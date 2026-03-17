# AI Chat App - Portfolio-Grade Upgrade Plan

## Context
Transform the current basic Groq chat app into a portfolio-grade AI/LLM showcase. The goal is to demonstrate hands-on experience with: **AI integration, prompt UIs, streaming responses, agent interfaces, and multi-provider architecture**.

## Strategic Decision: Adopt Vercel AI SDK
The `ai` package from Vercel gives us streaming, multi-provider support, and the `useChat` hook out of the box. This replaces the current blocking `sendMessageAction` + `useOptimistic` pattern.

## New Dependencies
```
ai @ai-sdk/react @ai-sdk/groq @ai-sdk/google @ai-sdk/openai zod
react-markdown remark-gfm rehype-highlight highlight.js
sonner
```

## AI Providers (All Free)
| Provider | Best Free Model | Speed | Why |
|----------|----------------|-------|-----|
| **Groq** (primary) | llama-3.3-70b-versatile | ~500 tok/s | Fastest, most reliable free tier |
| **Google Gemini** | gemini-2.5-flash | Fast | 1M context, well-known brand |
| **OpenRouter** | meta-llama/llama-3.1-8b-instruct:free | Varies | Access to 29+ free models |

OpenRouter uses `@ai-sdk/openai` with custom `baseURL: 'https://openrouter.ai/api/v1'`.

## How Streaming Works (Portfolio Talking Point)
1. Client sends messages to `/api/chat` via `useChat` hook (fetch with ReadableStream)
2. API route calls `streamText()` which opens a connection to the AI provider
3. Provider sends tokens one at a time via Server-Sent Events (SSE)
4. API route pipes the stream back to the client via `toUIMessageStreamResponse()`
5. `useChat` hook reads the stream and updates the `messages` array in real-time
6. React re-renders the message component as each token arrives
7. `onFinish` callback fires when stream completes — we persist the full message to the database

---

## Phase 1: Foundation (Streaming + Multi-Provider)
*Everything else depends on this phase.*

- [x] **1.1** Install all dependencies (`ai`, `@ai-sdk/react`, `@ai-sdk/groq`, `@ai-sdk/google`, `@ai-sdk/openai`, `zod`, `react-markdown`, `remark-gfm`, `rehype-highlight`, `highlight.js`, `sonner`)
- [x] **1.2** Schema migration
  - [x] Add to `conversations`: `model` (text, default `'llama-3.3-70b-versatile'`), `provider` (text, default `'groq'`), `systemPrompt` (text, nullable)
  - [x] Add to `messages`: `model` (text, nullable)
  - [x] Update `src/types/index.ts` with `AIModel` interface, updated `Message` and `Conversation`
  - [x] Run `yarn db:push`
- [x] **1.3** Provider config
  - [x] Create `src/lib/ai/providers.ts` — registry of AI providers with factory functions (Groq, Google, OpenRouter)
  - [x] Create `src/lib/ai/models.ts` — flat list of all available models `{ id, name, provider, modelId }`
- [x] **1.4** Streaming API route
  - [x] Create `src/app/api/chat/route.ts`
  - [x] Authenticate via `auth()`
  - [x] Read `messages`, `conversationId`, `model`, `provider`, `systemPrompt` from body
  - [x] Save user message to DB before streaming
  - [x] Call `streamText()` with selected provider/model
  - [x] `onFinish`: save assistant message to DB, trigger title generation if first exchange
  - [x] Return `result.toUIMessageStreamResponse()`
- [x] **1.5** Refactor `Chat.tsx`
  - [x] Replace `useOptimistic` with `useChat` from `@ai-sdk/react`
  - [x] Use `DefaultChatTransport` from `ai` for API configuration
  - [x] Pass `initialMessages`, `conversationId`, model/provider config
  - [x] Wire up `status`, `error`, `regenerate`, `stop`, `sendMessage`
- [x] **1.6** Refactor `ChatInput.tsx`
  - [x] Controlled textarea with `react-textarea-autosize`
  - [x] Enter to send, Shift+Enter for newline
  - [x] Receive `input`, `onInputChange`, `onSubmit`, `isLoading`, `onStop` as props
- [x] **1.7** Refactor `actions.ts`
  - [x] Remove `sendMessageAction` (moved to API route)
  - [x] Remove `groq-sdk` import and `getGroqClient` function
  - [x] Add `updateConversationTitle`, `updateConversationSettings`
  - [x] Keep `createNewChat`, `getChatHistory`, `getConversation`, `deleteConversation`

---

## Phase 2: Markdown Rendering + Message UX

- [x] **2.1** Markdown renderer
  - [x] Create `src/components/MarkdownRenderer.tsx`
  - [x] `react-markdown` + `remark-gfm` + `rehype-highlight`
  - [x] Custom `code` component with copy button + language label
  - [x] Styled inline code, links, and tables
- [x] **2.2** Upgrade `ChatMessage.tsx`
  - [x] Assistant messages render through `MarkdownRenderer`
  - [x] Hover action bar: copy button, regenerate (last assistant msg only)
  - [x] Small model label under assistant messages
- [x] **2.3** Code block styling
  - [x] Import `highlight.js/styles/github-dark.css` in `globals.css`
  - [x] `.hljs` background override for transparent code blocks

---

## Phase 3: Model Selector + System Prompt

- [x] **3.1** Model selector
  - [x] Create `src/components/ModelSelector.tsx`
  - [x] Dropdown grouped by provider, shows model names
  - [x] Passed to `useChat` body via transport
- [x] **3.2** System prompt editor
  - [x] Create `src/components/SystemPromptEditor.tsx`
  - [x] Settings icon toggle + popup panel
  - [x] Textarea for custom system prompt
  - [x] Passed to API route via transport body
  - [x] Default: "You are a helpful, accurate, and concise AI assistant."

---

## Phase 4: AI-Generated Titles

- [x] **4.1** Title generation
  - [x] In `/api/chat/route.ts` `onFinish`: if title is "New Chat", fire-and-forget a cheap AI call (`llama-3.1-8b-instant`) to generate a 3-5 word title
  - [x] Update DB with generated title
  - [x] Fallback to truncating user message on error
- [x] **4.2** Client refresh
  - [x] Call `router.refresh()` after stream completes to update sidebar title

---

## Phase 5: Typing Indicator + Error Handling + Stop Button

- [x] **5.1** Typing indicator
  - [x] Create `src/components/TypingIndicator.tsx`
  - [x] Three animated dots (CSS keyframes in `globals.css`)
  - [x] Shown when `status === 'submitted'` (before tokens arrive)
- [x] **5.2** Toast notifications
  - [x] Add `<Toaster />` from sonner to `layout.tsx`
  - [x] Handle 429 (rate limit), 401 (auth), generic errors
- [x] **5.3** Stop generation button
  - [x] Show "Stop generating" button when streaming, calls `stop()` from `useChat`

---

## Phase 6: Mobile Responsive Sidebar

- [x] **6.1** Sidebar state context
  - [x] Create `src/components/SidebarProvider.tsx` — React context for `isOpen`, `toggle`, `close`, `open`
- [x] **6.2** Client sidebar wrapper
  - [x] Create `src/components/SidebarContent.tsx` — client component receiving data as props, handles mobile visibility via context
- [x] **6.3** Layout update
  - [x] Wrap in `SidebarProvider` in `layout.tsx`
  - [x] Create `src/components/MobileHeader.tsx` — hamburger button on mobile
  - [x] Sidebar as fixed overlay on mobile with backdrop
  - [x] `transform: translateX` animation
- [x] **6.4** Update `Sidebar.tsx`
  - [x] Simplified to server component that fetches data and renders into `SidebarContent`

---

## Phase 7: Search + Conversation Rename + Keyboard Shortcuts

- [x] **7.1** Search
  - [x] Create `src/components/SearchInput.tsx` — client-side filter on conversation titles in sidebar
- [x] **7.2** Conversation rename
  - [x] Update `HistoryItem.tsx` — inline edit on double-click or edit icon
  - [x] Saves via `updateConversationTitle` action
- [x] **7.3** Keyboard shortcuts
  - [x] Create `src/hooks/useKeyboardShortcuts.ts`
  - [x] `Ctrl/Cmd+N` — new chat
  - [x] `Escape` — close modals/sidebar (handled by individual components)

---

## Phase 8: Landing Page + Empty States

- [x] **8.1** Redesign home page (`src/app/page.tsx`)
  - [x] Logged in: greeting + 6 clickable example prompt cards
  - [x] Logged out: hero section with 4 feature highlight cards + sign-in CTA
- [x] **8.2** Empty chat state
  - [x] Show "Send a message to start the conversation" in new chat before first message

---

## Phase 9: Final Polish

- [x] **9.1** Auto-scroll improvement
  - [x] Only auto-scroll when user is near bottom (scroll event listener with threshold detection)
- [x] **9.2** Conversation settings persistence
  - [x] Model/provider/systemPrompt saved per conversation in DB schema
  - [x] Restored on page load via `initialModel`, `initialProvider`, `initialSystemPrompt` props
- [ ] **9.3** Persist model selection to DB on change (currently only in-memory per session)
- [ ] **9.4** Remove unused `groq-sdk` dependency from `package.json`
- [ ] **9.5** Wire `useKeyboardShortcuts` hook into a layout-level component

---

## New Files Created
| File | Purpose |
|------|---------|
| `src/app/api/chat/route.ts` | Streaming API route |
| `src/lib/ai/providers.ts` | Multi-provider registry |
| `src/lib/ai/models.ts` | Available models list |
| `src/components/MarkdownRenderer.tsx` | Markdown + code highlighting |
| `src/components/ModelSelector.tsx` | Model/provider dropdown |
| `src/components/SystemPromptEditor.tsx` | Custom system prompt UI |
| `src/components/TypingIndicator.tsx` | Animated typing dots |
| `src/components/SidebarProvider.tsx` | Mobile sidebar context |
| `src/components/SidebarContent.tsx` | Client sidebar wrapper |
| `src/components/SearchInput.tsx` | Conversation search |
| `src/components/MobileHeader.tsx` | Mobile hamburger header |
| `src/hooks/useKeyboardShortcuts.ts` | Global shortcuts |

## Modified Files
| File | Key Changes |
|------|-------------|
| `src/db/schema.ts` | Added model, provider, systemPrompt columns |
| `src/types/index.ts` | Extended interfaces, added AIModel |
| `src/app/actions.ts` | Removed sendMessageAction, added new actions |
| `src/components/Chat.tsx` | useChat hook (AI SDK v6), streaming, error handling |
| `src/components/ChatInput.tsx` | Controlled textarea, keyboard handling |
| `src/components/ChatMessage.tsx` | Markdown, copy, regenerate, model label |
| `src/components/Sidebar.tsx` | Simplified server component |
| `src/components/HistoryItem.tsx` | Rename capability, onNavigate prop |
| `src/app/layout.tsx` | Toaster, SidebarProvider, MobileHeader |
| `src/app/page.tsx` | Example prompts, feature showcase |
| `src/app/globals.css` | Highlight.js theme, typing animation |
| `src/app/chat/[chatId]/page.tsx` | Pass model/provider/systemPrompt to Chat |
| `package.json` | New dependencies |

## Verification Checklist
- [x] `yarn build` — production build succeeds
- [x] `yarn db:push` — schema pushed to database
- [ ] `yarn dev` — app starts without errors
- [ ] Sign in with GitHub — auth flow works
- [ ] Create new chat — conversation created in DB
- [ ] Send message — response streams token-by-token
- [ ] Switch model/provider — different AI responds
- [ ] Set system prompt — AI behavior changes accordingly
- [ ] Markdown message — code blocks render with syntax highlighting + copy
- [ ] Mobile view — sidebar collapses, hamburger works
- [ ] Search — filters conversations in sidebar
- [ ] Delete/rename conversation — works with confirmation
- [ ] Deploy to Vercel — all features work in production
