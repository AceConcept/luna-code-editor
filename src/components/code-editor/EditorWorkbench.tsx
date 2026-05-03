import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import { EditorAsideNav } from "@/components/EditorAsideNav";

/** VS Code–style dark theme tokens (see editor mock reference) */
const hl = {
  kw: "text-[#c586c0]",
  fn: "text-[#dcdcaa]",
  id: "text-[#9cdcfe]",
  prim: "text-[#4ec9b0]",
  str: "text-[#ce9178]",
  pun: "text-[#d4d4d4]",
  num: "text-[#b5cea8]",
  comment: "text-[#6a9955]",
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
  const { kw, fn, id, prim, str, pun, num, comment } = hl;
  return [
    <>
      <span className={kw}>import</span>{" "}
      <span className={pun}>{"{"}</span>{" "}
      <span className={fn}>NextResponse</span>{" "}
      <span className={pun}>{"}"}</span>{" "}
      <span className={kw}>from</span>{" "}
      <span className={str}>&apos;next/server&apos;</span>
      <span className={pun}>;</span>
    </>,
    <>&nbsp;</>,
    <>
      <span className={kw}>interface</span>{" "}
      <span className={fn}>JishoResponse</span>{" "}
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
      <span className={prim}>string</span>
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
      <span className={prim}>string</span>
      <span className={pun}>[];</span>
    </>,
    <>
      {"    "}
      <span className={id}>parts_of_speech</span>
      <span className={pun}>: </span>
      <span className={prim}>string</span>
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
      <span className={fn}>Request</span>
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
      <span className={fn}>JishoResponse</span>
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
      <span className={fn}>NextResponse</span>
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

export function EditorWorkbench({
  leftSidebar,
  codeWrapperHeader,
  mainPanel,
  workspaceBackgroundImageSrc,
}: {
  leftSidebar: ReactNode;
  codeWrapperHeader?: ReactNode;
  /** When set (e.g. extensions page), replaces tabs, breadcrumbs, editor, and terminal. */
  mainPanel?: ReactNode;
  /** Background for the row below the layout bar (activity bar + main column). */
  workspaceBackgroundImageSrc?: string;
}) {
  const hasCodeWrapperHeader = Boolean(codeWrapperHeader);

  return (
    <div
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border border-[#2b2b2b] bg-[#212121] text-[#d4d4d4]"
      style={{ fontSize: "1.25rem", lineHeight: 1.5 }}
    >
      <header
        className="layout-bar flex h-[3.25rem] shrink-0 items-center justify-between gap-[1rem] border-b-[0.0625rem] border-solid border-b-[#848484] bg-[#0d0d0d] pl-[1rem] pr-0"
        aria-label="Layout bar"
      >
        <nav
          aria-label="Menu bar"
          className="flex min-h-0 shrink-0 items-center gap-[0.625rem]"
        >
          {layoutBarMenus.map((label) => (
            <button
              key={label}
              type="button"
              className="group flex h-[3.25rem] shrink-0 items-center whitespace-nowrap rounded-none border-0 bg-transparent px-[0.75rem] text-[inherit] shadow-none ring-0 transition-colors hover:bg-[#2e2e2e] hover:shadow-none focus-visible:outline-none focus-visible:ring-0"
            >
              <span className="select-none tracking-wide opacity-50 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {label}
              </span>
            </button>
          ))}
        </nav>
        <nav
          className="flex shrink-0 items-center gap-[0.5rem]"
          aria-label="Layout controls"
        >
          <div
            id="layout"
            title="layout"
            role="group"
            aria-label="layout"
            className="flex shrink-0 items-center gap-[0.5rem]"
          >
            {layoutBarIconsMain.map((icon) => (
              <button
                key={icon.src}
                type="button"
                className="group flex h-[3rem] w-[3rem] shrink-0 items-center justify-center rounded-[0.25rem] bg-transparent p-0 text-[inherit] transition-colors hover:bg-[#2e2e2e]"
                aria-label={icon.label}
              >
                <span className="opacity-50 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Image
                    src={icon.src}
                    alt=""
                    width={28}
                    height={28}
                    className="pointer-events-none h-[1.75rem] w-[1.75rem] object-contain"
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
            className="flex shrink-0 items-stretch"
          >
            {layoutBarIconsCloseExpand.map((icon) => (
              <button
                key={icon.src}
                type="button"
                aria-label={icon.label}
                className="group flex h-[3.25rem] w-[4rem] shrink-0 items-center justify-center bg-transparent p-0 text-[inherit] transition-colors hover:bg-[#2e2e2e]"
              >
                <span className="opacity-50 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Image
                    src={icon.src}
                    alt=""
                    width={24}
                    height={24}
                    className="pointer-events-none h-[1.5rem] w-[1.5rem] object-contain"
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
        className={`flex min-h-0 min-w-0 flex-1 ${
          workspaceBackgroundImageSrc
            ? "bg-cover bg-center bg-no-repeat"
            : ""
        }`}
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
          className="flex w-[6rem] shrink-0 flex-col items-center gap-[0.5rem] border-r border-[#2b2b2b] bg-transparent pb-[1rem] pt-[2rem] text-[#c5c5c5]"
        >
          <EditorAsideNav />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col pt-[1rem]">
        <div
          id="code-wrapper"
          title="code-wrapper"
          role="group"
          aria-label="code-wrapper"
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-bl-[0.625rem] rounded-br-[0.625rem] rounded-tl-[1rem] rounded-tr-none border border-white/20 bg-white/[0.09] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_0.25rem_1rem_rgba(0,0,0,0.15)] backdrop-blur-md"
        >
          {codeWrapperHeader}
          <div
            className={`flex min-h-0 min-w-0 flex-1 gap-[1.5rem] overflow-hidden pl-[3.125rem] pr-[1rem] pb-[3.25rem] ${
              hasCodeWrapperHeader ? "pt-[1rem]" : "pt-[1.25rem]"
            }`}
          >
          {leftSidebar}

          <div
            id="coding"
            title={mainPanel ? "installed-extensions" : "coding"}
            role="group"
            aria-label={mainPanel ? "Installed extensions" : "coding"}
            className={
              mainPanel
                ? "flex min-h-0 min-w-0 flex-1 flex-col bg-transparent"
                : "flex min-h-0 min-w-0 flex-1 flex-col bg-[#000000]/60"
            }
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
                    ? "flex min-w-[7rem] shrink-0 flex-col rounded-t-[0.25rem] border border-b-0 border-white/15 bg-black"
                    : "flex min-w-[7rem] shrink-0 flex-col rounded-t-[0.25rem] border border-transparent border-r-[#4A4A4A] bg-[#2d2d2d]"
                }
              >
                <div className="flex h-[3.625rem] min-h-0 min-w-0 flex-1 items-stretch pl-[1.5rem] pr-[1rem]">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab.active}
                    className={
                      tab.active
                        ? "flex min-h-0 min-w-0 max-w-[calc(100%-3.5rem)] shrink grow-0 items-center gap-[0.5rem] overflow-hidden text-left text-[1.25rem] font-semibold text-white focus-visible:outline-none"
                        : `flex min-h-0 min-w-0 max-w-[calc(100%-3.5rem)] shrink grow-0 items-center gap-[0.5rem] overflow-hidden text-left text-[1.25rem] focus-visible:outline-none ${tab.mutedClass}`
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
                  <span className="w-[1.5rem] shrink-0" aria-hidden />
                  <button
                    type="button"
                    aria-label={`Close ${tab.label}`}
                    className={
                      tab.active
                        ? "flex w-[2rem] shrink-0 items-center justify-center self-center text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-none"
                        : "flex w-[2rem] shrink-0 items-center justify-center self-center text-[#b9c0ca] transition-colors hover:bg-white/5 focus-visible:outline-none"
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
                  <span
                    className="min-h-0 min-w-0 flex-1 shrink"
                    aria-hidden
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="box-border flex h-[3rem] min-h-[3rem] shrink-0 flex-nowrap items-center gap-x-[0.5rem] gap-y-1 overflow-hidden border-b border-[#2b2b2b]/70 bg-transparent pl-[2.5rem] pr-[1rem] text-[1.25rem] leading-none text-[#a8a8a8]">
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

          <div className="box-border min-h-0 min-w-0 flex-1 overflow-auto bg-[#0F1010] pt-[1rem] pb-[0.25rem] pl-[2.5rem] pr-[0.25rem] selection:bg-[#264f78]">
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
                  <span className="flex h-[1.25rem] select-none items-center justify-end border-r border-[#2b2b2b] pr-[0.75rem] text-right text-[1.125rem] tabular-nums text-[#858585]">
                    {i + 1}
                  </span>
                  <div className="flex h-[1.25rem] min-w-0 items-center whitespace-pre pl-[1rem] text-[#d4d4d4]">
                    {line}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="flex h-[19rem] min-h-[19rem] shrink-0 flex-col border-t border-[#2b2b2b]/70 bg-black">
            <div
              id="terminal"
              title="Terminal"
              role="group"
              aria-label="Terminal"
              className="flex min-h-0 min-w-0 flex-1 flex-row bg-black"
            >
              <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-black">
                <div className="flex h-[4.25rem] min-h-[4.25rem] shrink-0 items-center gap-[1.25rem] border-b border-[#2b2b2b]/70 bg-black px-[1rem] text-[1.25rem] text-[#cccccc]">
                  <span className="border-b-[0.1875rem] border-[#0078d4] pb-[0.25rem] text-[var(--white)]">
                    Terminal
                  </span>
                  <span className="opacity-55">Problems</span>
                  <span className="opacity-55">Output</span>
                  <span className="opacity-55">Debug Console</span>
                  <span className="opacity-55">Ports</span>
                </div>
                <div className="min-h-0 flex-1 overflow-auto bg-black px-[1rem] py-[0.75rem] text-[1.25rem] text-[#cccccc]">
                  <span className="text-[#c586c0]">PS </span>
                  C:\Users\Ace\Desktop\LuminosProject\luminos-next
                  <span className="text-white">&gt;</span>{" "}
                  <span className="animate-pulse text-[#d4d4d4]">_</span>
                </div>
              </div>

              <aside
                className="flex w-[14.375rem] shrink-0 flex-col border-l border-[#2b2b2b]/70 bg-black"
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
