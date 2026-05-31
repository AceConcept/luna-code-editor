"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

type AssistantReply = {
  title: string;
  body: string;
  bullets?: string[];
};

const JISHO_API_REPLIES: readonly AssistantReply[] = [
  {
    title: "Proxy Jisho through Next.js",
    body: "For **luminos-next**, route dictionary lookups through a server handler so the browser never calls jisho.org directly.",
    bullets: [
      "Avoids **CORS** and keeps API keys off the client",
      "Central place for **caching**, logging, and rate limits",
      "Treat the proxy as the only public entry point for lookups",
    ],
  },
  {
    title: "Add the API route handler",
    body: "Create **`app/api/jisho/route.ts`** with a GET handler that validates `q` and forwards to Jisho.",
    bullets: [
      "Use **`fetch`** with an **`AbortSignal`** timeout",
      "Return stable error shapes for **400**, **502**, and **504**",
      "Forward only the status and JSON the UI needs",
    ],
  },
  {
    title: "Type the Jisho payload",
    body: "Define shared types in **`src/types/jisho.ts`** so routes and components stay aligned.",
    bullets: [
      "Model **`JishoSearchResult`**, **`JishoWord`**, and nested senses",
      "Mirror upstream loosely, then narrow to rendered fields",
      "Export helpers from one module to avoid schema drift",
    ],
  },
  {
    title: "Validate queries early",
    body: "Reject bad input in the route **before** calling Jisho.",
    bullets: [
      "Trim whitespace and return **400** on empty strings",
      "Cap length (e.g. **64 characters**)",
      "Log rejected queries at debug level for tuning",
    ],
  },
  {
    title: "Slim the API response",
    body: "Map upstream `data` to a small client shape so the UI does not depend on Jisho's full schema.",
    bullets: [
      "Return **`slug`**, **`word`**, **`reading`**, **`meanings`**, **`isCommon`**",
      "Drop fields you do not render and coerce nulls safely",
      "Version the shape if you add fields later",
    ],
  },
  {
    title: "Client search helper",
    body: "Add **`searchJisho(query)`** in **`src/lib/jisho.ts`** that calls your proxy.",
    bullets: [
      "Check **`response.ok`** and throw a typed error with a stable **`code`**",
      "Encode the query once in a single URL builder",
      "Surface **`AbortError`** separately from network failures",
    ],
  },
  {
    title: "Wire the lookup UI",
    body: "Use **`useTransition`** or a small hook so search feels responsive.",
    bullets: [
      "Show loading while fetching and debounce live input",
      "Render the first sense's **English glosses**",
      "Keep the last good result visible during background refresh",
    ],
  },
  {
    title: "Cache recent lookups",
    body: "Key cache entries by a **normalized query** (lowercase, trimmed).",
    bullets: [
      "Use in-memory or **sessionStorage** for the study session",
      "Cap at **50–100** entries with LRU eviction",
      "Invalidate when deck or lesson context changes",
    ],
  },
  {
    title: "Handle failures gracefully",
    body: "Make errors readable without wiping the user's work.",
    bullets: [
      "Show **\"try again shortly\"** on **429** with backoff",
      "Keep the last good result visible on network errors",
      "Log upstream status codes server-side for diagnosis",
    ],
  },
  {
    title: "Environment configuration",
    body: "Keep secrets and timeouts in **`.env.local`** and document each variable.",
    bullets: [
      "Set **`JISHO_PROXY_TIMEOUT_MS`** (default **8–12s**)",
      "Optional **Redis** or **KV** for a shared cache later",
      "Never expose upstream URLs or tokens in the client bundle",
    ],
  },
] as const;

const PHASE_TIMING_MS = {
  thinking: 700,
  processing: 900,
  preparing: 900,
} as const;

const TYPEWRITER_MS_PER_CHAR = 12;

const CHAT_PLUS_ICON = "/chat/plus.svg";
const CHAT_MIC_ICON = "/chat/microphone-02.svg";
const CHAT_ENTER_ICON = "/chat/enter.svg";
const CHAT_HEADER_MINUS_ICON = "/chat/Minus.svg";
const CHAT_HEADER_BBOX_ICON = "/chat/BoundingBox.svg";
const CHAT_HEADER_QUESTION_ICON = "/chat/Question.svg";
const CHAT_EMPTY_STATE_ICON = "/chat/Chat-Default.svg";

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

const emptyStateMotion = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.32, ease: EASE_OUT },
};

type AgentPhase = "idle" | "thinking" | "processing" | "preparing" | "typing";

type StatusKey = "thinking" | "processing" | "preparing";

type UserMessage = {
  id: string;
  role: "user";
  text: string;
};

type AssistantMessage = {
  id: string;
  role: "assistant";
  reply: AssistantReply;
  visibleChars: number;
};

type ChatMessage = UserMessage | AssistantMessage;

const STATUS_LABELS: Record<StatusKey, string> = {
  thinking: "Thinking",
  processing: "Processing request",
  preparing: "Preparing appropriate response",
};

function pickStockReply(userMessageIndex: number): AssistantReply {
  if (userMessageIndex < JISHO_API_REPLIES.length) {
    return JISHO_API_REPLIES[userMessageIndex];
  }
  const idx = Math.floor(Math.random() * JISHO_API_REPLIES.length);
  return JISHO_API_REPLIES[idx];
}

function replyPlainTextLength(reply: AssistantReply): number {
  const bulletBlock =
    reply.bullets && reply.bullets.length > 0
      ? `\n\n${reply.bullets.map((b) => `• ${b}`).join("\n")}`
      : "";
  return reply.title.length + 2 + reply.body.length + bulletBlock.length;
}

function sliceAssistantReply(reply: AssistantReply, charCount: number): AssistantReply {
  let remaining = charCount;

  const title = reply.title.slice(0, Math.min(remaining, reply.title.length));
  remaining -= title.length;
  if (remaining === 0) return { title, body: "", bullets: [] };

  const titleGap = Math.min(remaining, 2);
  remaining -= titleGap;
  if (titleGap < 2) return { title, body: "", bullets: [] };

  const body = reply.body.slice(0, Math.min(remaining, reply.body.length));
  remaining -= body.length;
  if (remaining === 0 || !reply.bullets?.length) {
    return { title, body, bullets: [] };
  }

  const bodyGap = Math.min(remaining, 2);
  remaining -= bodyGap;
  if (bodyGap < 2) return { title, body, bullets: [] };

  const bullets: string[] = [];
  for (let i = 0; i < reply.bullets.length; i++) {
    if (remaining === 0) break;
    if (i > 0) {
      const newline = Math.min(remaining, 1);
      remaining -= newline;
      if (newline < 1) break;
    }
    const marker = Math.min(remaining, 2);
    remaining -= marker;
    if (marker < 2) break;
    const visible = reply.bullets[i].slice(0, Math.min(remaining, reply.bullets[i].length));
    if (visible.length > 0) bullets.push(visible);
    remaining -= visible.length;
  }

  return { title, body, bullets };
}

function renderInlineBold(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(
      <strong key={`b-${match.index}`} className="luna-agent-message-strong">
        {match[1]}
      </strong>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

function AssistantMessageBody({
  reply,
  visibleChars,
  showCaret,
}: {
  reply: AssistantReply;
  visibleChars: number;
  showCaret: boolean;
}) {
  const visible = sliceAssistantReply(reply, visibleChars);
  const hasBullets = (visible.bullets?.length ?? 0) > 0;

  return (
    <article className="luna-agent-message">
      {visible.title ? (
        <h3 className="luna-agent-message-title">{visible.title}</h3>
      ) : null}
      {visible.body ? (
        <p className="luna-agent-message-body">{renderInlineBold(visible.body)}</p>
      ) : null}
      {hasBullets ? (
        <ul className="luna-agent-message-list">
          {visible.bullets!.map((bullet, index) => (
            <li key={index} className="luna-agent-message-list-item">
              {renderInlineBold(bullet)}
            </li>
          ))}
        </ul>
      ) : null}
      {showCaret ? <span className="luna-agent-caret" aria-hidden /> : null}
    </article>
  );
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

function getRootFontSizePx(): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}

export function LunaAgentChat() {
  const formId = useId();
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activeAssistantMessageIdRef = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const baseInputHeightPxRef = useRef<number | null>(null);
  const baseFooterHeightPxRef = useRef<number | null>(null);

  const [draft, setDraft] = useState("");
  const [footerBaseRem, setFooterBaseRem] = useState(0);
  const [footerExtraRem, setFooterExtraRem] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  const syncComposerHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (baseInputHeightPxRef.current === null) {
      baseInputHeightPxRef.current = textarea.offsetHeight;
    }

    const baseHeightPx = baseInputHeightPxRef.current;
    const rootFontSizePx = getRootFontSizePx();
    const maxExtraPx = baseFooterHeightPxRef.current ?? baseHeightPx;
    const maxHeightPx = baseHeightPx + maxExtraPx;

    textarea.style.height = "auto";
    const nextHeightPx = Math.min(
      Math.max(textarea.scrollHeight, baseHeightPx),
      maxHeightPx,
    );
    textarea.style.height = `${nextHeightPx}px`;
  }, []);

  useEffect(() => {
    syncComposerHeight();
  }, [draft, footerBaseRem, syncComposerHeight]);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const syncFooterLayout = () => {
      const rootFontSizePx = getRootFontSizePx();
      const currentPx = footer.offsetHeight;

      if (baseFooterHeightPxRef.current === null) {
        baseFooterHeightPxRef.current = currentPx;
        setFooterBaseRem(currentPx / rootFontSizePx);
        setFooterExtraRem(0);
        return;
      }

      const basePx = baseFooterHeightPxRef.current;
      const extraPx = Math.min(Math.max(currentPx - basePx, 0), basePx);
      setFooterBaseRem(basePx / rootFontSizePx);
      setFooterExtraRem(extraPx / rootFontSizePx);
    };

    syncFooterLayout();

    const observer = new ResizeObserver(syncFooterLayout);
    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  const scrollMessagesToEnd = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "auto" });
  }, []);

  useLayoutEffect(() => {
    scrollMessagesToEnd();
  }, [messages, phase, scrollMessagesToEnd]);

  const startTypewriter = useCallback((fullReply: AssistantReply) => {
    const assistantMessageId = `assistant-${Date.now()}`;
    const totalChars = replyPlainTextLength(fullReply);
    activeAssistantMessageIdRef.current = assistantMessageId;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        reply: fullReply,
        visibleChars: 0,
      },
    ]);
    setPhase("typing");
    let i = 0;
    typewriterRef.current = setInterval(() => {
      i += 1;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageId && message.role === "assistant"
            ? { ...message, visibleChars: i }
            : message,
        ),
      );
      if (i >= totalChars) {
        if (typewriterRef.current) clearInterval(typewriterRef.current);
        typewriterRef.current = null;
        activeAssistantMessageIdRef.current = null;
        setPhase("idle");
      }
    }, TYPEWRITER_MS_PER_CHAR);
  }, []);

  const runResponsePipeline = useCallback(
    (fullReply: AssistantReply) => {
      clearTimers();
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

    if (phase === "typing") {
      clearTimers();
      activeAssistantMessageIdRef.current = null;
      setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", text }]);
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

  const canSend = !isComposerLocked && draft.trim().length > 0;

  return (
    <motion.div
      className="luna-agent-panel luna-agent-panel--docked"
      role="complementary"
      aria-label="LunaChat"
      initial={false}
      style={{
        ["--luna-agent-footer-base-height" as string]: `${footerBaseRem}rem`,
        ["--luna-agent-footer-extra" as string]: `${footerExtraRem}rem`,
      }}
    >
      <header className="luna-agent-header">
        <span className="luna-agent-header-title">LunaChat</span>
        <div className="luna-agent-header-controls">
          <button type="button" aria-label="Minimize" className="luna-agent-win-btn">
            <Image
              src={CHAT_HEADER_MINUS_ICON}
              alt=""
              width={18}
              height={18}
              className="luna-agent-win-btn-ico"
              draggable={false}
              unoptimized
            />
          </button>
          <button type="button" aria-label="Maximize" className="luna-agent-win-btn">
            <Image
              src={CHAT_HEADER_BBOX_ICON}
              alt=""
              width={18}
              height={18}
              className="luna-agent-win-btn-ico"
              draggable={false}
              unoptimized
            />
          </button>
          <button
            type="button"
            aria-label="Help"
            className="luna-agent-win-btn"
          >
            <Image
              src={CHAT_HEADER_QUESTION_ICON}
              alt=""
              width={18}
              height={18}
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
        <div className="luna-agent-body">
          <div className="luna-agent-messages">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  key="luna-chat-empty-state"
                  className="luna-agent-messages-empty"
                  aria-hidden
                  {...emptyStateMotion}
                >
                  <Image
                    src={CHAT_EMPTY_STATE_ICON}
                    alt=""
                    width={217}
                    height={217}
                    className="luna-agent-messages-empty-ico"
                    draggable={false}
                    unoptimized
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {messages.map((message) =>
                message.role === "user" ? (
                  <motion.div
                    key={message.id}
                    className="luna-agent-bubble luna-agent-bubble--user"
                    {...bubbleEnterMotion}
                  >
                    <p>{message.text}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={message.id}
                    className="luna-agent-bubble luna-agent-bubble--assistant"
                    {...bubbleEnterMotion}
                  >
                    <AssistantMessageBody
                      reply={message.reply}
                      visibleChars={message.visibleChars}
                      showCaret={
                        phase === "typing" &&
                        message.id === activeAssistantMessageIdRef.current
                      }
                    />
                  </motion.div>
                ),
              )}
            </AnimatePresence>

            <MessagePipelineStatus phase={phase} />

            <div ref={messagesEndRef} className="luna-agent-messages-anchor" aria-hidden />
          </div>

          <footer ref={footerRef} className="luna-agent-footer">
            <ThinkingFooterStatus phase={phase} />
            <form id={formId} className="luna-agent-composer" onSubmit={onSubmit}>
              <div className="luna-agent-input-wrap">
                <textarea
                  ref={textareaRef}
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
              </div>
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
        </div>
      </motion.div>
    </motion.div>
  );
}
