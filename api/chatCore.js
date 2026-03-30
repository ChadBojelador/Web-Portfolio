import { buildSystemInstructions } from '../src/data/chatContext.js';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

const MAX_BODY_CHARS = 32000;
const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;

const DEFAULT_PROVIDER_ORDER = ['gemini', 'openai', 'xai'];
const DEFAULT_MODELS = {
  gemini: {
    primary: 'gemini-2.0-flash',
    fallback: ['gemini-1.5-flash'],
  },
  openai: {
    primary: 'gpt-4.1-mini',
    fallback: ['gpt-4o-mini', 'gpt-4.1-nano'],
  },
  xai: {
    primary: 'grok-4-1-fast',
    fallback: ['grok-3-mini'],
  },
};

function parseCsv(value, fallback = []) {
  if (typeof value !== 'string') return [...fallback];
  const list = value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  return list.length ? list : [...fallback];
}

function buildProviderOrder(env) {
  const raw = parseCsv(env.AI_PROVIDER_ORDER, DEFAULT_PROVIDER_ORDER).map((p) => p.toLowerCase());
  const allowed = new Set(DEFAULT_PROVIDER_ORDER);
  const seen = new Set();
  const order = [];

  for (const provider of raw) {
    if (!allowed.has(provider) || seen.has(provider)) continue;
    seen.add(provider);
    order.push(provider);
  }

  for (const provider of DEFAULT_PROVIDER_ORDER) {
    if (!seen.has(provider)) order.push(provider);
  }

  return order;
}

function buildProviderConfigs(env) {
  const geminiKey = (env.GEMINI_API_KEY || env.GOOGLE_API_KEY || '').trim();
  const openaiKey = (env.OPENAI_API_KEY || '').trim();
  const xaiKey = (env.XAI_API_KEY || '').trim();

  const googleProvider = geminiKey
    ? createGoogleGenerativeAI({
        apiKey: geminiKey,
      })
    : null;

  const openaiProvider = openaiKey
    ? createOpenAI({
        apiKey: openaiKey,
      })
    : null;

  const xaiProvider = xaiKey
    ? createOpenAI({
        name: 'xai',
        baseURL: 'https://api.x.ai/v1',
        apiKey: xaiKey,
      })
    : null;

  return {
    gemini: {
      configured: Boolean(googleProvider),
      model: (modelId) => googleProvider(modelId),
      models: [
        env.GEMINI_MODEL || DEFAULT_MODELS.gemini.primary,
        ...parseCsv(env.GEMINI_FALLBACK_MODELS, DEFAULT_MODELS.gemini.fallback),
      ],
    },
    openai: {
      configured: Boolean(openaiProvider),
      model: (modelId) => openaiProvider(modelId),
      models: [
        env.OPENAI_MODEL || DEFAULT_MODELS.openai.primary,
        ...parseCsv(env.OPENAI_FALLBACK_MODELS, DEFAULT_MODELS.openai.fallback),
      ],
    },
    xai: {
      configured: Boolean(xaiProvider),
      model: (modelId) => xaiProvider(modelId),
      models: [
        env.XAI_MODEL || DEFAULT_MODELS.xai.primary,
        ...parseCsv(env.XAI_FALLBACK_MODELS, DEFAULT_MODELS.xai.fallback),
      ],
    },
  };
}

function uniqList(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (!item || seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

export async function handleChatCore(body, env, clientIp = 'unknown') {
  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: 'Invalid body: non-empty messages array required', status: 400 };
  }
  if (messages.length > MAX_MESSAGES) {
    return { error: `At most ${MAX_MESSAGES} messages allowed`, status: 400 };
  }

  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant' && m.role !== 'system')) {
      return { error: 'Each message must have role user, assistant, or system', status: 400 };
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
  const providerOrder = buildProviderOrder(env);
  const providers = buildProviderConfigs(env);
  const configuredProviders = providerOrder.filter((provider) => providers[provider]?.configured);

  if (configuredProviders.length === 0) {
    return {
      error: 'Server is missing provider API keys (set GEMINI_API_KEY, OPENAI_API_KEY, or XAI_API_KEY).',
      status: 500,
    };
  }

  const attempts = [];
  for (const provider of configuredProviders) {
    const cfg = providers[provider];
    const models = uniqList(cfg.models.map((m) => String(m || '').trim()));
    for (const modelId of models) {
      attempts.push({ provider, modelId, modelFactory: cfg.model });
    }
  }

  for (const attempt of attempts) {
    try {
      const result = streamText({
        model: attempt.modelFactory(attempt.modelId),
        system,
        messages,
        temperature: 0.6,
        maxTokens: 512,
      });

      console.info(
        `[chat] client=${clientIp} provider=${attempt.provider} model=${attempt.modelId} status=selected`
      );
      return { stream: result, provider: attempt.provider, model: attempt.modelId };
    } catch (e) {
      console.error(
        `[chat] client=${clientIp} provider=${attempt.provider} model=${attempt.modelId} status=failed`,
        e
      );
    }
  }

  return { error: 'Chat temporarily unavailable across all configured models.', status: 503 };
}

export function validateBodySize(rawString) {
  if (rawString.length > MAX_BODY_CHARS) {
    return { ok: false, error: 'Request body too large' };
  }
  return { ok: true };
}
