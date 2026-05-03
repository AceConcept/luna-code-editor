"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ExtensionDetailPanel } from "@/components/extensions/ExtensionDetailPanel";

/** List column contracts/expands on click (matches `duration-300` / 300ms CSS). */
const LIST_CONTRACT_MS = 300;
/** Detail panel fades in after list contraction finishes. */
const PANEL_FADE_MS = 280;

const ICON_BASE = "/extensions/code-icons/Component%203";

const installedExtensions = [
  {
    id: "python-environments",
    title: "Python Environments",
    description: "Provides a unified python environment experience",
    version: "v.2.12",
    updateAvailable: true,
    iconSrc: `${ICON_BASE}/Variant6.png`,
  },
  {
    id: "spring-boot",
    title: "Spring Boot Extension",
    description: "Tools for faster Java and Spring development.",
    version: "v.5.66",
    updateAvailable: false,
    iconSrc: `${ICON_BASE}/Variant6-1.png`,
  },
  {
    id: "sonarqube",
    title: "SonarQube for IDE",
    description: "Performs static analysis to detect technical debt.",
    version: "v.2.311",
    updateAvailable: true,
    iconSrc: `${ICON_BASE}/Variant5.png`,
  },
  {
    id: "sqlite",
    title: "SQLite",
    description: "A serverless, file-based SQL database engine.",
    version: "v.3.122",
    updateAvailable: false,
    iconSrc: `${ICON_BASE}/sql.png`,
  },
  {
    id: "esp-idf",
    title: "ESP-IDF",
    description: "The official development framework for ESP32 chips.",
    version: "v.8.5",
    updateAvailable: false,
    iconSrc: `${ICON_BASE}/esp.png`,
  },
  {
    id: "dotnet-pack",
    title: ".NET Extension Pack",
    description: "Essential tools for building C# applications easily.",
    version: "v.3.122",
    updateAvailable: false,
    iconSrc: `${ICON_BASE}/.net.png`,
  },
] as const;

const ROW_CLASS =
  "relative box-border h-[7.625rem] min-h-[7.625rem] w-full cursor-default overflow-hidden rounded-[0.5rem] border border-white/[0.14] bg-gradient-to-br from-[#2f2f2f]/95 to-[#232323] py-[1.15rem] pl-[1.5rem] pr-[1.35rem] font-light shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]";

function FilterIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/85"
      aria-hidden
    >
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

function RowDecor() {
  return (
    <>
      <div
        className="pointer-events-none absolute -bottom-[20%] -right-[8%] h-[10rem] w-[10rem] rounded-full border border-white/[0.06] opacity-90"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-[35%] -right-[18%] h-[11rem] w-[11rem] rounded-full border border-white/[0.04] opacity-70"
        aria-hidden
      />
    </>
  );
}

function RowBody({
  ext,
}: {
  ext: (typeof installedExtensions)[number];
}) {
  return (
    <>
      <RowDecor />
      <div className="relative flex h-full min-h-0 items-center gap-[1.15rem]">
        <div className="flex h-[3.5rem] w-[3.5rem] shrink-0 items-center justify-center overflow-hidden bg-transparent">
          <Image
            src={ext.iconSrc}
            alt=""
            width={56}
            height={56}
            className="h-[3.5rem] w-[3.5rem] object-contain"
            draggable={false}
            unoptimized
          />
        </div>

        <div className="min-h-0 min-w-0 flex-1">
          <h3 className="text-[1.2rem] font-light leading-tight text-white">
            {ext.title}
          </h3>
          <p className="mt-[0.35rem] max-w-[42rem] text-[1.05rem] font-light leading-snug text-[#b5b5b5]">
            {ext.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-center gap-[0.35rem]">
          <div className="flex flex-wrap items-center justify-end gap-x-[0.65rem] gap-y-1">
            {ext.updateAvailable ? (
              <>
                <span className="flex items-center gap-[0.4rem]">
                  <span
                    className="h-[0.45rem] w-[0.45rem] shrink-0 rounded-full bg-[#3fb950] shadow-[0_0_6px_rgba(63,185,80,0.65)]"
                    aria-hidden
                  />
                  <span className="text-[0.98rem] font-light text-[#c4c4c4]">
                    Update Available
                  </span>
                </span>
                <span className="text-[0.98rem] font-light tabular-nums text-[#8a8a8a]">
                  {ext.version}
                </span>
              </>
            ) : (
              <span className="text-[0.98rem] font-light tabular-nums text-[#8a8a8a]">
                {ext.version}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function InstalledExtensionsPanel() {
  const [layoutNarrowed, setLayoutNarrowed] = useState(false);
  /** Panel column width: stays open while opacity fades out on close. */
  const [panelTrackOpen, setPanelTrackOpen] = useState(false);
  const [panelRevealed, setPanelRevealed] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const togglePython = useCallback(() => {
    if (panelRevealed) {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
      setPanelRevealed(false);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setPanelTrackOpen(false);
        setLayoutNarrowed(false);
        closeTimerRef.current = null;
      }, PANEL_FADE_MS);
      return;
    }

    if (layoutNarrowed) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
        setPanelRevealed(true);
        return;
      }
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
      setLayoutNarrowed(false);
      return;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setLayoutNarrowed(true);
    openTimerRef.current = setTimeout(() => {
      setPanelTrackOpen(true);
      setPanelRevealed(true);
      openTimerRef.current = null;
    }, LIST_CONTRACT_MS);
  }, [layoutNarrowed, panelRevealed]);

  const rowOpen = layoutNarrowed || panelTrackOpen;

  return (
    <section
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-transparent"
      aria-label="Installed extensions list"
    >
      <div
        className={`relative box-border flex min-h-0 min-w-0 w-full shrink-0 flex-1 flex-col overflow-hidden px-[2rem] pb-[2rem] ${
          rowOpen ? "" : "max-w-[103.25rem]"
        }`}
      >
        <div
          className={`flex min-h-0 min-w-0 flex-col overflow-hidden transition-[max-width] duration-300 ease-out motion-reduce:transition-none ${
            layoutNarrowed ? "shrink-0" : "w-full flex-1"
          }`}
          style={{
            maxWidth: layoutNarrowed ? "60.5rem" : "103.25rem",
          }}
        >
          <header className="flex shrink-0 items-center justify-between bg-transparent pt-[1.25rem] pb-[1rem]">
            <h2 className="text-[1.35rem] font-light tracking-tight text-white">
              Installed Extensions
            </h2>
            <button
              type="button"
              aria-label="Filter extensions"
              className="flex h-[2.25rem] w-[2.25rem] shrink-0 items-center justify-center rounded-[0.375rem] border-0 bg-transparent text-[inherit] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <FilterIcon />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-transparent">
            <ul className="m-0 flex w-full min-w-0 list-none flex-col gap-[0.875rem] p-0 font-light">
              {installedExtensions.map((ext) => {
                const isPython = ext.id === "python-environments";
                if (isPython) {
                  return (
                    <li key={ext.id} className="list-none">
                      <button
                        type="button"
                        className={`${ROW_CLASS} cursor-pointer appearance-none text-left transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35`}
                        onClick={togglePython}
                        aria-expanded={panelRevealed}
                        aria-controls="extension-detail-python"
                      >
                        <RowBody ext={ext} />
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={ext.id} className="list-none">
                    <article className={ROW_CLASS} aria-label={ext.title}>
                      <RowBody ext={ext} />
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div
          className={`absolute inset-y-0 right-0 z-20 flex min-h-0 w-[43.25rem] min-w-0 max-w-[min(43.25rem,100%)] flex-col justify-start ${
            panelRevealed ? "" : "pointer-events-none"
          }`}
          style={{
            opacity: panelRevealed ? 1 : 0,
            transition: `opacity ${PANEL_FADE_MS}ms ease-out`,
            visibility: panelTrackOpen ? "visible" : "hidden",
          }}
          aria-hidden={!panelRevealed}
          inert={panelRevealed ? undefined : true}
        >
          <div className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto">
            <ExtensionDetailPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
