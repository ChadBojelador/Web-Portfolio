import { buildSystemInstructions } from '../src/data/chatContext.js';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const MAX_BODY_CHARS = 32000;
const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;

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
  const geminiKey = (env.GEMINI_API_KEY || env.GOOGLE_API_KEY || '').trim();

  if (!geminiKey) {
    return { error: 'Server is missing provider API keys (GEMINI_API_KEY).', status: 500 };
  }

  const googleProvider = createGoogleGenerativeAI({
    apiKey: geminiKey,
  });

  try {
    const result = streamText({
      model: googleProvider('gemini-2.0-flash'),
      system,
      messages,
      temperature: 0.6,
      maxTokens: 512,
    });

    return { stream: result };
  } catch (e) {
    console.error(e);
    return { error: 'Chat temporarily unavailable.', status: 503 };
  }
}

export function validateBodySize(rawString) {
  if (rawString.length > MAX_BODY_CHARS) {
    return { ok: false, error: 'Request body too large' };
  }
  return { ok: true };
}
