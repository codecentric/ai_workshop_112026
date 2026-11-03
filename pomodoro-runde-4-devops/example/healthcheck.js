#!/usr/bin/env node
'use strict';

const DEFAULTS = { attempts: 3, timeoutMs: 5000, delayMs: 2000 };
const EXIT = { OK: 0, UNHEALTHY: 1, USAGE: 2 };
const USAGE = 'Aufruf: node healthcheck.js <url> [--attempts N] [--timeout-ms N] [--delay-ms N]';

const FLAGS = {
  '--attempts': { key: 'attempts', min: 1, max: 10 },
  '--timeout-ms': { key: 'timeoutMs', min: 100, max: 60000 },
  '--delay-ms': { key: 'delayMs', min: 0, max: 60000 },
};

// Returns { options } or { error }; never throws and never touches the network.
function parseArgs(argv) {
  const options = { ...DEFAULTS, url: null };
  const rest = [...argv];
  while (rest.length > 0) {
    const arg = rest.shift();
    const flag = FLAGS[arg];
    if (flag) {
      const raw = rest.shift();
      const value = Number(raw);
      if (raw === undefined || !Number.isInteger(value) || value < flag.min || value > flag.max) {
        return { error: `Ungültiger Wert für ${arg}: ${raw} (erlaubt: ${flag.min}-${flag.max})` };
      }
      options[flag.key] = value;
    } else if (arg.startsWith('--')) {
      return { error: `Unbekannte Option: ${arg}` };
    } else if (options.url === null) {
      options.url = arg;
    } else {
      return { error: `Unerwartetes Argument: ${arg}` };
    }
  }
  if (options.url === null) return { error: 'URL fehlt' };
  let parsed;
  try {
    parsed = new URL(options.url);
  } catch {
    // Do not echo the raw value: it may contain secrets.
    return { error: 'Ungültige URL' };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { error: `Nur http und https erlaubt, nicht ${parsed.protocol}` };
  }
  if (parsed.username || parsed.password) {
    return { error: 'Zugangsdaten in der URL werden nicht unterstützt' };
  }
  return { options };
}

// Logs must never leak tokens that CI passes in the query string.
function safeUrl(url) {
  const u = new URL(url);
  return `${u.protocol}//${u.host}${u.pathname}`;
}

async function checkOnce(url, timeoutMs, { fetch: fetchFn, now }) {
  const start = now();
  try {
    // Redirects are not followed: a 3xx means the target is not where we expect it.
    const res = await fetchFn(url, { redirect: 'manual', signal: AbortSignal.timeout(timeoutMs) });
    const ms = now() - start;
    if (res.body && res.body.cancel) await res.body.cancel();
    if (res.status >= 200 && res.status < 300) return { ok: true, status: res.status, ms };
    return { ok: false, reason: `HTTP ${res.status}`, ms };
  } catch (err) {
    const ms = now() - start;
    if (err && err.name === 'TimeoutError') {
      return { ok: false, reason: `Timeout nach ${timeoutMs} ms`, ms };
    }
    const cause = err && err.cause;
    const detail = (cause && (cause.code || cause.message)) || (err && err.message) || 'unbekannt';
    return { ok: false, reason: `Verbindungsfehler: ${detail}`, ms };
  }
}

async function runHealthcheck(options, deps) {
  const results = [];
  for (let i = 1; i <= options.attempts; i++) {
    const result = await checkOnce(options.url, options.timeoutMs, deps);
    results.push(result);
    deps.log(`Versuch ${i}/${options.attempts}: ${result.ok ? `HTTP ${result.status}` : result.reason} (${result.ms} ms)`);
    if (result.ok) return { healthy: true, results };
    if (i < options.attempts) await deps.sleep(options.delayMs);
  }
  return { healthy: false, results };
}

// Returns the process exit code: 0 healthy, 1 unhealthy, 2 usage error.
async function main(argv, deps) {
  const parsed = parseArgs(argv);
  if (parsed.error) {
    deps.log(`${parsed.error}\n${USAGE}`);
    return EXIT.USAGE;
  }
  const { options } = parsed;
  const target = safeUrl(options.url);
  const { healthy, results } = await runHealthcheck(options, deps);
  const last = results[results.length - 1];
  if (healthy) {
    deps.out(`OK ${target} HTTP ${last.status} in ${last.ms} ms (Versuch ${results.length}/${options.attempts})`);
    return EXIT.OK;
  }
  deps.out(`FEHLER ${target} nach ${results.length} Versuchen: ${last.reason}`);
  return EXIT.UNHEALTHY;
}

if (require.main === module) {
  const deps = {
    fetch: globalThis.fetch,
    now: () => Date.now(),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    log: (line) => console.error(line),
    out: (line) => console.log(line),
  };
  main(process.argv.slice(2), deps).then((code) => { process.exitCode = code; });
}

module.exports = { DEFAULTS, EXIT, parseArgs, safeUrl, checkOnce, runHealthcheck, main };
