// Zero-dependency static file server — just `node server.js`.
// Camera access (getUserMedia) requires a secure context, and browsers treat
// http://localhost as secure, so this is all you need for local use.
import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = normalize(join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    let st;
    try {
      st = await stat(filePath);
    } catch {
      st = null;
    }
    if (!st || st.isDirectory()) {
      filePath = join(filePath, st && st.isDirectory() ? 'index.html' : '');
      if (!filePath.endsWith('index.html')) filePath = join(ROOT, 'index.html');
      try { st = await stat(filePath); } catch { st = null; }
    }
    if (!st) {
      res.writeHead(404); res.end('Not found'); return;
    }
    const type = MIME[extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500); res.end('Server error');
  }
});

server.listen(PORT, () => {
  console.log(`Snapshoot running at http://localhost:${PORT}`);
});
