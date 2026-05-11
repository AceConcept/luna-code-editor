"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { ExtensionDetailPanel } from "@/components/extensions/ExtensionDetailPanel";
import {
  type InstalledExtensionId,
  installedExtensions,
  isInstalledExtensionId,
} from "@/components/extensions/installedExtensionsData";

/** List narrows before the panel mounts; no CSS transition on list width — avoids scrollbar flicker. */
const LIST_CONTRACT_MS = 300;
/** Panel `opacity` fade duration; list stays narrowed until fade-out finishes on close. */
const PANEL_FADE_MS = 300;

const EXT_DETAIL_QUERY_KEY = "extDetail";

function FilterFunnelIcon() {
  return (
    <svg
      className="extl-filter-ico"
      viewBox="0 0 28 28"
      width={28}
      height={28}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M24.9133 7.30188L24.9045 7.31172L17.4966 15.2217V21.2909C17.497 21.5796 17.426 21.8639 17.2899 22.1184C17.1539 22.373 16.9569 22.59 16.7167 22.75L13.2167 25.0841C12.953 25.2598 12.6464 25.3605 12.3299 25.3756C12.0133 25.3907 11.6986 25.3196 11.4194 25.1698C11.1401 25.02 10.9067 24.7971 10.7442 24.5251C10.5817 24.253 10.4961 23.9419 10.4966 23.625V15.2217L3.08858 7.31172L3.07983 7.30188C2.85206 7.0512 2.70192 6.73982 2.64763 6.4055C2.59334 6.07118 2.63723 5.72829 2.77399 5.41842C2.91074 5.10855 3.13447 4.84503 3.41805 4.65982C3.70162 4.47461 4.03285 4.37567 4.37155 4.375H23.6216C23.9605 4.37503 24.2922 4.47351 24.5763 4.65848C24.8603 4.84344 25.0846 5.10693 25.2217 5.41692C25.3589 5.72691 25.4031 6.07007 25.3489 6.40469C25.2947 6.73931 25.1445 7.051 24.9166 7.30188H24.9133Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RowBody({
  ext,
}: {
  ext: (typeof installedExtensions)[number];
}) {
  return (
    <>
      <div className="extl-row-body">
        <div className="extl-row-icon-wrap">
          <Image
            src={ext.iconSrc}
            alt=""
            width={56}
            height={56}
            className="extl-row-icon-img"
            draggable={false}
            unoptimized
          />
        </div>

        <div className="extl-row-text">
          <h3 className="extl-row-heading">{ext.title}</h3>
          <p className="extl-row-desc">{ext.description}</p>
        </div>

        <div className="extl-row-meta">
          <div className="extl-row-meta-line">
            {ext.updateAvailable ? (
              <>
                <span className="extl-update-pill">
                  <span className="extl-update-dot" aria-hidden />
                  <span className="extl-update-label">Update Available</span>
                </span>
                <span className="extl-version">{ext.version}</span>
              </>
            ) : (
              <span className="extl-version">{ext.version}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function InstalledExtensionsPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [layoutNarrowed, setLayoutNarrowed] = useState(false);
  const [panelTrackOpen, setPanelTrackOpen] = useState(false);
  const [panelRevealed, setPanelRevealed] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Avoid re-applying URL→state when `useSearchParams()` identity churns but `?query` is unchanged. */
  const lastAppliedSearchQsRef = useRef<string | undefined>(undefined);
  /** Last time `?extDetail=` meant “drawer ought to open” — avoids close choreography when URL never had it. */
  const prevHadExtDetailInUrlRef = useRef(false);

  /** Lets the slot paint at `opacity: 0` before `panelRevealed` so the 300ms fade-in runs. */
  const schedulePanelFadeIn = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPanelRevealed(true);
      });
    });
  }, []);

  const setExtDetailInUrl = useCallback(
    (id: InstalledExtensionId | null) => {
      if (typeof window === "undefined") return;
      const p = new URLSearchParams(window.location.search);
      const cur = p.get(EXT_DETAIL_QUERY_KEY);
      if (id === null) {
        if (!cur) return;
        p.delete(EXT_DETAIL_QUERY_KEY);
      } else {
        if (cur === id) return;
        p.set(EXT_DETAIL_QUERY_KEY, id);
      }
      const q = p.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const searchQsKey = searchParams.toString();

  /** URL / browser navigation → drawer state (only when `?…` string changes). */
  useLayoutEffect(() => {
    if (lastAppliedSearchQsRef.current === searchQsKey) return;
    lastAppliedSearchQsRef.current = searchQsKey;

    const detailParam = new URLSearchParams(searchQsKey).get(
      EXT_DETAIL_QUERY_KEY,
    );
    const detailInUrl = isInstalledExtensionId(detailParam);

    if (detailInUrl) {
      prevHadExtDetailInUrlRef.current = true;
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setLayoutNarrowed(true);
      setPanelTrackOpen(true);
      schedulePanelFadeIn();
      return;
    }

    if (!prevHadExtDetailInUrlRef.current) {
      return;
    }
    prevHadExtDetailInUrlRef.current = false;

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
  }, [searchQsKey, schedulePanelFadeIn]);

  /** URL lost `extDetail` during list-narrow-only phase → unwrap list width. */
  useEffect(() => {
    const detailParam = new URLSearchParams(searchQsKey).get(
      EXT_DETAIL_QUERY_KEY,
    );
    const detailInUrl = isInstalledExtensionId(detailParam);
    if (
      detailInUrl ||
      panelRevealed ||
      panelTrackOpen ||
      !layoutNarrowed
    ) {
      return;
    }
    if (openTimerRef.current || closeTimerRef.current) return;
    setLayoutNarrowed(false);
  }, [searchQsKey, layoutNarrowed, panelRevealed, panelTrackOpen]);

  const toggleExtension = useCallback(
    (extId: InstalledExtensionId) => {
      if (typeof window === "undefined") return;
      const currentInUrl = new URLSearchParams(window.location.search).get(
        EXT_DETAIL_QUERY_KEY,
      );
      const currentId = isInstalledExtensionId(currentInUrl)
        ? currentInUrl
        : null;

      if (panelRevealed) {
        if (currentId !== null && currentId !== extId) {
          setExtDetailInUrl(extId);
          return;
        }
        if (openTimerRef.current) {
          clearTimeout(openTimerRef.current);
          openTimerRef.current = null;
        }
        setPanelRevealed(false);
        setExtDetailInUrl(null);
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
          setExtDetailInUrl(extId);
          return;
        }
        if (openTimerRef.current) {
          clearTimeout(openTimerRef.current);
          openTimerRef.current = null;
          setLayoutNarrowed(false);
          setExtDetailInUrl(null);
          return;
        }
        return;
      }

      if (panelTrackOpen && closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
        setPanelRevealed(true);
        setExtDetailInUrl(extId);
        return;
      }

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setLayoutNarrowed(true);
      openTimerRef.current = setTimeout(() => {
        setPanelTrackOpen(true);
        setExtDetailInUrl(extId);
        schedulePanelFadeIn();
        openTimerRef.current = null;
      }, LIST_CONTRACT_MS);
    },
    [
      layoutNarrowed,
      panelRevealed,
      panelTrackOpen,
      setExtDetailInUrl,
      schedulePanelFadeIn,
    ],
  );

  const rowOpen = layoutNarrowed || panelTrackOpen;

  const detailParam = searchParams.get(EXT_DETAIL_QUERY_KEY);
  const extIdFromUrl = isInstalledExtensionId(detailParam)
    ? detailParam
    : null;

  /** `useSearchParams` can lag one frame behind `router.replace`; cache last valid id for the open panel. */
  const [cachedExtId, setCachedExtId] = useState<InstalledExtensionId | null>(
    null,
  );
  useEffect(() => {
    if (extIdFromUrl) setCachedExtId(extIdFromUrl);
  }, [extIdFromUrl]);
  useEffect(() => {
    if (!extIdFromUrl && !panelTrackOpen) setCachedExtId(null);
  }, [extIdFromUrl, panelTrackOpen]);

  const activeExtId = extIdFromUrl ?? cachedExtId;

  return (
    <section className="extl-section" aria-label="Installed extensions list">
      <div
        className={`extl-frame${rowOpen ? "" : " extl-frame--constrained"}`}
      >
        <div
          className={`extl-list-col${layoutNarrowed ? " extl-list-col--narrowed" : " extl-list-col--wide"}`}
          style={{
            maxWidth: layoutNarrowed ? "60.5rem" : "103.25rem",
          }}
        >
          <div className="extl-scroll">
            <header className="extl-header">
              <h2 className="extl-title">Installed Extensions</h2>
              <button
                type="button"
                aria-label="Filter extensions"
                className="extl-filter-btn"
              >
                <FilterFunnelIcon />
              </button>
            </header>

            <ul className="extl-ul">
              {installedExtensions.map((ext) => {
                const isExpandedRow =
                  panelRevealed && activeExtId === ext.id;
                return (
                  <li key={ext.id} className="extl-li">
                    <button
                      type="button"
                      className="extl-row extl-row--btn"
                      onClick={() => toggleExtension(ext.id)}
                      aria-expanded={isExpandedRow}
                      aria-controls="extension-panel"
                    >
                      <RowBody ext={ext} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div
          className={`extl-panel-slot${panelRevealed ? "" : " extl-panel-slot--inert"}`}
          style={{
            visibility: panelTrackOpen ? "visible" : "hidden",
            opacity: panelTrackOpen && panelRevealed ? 1 : 0,
          }}
          aria-hidden={!panelRevealed}
          inert={panelRevealed ? undefined : true}
        >
          <div className="extl-panel-scroll">
            {activeExtId ? (
              <ExtensionDetailPanel extensionId={activeExtId} />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
