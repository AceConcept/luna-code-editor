"use client";

import { Suspense, useState } from "react";
import { EditorWorkbench } from "@/components/code-editor/EditorWorkbench";
import { ExtensionsFileMenu } from "@/components/extensions/ExtensionsFileMenu";
import { InstalledExtensionsPanel } from "@/components/extensions/InstalledExtensionsPanel";

const SEARCH_PLACEHOLDER = "Search for Extensions";

function SearchIcon() {
  return (
    <svg
      className="ecm-code-header__search-svg"
      viewBox="0 0 18 18"
      width={22}
      height={22}
      aria-hidden
    >
      <circle
        cx="7.5"
        cy="7.5"
        r="5.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M11.25 11.25 16 16"
      />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg
      className="ecm-code-header__menu-svg"
      viewBox="0 0 20 16"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 1.25h20v1.5H0zm0 6h20v1.5H0zm0 6h20v1.5H0z"
      />
    </svg>
  );
}

function CodeWrapperHeader() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  /** Idle chrome (icon + label) — hidden once the user focuses or has typed text. */
  const showDecor = !focused && query === "";

  return (
    <div
      id="code-wrapper-header"
      role="region"
      aria-label="Editor panel header"
      className="ecm-code-header"
    >
      <div className="ecm-code-header__inner">
        <div className="ecm-code-header__left">
          <button
            type="button"
            className="ecm-code-header__menu"
            aria-label="Extensions menu"
          >
            <HamburgerIcon />
          </button>
          <span className="ecm-code-header__title">Extensions</span>
        </div>
        <div className="ecm-code-header__search">
          <label
            className="ecm-code-header__search-field"
            htmlFor="extensions-marketplace-search"
          >
            <input
              id="extensions-marketplace-search"
              className={
                showDecor
                  ? "ecm-code-header__search-input ecm-code-header__search-input--capture"
                  : "ecm-code-header__search-input ecm-code-header__search-input--active"
              }
              type="search"
              name="extensions-marketplace-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoComplete="off"
              aria-label={SEARCH_PLACEHOLDER}
            />
            {showDecor ? (
              <div className="ecm-code-header__search-show" aria-hidden>
                <div className="ecm-code-header__search-cluster">
                  <span className="ecm-code-header__search-phrase">
                    <span
                      className="ecm-code-header__search-phrase-icon"
                      aria-hidden
                    >
                      <SearchIcon />
                    </span>
                    <span className="ecm-code-header__search-fake-text ecm-code-header__search-fake-text--placeholder">
                      {SEARCH_PLACEHOLDER}
                    </span>
                  </span>
                </div>
              </div>
            ) : null}
          </label>
        </div>
      </div>
    </div>
  );
}

export function CodeEditorExtensionsMock() {
  return (
    <EditorWorkbench
      benchClassPrefix="ewb"
      codeWrapperHeader={<CodeWrapperHeader />}
      leftSidebar={<ExtensionsFileMenu />}
      mainPanel={
        <Suspense fallback={null}>
          <InstalledExtensionsPanel />
        </Suspense>
      }
      workspaceBackgroundImageSrc="/extensions/ext-background.jpg"
    />
  );
}
