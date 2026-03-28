import { useState, useRef, useEffect, useCallback } from 'react';
import '../Styles/chat-widget.css';

const STORAGE_KEY = 'portfolio-chat-messages-v1';
const MAX_STORED_MESSAGES = 50;
const MAX_HISTORY_TO_SEND = 12;
const REQUEST_TIMEOUT_MS = 20000;
const STATUS_TIMEOUT_MS = 5000;
const STATUS_RECHECK_MS = 20000;

function chatEndpoint() {
  const base = import.meta.env.VITE_CHAT_API_URL;
  if (base && String(base).trim()) {
    return `${String(base).replace(/\/$/, '')}/api/chat`;
  }
  return '/api/chat';
}

function loadStoredMessages() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (m) =>
          m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string'
      )
      .slice(-MAX_STORED_MESSAGES);
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    /* ignore */
  }
}

function buildUserErrorMessage(detail) {
  const text = String(detail || '').toLowerCase();

  if (text.includes('chat is busy right now')) {
    return (
      'Sorry - OpenAI is rate-limiting this key right now (or quota is exhausted). ' +
      'Please try again in a minute, or check your OpenAI billing and usage limits.'
    );
  }

  if (text.includes('credentials are invalid')) {
    return 'Sorry - the OpenAI API key is invalid. Update OPENAI_API_KEY in your .env file and restart dev:api.';
  }

  if (text.includes('openai api key is invalid')) {
    return 'Sorry - the OpenAI API key is invalid. Update OPENAI_API_KEY in your .env file and restart dev:api.';
  }

  if (text.includes('xai api key is invalid')) {
    return 'Sorry - the xAI API key is invalid. Update XAI_API_KEY in your .env file and restart dev:api.';
  }

  if (text.includes('gemini api key is invalid')) {
    return 'Sorry - the Gemini API key is invalid. Update GEMINI_API_KEY in your .env file and restart dev:api.';
  }

  if (text.includes('gemini rejected the request (400)') || text.includes('gemini rejected the request (404)')) {
    return 'Sorry - Gemini rejected the request. Check GEMINI_MODEL and your Gemini API key access, then restart dev:api.';
  }

  if (text.includes('server missing openai_api_key')) {
    return 'Sorry - OPENAI_API_KEY is missing in your .env file. Add it and restart dev:api.';
  }

  if (text.includes('missing provider api keys')) {
    return 'Sorry - API keys are missing. Add OPENAI_API_KEY, XAI_API_KEY, or GEMINI_API_KEY in .env, then restart dev:api.';
  }

  if (
    text.includes('failed to fetch') ||
    text.includes('networkerror') ||
    text.includes('request failed (404)') ||
    text.includes('request failed (502)') ||
    text.includes('request failed (503)')
  ) {
    return (
      'Sorry - I cannot reach /api/chat right now. ' +
      'Locally, run `npm run dev:api` in another terminal so /api/chat is available via the Vite proxy.'
    );
  }

  return `Sorry - something went wrong (${detail}).`;
}

export default function PortfolioChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState('checking');
  const [messages, setMessages] = useState(() => loadStoredMessages());
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    let statusController = null;

    const checkStatus = async (showChecking = false) => {
      if (!active) return;
      if (showChecking) setChatStatus('checking');

      if (statusController) {
        statusController.abort();
      }
      statusController = new AbortController();
      const timeoutId = setTimeout(
        () => statusController.abort(),
        STATUS_TIMEOUT_MS
      );

      try {
        const res = await fetch(chatEndpoint(), {
          method: 'OPTIONS',
          signal: statusController.signal,
        });
        if (!active) return;
        const reachable = res.ok || res.status === 405;
        setChatStatus(reachable ? 'online' : 'offline');
      } catch {
        if (!active) return;
        setChatStatus('offline');
      } finally {
        clearTimeout(timeoutId);
      }
    };

    checkStatus(true);
    const intervalId = setInterval(() => {
      checkStatus(false);
    }, STATUS_RECHECK_MS);

    return () => {
      active = false;
      if (statusController) {
        statusController.abort();
      }
      clearInterval(intervalId);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    const nextMessagesTrimmed = nextMessages.slice(-MAX_STORED_MESSAGES);
    const historyForRequest = nextMessagesTrimmed.slice(-MAX_HISTORY_TO_SEND);

    setMessages(nextMessagesTrimmed);
    setInput('');
    setLoading(true);

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(chatEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyForRequest }),
        signal: controller.signal,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      if (typeof data.reply !== 'string') {
        throw new Error('Invalid response');
      }

      setMessages((m) =>
        [...m, { role: 'assistant', content: data.reply }].slice(
          -MAX_STORED_MESSAGES
        )
      );
    } catch (e) {
      const detail =
        e instanceof Error && e.name === 'AbortError'
          ? 'Request timed out. Please try again.'
          : e instanceof Error
            ? e.message
            : 'Something went wrong';

      setMessages((m) => [
        ...m.slice(-(MAX_STORED_MESSAGES - 1)),
        {
          role: 'assistant',
          content: buildUserErrorMessage(detail),
        },
      ]);
    } finally {
      clearTimeout(timeoutId);
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      setLoading(false);
    }
  }, [input, loading, messages]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        type="button"
        className="portfolio-chat-fab"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        Chat with Chad
      </button>

      {open && (
        <>
          <button
            type="button"
            className="portfolio-chat-backdrop"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
          />
          <div
            className="portfolio-chat-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-chat-title"
          >
            <div className="portfolio-chat-header">
              <h2 id="portfolio-chat-title">Chat with Chad</h2>
              <button
                type="button"
                className="portfolio-chat-close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                x
              </button>
            </div>
            <p className="portfolio-chat-disclaimer">
              AI-generated; may be inaccurate. For reliable info, use Projects,
              Certificates, and About on this site.
            </p>
            <div className={`portfolio-chat-status portfolio-chat-status--${chatStatus}`}>
              Chat status: {chatStatus === 'online' ? 'Online' : chatStatus === 'offline' ? 'Offline' : 'Checking...'}
            </div>
            <div className="portfolio-chat-messages" ref={listRef}>
              {messages.length === 0 && !loading && (
                <p className="portfolio-chat-msg portfolio-chat-msg--assistant">
                  Hi - ask about Chad&apos;s projects, certs, or where to find
                  something on this portfolio.
                </p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={`${i}-${msg.role}-${msg.content.slice(0, 12)}`}
                  className={`portfolio-chat-msg portfolio-chat-msg--${msg.role}`}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="portfolio-chat-msg portfolio-chat-msg--assistant">
                  Thinking...
                </div>
              )}
            </div>
            <form
              className="portfolio-chat-form"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                ref={inputRef}
                className="portfolio-chat-input"
                placeholder="Message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={loading}
                autoComplete="off"
                aria-label="Message"
              />
              <button
                type="submit"
                className="portfolio-chat-send"
                disabled={loading || !input.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
