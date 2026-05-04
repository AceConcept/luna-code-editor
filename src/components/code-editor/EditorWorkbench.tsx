import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import { EditorAsideNav } from "@/components/EditorAsideNav";

/** Monokai-style tokens for the route.ts mock (keywords, types, punct, etc.) */
const hl = {
  kw: "text-[#a6e22e]",
  typ: "text-[#e6db74]",
  fn: "text-[#fd971f]",
  id: "text-[#66d9ef]",
  str: "text-[#ae81ff]",
  pun: "text-[#f92672]",
  num: "text-[#ae81ff]",
  comment: "text-[#75715e]",
} as const;

/** Editor tab strip (icons match reference: Tailwind / React / TS / React) */
const editorTabs = [
  {
    label: "globals.css",
    active: false,
    iconSrc: "/code-editor/folder-menu/code-icons/Dev%20Icons-5.svg",
    mutedClass: "text-[#d7ba7d] hover:text-[#e8d4a8]",
  },
  {
    label: "WordModal.ts",
    active: false,
    iconSrc: "/code-editor/folder-menu/code-icons/Dev%20Icons-6.svg",
    mutedClass: "text-[#b3b3b3] hover:text-[#cccccc]",
  },
  {
    label: "route.ts",
    active: true,
    iconSrc: "/code-editor/folder-menu/code-icons/Dev%20Icons-3.svg",
    mutedClass: "text-[#b3b3b3] hover:text-[#cccccc]",
  },
  {
    label: "page.tsx",
    active: false,
    iconSrc: "/code-editor/folder-menu/code-icons/Dev%20Icons-6.svg",
    mutedClass: "text-[#b3b3b3] hover:text-[#cccccc]",
  },
] as const;

const layoutBarIconsMain = [
  { src: "/code-editor/layout-bar/Browser.svg", label: "Editor area layout" },
  { src: "/code-editor/layout-bar/Layout.svg", label: "Panel layout" },
  {
    src: "/code-editor/layout-bar/SidebarSimple-1.svg",
    label: "Secondary sidebar",
  },
  { src: "/code-editor/layout-bar/SidebarSimple.svg", label: "Primary sidebar" },
] as const;

const layoutBarIconsCloseExpand = [
  { src: "/code-editor/layout-bar/Minus.svg", label: "Minimize panel" },
  { src: "/code-editor/layout-bar/Square.svg", label: "Maximize panel" },
  { src: "/code-editor/terminal/Close.svg", label: "Close" },
] as const;

const layoutBarMenus = [
  "File",
  "Edit",
  "Selection",
  "View",
  "Go",
  "Run",
  "Terminal",
  "Help",
] as const;

/** Explorer file-type icons (`public/code-editor/folder-menu/code-icons/`) */
const FI = {
  json: "/code-editor/folder-menu/code-icons/Dev%20Icons.svg",
  git: "/code-editor/folder-menu/code-icons/Dev%20Icons-1.svg",
  js: "/code-editor/folder-menu/code-icons/Dev%20Icons-2.svg",
  ts: "/code-editor/folder-menu/code-icons/Dev%20Icons-3.svg",
  readme: "/code-editor/folder-menu/code-icons/Dev%20Icons-4.svg",
  tailwind: "/code-editor/folder-menu/code-icons/Dev%20Icons-5.svg",
  npm: "/code-editor/folder-menu/code-icons/Dev%20Icons-6.svg",
} as const;

const fileMenuIconBoxClass =
  "h-[1.25rem] w-[1.25rem] shrink-0 object-contain";

/** Breadcrumb path separator (Caret.svg, 20px → `1.25rem`) */
function BreadcrumbCaret() {
  return (
    <Image
      src="/code-editor/folder-menu/Caret.svg"
      alt=""
      aria-hidden
      width={20}
      height={20}
      className={fileMenuIconBoxClass}
      draggable={false}
      unoptimized
    />
  );
}

/** Symbol / file crumb icon in the editor breadcrumb strip */
function BreadcrumbCrumbIcon({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={20}
      height={20}
      className={fileMenuIconBoxClass}
      draggable={false}
      unoptimized
    />
  );
}

/** Mock `route.ts` body: highlighted rows for gutter + grid layout */
function routeTsMockLines(): ReactNode[] {
  const { kw, typ, fn, id, str, pun, num, comment } = hl;
  return [
    <>
      <span className={kw}>import</span>{" "}
      <span className={pun}>{"{"}</span>{" "}
      <span className={typ}>NextResponse</span>{" "}
      <span className={pun}>{"}"}</span>{" "}
      <span className={kw}>from</span>{" "}
      <span className={str}>&apos;next/server&apos;</span>
      <span className={pun}>;</span>
    </>,
    <>&nbsp;</>,
    <>
      <span className={kw}>interface</span>{" "}
      <span className={typ}>JishoResponse</span>{" "}
      <span className={pun}>{"{"}</span>
    </>,
    <>
      {"  "}
      <span className={id}>japanese</span>
      <span className={pun}>: {"{"}</span>
    </>,
    <>
      {"    "}
      <span className={id}>reading</span>
      <span className={pun}>?: </span>
      <span className={typ}>string</span>
      <span className={pun}>;</span>
    </>,
    <>
      {"  "}
      <span className={pun}>{"}"}</span>
      <span className={pun}>[];</span>
    </>,
    <>
      {"  "}
      <span className={id}>senses</span>
      <span className={pun}>: {"{"}</span>
    </>,
    <>
      {"    "}
      <span className={id}>english_definitions</span>
      <span className={pun}>: </span>
      <span className={typ}>string</span>
      <span className={pun}>[];</span>
    </>,
    <>
      {"    "}
      <span className={id}>parts_of_speech</span>
      <span className={pun}>: </span>
      <span className={typ}>string</span>
      <span className={pun}>[];</span>
    </>,
    <>
      {"  "}
      <span className={pun}>{"}"}</span>
      <span className={pun}>[];</span>
    </>,
    <>
      <span className={pun}>{"}"}</span>
    </>,
    <>&nbsp;</>,
    <>
      <span className={kw}>export</span>{" "}
      <span className={kw}>async</span>{" "}
      <span className={kw}>function</span>{" "}
      <span className={fn}>POST</span>
      <span className={pun}>(</span>
    </>,
    <>
      {"  "}
      <span className={id}>request</span>
      <span className={pun}>: </span>
      <span className={typ}>Request</span>
    </>,
    <>
      <span className={pun}>)</span>{" "}
      <span className={pun}>{"{"}</span>
    </>,
    <>
      {"  "}
      <span className={kw}>try</span>{" "}
      <span className={pun}>{"{"}</span>
    </>,
    <>
      {"    "}
      <span className={kw}>const</span>{" "}
      <span className={pun}>{"{ "}</span>
      <span className={id}>word</span>
      <span className={pun}>{" }"}</span>{" "}
      <span className={pun}>=</span>{" "}
      <span className={kw}>await</span>{" "}
      <span className={id}>request</span>
      <span className={pun}>.</span>
      <span className={fn}>json</span>
      <span className={pun}>();</span>
    </>,
    <>
      {"    "}
      <span className={kw}>const</span>{" "}
      <span className={id}>response</span>{" "}
      <span className={pun}>=</span>{" "}
      <span className={kw}>await</span>{" "}
      <span className={fn}>fetch</span>
      <span className={pun}>(</span>
    </>,
    <>
      {"      "}
      <span className={str}>{`\`https://jisho.org/api/v1/search/words?keyword=\${encodeURIComponent(word)}\``}</span>
    </>,
    <>
      {"    "}
      <span className={pun}>);</span>
    </>,
    <>
      {"    "}
      <span className={kw}>const</span>{" "}
      <span className={id}>data</span>{" "}
      <span className={pun}>=</span>{" "}
      <span className={kw}>await</span>{" "}
      <span className={id}>response</span>
      <span className={pun}>.</span>
      <span className={fn}>json</span>
      <span className={pun}>();</span>
    </>,
    <>
      {"    "}
      <span className={kw}>const</span>{" "}
      <span className={id}>firstResult</span>{" "}
      <span className={pun}>=</span>{" "}
      <span className={id}>data</span>
      <span className={pun}>.</span>
      <span className={id}>data</span>
      <span className={pun}>[</span>
      <span className={num}>0</span>
      <span className={pun}>]</span>{" "}
      <span className={kw}>as</span>{" "}
      <span className={typ}>JishoResponse</span>
      <span className={pun}>;</span>
    </>,
    <>&nbsp;</>,
    <>
      {"    "}
      <span className={kw}>if</span>{" "}
      <span className={pun}>(</span>
      <span className={pun}>!</span>
      <span className={id}>firstResult</span>
      <span className={pun}>)</span>{" "}
      <span className={pun}>{"{"}</span>
    </>,
    <>
      {"      "}
      <span className={kw}>return</span>{" "}
      <span className={typ}>NextResponse</span>
      <span className={pun}>.</span>
      <span className={fn}>json</span>
      <span className={pun}>(</span>
      <span className={pun}>{"{"}</span>{" "}
      <span className={id}>definition</span>
      <span className={pun}>: </span>
      <span className={str}>&apos;No definition found&apos;</span>
      <span className={pun}>{"}"}</span>
      <span className={pun}>);</span>
    </>,
    <>
      {"    "}
      <span className={pun}>{"}"}</span>
    </>,
    <>
      {"    "}
      <span className={comment}>{"// ... process firstResult"}</span>
    </>,
    <>
      {"  "}
      <span className={pun}>{"}"}</span>{" "}
      <span className={kw}>catch</span>{" "}
      <span className={pun}>(</span>
      <span className={id}>error</span>
      <span className={pun}>)</span>{" "}
      <span className={pun}>{"{"}</span>
    </>,
    <>
      {"    "}
      <span className={comment}>{"// ..."}</span>
    </>,
    <>
      {"  "}
      <span className={pun}>{"}"}</span>
    </>,
    <>
      <span className={pun}>{"}"}</span>
    </>,
  ];
}

/** `hwb` = home (/), `ewb` = extensions (/extensions); CSS is split in globals.css */
export type EditorWorkbenchBenchPrefix = "hwb" | "ewb";

function wb(prefix: EditorWorkbenchBenchPrefix, ...parts: string[]) {
  return parts.map((part) => `${prefix}-${part}`).join(" ");
}

export function EditorWorkbench({
  benchClassPrefix,
  leftSidebar,
  codeWrapperHeader,
  mainPanel,
  workspaceBackgroundImageSrc,
}: {
  benchClassPrefix: EditorWorkbenchBenchPrefix;
  leftSidebar: ReactNode;
  codeWrapperHeader?: ReactNode;
  /** When set (e.g. extensions page), replaces tabs, breadcrumbs, editor, and terminal. */
  mainPanel?: ReactNode;
  /** Background for the row below the layout bar (activity bar + main column). */
  workspaceBackgroundImageSrc?: string;
}) {
  const p = benchClassPrefix;
  const hasCodeWrapperHeader = Boolean(codeWrapperHeader);
  const splitPad =
    p === "hwb"
      ? { "data-hwb-split-pad": hasCodeWrapperHeader ? "sm" : "md" }
      : { "data-ewb-split-pad": hasCodeWrapperHeader ? "sm" : "md" };
  const codingMode =
    p === "hwb"
      ? { "data-hwb-mode": mainPanel ? "ext" : "editor" }
      : { "data-ewb-mode": mainPanel ? "ext" : "editor" };

  return (
    <div className={wb(p, "root")} style={{ fontSize: "1.25rem", lineHeight: 1.5 }}>
      <header className={wb(p, "layout-header")} aria-label="Layout bar">
        <nav aria-label="Menu bar" className={wb(p, "menubar")}>
          {layoutBarMenus.map((label) => (
            <button key={label} type="button" className={wb(p, "menubar-btn")}>
              <span className={wb(p, "menubar-label")}>{label}</span>
            </button>
          ))}
        </nav>
        <nav className={wb(p, "layout-controls")} aria-label="Layout controls">
          <div
            id="layout"
            title="layout"
            role="group"
            aria-label="layout"
            className={wb(p, "icon-group")}
          >
            {layoutBarIconsMain.map((icon) => (
              <button
                key={icon.src}
                type="button"
                className={wb(p, "layout-tool")}
                aria-label={icon.label}
              >
                <span className={wb(p, "layout-tool-ico-wrap")}>
                  <Image
                    src={icon.src}
                    alt=""
                    width={28}
                    height={28}
                    className={wb(p, "layout-tool-img")}
                    draggable={false}
                    unoptimized
                  />
                </span>
              </button>
            ))}
          </div>
          <div
            id="close-expand"
            title="close-expand"
            role="group"
            aria-label="close-expand"
            className={wb(p, "icon-group", "icon-group--stretch")}
          >
            {layoutBarIconsCloseExpand.map((icon) => (
              <button
                key={icon.src}
                type="button"
                aria-label={icon.label}
                className={wb(p, "window-tool")}
              >
                <span className={wb(p, "window-tool-ico-wrap")}>
                  <Image
                    src={icon.src}
                    alt=""
                    width={24}
                    height={24}
                    className={wb(p, "window-tool-img")}
                    draggable={false}
                    unoptimized
                  />
                </span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      <div
        className={
          workspaceBackgroundImageSrc
            ? wb(p, "workspace", "workspace--bg")
            : wb(p, "workspace")
        }
        style={
          workspaceBackgroundImageSrc
            ? { backgroundImage: `url("${workspaceBackgroundImageSrc}")` }
            : undefined
        }
      >
        <aside
          id="aside-menu"
          title="aside-menu"
          aria-label="aside-menu"
          className={wb(p, "activity-aside")}
        >
          <EditorAsideNav benchClassPrefix={p} />
        </aside>

        <div className={wb(p, "main-column")}>
        <div
          id="code-wrapper"
          title="code-wrapper"
          role="group"
          aria-label="code-wrapper"
          className={wb(p, "code-wrapper")}
        >
          {codeWrapperHeader}
          <div className={wb(p, "main-split")} {...splitPad}>
          {leftSidebar}

          <div
            id="coding"
            title={mainPanel ? "installed-extensions" : "coding"}
            role="group"
            aria-label={mainPanel ? "Installed extensions" : "coding"}
            className={wb(p, "coding")}
            {...codingMode}
          >
          {mainPanel ?? (
          <>
          <div
            className="flex h-[3.625rem] shrink-0 items-stretch overflow-x-auto border-b border-[#2b2b2b]/70 bg-transparent px-0"
            role="tablist"
          >
            {editorTabs.map((tab) => (
              <div
                key={tab.label}
                className={
                  tab.active
                    ? "flex min-w-[7rem] shrink-0 flex-col rounded-t-[0.25rem] border border-b-0 border-white/15 bg-black transition-colors duration-150 hover:bg-[#141414]"
                    : "flex min-w-[7rem] shrink-0 flex-col rounded-t-[0.25rem] border border-transparent border-r-[#4A4A4A] bg-[#2d2d2d] transition-colors duration-150 hover:bg-[#343434]"
                }
              >
                <div className="flex h-[3.625rem] min-h-0 min-w-0 flex-1 items-center gap-[0.25rem] pl-[1.5rem] pr-[0.75rem]">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab.active}
                    className={
                      tab.active
                        ? "flex min-h-0 min-w-0 flex-1 items-center gap-[0.5rem] overflow-hidden rounded-sm text-left text-[1.25rem] font-semibold text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                        : `flex min-h-0 min-w-0 flex-1 items-center gap-[0.5rem] overflow-hidden rounded-sm text-left text-[1.25rem] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${tab.mutedClass}`
                    }
                  >
                    <Image
                      src={tab.iconSrc}
                      alt=""
                      width={28}
                      height={28}
                      className="h-[1.75rem] w-[1.75rem] shrink-0 object-contain"
                      draggable={false}
                      unoptimized
                    />
                    <span className="min-w-0 truncate">{tab.label}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Close ${tab.label}`}
                    className={
                      tab.active
                        ? "flex h-[2rem] w-[2rem] shrink-0 items-center justify-center rounded-sm text-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                        : "flex h-[2rem] w-[2rem] shrink-0 items-center justify-center rounded-sm text-[#b9c0ca] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                    }
                  >
                    <Image
                      src="/code-editor/terminal/Close.svg"
                      alt=""
                      width={20}
                      height={20}
                      className={
                        tab.active
                          ? "h-[1.25rem] w-[1.25rem] object-contain brightness-0 invert"
                          : "h-[1.25rem] w-[1.25rem] object-contain"
                      }
                      draggable={false}
                      unoptimized
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="box-border flex h-[3rem] min-h-[3rem] shrink-0 flex-nowrap items-center gap-x-[0.5rem] gap-y-1 overflow-hidden border-b border-[#2b2b2b]/70 bg-[#0E0E0E] pl-[2.5rem] pr-[1rem] text-[1.25rem] leading-none text-[#a8a8a8]">
            luminos-next
            <BreadcrumbCaret />
            <span className="text-white">src</span>
            <BreadcrumbCaret />
            <span className="text-white">app</span>
            <BreadcrumbCaret />
            <span className="text-white">dictionary</span>
            <BreadcrumbCaret />
            <span className="inline-flex min-h-0 min-w-0 items-center gap-[0.5rem] truncate text-white">
              <BreadcrumbCrumbIcon src={FI.git} />
              route.ts
            </span>
            <BreadcrumbCaret />
            <span className="inline-flex min-h-0 min-w-0 items-center gap-[0.5rem] truncate text-[#d4d4d4]">
              <BreadcrumbCrumbIcon src={FI.git} />
              JishoResponse
            </span>
            <BreadcrumbCaret />
            <span className="inline-flex min-h-0 min-w-0 items-center gap-[0.5rem] truncate">
              <BreadcrumbCrumbIcon src="/code-editor/folder-menu/code-icons/fix.svg" />
              senses
            </span>
          </div>

          <div className="hwb-editor-scroll-area box-border min-h-0 min-w-0 flex-1 overflow-auto pt-[1rem] pb-[0.25rem] pl-[2.5rem] pr-[0.25rem] selection:bg-[#49483e]">
            <div
              className="grid w-full min-w-0 grid-cols-[minmax(2.25rem,auto)_1fr] gap-y-[0.25rem] font-mono"
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.25rem",
                fontWeight: 300,
              }}
            >
              {routeTsMockLines().map((line, i) => (
                <Fragment key={i}>
                  <span className="flex h-[1.25rem] select-none items-center justify-end border-r border-[#3e3d32] pr-[0.75rem] text-right text-[1.125rem] tabular-nums text-[#90908a]">
                    {i + 1}
                  </span>
                  <div className="flex h-[1.25rem] min-w-0 items-center whitespace-pre pl-[1rem] text-[#f8f8f2]">
                    {line}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="flex h-[19rem] min-h-[19rem] shrink-0 flex-col border-t border-[#2b2b2b]/70 bg-[#050505]">
            <div
              id="terminal"
              title="Terminal"
              role="group"
              aria-label="Terminal"
              className="flex min-h-0 min-w-0 flex-1 flex-row bg-transparent"
            >
              <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-transparent">
                <div className="flex h-[4.25rem] min-h-[4.25rem] shrink-0 items-center gap-[1.25rem] border-b border-[#2b2b2b]/70 bg-transparent px-[1rem] text-[1.25rem] text-[#cccccc]">
                  <span className="border-b-[0.1875rem] border-[#0078d4] pb-[0.25rem] text-[var(--white)]">
                    Terminal
                  </span>
                  <span className="opacity-55">Problems</span>
                  <span className="opacity-55">Output</span>
                  <span className="opacity-55">Debug Console</span>
                  <span className="opacity-55">Ports</span>
                </div>
                <div className="min-h-0 flex-1 overflow-auto bg-transparent px-[1rem] py-[0.75rem] text-[1.25rem] text-[#cccccc]">
                  <span className="text-[#c586c0]">PS </span>
                  C:\Users\Ace\Desktop\LuminosProject\luminos-next
                  <span className="text-white">&gt;</span>{" "}
                  <span className="animate-pulse text-[#d4d4d4]">_</span>
                </div>
              </div>

              <aside
                className="flex w-[14.375rem] shrink-0 flex-col border-l border-[#2b2b2b]/70 bg-transparent"
                aria-label="Terminal sessions"
              >
                <div className="flex h-[3.375rem] min-h-[3.375rem] min-w-0 shrink-0 w-full items-center justify-between px-[0.5rem]">
                  <div
                    className="flex shrink-0 items-center gap-[0.5rem]"
                    role="presentation"
                  >
                    <button
                      type="button"
                      aria-label="Scroll terminal down"
                      className="flex h-[1.25rem] w-[1.25rem] shrink-0 items-center justify-center rounded border-0 bg-transparent p-0 text-[#cccccc] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0078d4]"
                    >
                      <Image
                        src="/code-editor/terminal/CaretUp.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="h-[1.25rem] w-[1.25rem] object-contain"
                        draggable={false}
                        unoptimized
                      />
                    </button>
                    <button
                      type="button"
                      aria-label="Scroll terminal up"
                      className="flex h-[1.25rem] w-[1.25rem] shrink-0 items-center justify-center rounded border-0 bg-transparent p-0 text-[#cccccc] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0078d4]"
                    >
                      <Image
                        src="/code-editor/terminal/CaretUp-1.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="h-[1.25rem] w-[1.25rem] object-contain"
                        draggable={false}
                        unoptimized
                      />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label="Kill terminal"
                    className="flex h-[1.25rem] w-[1.25rem] shrink-0 items-center justify-center rounded border-0 bg-transparent p-0 text-[#cccccc] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0078d4]"
                  >
                    <Image
                      src="/code-editor/terminal/Close.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="h-[1.25rem] w-[1.25rem] object-contain opacity-90"
                      draggable={false}
                      unoptimized
                    />
                  </button>
                </div>
                <ul className="min-h-0 flex-1 list-none overflow-auto p-0 font-mono text-[1.25rem] leading-normal text-[#cccccc]">
                  <li className="list-none">
                    <button
                      type="button"
                      className="w-full border-0 bg-[#2a2d2e] py-[0.25rem] pl-[1rem] pr-[0.5rem] text-left text-[#cccccc] transition-colors hover:bg-[#323638] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0078d4]"
                    >
                      powershell
                    </button>
                  </li>
                  <li className="list-none">
                    <button
                      type="button"
                      className="w-full border-0 bg-transparent py-[0.25rem] pl-[1rem] pr-[0.5rem] text-left text-[#cccccc] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0078d4]"
                    >
                      powershell
                    </button>
                  </li>
                  <li className="list-none">
                    <button
                      type="button"
                      className="w-full border-0 bg-transparent py-[0.25rem] pl-[1rem] pr-[0.5rem] text-left text-[#cccccc] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0078d4]"
                    >
                      powershell
                    </button>
                  </li>
                </ul>
              </aside>
            </div>
          </div>
          </>
          )}
          </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
