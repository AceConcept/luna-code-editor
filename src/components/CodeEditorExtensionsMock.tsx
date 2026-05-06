import { Suspense } from "react";
import { EditorWorkbench } from "@/components/code-editor/EditorWorkbench";
import { ExtensionsFileMenu } from "@/components/extensions/ExtensionsFileMenu";
import { InstalledExtensionsPanel } from "@/components/extensions/InstalledExtensionsPanel";

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

function SearchIcon() {
  return (
    <svg
      className="ecm-code-header__search-svg"
      viewBox="0 0 18 18"
      width={26}
      height={26}
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

function CodeWrapperHeader() {
  return (
    <div
      id="code-wrapper-header"
      title="code-wrapper-header"
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
          <div className="ecm-code-header__search-field">
            <div className="ecm-code-header__search-inner">
              <SearchIcon />
              <input
                id="extensions-marketplace-search"
                className="ecm-code-header__search-input"
                type="search"
                name="extensions-marketplace-search"
                placeholder="Search for Extensions"
                aria-label="Search for Extensions"
                autoComplete="off"
              />
            </div>
          </div>
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
