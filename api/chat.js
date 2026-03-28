import { handleChatCore, validateBodySize } from './chatCore.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let raw;
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    raw = JSON.stringify(req.body);
  } else {
    raw = await readBody(req);
  }

  const sizeCheck = validateBodySize(raw);
  if (!sizeCheck.ok) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: sizeCheck.error }));
    return;
  }

  let body;
  try {
    body = JSON.parse(raw || '{}');
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  const forwarded = req.headers['x-forwarded-for'];
  const ip =
    (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null) ||
    req.socket?.remoteAddress ||
    'unknown';

  const out = await handleChatCore(body, process.env, ip);
  if (out.error) {
    res.statusCode = out.status || 400;
    res.end(JSON.stringify({ error: out.error }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ reply: out.reply }));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
