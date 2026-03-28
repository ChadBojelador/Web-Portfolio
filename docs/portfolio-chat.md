# Portfolio AI chat

The **Chat with Chad** widget calls `POST /api/chat` with a JSON body `{ "messages": [{ "role": "user"|"assistant", "content": "..." }] }` and receives `{ "reply": "..." }`.

## Local development

1. Copy `.env.example` to `.env` in the project root (or export variables in your shell).
2. Set `OPENAI_API_KEY` to a valid [OpenAI](https://platform.openai.com/) API key.
3. Optional provider keys:
   - `XAI_API_KEY=...` (for xAI Grok fallback via `https://api.x.ai/v1/chat/completions`)
   - `GEMINI_API_KEY=...` (or `GOOGLE_API_KEY=...`) for Gemini fallback via Google AI API
4. Optional model fallback order:
   - `OPENAI_MODEL=gpt-4.1-mini`
   - `OPENAI_FALLBACK_MODELS=gpt-4o-mini,gpt-4.1-nano`
   - `XAI_MODEL=grok-4-1-fast`
   - `XAI_FALLBACK_MODELS=grok-3-mini`
   - `GEMINI_MODEL=gemini-2.5-flash`
   - `GEMINI_FALLBACK_MODELS=gemini-2.5-flash-lite,gemini-1.5-flash`
   - `AI_PROVIDER_ORDER=gemini,openai,xai` (default)
5. In one terminal: `npm run dev:api` (starts `http://127.0.0.1:3002/api/chat`).
6. In another: `npm run dev` (Vite proxies `/api` to port 3002; see `vite.config.js`).

Without `dev:api`, the UI still loads but chat requests will fail until the API is running.

## Production (Vercel)

1. Connect the repo and deploy; Vercel runs the Vite build and serves `api/chat.js` as a serverless function.
2. In the project **Environment Variables**, add any provider key you use: `OPENAI_API_KEY`, `XAI_API_KEY`, and/or `GEMINI_API_KEY` (plus optional model variables).
3. Same-origin `fetch('/api/chat')` works with the included `vercel.json` SPA rewrite (paths that do not start with `api/` fall through to `index.html`).

## Cross-origin API

If the frontend and API are on different domains, set `VITE_CHAT_API_URL` to the API base (no trailing slash). The client will call `{VITE_CHAT_API_URL}/api/chat`.

## Limits

The API enforces approximate limits: body size, message count, content length per message, and a simple per-IP rate window (best-effort on serverless). Adjust defaults in `api/chatCore.js` if needed.

## Adding CV data

Add or edit structured CV facts in `src/data/cv.json`. The chat prompt loader reads this file and includes it in the assistant knowledge base.
The API now uses lightweight retrieval, so each question only gets the most relevant CV, experience, project, and certificate facts.
