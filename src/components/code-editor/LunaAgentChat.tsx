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

const DUMMY_ASSISTANT_REPLY =
  "Works, but it's often heavier than H.264/WebM video for full-screen motion: the browser decodes many frames on the main thread, which can affect scroll performance. For static UIs, images or CSS are usually lighter.";

const PHASE_TIMING_MS = {
  thinking: 700,
  processing: 900,
  preparing: 900,
} as const;

const TYPEWRITER_MS_PER_CHAR = 18;

const CHAT_PLUS_ICON = "/chat/plus.svg";
const CHAT_MIC_ICON = "/chat/microphone-02.svg";
const CHAT_ENTER_ICON = "/chat/enter.svg";

const PANEL_HEIGHT_COLLAPSED = "36rem";
const PANEL_HEIGHT_EXPANDED = "calc(2.75rem + 69.5rem)";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const panelMotion = {
  initial: { opacity: 0, y: -10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2 } },
  transition: { duration: 0.32, ease: EASE_OUT },
};

const bubbleMotion = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
  transition: { duration: 0.28, ease: EASE_OUT },
};

const statusMotion = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: EASE_OUT },
};

type AgentPhase = "idle" | "thinking" | "processing" | "preparing" | "typing";

type StatusKey = "thinking" | "processing" | "preparing";

const STATUS_LABELS: Record<StatusKey, string> = {
  thinking: "Thinking",
  processing: "Processing request",
  preparing: "Preparing appropriate response",
};

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
          className="luna-agent-status"
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
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [assistantText, setAssistantText] = useState("");
  const [phase, setPhase] = useState<AgentPhase>("idle");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const clearTimers = useCallback(() => {
    phaseTimersRef.current.forEach(clearTimeout);
    phaseTimersRef.current = [];
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
      typewriterRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const startTypewriter = useCallback(() => {
    setPhase("typing");
    setAssistantText("");
    let i = 0;
    typewriterRef.current = setInterval(() => {
      i += 1;
      setAssistantText(DUMMY_ASSISTANT_REPLY.slice(0, i));
      if (i >= DUMMY_ASSISTANT_REPLY.length) {
        if (typewriterRef.current) clearInterval(typewriterRef.current);
        typewriterRef.current = null;
        setPhase("idle");
        setBusy(false);
      }
    }, TYPEWRITER_MS_PER_CHAR);
  }, []);

  const runResponsePipeline = useCallback(() => {
    clearTimers();
    setBusy(true);
    setAssistantText("");
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
        () => startTypewriter(),
        PHASE_TIMING_MS.thinking +
          PHASE_TIMING_MS.processing +
          PHASE_TIMING_MS.preparing,
      ),
    );
  }, [clearTimers, startTypewriter]);

  const submitMessage = useCallback(() => {
    const text = draft.trim();
    if (!text || busy) return;
    setUserMessage(text);
    setDraft("");
    setExpanded(true);
    runResponsePipeline();
  }, [busy, draft, runResponsePipeline]);

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

  const showAssistant =
    phase === "typing" || (phase === "idle" && assistantText.length > 0);

  const canSend = !busy && draft.trim().length > 0;

  return (
    <motion.div
      className="luna-agent-panel"
      role="dialog"
      aria-label="Luna Agent"
      aria-modal="true"
      initial={panelMotion.initial}
      animate={{
        ...panelMotion.animate,
        height: expanded ? PANEL_HEIGHT_EXPANDED : PANEL_HEIGHT_COLLAPSED,
      }}
      exit={panelMotion.exit}
      transition={{
        opacity: { duration: 0.32, ease: EASE_OUT },
        y: { duration: 0.32, ease: EASE_OUT },
        scale: { duration: 0.32, ease: EASE_OUT },
        height: { duration: 0.85, ease: EASE_OUT },
      }}
    >
      <header className="luna-agent-header">
        <nav className="luna-agent-header-menus" aria-label="Chat menus">
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
            className="luna-agent-win-btn"
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
        title="luna-chat-adjust"
        layout
        transition={{ layout: { duration: 0.85, ease: EASE_OUT } }}
      >
        <div className="luna-agent-messages">
          <AnimatePresence mode="popLayout">
            {userMessage ? (
              <motion.div
                key={`user-${userMessage}`}
                className="luna-agent-bubble luna-agent-bubble--user"
                {...bubbleMotion}
                layout
              >
                <p>{userMessage}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <MessagePipelineStatus phase={phase} />

          <AnimatePresence mode="wait">
            {showAssistant ? (
              <motion.div
                key="assistant-reply"
                className="luna-agent-bubble luna-agent-bubble--assistant"
                {...bubbleMotion}
                layout
              >
                <p>
                  {assistantText}
                  {phase === "typing" ? (
                    <motion.span
                      className="luna-agent-caret"
                      aria-hidden
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ) : null}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <footer className="luna-agent-footer">
          <ThinkingFooterStatus phase={phase} />
          <motion.form
            id={formId}
            className="luna-agent-composer"
            onSubmit={onSubmit}
            layout
            transition={{ layout: { duration: 0.3, ease: EASE_OUT } }}
          >
            <textarea
              className="luna-agent-input"
              placeholder="Ask Anything"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              rows={3}
              disabled={busy}
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
                      disabled={busy}
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
                      disabled={busy}
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
                  <button type="button" className="luna-agent-mode-btn" disabled={busy}>
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
                    disabled={busy}
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
          </motion.form>
        </footer>
      </motion.div>
    </motion.div>
  );
}
