const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const { spawn } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const cliPath = path.join(__dirname, 'health-check.js');

function runCli(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, ...args]);
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (data) => { stdout += data; });
    child.stderr.on('data', (data) => { stderr += data; });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

async function startServer(handler) {
  const server = http.createServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  return {
    server,
    url: `http://127.0.0.1:${port}/health`,
  };
}

function assertUnhealthyResult(result, reason) {
  assert.equal(result.code, 1);
  assert.equal(result.stdout.trim().split('\n').length, 1);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: 'unhealthy',
    checks: [{ name: 'application', status: 'unhealthy', reason }],
  });
}

test('accepts a valid --url invocation', async (t) => {
  const { server, url } = await startServer((request, response) => {
    response.writeHead(200).end();
  });
  t.after(() => server.close());

  const result = await runCli(['--url', url]);

  assert.equal(result.code, 0);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: 'healthy',
    checks: [{ name: 'application', status: 'healthy' }],
  });
});

test('treats every 2xx response as healthy', async (t) => {
  const { server, url } = await startServer((request, response) => {
    response.writeHead(204).end();
  });
  t.after(() => server.close());

  const result = await runCli(['--url', url]);

  assert.equal(result.code, 0);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: 'healthy',
    checks: [{ name: 'application', status: 'healthy' }],
  });
  assert.equal(result.stderr, '');
});

test('reports non-2xx responses as http_error without mixing channels', async (t) => {
  const { server, url } = await startServer((request, response) => {
    response.writeHead(503).end();
  });
  t.after(() => server.close());

  const result = await runCli(['--url', url]);

  assert.equal(result.code, 1);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: 'unhealthy',
    checks: [{ name: 'application', status: 'unhealthy', reason: 'http_error' }],
  });
  assert.match(result.stderr, /HTTP status 503/);
  assert.doesNotMatch(result.stderr, /\{/);
});

for (const args of [[], ['--url'], ['--url', ''], ['--url', 'not a url']]) {
  test(`rejects invalid arguments: ${JSON.stringify(args)}`, async () => {
    const result = await runCli(args);

    assert.equal(result.code, 2);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /Usage:/);
  });
}

test('reports an unreachable local target', async () => {
  const probe = http.createServer();
  probe.listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const { port } = probe.address();
  await new Promise((resolve) => probe.close(resolve));

  const result = await runCli(['--url', `http://127.0.0.1:${port}/health`]);

  assertUnhealthyResult(result, 'unreachable');
  assert.match(result.stderr, /unreachable/);
});

test('times out when a local target does not complete its response', async (t) => {
  const { server, url } = await startServer(() => {});
  t.after(() => server.closeAllConnections());
  t.after(() => server.close());

  const started = Date.now();
  const result = await runCli(['--url', url]);

  assertUnhealthyResult(result, 'timeout');
  assert.ok(Date.now() - started >= 4_900);
  assert.match(result.stderr, /timed out/);
});

test('reports an incomplete local HTTP response as invalid_response', async (t) => {
  const { server, url } = await startServer((request, response) => {
    response.writeHead(200, { 'content-length': '10' });
    response.flushHeaders();
    response.write('short');
    response.socket.destroy();
  });
  t.after(() => server.close());

  const result = await runCli(['--url', url]);

  assertUnhealthyResult(result, 'invalid_response');
  assert.match(result.stderr, /incomplete|invalid/);
});

test('does not expose sensitive URL values in either output channel', async () => {
  const secret = 'super-secret-token';
  const result = await runCli([
    '--url',
    `http://user:${secret}@127.0.0.1:1/health?token=${secret}`,
  ]);

  assertUnhealthyResult(result, 'unreachable');
  assert.doesNotMatch(result.stdout, new RegExp(secret));
  assert.doesNotMatch(result.stderr, new RegExp(secret));
  assert.doesNotMatch(result.stdout, /user:/);
  assert.doesNotMatch(result.stderr, /user:/);
});
