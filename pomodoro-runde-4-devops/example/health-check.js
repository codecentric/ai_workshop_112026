'use strict';

const http = require('node:http');
const https = require('node:https');

const TIMEOUT_MS = 5_000;

function usage() {
  process.stderr.write('Usage: node health-check.js --url <health-endpoint-url>\n');
}

function writeResult(status, reason) {
  const check = { name: 'application', status };
  if (reason) {
    check.reason = reason;
  }
  process.stdout.write(`${JSON.stringify({ status, checks: [check] })}\n`);
}

function parseUrl(args) {
  if (args.length !== 2 || args[0] !== '--url' || !args[1]) {
    return null;
  }

  try {
    const target = new URL(args[1]);
    return target.protocol === 'http:' || target.protocol === 'https:' ? target : null;
  } catch {
    return null;
  }
}

function check(target) {
  const client = target.protocol === 'https:' ? https : http;
  let settled = false;
  let request;
  let responseStarted = false;

  function finish(status, reason, exitCode, diagnostic) {
    if (settled) return;
    settled = true;
    clearTimeout(timeout);
    if (diagnostic) process.stderr.write(`${diagnostic}\n`);
    writeResult(status, reason);
    process.exitCode = exitCode;
  }

  const timeout = setTimeout(() => {
    request.destroy();
    finish('unhealthy', 'timeout', 1, 'Health check timed out');
  }, TIMEOUT_MS);

  try {
    request = client.get(target, (response) => {
      responseStarted = true;
      response.resume();
      response.on('end', () => {
        if (response.complete !== true) {
          finish('unhealthy', 'invalid_response', 1, 'Health check received an incomplete response');
          return;
        }

        if (response.statusCode >= 200 && response.statusCode <= 299) {
          finish('healthy', undefined, 0);
          return;
        }
        finish('unhealthy', 'http_error', 1, `Health check returned HTTP status ${response.statusCode}`);
      });
      response.on('aborted', () => finish('unhealthy', 'invalid_response', 1, 'Health check received an incomplete response'));
      response.on('error', () => finish('unhealthy', 'invalid_response', 1, 'Health check received an invalid response'));
    });
    request.on('error', () => {
      if (!settled) {
        if (responseStarted) {
          finish('unhealthy', 'invalid_response', 1, 'Health check received an invalid response');
        } else {
          finish('unhealthy', 'unreachable', 1, 'Health check target is unreachable');
        }
      }
    });
  } catch {
    finish('unhealthy', 'invalid_response', 1, 'Health check could not create a request');
  }
}

const target = parseUrl(process.argv.slice(2));
if (!target) {
  usage();
  process.exitCode = 2;
} else {
  check(target);
}
