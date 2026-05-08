"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { EditorAsideNav } from "@/components/EditorAsideNav";

/** VSCode-like tokens for the route.ts mock */
const hl = {
  kw: "text-[#A6EF67]",
  typ: "text-[#B692F6]",
  fn: "text-[#FAC515]",
  id: "text-[#F7F8F8]",
  prop: "text-[#2970FF]",
  str: "text-[#E478FA]",
  pun: "text-[#F7F8F8]",
  num: "text-[#2970FF]",
  comment: "text-[#C586C0]",
} as const;

/** Editor tab strip (icons match reference: Tailwind / React / TS / React) */
const editorTabs = [
  {
    label: "globals.css",
    iconSrc: "/code-editor/folder-menu/code-icons/Dev%20Icons-5.svg",
    mutedClass: "text-[#d7ba7d] hover:text-[#e8d4a8]",
    accentClass: "text-[#d7ba7d]",
  },
  {
    label: "WordModal.ts",
    iconSrc: "/code-editor/folder-menu/code-icons/Dev%20Icons-6.svg",
    mutedClass: "text-[#b3b3b3] hover:text-[#cccccc]",
    accentClass: "text-[#4FC1FF]",
  },
  {
    label: "route.ts",
    iconSrc: "/code-editor/folder-menu/code-icons/Dev%20Icons-3.svg",
    mutedClass: "text-[#b3b3b3] hover:text-[#cccccc]",
    accentClass: "text-[#4FC1FF]",
  },
  {
    label: "page.tsx",
    iconSrc: "/code-editor/folder-menu/code-icons/Dev%20Icons-6.svg",
    mutedClass: "text-[#b3b3b3] hover:text-[#cccccc]",
    accentClass: "text-[#C586C0]",
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

const terminalTabs = [
  "Terminal",
  "Problems",
  "Output",
  "Debug Console",
  "Ports",
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

function Indent({ level }: { level: number }) {
  return <span aria-hidden className="inline-block shrink-0" style={{ width: `${level}rem` }} />;
}

/** Mock `route.ts` body: highlighted rows for gutter + grid layout */
function routeTsMockLines(): ReactNode[] {
  const { kw, typ, fn, id, prop, str, pun, num } = hl;
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
      <Indent level={1} />
      <span className={prop}>japanese</span>
      <span className={pun}>: {"{"}</span>
    </>,
    <>
      <Indent level={2} />
      <span className={prop}>reading</span>
      <span className={pun}>?: </span>
      <span className={typ}>string</span>
      <span className={pun}>;</span>
    </>,
    <>
      <Indent level={1} />
      <span className={pun}>{"}"}</span>
      <span className={pun}>[];</span>
    </>,
    <>
      <Indent level={1} />
      <span className={prop}>senses</span>
      <span className={pun}>: {"{"}</span>
    </>,
    <>
      <Indent level={2} />
      <span className={prop}>english_definitions</span>
      <span className={pun}>: </span>
      <span className={typ}>string</span>
      <span className={pun}>[];</span>
    </>,
    <>
      <Indent level={2} />
      <span className={prop}>parts_of_speech</span>
      <span className={pun}>: </span>
      <span className={typ}>string</span>
      <span className={pun}>[];</span>
    </>,
    <>
      <Indent level={1} />
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
      <span className={id}>request</span>
      <span className={pun}>: </span>
      <span className={typ}>Request</span>
      <span className={pun}>)</span>{" "}
      <span className={pun}>{"{"}</span>
    </>,
    <>
      <Indent level={1} />
      <span className={kw}>try</span>{" "}
      <span className={pun}>{"{"}</span>
    </>,
    <>
      <Indent level={2} />
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
      <Indent level={2} />
      <span className={kw}>const</span>{" "}
      <span className={id}>response</span>{" "}
      <span className={pun}>=</span>{" "}
      <span className={kw}>await</span>{" "}
      <span className={fn}>fetch</span>
      <span className={pun}>(</span>
    </>,
    <>
      <Indent level={3} />
      <span className={str}>&apos;https://jisho.org/api/v1/search/words?keyword=</span>
      <span className={pun}>${"{"}</span>
      <span className={fn}>encodeURIComponent</span>
      <span className={pun}>(</span>
      <span className={id}>word</span>
      <span className={pun}>)</span>
      <span className={pun}>{"}"}</span>
      <span className={str}>&apos;</span>
    </>,
    <>
      <Indent level={2} />
      <span className={pun}>);</span>
    </>,
    <>
      <Indent level={2} />
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
      <Indent level={2} />
      <span className={kw}>const</span>{" "}
      <span className={id}>firstResult</span>{" "}
      <span className={pun}>=</span>{" "}
      <span className={id}>data</span>
      <span className={pun}>.</span>
      <span className={prop}>data</span>
      <span className={pun}>[</span>
      <span className={num}>0</span>
      <span className={pun}>]</span>{" "}
      <span className={kw}>as</span>{" "}
      <span className={typ}>JishoResponse</span>
      <span className={pun}>;</span>
    </>,
    <>&nbsp;</>,
    <>
      <Indent level={2} />
      <span className={kw}>if</span>{" "}
      <span className={pun}>(</span>
      <span className={pun}>!</span>
      <span className={id}>firstResult</span>
      <span className={pun}>)</span>{" "}
      <span className={pun}>{"{"}</span>
    </>,
    <>
      <Indent level={3} />
      <span className={kw}>return</span>{" "}
      <span className={typ}>NextResponse</span>
      <span className={pun}>.</span>
      <span className={fn}>json</span>
      <span className={pun}>(</span>
      <span className={pun}>{"{"}</span>{" "}
      <span className={prop}>definition</span>
      <span className={pun}>: </span>
      <span className={str}>&apos;No definition found&apos;</span>
      <span className={pun}>{"}"}</span>
      <span className={pun}>);</span>
    </>,
    <>
      <Indent level={2} />
      <span className={pun}>{"}"}</span>
    </>,
    <>
      <Indent level={1} />
      <span className={pun}>{"}"}</span>
    </>,
    <>
      <span className={pun}>{"}"}</span>
    </>,
  ];
}

type EditorTabLabel = (typeof editorTabs)[number]["label"];

/** Reuse TS token colors for numeric `0` / `var()` in CSS mock */
const cssNum = hl.num;
const cssFn = hl.fn;

/** CSS tokens for `globals.css` mock */
const cssHl = {
  rule: "text-[#D7BA7D]",
  prop: "text-[#9CDCFE]",
  val: "text-[#CE9178]",
  pun: "text-[#F7F8F8]",
  comment: "text-[#6A9955]",
} as const;

function globalsCssMockLines(): ReactNode[] {
  const { rule, prop, val, pun, comment } = cssHl;
  return [
    <>
      <span className={comment}>{`/* App-wide tokens & base layer */`}</span>
    </>,
    <>
      <span className={rule}>:root</span>
      <span className={pun}> {"{"}</span>
    </>,
    <>
      <Indent level={1} />
      <span className={prop}>--accent</span>
      <span className={pun}>: </span>
      <span className={val}>#2970ff</span>
      <span className={pun}>;</span>
    </>,
    <>
      <Indent level={1} />
      <span className={prop}>--surface</span>
      <span className={pun}>: </span>
      <span className={val}>#0e0e0e</span>
      <span className={pun}>;</span>
    </>,
    <>
      <span className={pun}>{"}"}</span>
    </>,
    <>&nbsp;</>,
    <>
      <span className={rule}>body</span>
      <span className={pun}> {"{"}</span>
    </>,
    <>
      <Indent level={1} />
      <span className={prop}>margin</span>
      <span className={pun}>: </span>
      <span className={cssNum}>0</span>
      <span className={pun}>;</span>
    </>,
    <>
      <Indent level={1} />
      <span className={prop}>font-family</span>
      <span className={pun}>: </span>
      <span className={val}>system-ui</span>
      <span className={pun}>, </span>
      <span className={val}>sans-serif</span>
      <span className={pun}>;</span>
    </>,
    <>
      <Indent level={1} />
      <span className={prop}>background</span>
      <span className={pun}>: </span>
      <span className={cssFn}>var</span>
      <span className={pun}>(</span>
      <span className={val}>--surface</span>
      <span className={pun}>);</span>
    </>,
    <>
      <span className={pun}>{"}"}</span>
    </>,
  ];
}

function wordModalTsMockLines(): ReactNode[] {
  const { kw, typ, fn, id, prop, str, pun } = hl;
  return [
    <>
      <span className={str}>&apos;use client&apos;</span>
      <span className={pun}>;</span>
    </>,
    <>&nbsp;</>,
    <>
      <span className={kw}>import</span>{" "}
      <span className={pun}>{"{"}</span>{" "}
      <span className={id}>useState</span>
      <span className={pun}>, </span>
      <span className={kw}>type</span>
      <span className={pun}>{" "}</span>
      <span className={typ}>ReactNode</span>{" "}
      <span className={pun}>{"}"}</span>{" "}
      <span className={kw}>from</span>{" "}
      <span className={str}>&apos;react&apos;</span>
      <span className={pun}>;</span>
    </>,
    <>&nbsp;</>,
    <>
      <span className={kw}>export</span>{" "}
      <span className={kw}>type</span>{" "}
      <span className={typ}>WordModalProps</span>{" "}
      <span className={pun}>= {"{"}</span>
    </>,
    <>
      <Indent level={1} />
      <span className={prop}>word</span>
      <span className={pun}>: </span>
      <span className={typ}>string</span>
      <span className={pun}>;</span>
    </>,
    <>
      <Indent level={1} />
      <span className={prop}>onClose</span>
      <span className={pun}>: </span>
      <span className={pun}>() =&gt; </span>
      <span className={typ}>void</span>
      <span className={pun}>;</span>
    </>,
    <>
      <Indent level={1} />
      <span className={prop}>children</span>
      <span className={pun}>?: </span>
      <span className={typ}>ReactNode</span>
      <span className={pun}>;</span>
    </>,
    <>
      <span className={pun}>{"}"}</span>
      <span className={pun}>;</span>
    </>,
    <>&nbsp;</>,
    <>
      <span className={kw}>export</span>{" "}
      <span className={kw}>function</span>{" "}
      <span className={fn}>WordModal</span>
      <span className={pun}>(</span>
      <span className={pun}>{"{"}</span>{" "}
      <span className={id}>word</span>
      <span className={pun}>, </span>
      <span className={id}>onClose</span>
      <span className={pun}>, </span>
      <span className={id}>children</span>
      <span className={pun}>{" "}</span>
      <span className={pun}>{"}"}</span>
      <span className={pun}>: </span>
      <span className={typ}>WordModalProps</span>
      <span className={pun}>)</span>{" "}
      <span className={pun}>{"{"}</span>
    </>,
    <>
      <Indent level={1} />
      <span className={kw}>const</span>{" "}
      <span className={pun}>[</span>
      <span className={id}>open</span>
      <span className={pun}>, </span>
      <span className={id}>setOpen</span>
      <span className={pun}>]</span>{" "}
      <span className={pun}>=</span>{" "}
      <span className={fn}>useState</span>
      <span className={pun}>(</span>
      <span className={kw}>false</span>
      <span className={pun}>);</span>
    </>,
    <>
      <Indent level={1} />
      <span className={kw}>if</span>{" "}
      <span className={pun}>(</span>
      <span className={pun}>!</span>
      <span className={id}>open</span>
      <span className={pun}>)</span>{" "}
      <span className={kw}>return</span>{" "}
      <span className={kw}>null</span>
      <span className={pun}>;</span>
    </>,
    <>
      <Indent level={1} />
      <span className={kw}>return</span>{" "}
      <span className={pun}>(</span>
    </>,
    <>
      <Indent level={2} />
      <span className={pun}>&lt;</span>
      <span className={typ}>section</span>
      <span className={pun}> </span>
      <span className={prop}>aria-label</span>
      <span className={pun}>=</span>
      <span className={str}>&quot;Word details&quot;</span>
      <span className={pun}>&gt;</span>
    </>,
    <>
      <Indent level={2} />
      <span className={pun}>{"{"}</span>
      <span className={id}>children</span>
      <span className={pun}>{"}"}</span>
    </>,
    <>
      <Indent level={2} />
      <span className={pun}>&lt;/</span>
      <span className={typ}>section</span>
      <span className={pun}>&gt;</span>
    </>,
    <>
      <Indent level={1} />
      <span className={pun}>);</span>
    </>,
    <>
      <span className={pun}>{"}"}</span>
    </>,
  ];
}

function pageTsxMockLines(): ReactNode[] {
  const { kw, typ, fn, id, prop, str, pun } = hl;
  return [
    <>
      <span className={str}>&apos;use client&apos;</span>
      <span className={pun}>;</span>
    </>,
    <>&nbsp;</>,
    <>
      <span className={kw}>import</span>{" "}
      <span className={pun}>{"{"}</span>{" "}
      <span className={id}>useState</span>{" "}
      <span className={pun}>{"}"}</span>{" "}
      <span className={kw}>from</span>{" "}
      <span className={str}>&apos;react&apos;</span>
      <span className={pun}>;</span>
    </>,
    <>
      <span className={kw}>import</span>{" "}
      <span className={pun}>{"{"}</span>{" "}
      <span className={typ}>WordModal</span>{" "}
      <span className={pun}>{"}"}</span>{" "}
      <span className={kw}>from</span>{" "}
      <span className={str}>&apos;@/components/WordModal&apos;</span>
      <span className={pun}>;</span>
    </>,
    <>&nbsp;</>,
    <>
      <span className={kw}>export</span>{" "}
      <span className={kw}>default</span>{" "}
      <span className={kw}>function</span>{" "}
      <span className={fn}>DictionaryPage</span>
      <span className={pun}>()</span>{" "}
      <span className={pun}>{"{"}</span>
    </>,
    <>
      <Indent level={1} />
      <span className={kw}>const</span>{" "}
      <span className={pun}>[</span>
      <span className={id}>q</span>
      <span className={pun}>, </span>
      <span className={id}>setQ</span>
      <span className={pun}>]</span>{" "}
      <span className={pun}>=</span>{" "}
      <span className={fn}>useState</span>
      <span className={pun}>(</span>
      <span className={str}>&quot;&quot;</span>
      <span className={pun}>);</span>
    </>,
    <>
      <Indent level={1} />
      <span className={kw}>return</span>{" "}
      <span className={pun}>(</span>
    </>,
    <>
      <Indent level={2} />
      <span className={pun}>&lt;</span>
      <span className={typ}>main</span>
      <span className={pun}> </span>
      <span className={prop}>className</span>
      <span className={pun}>=</span>
      <span className={str}>&quot;mx-auto max-w-3xl p-6&quot;</span>
      <span className={pun}>&gt;</span>
    </>,
    <>
      <Indent level={2} />
      <span className={pun}>&lt;</span>
      <span className={typ}>h1</span>
      <span className={pun}>&gt;</span>
      <span className={id}>Dictionary</span>
      <span className={pun}>&lt;/</span>
      <span className={typ}>h1</span>
      <span className={pun}>&gt;</span>
    </>,
    <>
      <Indent level={2} />
      <span className={pun}>&lt;</span>
      <span className={typ}>WordModal</span>
      <span className={pun}> </span>
      <span className={prop}>word</span>
      <span className={pun}>=</span>
      <span className={pun}>{"{"}</span>
      <span className={id}>q</span>
      <span className={pun}>{"}"}</span>{" "}
      <span className={prop}>onClose</span>
      <span className={pun}>=</span>
      <span className={pun}>{"{"}</span>
      <span className={pun}>() =&gt; </span>
      <span className={fn}>setQ</span>
      <span className={pun}>(</span>
      <span className={str}>&quot;&quot;</span>
      <span className={pun}>)</span>
      <span className={pun}>{"}"}</span>
      <span className={pun}> /&gt;</span>
    </>,
    <>
      <Indent level={2} />
      <span className={pun}>&lt;/</span>
      <span className={typ}>main</span>
      <span className={pun}>&gt;</span>
    </>,
    <>
      <Indent level={1} />
      <span className={pun}>);</span>
    </>,
    <>
      <span className={pun}>{"}"}</span>
    </>,
  ];
}

function editorLinesForTab(tab: EditorTabLabel): ReactNode[] {
  switch (tab) {
    case "globals.css":
      return globalsCssMockLines();
    case "WordModal.ts":
      return wordModalTsMockLines();
    case "route.ts":
      return routeTsMockLines();
    case "page.tsx":
      return pageTsxMockLines();
    default:
      return routeTsMockLines();
  }
}

type BreadcrumbSeg = { key: string; label: string; iconSrc?: string };

function breadcrumbsForTab(tab: EditorTabLabel): BreadcrumbSeg[] {
  const base: BreadcrumbSeg[] = [
    { key: "root", label: "luminos-next" },
    { key: "src", label: "src" },
  ];
  switch (tab) {
    case "globals.css":
      return [
        ...base,
        { key: "app", label: "app" },
        { key: "file", label: "globals.css", iconSrc: FI.tailwind },
      ];
    case "WordModal.ts":
      return [
        ...base,
        { key: "components", label: "components" },
        { key: "file", label: "WordModal.ts", iconSrc: FI.ts },
      ];
    case "route.ts":
      return [
        ...base,
        { key: "app", label: "app" },
        { key: "dictionary", label: "dictionary" },
        { key: "file", label: "route.ts", iconSrc: FI.git },
        { key: "sym1", label: "JishoResponse", iconSrc: FI.git },
        { key: "sym2", label: "senses", iconSrc: "/code-editor/folder-menu/code-icons/fix.svg" },
      ];
    case "page.tsx":
      return [
        ...base,
        { key: "app", label: "app" },
        { key: "dictionary", label: "dictionary" },
        { key: "file", label: "page.tsx", iconSrc: FI.npm },
      ];
    default:
      return breadcrumbsForTab("route.ts");
  }
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
  const [activeEditorTab, setActiveEditorTab] = useState<(typeof editorTabs)[number]["label"]>("route.ts");
  const [terminalInput, setTerminalInput] = useState("");
  const hasCodeWrapperHeader = Boolean(codeWrapperHeader);
  const splitPad =
    p === "hwb"
      ? { "data-hwb-split-pad": hasCodeWrapperHeader ? "sm" : "md" }
      : { "data-ewb-split-pad": hasCodeWrapperHeader ? "sm" : "md" };
  const codingMode =
    p === "hwb"
      ? { "data-hwb-mode": mainPanel ? "ext" : "editor" }
      : { "data-ewb-mode": mainPanel ? "ext" : "editor" };
  const editorLines = useMemo(
    () => editorLinesForTab(activeEditorTab),
    [activeEditorTab],
  );
  const breadcrumbSegs = useMemo(
    () => breadcrumbsForTab(activeEditorTab),
    [activeEditorTab],
  );

  return (
    <div className={wb(p, "root")} style={{ fontSize: "1.25rem", lineHeight: 1.5 }}>
      <header className={wb(p, "layout-header")} aria-label="Layout bar">
        <nav aria-label="Menu bar" className={wb(p, "menubar")}>
          {layoutBarMenus.map((label) => (
            <button
              key={label}
              type="button"
              className={`${wb(p, "menubar-btn")} wb-topbar-btn`}
            >
              <span className={`${wb(p, "menubar-label")} wb-topbar-ink`}>{label}</span>
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
                className={`${wb(p, "layout-tool")} wb-topbar-btn`}
                aria-label={icon.label}
              >
                <span className={`${wb(p, "layout-tool-ico-wrap")} wb-topbar-ink`}>
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
                className={`${wb(p, "window-tool")} wb-topbar-btn`}
              >
                <span className={`${wb(p, "window-tool-ico-wrap")} wb-topbar-ink`}>
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
            className="flex h-[3.625rem] shrink-0 cursor-pointer items-stretch overflow-x-auto border-b border-[#2b2b2b]/70 bg-[#171818] px-0 [&_*]:cursor-pointer"
            role="tablist"
          >
            {editorTabs.map((tab) => {
              const isActive = activeEditorTab === tab.label;
              return (
              <div
                key={tab.label}
                className={
                  isActive
                    ? "flex min-w-[7rem] shrink-0 cursor-pointer flex-col rounded-t-[0.25rem] border border-b-0 border-white/15 bg-black transition-colors duration-150 hover:bg-[#141414]"
                    : "flex min-w-[7rem] shrink-0 cursor-pointer flex-col rounded-t-[0.25rem] border border-transparent border-r-[#4A4A4A] bg-[#252525] transition-colors duration-150 hover:bg-[#343434]"
                }
              >
                <div
                  className="flex h-[3.625rem] min-h-0 min-w-0 flex-1 cursor-pointer items-center gap-[0.5rem] pl-[1rem] pr-[0.75rem] bg-[unset] [background:unset]"
                  onClick={() => setActiveEditorTab(tab.label)}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveEditorTab(tab.label)}
                    className={
                      isActive
                        ? `flex min-h-0 min-w-0 flex-1 items-center gap-[0.5rem] overflow-hidden rounded-sm text-left text-[1.25rem] font-[300] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 ${tab.accentClass}`
                        : `flex min-h-0 min-w-0 flex-1 items-center gap-[0.5rem] overflow-hidden rounded-sm text-left text-[1.25rem] font-[300] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${tab.mutedClass}`
                    }
                  >
                    <Image
                      src={tab.iconSrc}
                      alt=""
                      width={28}
                      height={28}
                      className="h-[1.75rem] w-[1.75rem] shrink-0 cursor-pointer object-contain"
                      draggable={false}
                      unoptimized
                    />
                    <span className="min-w-0 cursor-pointer select-none truncate">{tab.label}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Close ${tab.label}`}
                    onClick={(event) => event.stopPropagation()}
                    className={
                      isActive
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
                        isActive
                          ? "h-[1.25rem] w-[1.25rem] object-contain brightness-0 invert"
                          : "h-[1.25rem] w-[1.25rem] object-contain"
                      }
                      draggable={false}
                      unoptimized
                    />
                  </button>
                </div>
              </div>
              );
            })}
          </div>

          <div className="box-border flex h-[3rem] min-h-[3rem] shrink-0 flex-nowrap items-center gap-x-[0.5rem] gap-y-1 overflow-hidden border-b border-[#2b2b2b]/70 bg-[#0E0E0E] pl-[2.5rem] pr-[1rem] text-[1.25rem] leading-none text-[#818181]">
            {breadcrumbSegs.map((seg, i) => (
              <Fragment key={seg.key}>
                {i > 0 ? <BreadcrumbCaret /> : null}
                <button
                  type="button"
                  className={
                    seg.iconSrc
                      ? "inline-flex min-h-0 min-w-0 items-center gap-[0.5rem] truncate rounded-sm px-[0.125rem] text-inherit transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                      : "inline-flex items-center rounded-sm px-[0.125rem] text-inherit transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                  }
                >
                  {seg.iconSrc ? (
                    <BreadcrumbCrumbIcon src={seg.iconSrc} />
                  ) : null}
                  {seg.label}
                </button>
              </Fragment>
            ))}
          </div>

          <div className="hwb-editor-scroll-area box-border min-h-0 min-w-0 flex-1 overflow-auto pt-[1rem] pb-[0.25rem] pl-[2.625rem] pr-[0.25rem] selection:bg-[#49483e]">
            <div
              className="flex w-full min-w-0 flex-col gap-y-[0.5rem] font-sans"
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.25rem",
                fontWeight: 300,
              }}
            >
              {editorLines.map((line, i) => (
                <div key={`line-row-${activeEditorTab}-${i}`} className="m-0 p-0 flex min-w-0 items-center">
                  <span className="flex h-[1.25rem] w-[3rem] shrink-0 cursor-pointer select-none items-center justify-end border-r border-[#3e3d32] pr-[0.75rem] text-right text-[1.125rem] tabular-nums text-[#9a9da1]">
                    {i + 1}
                  </span>
                  <div className="m-0 p-0 flex h-[1.25rem] min-w-0 flex-1 items-center whitespace-pre pl-[1rem] text-[#f8f8f2]">
                    {line}
                  </div>
                </div>
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
                <div className="flex h-[4.25rem] min-h-[4.25rem] shrink-0 items-center gap-[1.25rem] border-b border-[#2b2b2b]/70 bg-transparent px-[1rem] text-[1.25rem] text-[#818181]">
                  {terminalTabs.map((tab) => {
                    const isActive = tab === "Terminal";
                    return (
                      <button
                        key={tab}
                        type="button"
                        className={
                          isActive
                            ? "border-b-[0.1875rem] border-[#0078d4] pb-[0.25rem] text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                            : "rounded-sm px-[0.125rem] text-inherit transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                        }
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
                <div
                  className="min-h-0 flex-1 overflow-auto bg-transparent px-[1rem] py-[0.75rem] text-[1.25rem] text-[#cccccc]"
                  style={{ fontFamily: "Consolas, 'Courier New', monospace" }}
                >
                  <span className="text-[#c586c0]">PS </span>
                  C:\Users\Ace\Desktop\LuminosProject\luminos-next
                  <span className="text-white">&gt;</span>{" "}
                  <input
                    type="text"
                    aria-label="Terminal input"
                    value={terminalInput}
                    onChange={(event) => setTerminalInput(event.target.value)}
                    className="inline-block w-[24rem] max-w-full border-0 bg-transparent p-0 text-[#d4d4d4] caret-[#d4d4d4] outline-none"
                    spellCheck={false}
                  />
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
