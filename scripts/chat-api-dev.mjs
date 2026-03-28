/**
 * Local chat API for Vite dev (proxy /api -> this server).
 * Run: npm run dev:api
 * Requires OPENAI_API_KEY in .env.local (load manually) or environment.
 */
import 'dotenv/config';
import http from 'node:http';
import { handleChatCore, validateBodySize } from '../api/chatCore.js';

const PORT = Number(process.env.CHAT_API_PORT || 3002);

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || 'localhost';
  let pathname = '/';
  try {
    pathname = new URL(req.url || '/', `http://${host}`).pathname;
  } catch {
    pathname = req.url?.split('?')[0] || '/';
  }

  if (pathname !== '/api/chat') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let buf = '';
  for await (const chunk of req) {
    buf += chunk;
    if (buf.length > 32000) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Request body too large' }));
      return;
    }
  }

  const sizeCheck = validateBodySize(buf);
  if (!sizeCheck.ok) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: sizeCheck.error }));
    return;
  }

  let body;
  try {
    body = JSON.parse(buf || '{}');
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  const ip = req.socket.remoteAddress || 'local';

  try {
    const out = await handleChatCore(body, process.env, ip);
    if (out.error) {
      res.writeHead(out.status || 400, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ error: out.error }));
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({ reply: out.reply }));
  } catch (e) {
    console.error(e);
    res.writeHead(500, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({ error: 'Chat failed' }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Portfolio chat API (dev): http://127.0.0.1:${PORT}/api/chat`);
});
