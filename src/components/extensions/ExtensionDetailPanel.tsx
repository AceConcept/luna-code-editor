"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { extensionDetailCopy } from "@/components/extensions/extensionDetailCopy";
import {
  type InstalledExtensionId,
  getInstalledExtension,
} from "@/components/extensions/installedExtensionsData";
const GEAR_ICON = "/extensions/ext-panel/Gear.svg";
const EXPAND_ICON = "/extensions/ext-panel/expand.svg";
const STARS_ICON = "/extensions/ext-panel/stars.svg";
const DOWNLOAD_BTN_ICON = "/extensions/ext-panel/dwnload-icon.svg";
const DL_CARET_ICON = "/extensions/ext-panel/dl-caret.svg";
const CLOUD_ARROW_DOWN_ICON = "/extensions/ext-panel/CloudArrowDown.svg";
const WARNING_ICON = "/extensions/ext-panel/Warning.svg";
const WARNING_DIAMOND_ICON = "/extensions/ext-panel/alert-modal/WarningDiamond.svg";
const TRIPLE_DOT_ICON = "/extensions/ext-panel/triple-dot.svg";

function StarRow() {
  return (
    <div className="extp-star-row" aria-label="4 out of 5 stars">
      <Image
        src={STARS_ICON}
        alt=""
        width={99}
        height={20}
        className="extp-star-img"
        draggable={false}
        unoptimized
        aria-hidden
      />
      <span className="extp-star-count">(100)</span>
    </div>
  );
}

function IconBtn({ label, src }: { label: string; src: string }) {
  return (
    <button type="button" aria-label={label} className="extp-icon-btn">
      <Image
        src={src}
        alt=""
        width={36}
        height={36}
        className="extp-icon-btn-img"
        draggable={false}
        unoptimized
        aria-hidden
      />
    </button>
  );
}

const DOWNLOAD_MS = 1000;
const HOLD_AT_100_MS = 400;

/** Side panel mock — width 692px (43.25rem @ 16px root), height 1122px (70.125rem). */
export function ExtensionDetailPanel({
  extensionId,
}: {
  extensionId: InstalledExtensionId;
}) {
  const meta = getInstalledExtension(extensionId);
  const copy = extensionDetailCopy[extensionId];
  const hasUpdate = meta.updateAvailable;
  const router = useRouter();
  const [downloadPct, setDownloadPct] = useState(0);
  const [downloadActive, setDownloadActive] = useState(false);
  const [restartModalOpen, setRestartModalOpen] = useState(false);
  const [modalHost, setModalHost] = useState<HTMLElement | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setModalHost(document.getElementById("code-wrapper"));
  }, []);

  const closeRestartModal = useCallback(() => {
    setRestartModalOpen(false);
  }, []);

  const clearTimers = useCallback(() => {
    if (tickRef.current != null) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (finishTimerRef.current != null) {
      clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    clearTimers();
    setDownloadPct(0);
    setDownloadActive(false);
    setRestartModalOpen(false);
  }, [extensionId, clearTimers]);

  useEffect(() => {
    if (!downloadActive) return;

    const started = Date.now();
    tickRef.current = setInterval(() => {
      const elapsed = Date.now() - started;
      const next = Math.min(100, Math.round((elapsed / DOWNLOAD_MS) * 100));
      setDownloadPct(next);
      if (next >= 100 && tickRef.current != null) {
        clearInterval(tickRef.current);
        tickRef.current = null;
        finishTimerRef.current = setTimeout(() => {
          setDownloadActive(false);
          setDownloadPct(0);
          finishTimerRef.current = null;
          setRestartModalOpen(true);
        }, HOLD_AT_100_MS);
      }
    }, 32);

    return () => {
      clearTimers();
    };
  }, [downloadActive, clearTimers]);

  const onDownloadClick = () => {
    if (!hasUpdate || downloadActive) return;
    clearTimers();
    setDownloadPct(0);
    setDownloadActive(true);
  };

  const onRestartNowClick = useCallback(() => {
    closeRestartModal();
    router.push("/");
  }, [closeRestartModal, router]);

  return (
    <>
    <aside
      id="extension-panel"
      className="extp-aside"
      aria-label="// Window"
    >
      <div className="extp-chrome">
        <span className="extp-chrome-title">// Window</span>
        <button type="button" aria-label="Collapse" className="extp-collapse-btn">
          <svg
            className="extp-collapse-btn-svg"
            viewBox="0 0 20 20"
            width={20}
            height={20}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M15.625 7.75L10 13.375L4.375 7.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="extp-body">
        <div className="extp-hero-row">
          <div className="extp-hero-icon-box">
            <Image
              src={meta.iconSrc}
              alt=""
              width={48}
              height={48}
              className="extp-hero-icon-img"
              draggable={false}
              unoptimized
            />
          </div>
          <div className="extp-hero-main">
            <div className="extp-hero-top">
              <div className="extp-title-block">
                <h2>
                  {meta.title}
                  <span className="extp-title-publisher">{copy.publisher}</span>
                </h2>
                <div className="extp-meta-row">
                  <StarRow />
                  <span className="extp-dl-stat">
                    <Image
                      src={CLOUD_ARROW_DOWN_ICON}
                      alt=""
                      width={22}
                      height={22}
                      className="extp-dl-ico"
                      draggable={false}
                      unoptimized
                      aria-hidden
                    />
                    {copy.downloads}
                  </span>
                </div>
                <p className="extp-lead">{copy.lead}</p>
              </div>
              <div className="extp-icon-actions">
                <IconBtn label="Settings" src={GEAR_ICON} />
                <IconBtn label="Expand" src={EXPAND_ICON} />
              </div>
            </div>
          </div>
        </div>

        <div className="extp-body-below">
          <div
            className={
              downloadActive && hasUpdate
                ? "extp-actions-wrap extp-actions-wrap--downloading"
                : "extp-actions-wrap"
            }
          >
            <div className="extp-actions-row">
              <div
                className={
                  hasUpdate
                    ? "extp-dl-split"
                    : "extp-dl-split extp-dl-split--uninstall"
                }
              >
                <button
                  type="button"
                  className="extp-dl-primary"
                  disabled={hasUpdate && downloadActive}
                  onClick={hasUpdate ? onDownloadClick : undefined}
                >
                  <Image
                    src={DOWNLOAD_BTN_ICON}
                    alt=""
                    width={22}
                    height={22}
                    className="extp-dl-primary-ico"
                    draggable={false}
                    unoptimized
                    aria-hidden
                  />
                  {hasUpdate
                    ? downloadActive
                      ? "Downloading"
                      : "Download Update"
                    : "Uninstall"}
                </button>
                <button
                  type="button"
                  aria-label={
                    hasUpdate
                      ? "Other download options"
                      : "Other uninstall options"
                  }
                  className="extp-dl-caret-btn"
                  disabled={hasUpdate && downloadActive}
                >
                  <Image
                    src={DL_CARET_ICON}
                    alt=""
                    width={22}
                    height={22}
                    className="extp-dl-caret-ico"
                    draggable={false}
                    unoptimized
                    aria-hidden
                  />
                </button>
              </div>
              <label className="extp-auto-label">
                <span className="extp-cb-wrap">
                  <input type="checkbox" className="extp-cb" />
                  <span className="extp-cb-tick" aria-hidden>
                    ✓
                  </span>
                </span>
                Auto Updates
              </label>
            </div>
            {downloadActive && hasUpdate ? (
              <div
                className="extp-dl-progress"
                role="progressbar"
                aria-valuenow={downloadPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Download progress"
              >
                <div className="extp-dl-progress-head">
                  <span className="extp-dl-progress-label">Downloading</span>
                  <span className="extp-dl-progress-pct">{downloadPct}%</span>
                </div>
                <div className="extp-dl-progress-track">
                  <div
                    className="extp-dl-progress-fill"
                    style={{ width: `${downloadPct}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="extp-tabs">
            {(["DETAILS", "FEATURES", "CHANGELOG"] as const).map((tab, i) => (
              <button
                key={tab}
                type="button"
                className={i === 0 ? "extp-tab extp-tab--active" : "extp-tab"}
              >
                {tab}
              </button>
            ))}
            <button type="button" aria-label="More" className="extp-tab-more">
              <Image
                src={TRIPLE_DOT_ICON}
                alt=""
                width={36}
                height={36}
                className="extp-tab-more-ico"
                draggable={false}
                unoptimized
                aria-hidden
              />
            </button>
          </div>

          <details className="extp-details">
            <summary>
              <span className="extp-details-chev" aria-hidden>
                ›
              </span>
              <div className="extp-details-inner">
                <Image
                  src={WARNING_ICON}
                  alt=""
                  width={30}
                  height={30}
                  className="extp-details-warn-ico"
                  draggable={false}
                  unoptimized
                  aria-hidden
                />
                <p className="extp-details-h">{copy.updateTitle}</p>
                <p className="extp-details-p">{copy.updateSummary}</p>
              </div>
            </summary>
            <div className="extp-details-body">
              <span className="extp-details-spacer" aria-hidden />
              <div className="extp-details-copy">
                <p className="extp-details-h">Notable changes:</p>
                <ul className="extp-details-ul">
                  {copy.updateBullets.map((b, i) => (
                    <li key={i}>
                      <span className="extp-details-strong">{b.strong}</span>
                      {b.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          <div className="extp-prose">
            <div className="extp-prose-stack">
              <h3>{copy.proseTitle}</h3>
              {copy.proseBlocks.map((block, i) => (
                <div key={i}>
                  {block.heading ? <h4>{block.heading}</h4> : null}
                  <p>
                    {block.linkExtensionWord ? (
                      <>
                        A Visual Studio Code{" "}
                        <span className="extp-prose-link">extension</span>{" "}
                        {block.body}
                      </>
                    ) : (
                      block.body
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
    {restartModalOpen && modalHost
      ? createPortal(
          <div className="extp-restart-modal-backdrop" role="presentation">
            <div
              className="extp-restart-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="extp-restart-modal-title"
            >
              <div className="extp-restart-modal-header">
                <div className="extp-restart-modal-icon-wrap" aria-hidden>
                  <Image
                    src={WARNING_DIAMOND_ICON}
                    alt=""
                    width={32}
                    height={32}
                    className="extp-restart-modal-icon-img"
                    draggable={false}
                    unoptimized
                  />
                </div>
                <h2 id="extp-restart-modal-title" className="extp-restart-modal-title">
                  Download Complete
                </h2>
                <button
                  type="button"
                  className="extp-restart-modal-close"
                  aria-label="Close"
                  onClick={closeRestartModal}
                >
                  ×
                </button>
              </div>
              <p className="extp-restart-modal-body">
                Download finished. A restart of Pharecia is required to access all new
                features.
              </p>
              <div className="extp-restart-modal-actions">
                <button
                  type="button"
                  className="extp-restart-modal-btn extp-restart-modal-btn--primary"
                  onClick={onRestartNowClick}
                >
                  Restart Now
                </button>
                <button
                  type="button"
                  className="extp-restart-modal-btn extp-restart-modal-btn--secondary"
                  onClick={closeRestartModal}
                >
                  Restart Later
                </button>
              </div>
            </div>
          </div>,
          modalHost,
        )
      : null}
    </>
  );
}
