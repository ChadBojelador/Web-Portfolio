import { buildSystemInstructions } from '../src/data/chatContext.js';

const MAX_BODY_CHARS = 32000;
const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 40;
const OPENAI_TIMEOUT_MS = 25000;

const rateBuckets = new Map();

class AIProviderError extends Error {
  constructor(message, status = 503) {
    super(message);
    this.name = 'AIProviderError';
    this.status = status;
  }
}

function checkRate(clientIp) {
  const now = Date.now();
  let b = rateBuckets.get(clientIp);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + RATE_WINDOW_MS };
    rateBuckets.set(clientIp, b);
  }
  b.count += 1;
  if (b.count > RATE_MAX) return false;
  return true;
}

async function callAIProviders(messages, env) {
  const attempts = getProviderAttempts(env);
  if (attempts.length === 0) {
    throw new AIProviderError(
      'Server is missing provider API keys (OPENAI_API_KEY, XAI_API_KEY, or GEMINI_API_KEY).',
      500
    );
  }

  let lastError = null;

  for (const attempt of attempts) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);
    let res;
    try {
      const request = buildProviderRequest(attempt, messages);
      res = await fetch(request.url, {
        method: 'POST',
        headers: request.headers,
        body: request.body,
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        lastError = new AIProviderError('AI request timed out. Please try again.', 503);
      } else {
        lastError = new AIProviderError('Could not reach AI service.', 503);
      }
      continue;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(
        `${attempt.provider.toUpperCase()} HTTP (${attempt.model})`,
        res.status,
        errText.slice(0, 500)
      );
      if (res.status === 401 || res.status === 403) {
        lastError = new AIProviderError(
          `${attempt.provider.toUpperCase()} API key is invalid.`,
          500
        );
        continue;
      }
      if (res.status === 429) {
        lastError = new AIProviderError(
          `${attempt.provider.toUpperCase()} is rate-limiting or temporarily unavailable. Please try again in a moment.`,
          429
        );
        continue;
      }
      if (res.status === 400 || res.status === 404) {
        lastError = new AIProviderError(
          `${attempt.provider.toUpperCase()} rejected the request (${res.status}). Check model name and provider API settings.`,
          503
        );
        continue;
      }
      if (res.status >= 500) {
        lastError = new AIProviderError(
          `${attempt.provider.toUpperCase()} is temporarily unavailable. Please try again in a moment.`,
          503
        );
        continue;
      }
      lastError = new AIProviderError(
        `${attempt.provider.toUpperCase()} request failed (${res.status}).`,
        503
      );
      continue;
    }

    const data = await res.json();
    const content = getProviderText(attempt.provider, data);
    if (content) {
      return content;
    }
    lastError = new AIProviderError('AI returned an empty response.', 503);
  }

  if (lastError) {
    throw lastError;
  }
  throw new AIProviderError('AI service is temporarily unavailable.', 503);
}

function buildProviderRequest(attempt, messages) {
  if (attempt.provider === 'gemini') {
    const model = String(attempt.model || '').replace(/^models\//, '');
    const userContents = [];
    let systemInstruction = null;

    for (const msg of messages) {
      if (!msg || typeof msg.content !== 'string' || !msg.content.trim()) continue;
      if (msg.role === 'system') {
        systemInstruction = msg.content.trim();
        continue;
      }
      userContents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content.trim() }],
      });
    }

    const body = {
      contents: userContents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 512,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    return {
      url:
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent` +
        `?key=${encodeURIComponent(attempt.apiKey)}`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  }

  return {
    url: attempt.url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${attempt.apiKey}`,
    },
    body: JSON.stringify({
      model: attempt.model,
      messages,
      max_tokens: 512,
      temperature: 0.6,
    }),
  };
}

function getProviderText(provider, data) {
  if (provider === 'gemini') {
    const parts = data?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return '';
    return parts
      .map((p) => (typeof p?.text === 'string' ? p.text : ''))
      .join('')
      .trim();
  }

  return data?.choices?.[0]?.message?.content?.trim() || '';
}

function getModelPriority(primary, fallbackRaw) {
  const list = [primary, ...String(fallbackRaw || '').split(',')]
    .map((m) => String(m).trim())
    .filter(Boolean);
  return [...new Set(list)];
}

function getProviderAttempts(env) {
  const attemptsByProvider = {
    gemini: [],
    openai: [],
    xai: [],
  };

  const openaiKey = (env.OPENAI_API_KEY || '').trim();
  if (openaiKey) {
    const openaiModels = getModelPriority(
      env.OPENAI_MODEL || 'gpt-4.1-mini',
      env.OPENAI_FALLBACK_MODELS
    );
    for (const model of openaiModels) {
      attemptsByProvider.openai.push({
        provider: 'openai',
        model,
        apiKey: openaiKey,
        url: 'https://api.openai.com/v1/chat/completions',
      });
    }
  }

  const xaiKey = (env.XAI_API_KEY || '').trim();
  if (xaiKey) {
    const xaiModels = getModelPriority(
      env.XAI_MODEL || 'grok-4-1-fast',
      env.XAI_FALLBACK_MODELS
    );
    for (const model of xaiModels) {
      attemptsByProvider.xai.push({
        provider: 'xai',
        model,
        apiKey: xaiKey,
        url: 'https://api.x.ai/v1/chat/completions',
      });
    }
  }

  const geminiKey = (env.GEMINI_API_KEY || env.GOOGLE_API_KEY || '').trim();
  if (geminiKey) {
    const geminiModels = getModelPriority(
      env.GEMINI_MODEL || 'gemini-2.5-flash',
      env.GEMINI_FALLBACK_MODELS || 'gemini-2.5-flash-lite,gemini-1.5-flash'
    );
    for (const model of geminiModels) {
      attemptsByProvider.gemini.push({
        provider: 'gemini',
        model,
        apiKey: geminiKey,
        url: '',
      });
    }
  }

  const order = String(env.AI_PROVIDER_ORDER || 'gemini,openai,xai')
    .split(',')
    .map((p) => p.trim().toLowerCase())
    .filter((p) => p === 'gemini' || p === 'openai' || p === 'xai');

  const attempts = [];
  for (const provider of order) {
    attempts.push(...attemptsByProvider[provider]);
  }
  for (const provider of ['gemini', 'openai', 'xai']) {
    if (!order.includes(provider)) {
      attempts.push(...attemptsByProvider[provider]);
    }
  }

  return attempts;
}

/**
 * @param {object} body - { messages: { role: 'user'|'assistant', content: string }[] }
 * @param {NodeJS.ProcessEnv} env
 * @param {string} clientIp
 * @returns {Promise<{ reply?: string, error?: string, status?: number }>}
 */
export async function handleChatCore(body, env, clientIp = 'unknown') {
  if (!checkRate(clientIp)) {
    return { error: 'Too many requests. Try again later.', status: 429 };
  }

  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: 'Invalid body: non-empty messages array required', status: 400 };
  }
  if (messages.length > MAX_MESSAGES) {
    return { error: `At most ${MAX_MESSAGES} messages allowed`, status: 400 };
  }

  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) {
      return { error: 'Each message must have role user or assistant', status: 400 };
    }
    if (typeof m.content !== 'string' || !m.content.trim()) {
      return { error: 'Each message must have non-empty string content', status: 400 };
    }
    if (m.content.length > MAX_CONTENT_LENGTH) {
      return {
        error: `Each message must be at most ${MAX_CONTENT_LENGTH} characters`,
        status: 400,
      };
    }
  }

  const system = buildSystemInstructions({ messages });
  const apiMessages = [{ role: 'system', content: system }, ...messages];

  try {
    const reply = await callAIProviders(apiMessages, env);
    return { reply };
  } catch (e) {
    console.error(e);
    if (e instanceof AIProviderError) {
      return { error: e.message, status: e.status };
    }
    return { error: 'Chat temporarily unavailable.', status: 503 };
  }
}

export function validateBodySize(rawString) {
  if (rawString.length > MAX_BODY_CHARS) {
    return { ok: false, error: 'Request body too large' };
  }
  return { ok: true };
}
