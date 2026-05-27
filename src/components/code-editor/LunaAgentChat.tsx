"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

const JISHO_API_REPLIES = [
  "For luminos-next, proxy Jisho through a Next.js route handler so the browser never hits jisho.org directly. That sidesteps CORS, keeps your API key and rate-limit logic on the server, and gives you one place to add caching, logging, and request shaping before responses ever reach the client. Treat the proxy as the only public entry point for dictionary lookups.",
  "Add `app/api/jisho/route.ts` with a GET handler that reads `q` from the query string, validates it, and forwards to `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(q)}`. Use `fetch` with an `AbortSignal` timeout, forward only the status and JSON body you need, and return consistent error shapes for 400, 502, and 504 so the UI can branch without parsing raw upstream payloads.",
  "Define types in `src/types/jisho.ts` for the API payload—`JishoSearchResult`, `JishoWord`, and nested `senses` / `japanese` entries—so the UI stays typed end-to-end. Mirror the upstream schema loosely at first, then narrow to the fields you render. Export response helpers and keep route handlers and React components importing from the same module to avoid drift.",
  "Validate input in the route before calling Jisho: trim whitespace, reject empty strings with 400, cap length (e.g. 64 characters), and normalize full-width digits or stray punctuation if your study flow needs it. Log rejected queries at debug level so you can tune rules without spamming production logs.",
  "Return a slimmed response from the API route—map `data` to `{ slug, word, reading, meanings, isCommon }` so the client does not depend on Jisho's full schema. Drop rare fields you do not render, coerce nulls to safe defaults, and version the shape if you add fields later so older clients do not break silently.",
  "On the client, add a `searchJisho(query: string)` helper in `src/lib/jisho.ts` that calls `/api/jisho?q=`, checks `response.ok`, and throws a typed error with a stable `code` field when the proxy fails. Centralize URL building, encode the query once, and surface `AbortError` separately so the UI can distinguish user cancel from network failure.",
  "Wire the lookup UI with `useTransition` or a small hook: set loading while fetching, debounce rapid input if search is live, show the first sense's English glosses, and surface a clear empty state when `data` is empty. Keep the last successful result on screen during background refresh so the panel does not flicker on slow networks.",
  "Cache recent lookups in memory (or sessionStorage) keyed by a normalized query—lowercase, trimmed—so repeat searches in a study session feel instant. Cap the cache at 50–100 entries with LRU eviction, and invalidate when the user switches decks or lessons if context changes the sense they expect.",
  "Handle failures gracefully: 429 from your proxy should show \"try again shortly\" with backoff; network errors should keep the last good result visible and offer a retry affordance. Avoid clearing the textarea on failure, and log upstream status codes server-side so you can tell rate limits from Jisho outages.",
  "Add env-driven config in `.env.local`—`JISHO_PROXY_TIMEOUT_MS`, optional Redis or KV for a shared cache later, and keep the public surface limited to your `/api/jisho` route. Document each variable in README, default timeouts conservatively (8–12s), and never expose upstream URLs or tokens to the browser bundle.",
] as const;

const PHASE_TIMING_MS = {
  thinking: 700,
  processing: 900,
  preparing: 900,
} as const;

const TYPEWRITER_MS_PER_CHAR = 24;

const CHAT_PLUS_ICON = "/chat/plus.svg";
const CHAT_MIC_ICON = "/chat/microphone-02.svg";
const CHAT_ENTER_ICON = "/chat/enter.svg";

/** 800px at 16px root */
const MESSAGES_VIEWPORT_HEIGHT = "50rem";
const PANEL_FOOTER_REM = "14.5rem";
const PANEL_HEADER_REM = "2.75rem";
const PANEL_HEIGHT = `calc(${PANEL_HEADER_REM} + ${MESSAGES_VIEWPORT_HEIGHT} + ${PANEL_FOOTER_REM})`;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const chatBodyMotion = {
  initial: { y: -16 },
  animate: { y: 0 },
  transition: { duration: 0.32, ease: EASE_OUT },
};

const bubbleEnterMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: EASE_OUT },
};

const statusMotion = {
  initial: { y: 6 },
  animate: { y: 0 },
  exit: { y: -4 },
  transition: { duration: 0.22, ease: EASE_OUT },
};

type AgentPhase = "idle" | "thinking" | "processing" | "preparing" | "typing";

type StatusKey = "thinking" | "processing" | "preparing";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const STATUS_LABELS: Record<StatusKey, string> = {
  thinking: "Thinking",
  processing: "Processing request",
  preparing: "Preparing appropriate response",
};

function pickStockReply(userMessageIndex: number): string {
  if (userMessageIndex < JISHO_API_REPLIES.length) {
    return JISHO_API_REPLIES[userMessageIndex];
  }
  const idx = Math.floor(Math.random() * JISHO_API_REPLIES.length);
  return JISHO_API_REPLIES[idx];
}

function ThinkingDots() {
  return (
    <span className="luna-agent-thinking-dots" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="luna-agent-thinking-dot"
          animate={{ y: [0, "-0.2rem", 0], opacity: [0.35, 1, 0.35] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </span>
  );
}

function ThinkingFooterStatus({ phase }: { phase: AgentPhase }) {
  const show =
    phase === "thinking" || phase === "processing" || phase === "preparing";

  return (
    <AnimatePresence mode="wait">
      {show ? (
        <motion.p
          key="thinking-footer"
          className="luna-agent-status luna-agent-status--footer-thinking"
          role="status"
          aria-live="polite"
          {...statusMotion}
        >
          <span>{STATUS_LABELS.thinking}</span>
          <ThinkingDots />
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

function MessagePipelineStatus({ phase }: { phase: AgentPhase }) {
  const label =
    phase === "processing"
      ? STATUS_LABELS.processing
      : phase === "preparing"
        ? STATUS_LABELS.preparing
        : null;

  return (
    <AnimatePresence mode="wait">
      {label ? (
        <motion.p
          key={label}
          className="luna-agent-status luna-agent-status--message"
          role="status"
          aria-live="polite"
          {...statusMotion}
        >
          {label}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

export function LunaAgentChat({ onClose }: { onClose: () => void }) {
  const formId = useId();
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingText, setTypingText] = useState("");
  const [streamFullText, setStreamFullText] = useState<string | null>(null);
  const [phase, setPhase] = useState<AgentPhase>("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isComposerLocked =
    phase === "thinking" || phase === "processing" || phase === "preparing";

  const clearTimers = useCallback(() => {
    phaseTimersRef.current.forEach(clearTimeout);
    phaseTimersRef.current = [];
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
      typewriterRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const scrollMessagesToEnd = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "auto" });
  }, []);

  useEffect(() => {
    if (phase === "typing" || typingText.length > 0) {
      scrollMessagesToEnd();
    }
  }, [phase, typingText, scrollMessagesToEnd]);

  const startTypewriter = useCallback(
    (fullReply: string) => {
      setPhase("typing");
      setStreamFullText(fullReply);
      setTypingText("");
      let i = 0;
      typewriterRef.current = setInterval(() => {
        i += 1;
        setTypingText(fullReply.slice(0, i));
        if (i >= fullReply.length) {
          if (typewriterRef.current) clearInterval(typewriterRef.current);
          typewriterRef.current = null;
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              text: fullReply,
            },
          ]);
          setTypingText("");
          setStreamFullText(null);
          setPhase("idle");
        }
      }, TYPEWRITER_MS_PER_CHAR);
    },
    [],
  );

  const runResponsePipeline = useCallback(
    (fullReply: string) => {
      clearTimers();
      setTypingText("");
      setStreamFullText(null);
      setPhase("thinking");

      phaseTimersRef.current.push(
        setTimeout(() => setPhase("processing"), PHASE_TIMING_MS.thinking),
      );
      phaseTimersRef.current.push(
        setTimeout(
          () => setPhase("preparing"),
          PHASE_TIMING_MS.thinking + PHASE_TIMING_MS.processing,
        ),
      );
      phaseTimersRef.current.push(
        setTimeout(
          () => startTypewriter(fullReply),
          PHASE_TIMING_MS.thinking +
            PHASE_TIMING_MS.processing +
            PHASE_TIMING_MS.preparing,
        ),
      );
    },
    [clearTimers, startTypewriter],
  );

  const submitMessage = useCallback(() => {
    const text = draft.trim();
    if (!text || isComposerLocked) return;

    const userMessageIndex = messages.filter((m) => m.role === "user").length;
    const replyText = pickStockReply(userMessageIndex);

    if (phase === "typing" || typingText.length > 0) {
      clearTimers();
      setMessages((prev) => {
        const next = [...prev];
        if (typingText.length > 0) {
          next.push({
            id: `assistant-${Date.now()}`,
            role: "assistant",
            text: typingText,
          });
        }
        next.push({ id: `user-${Date.now()}`, role: "user", text });
        return next;
      });
      setTypingText("");
      setStreamFullText(null);
      setPhase("idle");
      setDraft("");
      runResponsePipeline(replyText);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text },
    ]);
    setDraft("");
    runResponsePipeline(replyText);
  }, [
    clearTimers,
    draft,
    isComposerLocked,
    messages,
    phase,
    runResponsePipeline,
    typingText,
  ]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitMessage();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  const showTypingBubble =
    streamFullText !== null && (phase === "typing" || typingText.length > 0);

  const canSend = !isComposerLocked && draft.trim().length > 0;

  return (
    <motion.div
      className="luna-agent-panel"
      role="dialog"
      aria-label="Luna Agent"
      aria-modal="true"
      initial={false}
      style={{ height: PANEL_HEIGHT }}
    >
      <header className="luna-agent-header">
        <nav className="luna-agent-header-menus" aria-label="Chat menus">
          <span className="luna-agent-header-dot-wrap" aria-hidden>
            <span className="luna-agent-header-dot" />
          </span>
          {(["File", "Edit", "Selection"] as const).map((item) => (
            <button key={item} type="button" className="luna-agent-header-menu-btn">
              {item}
            </button>
          ))}
        </nav>
        <div className="luna-agent-header-controls">
          <button type="button" aria-label="Minimize" className="luna-agent-win-btn">
            <Image
              src="/code-editor/layout-bar/Minus.svg"
              alt=""
              width={24}
              height={24}
              className="luna-agent-win-btn-ico"
              draggable={false}
              unoptimized
            />
          </button>
          <button type="button" aria-label="Maximize" className="luna-agent-win-btn">
            <Image
              src="/code-editor/layout-bar/Square.svg"
              alt=""
              width={20}
              height={20}
              className="luna-agent-win-btn-ico luna-agent-win-btn-ico--maximize"
              draggable={false}
              unoptimized
            />
          </button>
          <button
            type="button"
            aria-label="Close Luna Agent"
            className="luna-agent-win-btn luna-agent-win-btn--close"
            onClick={onClose}
          >
            <Image
              src="/code-editor/terminal/Close.svg"
              alt=""
              width={24}
              height={24}
              className="luna-agent-win-btn-ico"
              draggable={false}
              unoptimized
            />
          </button>
        </div>
      </header>

      <motion.div
        className="luna-chat-adjust"
        initial={false}
        animate={chatBodyMotion.animate}
        transition={chatBodyMotion.transition}
      >
        <div
          className="luna-agent-messages"
          style={{
            height: MESSAGES_VIEWPORT_HEIGHT,
            minHeight: MESSAGES_VIEWPORT_HEIGHT,
            maxHeight: MESSAGES_VIEWPORT_HEIGHT,
          }}
        >
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={
                  message.role === "user"
                    ? "luna-agent-bubble luna-agent-bubble--user"
                    : "luna-agent-bubble luna-agent-bubble--assistant"
                }
                {...bubbleEnterMotion}
              >
                <p>{message.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          <MessagePipelineStatus phase={phase} />

          {showTypingBubble && streamFullText ? (
            <div className="luna-agent-bubble luna-agent-bubble--assistant luna-agent-bubble--streaming">
              <p className="luna-agent-typing-block">
                <span className="luna-agent-typing-ghost" aria-hidden>
                  {streamFullText}
                </span>
                <span className="luna-agent-typing-visible">
                  {typingText}
                  {phase === "typing" ? (
                    <span className="luna-agent-caret" aria-hidden />
                  ) : null}
                </span>
              </p>
            </div>
          ) : null}

          <div ref={messagesEndRef} className="luna-agent-messages-anchor" aria-hidden />
        </div>

        <footer className="luna-agent-footer">
          <ThinkingFooterStatus phase={phase} />
          <form id={formId} className="luna-agent-composer" onSubmit={onSubmit}>
            <textarea
              className="luna-agent-input"
              placeholder="Ask Anything"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              rows={3}
              disabled={isComposerLocked}
              aria-label="Message Luna Agent"
              spellCheck={false}
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
            />
            <div className="luna-agent-composer-bar-wrap">
              <div className="luna-agent-composer-bar">
                <div className="luna-agent-composer-left">
                  <div className="luna-agent-round-btn-wrap">
                    <button
                      type="button"
                      aria-label="Add attachment"
                      className="luna-agent-round-btn"
                      disabled={isComposerLocked}
                    >
                      <Image
                        src={CHAT_PLUS_ICON}
                        alt=""
                        width={16}
                        height={16}
                        className="luna-agent-round-btn-ico"
                        draggable={false}
                        unoptimized
                        aria-hidden
                      />
                    </button>
                  </div>
                  <div className="luna-agent-round-btn-wrap">
                    <button
                      type="button"
                      aria-label="Voice input"
                      className="luna-agent-round-btn"
                      disabled={isComposerLocked}
                    >
                      <Image
                        src={CHAT_MIC_ICON}
                        alt=""
                        width={16}
                        height={16}
                        className="luna-agent-round-btn-ico"
                        draggable={false}
                        unoptimized
                        aria-hidden
                      />
                    </button>
                  </div>
                </div>
                <div className="luna-agent-composer-right">
                  <button type="button" className="luna-agent-mode-btn" disabled={isComposerLocked}>
                    Auto
                    <Image
                      src="/code-editor/folder-menu/Caret.svg"
                      alt=""
                      width={14}
                      height={14}
                      className="luna-agent-mode-caret"
                      draggable={false}
                      unoptimized
                      aria-hidden
                    />
                  </button>
                  <motion.button
                    type="button"
                    aria-label="Send message"
                    className={
                      canSend
                        ? "luna-agent-send-btn"
                        : "luna-agent-send-btn luna-agent-send-btn--inactive"
                    }
                    disabled={isComposerLocked}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      submitMessage();
                    }}
                    whileHover={canSend ? { scale: 1.05 } : undefined}
                    whileTap={canSend ? { scale: 0.94 } : undefined}
                    transition={{ type: "spring", stiffness: 520, damping: 28 }}
                  >
                    <Image
                      src={CHAT_ENTER_ICON}
                      alt=""
                      width={16}
                      height={16}
                      className="luna-agent-send-ico"
                      draggable={false}
                      unoptimized
                      aria-hidden
                    />
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </footer>
      </motion.div>
    </motion.div>
  );
}
