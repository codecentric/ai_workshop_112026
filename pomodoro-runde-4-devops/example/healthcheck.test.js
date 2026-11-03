'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { DEFAULTS, EXIT, parseArgs, safeUrl, checkOnce, runHealthcheck, main } = require('./healthcheck.js');

// --- helpers ---------------------------------------------------------------

const fakeResponse = (status) => ({ status, body: null });
const timeoutError = () => Object.assign(new Error('timed out'), { name: 'TimeoutError' });
const refusedError = () => Object.assign(new TypeError('fetch failed'), { cause: { code: 'ECONNREFUSED' } });

// Fake fetch that plays back one scripted outcome per call (Response-like or Error).
function scriptedFetch(outcomes) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    const next = outcomes[Math.min(calls.length - 1, outcomes.length - 1)];
    if (next instanceof Error) throw next;
    return next;
  };
  fn.calls = calls;
  return fn;
}

function makeDeps(fetchFn) {
  const deps = {
    fetch: fetchFn,
    now: () => 0,
    sleeps: [],
    logs: [],
    outs: [],
    sleep: async (ms) => { deps.sleeps.push(ms); },
    log: (line) => deps.logs.push(line),
    out: (line) => deps.outs.push(line),
  };
  return deps;
}

// --- parseArgs ---------------------------------------------------------------

test('parseArgs applies defaults', () => {
  const { options } = parseArgs(['https://example.test/health']);
  assert.deepEqual(options, { ...DEFAULTS, url: 'https://example.test/health' });
});

test('parseArgs reads overrides', () => {
  const { options } = parseArgs(['https://x.test', '--attempts', '5', '--timeout-ms', '1000', '--delay-ms', '0']);
  assert.equal(options.attempts, 5);
  assert.equal(options.timeoutMs, 1000);
  assert.equal(options.delayMs, 0);
});

test('parseArgs rejects missing URL, bad scheme and malformed URL', () => {
  assert.match(parseArgs([]).error, /URL fehlt/);
  assert.match(parseArgs(['ftp://x.test']).error, /Nur http und https/);
  assert.match(parseArgs(['kein-url']).error, /Ungültige URL/);
});

test('parseArgs rejects credentials in the URL without echoing them', () => {
  const { error } = parseArgs(['https://user:secret@x.test/health']);
  assert.match(error, /Zugangsdaten/);
  assert.ok(!error.includes('secret'));
  assert.ok(!parseArgs(['kein-url-mit-secret']).error.includes('secret'));
});

test('parseArgs rejects bad numbers, unknown flags and extra arguments', () => {
  assert.match(parseArgs(['https://x.test', '--attempts', '0']).error, /--attempts/);
  assert.match(parseArgs(['https://x.test', '--attempts', 'abc']).error, /--attempts/);
  assert.match(parseArgs(['https://x.test', '--attempts']).error, /--attempts/);
  assert.match(parseArgs(['https://x.test', '--foo']).error, /Unbekannte Option/);
  assert.match(parseArgs(['https://x.test', 'https://y.test']).error, /Unerwartetes Argument/);
});

// --- safeUrl -----------------------------------------------------------------

test('safeUrl strips credentials, query and fragment', () => {
  assert.equal(safeUrl('https://user:secret@host.test:8443/health?token=abc#x'), 'https://host.test:8443/health');
});

// --- checkOnce ---------------------------------------------------------------

test('checkOnce treats every 2xx as healthy', async () => {
  for (const status of [200, 204]) {
    const deps = makeDeps(scriptedFetch([fakeResponse(status)]));
    const r = await checkOnce('https://x.test', 1000, deps);
    assert.deepEqual([r.ok, r.status], [true, status]);
  }
});

test('checkOnce treats 3xx, 4xx and 5xx as unhealthy and names the status', async () => {
  for (const status of [301, 404, 503]) {
    const deps = makeDeps(scriptedFetch([fakeResponse(status)]));
    const r = await checkOnce('https://x.test', 1000, deps);
    assert.deepEqual([r.ok, r.reason], [false, `HTTP ${status}`]);
  }
});

test('checkOnce reports timeout and connection errors', async () => {
  let r = await checkOnce('https://x.test', 250, makeDeps(scriptedFetch([timeoutError()])));
  assert.equal(r.reason, 'Timeout nach 250 ms');
  r = await checkOnce('https://x.test', 250, makeDeps(scriptedFetch([refusedError()])));
  assert.equal(r.reason, 'Verbindungsfehler: ECONNREFUSED');
});

test('checkOnce does not follow redirects and passes a timeout signal', async () => {
  const fetchFn = scriptedFetch([fakeResponse(200)]);
  await checkOnce('https://x.test', 1000, makeDeps(fetchFn));
  assert.equal(fetchFn.calls[0].init.redirect, 'manual');
  assert.ok(fetchFn.calls[0].init.signal instanceof AbortSignal);
});

// --- runHealthcheck ----------------------------------------------------------

const opts = { url: 'https://x.test', attempts: 3, timeoutMs: 1000, delayMs: 50 };

test('runHealthcheck stops at the first success without waiting', async () => {
  const fetchFn = scriptedFetch([fakeResponse(200)]);
  const deps = makeDeps(fetchFn);
  const { healthy, results } = await runHealthcheck(opts, deps);
  assert.equal(healthy, true);
  assert.equal(results.length, 1);
  assert.deepEqual(deps.sleeps, []);
});

test('runHealthcheck retries after a failure and stops at the first success', async () => {
  const fetchFn = scriptedFetch([fakeResponse(503), fakeResponse(503), fakeResponse(200)]);
  const deps = makeDeps(fetchFn);
  const { healthy, results } = await runHealthcheck(opts, deps);
  assert.equal(healthy, true);
  assert.equal(results.length, 3);
  assert.deepEqual(deps.sleeps, [50, 50]);
});

test('runHealthcheck gives up after N attempts and does not sleep after the last one', async () => {
  const fetchFn = scriptedFetch([fakeResponse(503)]);
  const deps = makeDeps(fetchFn);
  const { healthy, results } = await runHealthcheck(opts, deps);
  assert.equal(healthy, false);
  assert.equal(fetchFn.calls.length, 3);
  assert.equal(results.length, 3);
  assert.deepEqual(deps.sleeps, [50, 50]);
});

// --- main (exit codes and output) -------------------------------------------

test('main returns 0 and prints one OK line on stdout', async () => {
  const deps = makeDeps(scriptedFetch([fakeResponse(200)]));
  const code = await main(['https://x.test/health'], deps);
  assert.equal(code, EXIT.OK);
  assert.deepEqual(deps.outs, ['OK https://x.test/health HTTP 200 in 0 ms (Versuch 1/3)']);
});

test('main returns 1 and names the last failure reason', async () => {
  const deps = makeDeps(scriptedFetch([timeoutError(), timeoutError(), fakeResponse(503)]));
  const code = await main(['https://x.test/health', '--delay-ms', '0'], deps);
  assert.equal(code, EXIT.UNHEALTHY);
  assert.deepEqual(deps.outs, ['FEHLER https://x.test/health nach 3 Versuchen: HTTP 503']);
  assert.equal(deps.logs.length, 3);
});

test('main returns 2 on usage errors without any network call', async () => {
  const fetchFn = scriptedFetch([fakeResponse(200)]);
  const deps = makeDeps(fetchFn);
  const code = await main(['ftp://x.test'], deps);
  assert.equal(code, EXIT.USAGE);
  assert.equal(fetchFn.calls.length, 0);
  assert.match(deps.logs[0], /Aufruf:/);
  assert.deepEqual(deps.outs, []);
});

test('main never prints query strings', async () => {
  for (const status of [200, 503]) {
    const deps = makeDeps(scriptedFetch([fakeResponse(status)]));
    await main(['https://x.test/h?token=abc', '--attempts', '1'], deps);
    assert.ok(![...deps.outs, ...deps.logs].join('\n').includes('token'));
  }
});

test('main rejects credentials in the URL with exit code 2 and leaks nothing', async () => {
  const fetchFn = scriptedFetch([fakeResponse(200)]);
  const deps = makeDeps(fetchFn);
  const code = await main(['https://user:secret@x.test/h', '--attempts', '1'], deps);
  assert.equal(code, EXIT.USAGE);
  assert.equal(fetchFn.calls.length, 0);
  assert.ok(![...deps.outs, ...deps.logs].join('\n').includes('secret'));
});

test('checkOnce falls back to the cause message when there is no error code', async () => {
  const err = Object.assign(new TypeError('fetch failed'), { cause: new Error('bad port') });
  const r = await checkOnce('https://x.test', 250, makeDeps(scriptedFetch([err])));
  assert.equal(r.reason, 'Verbindungsfehler: bad port');
});

// --- integration against a local server (no production access needed) --------

function startServer(handler) {
  return new Promise((resolve) => {
    const server = http.createServer(handler);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

const realDeps = () => {
  const deps = makeDeps(globalThis.fetch);
  deps.now = () => Date.now();
  return deps;
};

test('integration: real server answers 200, 503 and 302', async () => {
  const server = await startServer((req, res) => {
    if (req.url === '/ok') { res.writeHead(200).end('ok'); }
    else if (req.url === '/redirect') { res.writeHead(302, { Location: '/ok' }).end(); }
    else { res.writeHead(503).end('down'); }
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal(await main([`${base}/ok`], realDeps()), EXIT.OK);
    assert.equal(await main([`${base}/down`, '--attempts', '1'], realDeps()), EXIT.UNHEALTHY);
    assert.equal(await main([`${base}/redirect`, '--attempts', '1'], realDeps()), EXIT.UNHEALTHY);
  } finally {
    server.close();
    server.closeAllConnections();
  }
});

test('integration: a server that never answers hits the timeout', async () => {
  const server = await startServer(() => { /* hang on purpose */ });
  const base = `http://127.0.0.1:${server.address().port}`;
  const deps = realDeps();
  try {
    const code = await main([`${base}/`, '--attempts', '2', '--timeout-ms', '200', '--delay-ms', '0'], deps);
    assert.equal(code, EXIT.UNHEALTHY);
    assert.match(deps.outs[0], /Timeout nach 200 ms/);
  } finally {
    server.close();
    server.closeAllConnections();
  }
});

test('integration: a closed port counts as connection error', async () => {
  const server = await startServer((req, res) => res.end());
  const { port } = server.address();
  server.close();
  const deps = realDeps();
  const code = await main([`http://127.0.0.1:${port}/`, '--attempts', '1'], deps);
  assert.equal(code, EXIT.UNHEALTHY);
  assert.match(deps.outs[0], /Verbindungsfehler/);
});
