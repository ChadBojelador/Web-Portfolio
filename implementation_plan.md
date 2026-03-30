# Migrate Portfolio Chat to Vercel AI SDK + Google SDK

We will combine your current context logic with the Vercel AI SDK and the Google Generative AI provider to enable real-time streaming, while also massively reducing technical debt.

## SDK vs. ADK Decision

You mentioned the **Google ADK (Agent Development Kit)**. Here is why we are proposing the **Vercel AI SDK + Google SDK** instead for your portfolio:

*   **Vercel AI SDK (Our Proposal):** This is a high-level UI framework specifically designed for **React/Next.js**. It handles "streaming" out-of-the-box, provides hooks like `useChat` to manage UI state automatically, and maps perfectly to your existing `PortfolioChat.jsx`. It's the industry standard for modern web chatbots.
*   **Google ADK:** This is a specialized framework for building autonomous **Agents** that can perform multi-step tasks across different tools. While more powerful, it is significantly heavier and typically overkill for a portfolio chatbot whose primary job is answering character-based questions.
*   **Recommendation:** Use the Vercel AI SDK to get a premium, streaming user experience with minimal code. If you later want to add "Agentic" features (like the bot actually searching the web or your file system), the Vercel AI SDK *also* supports tool calling similar to the ADK.

## Proposed Changes

### 1. Dependencies
We will install the Vercel AI SDK and the official Google AI provider package.

#### [NEW] Command to run
```bash
npm install ai @ai-sdk/google
```

---

### 2. Backend API Refactor

#### [MODIFY] `api/chatCore.js`
We will rip out the 300+ line custom fetch logic, fallbacks, and error handling.
- We will import `streamText` from `ai` and `google` from `@ai-sdk/google`.
- We will inject your `buildSystemInstructions()` context into the `system` parameter of `streamText`.
- **Token Optimization:** We will implement intelligent message history slicing (e.g., only sending the last 6 messages) to prevent the context window from growing indefinitely, ensuring minimal token usage per request.
- We will ensure `gemini-1.5-flash` (or your preferred lightweight model) is explicitly specified to keep token costs and latency low.
- We will remove all manual rate limiting and string manipulation, and replace it with a 15-line export that returns a `toDataStreamResponse()`.

#### [MODIFY] `scripts/chat-api-dev.mjs`
- Since `chat-api-dev.mjs` is a raw Node HTTP server (not Express/Next.js route), we need to ensure it can correctly pipe the streaming response back to the client.

---

### 3. Frontend Refactor

#### [MODIFY] `src/Components/PortfolioChat.jsx`
We will replace all of your custom `messages`, `loading`, and `input` state logic with the `useChat` hook from the Vercel AI SDK (`@ai-sdk/react`).
- Removes the need for complex `useEffect` scrolling logic, `AbortController`, and `localStorage` caching management (if we decide to simplify).
- Instantly adds beautiful real-time word-by-word streaming when the AI responds.
- Makes the code 60% smaller and far more robust.

## Open Questions

> [!IMPORTANT]
> **SDK vs. ADK Choice**: Do you agree with using the Vercel AI SDK (better for React UI & streaming) or would you prefer the Google ADK (better for complex multi-step agents)?
> I recommend the Vercel AI SDK as it will make your portfolio feel "snappier" and the code much easier to maintain.

> [!CAUTION]
> **Significant Refactor**: This change will remove your custom `fetch` calls and existing state management in `PortfolioChat.jsx`. It will be much cleaner, but it is a major code swap.

Are you ready for me to begin writing the code?
