// server.js
// Minimal, dependency-free Node.js app for a Kubernetes workshop.
// Shows pod identity, env vars, and request/client info on the root path.

const http = require('http');
const os = require('os');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;

// A random ID generated once per process start. Handy in a workshop to
// prove that hitting a Service repeatedly load-balances across different
// pods (this value changes every time a pod is replaced/restarted, but
// stays the same across requests to the same pod).
const INSTANCE_ID = crypto.randomBytes(4).toString('hex');
const START_TIME = new Date();

// Pick a stable color for this pod, derived from its hostname, so that
// when you scale replicas and refresh the page, you visually see the
// load balancer bouncing between different-colored pods.
function colorFromString(str) {
    const hash = crypto.createHash('md5').update(str).digest('hex');
    const hue = parseInt(hash.substring(0, 8), 16) % 360;
    return `hsl(${hue}, 70%, 45%)`;
}

function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderTable(rows) {
    return `<table>${rows
        .map(
            ([k, v]) =>
                `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v ?? '(not set)')}</td></tr>`
        )
        .join('')}</table>`;
}

function getRequestIp(req) {
    // In Kubernetes, requests are often proxied (Ingress, Service, etc.),
    // so the "real" client IP may be in a forwarding header rather than
    // the raw socket address. Showing both is a nice teaching moment.
    const forwardedFor = req.headers['x-forwarded-for'];
    const socketIp = req.socket.remoteAddress;
    return {forwardedFor, socketIp};
}

function handleRoot(req, res) {
    const podName = process.env.POD_NAME || os.hostname();
    const podIp = process.env.POD_IP || '(not set - see README to expose via Downward API)';
    const namespace = process.env.POD_NAMESPACE || '(not set)';
    const nodeName = process.env.NODE_NAME || '(not set)';
    const serviceAccount = process.env.POD_SERVICE_ACCOUNT || '(not set)';
    const podUid = process.env.POD_UID || '(not set)';

    const {forwardedFor, socketIp} = getRequestIp(req);
    const uptimeSec = process.uptime();
    const color = colorFromString(podName);

    const identityRows = renderTable([
        ['Pod name', podName],
        ['Pod IP', podIp],
        ['Pod UID', podUid],
        ['Namespace', namespace],
        ['Node name', nodeName],
        ['Service account', serviceAccount],
        ['Container hostname (os.hostname())', os.hostname()],
        ['Process instance ID (random, set at startup)', INSTANCE_ID],
    ]);

    const requestRows = renderTable([
        ['Client socket address', `${socketIp}`],
        ['X-Forwarded-For header', forwardedFor || '(not present - no proxy in front, or not set)'],
        ['Request method', req.method],
        ['Request URL', req.url],
        ['User-Agent', req.headers['user-agent']],
        ['Host header', req.headers['host']],
    ]);

    const runtimeRows = renderTable([
        ['Server started at', START_TIME.toISOString()],
        ['Current server time', new Date().toISOString()],
        ['Process uptime', formatUptime(uptimeSec)],
        ['Node.js version', process.version],
        ['Platform / Arch', `${process.platform} / ${process.arch}`],
        ['CPU count', os.cpus().length],
        ['Total memory', `${(os.totalmem() / 1024 / 1024).toFixed(0)} MB`],
        ['Free memory', `${(os.freemem() / 1024 / 1024).toFixed(0)} MB`],
        ['Load average (1m,5m,15m)', os.loadavg().map((n) => n.toFixed(2)).join(', ')],
    ]);

    const envEntries = Object.entries(process.env).sort(([a], [b]) => a.localeCompare(b));
    const envRows = renderTable(envEntries);

    const headerRows = renderTable(Object.entries(req.headers));

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pod Info: ${escapeHtml(podName)}</title>
<style>
  :root { --accent: ${color}; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    background: #0f1115;
    color: #e6e6e6;
    line-height: 1.5;
  }
  header {
    background: var(--accent);
    color: #fff;
    padding: 2rem 1.5rem;
  }
  header h1 { margin: 0 0 0.25rem 0; font-size: 1.8rem; }
  header p { margin: 0; opacity: 0.9; font-family: monospace; }
  main {
    max-width: 900px;
    margin: 0 auto;
    padding: 1.5rem;
  }
  section {
    background: #1a1d24;
    border: 1px solid #2a2e38;
    border-radius: 8px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
  }
  h2 {
    margin-top: 0;
    font-size: 1.1rem;
    color: var(--accent);
    border-bottom: 1px solid #2a2e38;
    padding-bottom: 0.5rem;
  }
  table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  th, td {
    text-align: left;
    padding: 0.4rem 0.5rem;
    border-bottom: 1px solid #23262e;
    vertical-align: top;
    word-break: break-all;
  }
  th { color: #9aa4b2; font-weight: 600; width: 40%; }
  td { font-family: monospace; }
  .badge {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }
  footer { text-align: center; color: #6b7280; padding: 1rem; font-size: 0.8rem; }
  code { background: #23262e; padding: 0.1rem 0.35rem; border-radius: 4px; }
</style>
</head>
<body>
<header>
  <h1>&#9899; ${escapeHtml(podName)}</h1>
  <p>Refresh this page repeatedly (or hammer it with a load test) while
  scaled to multiple replicas to watch requests bounce between pods.</p>
  <span class="badge">instance ${escapeHtml(INSTANCE_ID)}</span>
</header>
<main>
  <section>
    <h2>Pod identity</h2>
    ${identityRows}
  </section>
  <section>
    <h2>Request / client info</h2>
    ${requestRows}
  </section>
  <section>
    <h2>Runtime / resource info</h2>
    ${runtimeRows}
  </section>
  <section>
    <h2>All environment variables (${envEntries.length})</h2>
    ${envRows}
  </section>
  <section>
    <h2>All request headers</h2>
    ${headerRows}
  </section>
</main>
<footer>
  Endpoints: <code>/</code> this page &middot; <code>/health</code> liveness &middot; <code>/ready</code> readiness &middot; <code>/api</code> JSON version
</footer>
</body>
</html>`;

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
}

function handleApi(req, res) {
    const {forwardedFor, socketIp} = getRequestIp(req);
    const payload = {
        podName: process.env.POD_NAME || os.hostname(),
        podIp: process.env.POD_IP || null,
        podUid: process.env.POD_UID || null,
        namespace: process.env.POD_NAMESPACE || null,
        nodeName: process.env.NODE_NAME || null,
        serviceAccount: process.env.POD_SERVICE_ACCOUNT || null,
        instanceId: INSTANCE_ID,
        startedAt: START_TIME.toISOString(),
        now: new Date().toISOString(),
        uptimeSeconds: process.uptime(),
        client: {socketIp, forwardedFor: forwardedFor || null},
        env: process.env,
        headers: req.headers,
    };
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(payload, null, 2));
}

const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0];

    if (url === '/health') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('ok');
        return;
    }

    if (url === '/ready') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('ready');
        return;
    }

    if (url === '/api') {
        handleApi(req, res);
        return;
    }

    if (url === '/') {
        handleRoot(req, res);
        return;
    }

    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log(`Pod info app (instance ${INSTANCE_ID}) listening on port ${PORT}`);
});

// Graceful shutdown, useful to demo how Kubernetes sends SIGTERM before
// killing a pod (e.g. during a rolling update or scale-down).
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    server.close(() => process.exit(0));
});
