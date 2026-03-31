import { handleChatCore, validateBodySize } from './chatCore.js';

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  // CORS pre-flight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-tier');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // Read raw body
  let raw;
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    raw = JSON.stringify(req.body);
  } else {
    raw = await readBody(req);
  }

  const sizeCheck = validateBodySize(raw);
  if (!sizeCheck.ok) {
    res.statusCode = 400;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: sizeCheck.error }));
    return;
  }

  let body;
  try {
    body = JSON.parse(raw || '{}');
  } catch {
    res.statusCode = 400;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  const forwarded = req.headers['x-forwarded-for'];
  const tierHeader = req.headers['x-user-tier'];
  const userTier =
    (typeof tierHeader === 'string' ? tierHeader : Array.isArray(tierHeader) ? tierHeader[0] : '') ||
    'free';
  const ip =
    (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null) ||
    req.socket?.remoteAddress ||
    'unknown';

  const out = await handleChatCore(body, process.env, ip, userTier);
  if (out.error) {
    res.statusCode = out.status || 400;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: out.error }));
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  out.stream.pipeUIMessageStreamToResponse(res);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
