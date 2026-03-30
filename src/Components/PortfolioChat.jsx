import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useChat } from '@ai-sdk/react';
import '../Styles/chat-widget.css';

const SUGGESTIONS = [
  "What projects has Chad built?",
  "Tell me about his technical skills.",
  "How can I contact him?",
  "What certificates does he hold?"
];

function chatEndpoint() {
  const base = import.meta.env.VITE_CHAT_API_URL;
  if (base && String(base).trim()) {
    return `${String(base).replace(/\/$/, '')}/api/chat`;
  }
  return '/api/chat';
}

function formatTime(ts) {
  if (!ts) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(ts));
}

export default function PortfolioChat() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    reload,
    setMessages,
    append
  } = useChat({
    api: chatEndpoint(),
    onError: (err) => console.error('Chat error:', err),
  });

  const getGreeting = () => {
    if (location.pathname === '/projects') return "Hi! I can tell you all about Chad's projects. What would you like to know?";
    if (location.pathname === '/certificates') return "Hello! Want to know more about Chad's certifications and courses?";
    if (location.pathname === '/about') return "Hi there! I can help you learn more about Chad or how to contact him.";
    return "Hi - ask me about Chad's projects, skills, certs, or where to find something on this portfolio!";
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, isLoading]);

  const handleClear = () => {
    setMessages([]);
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleChipClick = (suggestion) => {
    append({ role: 'user', content: suggestion });
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
              <div className="portfolio-chat-header-actions">
                <button
                  type="button"
                  className="portfolio-chat-icon-btn"
                  title="Clear Chat"
                  onClick={handleClear}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
                </button>
                <button
                  type="button"
                  className="portfolio-chat-close"
                  aria-label="Close chat"
                  onClick={() => setOpen(false)}
                >
                  &#x2715;
                </button>
              </div>
            </div>
            
            <p className="portfolio-chat-disclaimer">
              AI-generated; may be inaccurate. For reliable info, use Projects, Certificates, and About on this site.
            </p>
            <div className="portfolio-chat-status portfolio-chat-status--online">
              Chat status: Online
            </div>
            
            <div className="portfolio-chat-messages" ref={listRef}>
              {messages.length === 0 && !isLoading && (
                <div className="portfolio-chat-welcome">
                  <div className="portfolio-chat-msg portfolio-chat-msg--assistant">
                    {getGreeting()}
                  </div>
                  <div className="portfolio-chat-chips">
                    {SUGGESTIONS.map(s => (
                      <button key={s} onClick={() => handleChipClick(s)} className="portfolio-chat-chip">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <div
                  key={msg.id || i}
                  className={`portfolio-chat-msg-wrapper portfolio-chat-msg-wrapper--${msg.role}`}
                >
                  <div className={`portfolio-chat-msg portfolio-chat-msg--${msg.role}`}>
                     {msg.role === 'assistant' ? (
                       <div className="portfolio-chat-markdown prose prose-invert max-w-none text-sm leading-snug">
                         <ReactMarkdown>{msg.content}</ReactMarkdown>
                       </div>
                     ) : (
                       msg.content
                     )}
                     
                     {msg.role === 'assistant' && (
                       <button 
                         className="portfolio-chat-copy-btn" 
                         onClick={() => copyToClipboard(msg.content, msg.id || i)}
                         title="Copy message"
                       >
                         {copiedId === (msg.id || i) ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                         ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                         )}
                       </button>
                     )}
                  </div>
                </div>
              ))}
              
              {error && (
                <div className="portfolio-chat-msg-wrapper portfolio-chat-msg-wrapper--assistant">
                  <div className="portfolio-chat-msg portfolio-chat-msg--assistant portfolio-chat-msg--error">
                     Sorry, the chat service encountered an error. Please try again or check the API keys.
                  </div>
                  <div className="portfolio-chat-msg-meta">
                      <button className="portfolio-chat-retry-btn" onClick={() => reload()}>
                        Retry
                      </button>
                  </div>
                </div>
              )}

              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <div className="portfolio-chat-msg-wrapper portfolio-chat-msg-wrapper--assistant">
                  <div className="portfolio-chat-msg portfolio-chat-msg--assistant">
                    <div className="portfolio-chat-typing">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <form
              className="portfolio-chat-form"
              onSubmit={handleSubmit}
            >
              <input
                ref={inputRef}
                className="portfolio-chat-input"
                placeholder="Message..."
                value={input}
                onChange={handleInputChange}
                disabled={isLoading && error === undefined}
                autoComplete="off"
                aria-label="Message"
              />
              {isLoading && !error ? (
                <button
                  type="button"
                  className="portfolio-chat-send portfolio-chat-stop"
                  onClick={stop}
                  title="Stop generating"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12"></rect></svg>
                </button>
              ) : (
                <button
                  type="submit"
                  className="portfolio-chat-send"
                  disabled={!input.trim()}
                >
                  Send
                </button>
              )}
            </form>
          </div>
        </>
      )}
    </>
  );
}
