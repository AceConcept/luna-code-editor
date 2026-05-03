import Image from "next/image";

const PYTHON_ICON = "/extensions/code-icons/Component%203/Variant6.png";

function StarRow() {
  return (
    <div className="flex items-center gap-1 text-[#f5a623]" aria-label="4 out of 5 stars">
      <span aria-hidden>★</span>
      <span aria-hidden>★</span>
      <span aria-hidden>★</span>
      <span aria-hidden>★</span>
      <span className="text-white/25" aria-hidden>
        ★
      </span>
      <span className="ml-1 text-[0.75rem] font-light text-[#9d9d9d]">(100)</span>
    </div>
  );
}

function IconBtn({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded border-0 bg-transparent text-[#b0b0b0] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      <span className="text-[0.9rem]">⋯</span>
    </button>
  );
}

/** Side panel mock: Python Environments (692×1122px design space, rem). */
export function ExtensionDetailPanel() {
  return (
    <aside
      id="extension-detail-python"
      className="flex h-[70.125rem] max-h-[70.125rem] w-[43.25rem] shrink-0 flex-col overflow-hidden rounded-[0.375rem] border border-[#3c3c3c] bg-[#2d2d2d] font-light text-[#cccccc] shadow-[0_0.5rem_2rem_rgba(0,0,0,0.35)]"
      aria-label="Extension details"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-[#454545] bg-[#3c3c3c] px-3 py-2 text-[0.75rem] text-[#c8c8c8]">
        <span className="font-mono">{"// Window"}</span>
        <button
          type="button"
          aria-label="Collapse"
          className="rounded border-0 bg-transparent px-2 text-[#aaa] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          ⌄
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-4 pt-4">
        <div className="flex shrink-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/25 bg-black/30">
            <Image
              src={PYTHON_ICON}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              draggable={false}
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-[1.25rem] font-light leading-tight text-white">
                  Python Environments{" "}
                  <span className="text-[0.85rem] font-light text-[#8a8a8a]">
                    pythonCo.
                  </span>
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <StarRow />
                  <span className="flex items-center gap-1 text-[0.8rem] text-white">
                    <span aria-hidden className="opacity-70">
                      ⬇
                    </span>
                    12,000,367
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <IconBtn label="Settings" />
                <IconBtn label="Expand" />
              </div>
            </div>
            <p className="mt-2 text-[0.8rem] leading-snug text-[#b0b0b0]">
              A performant, feature-rich language server for Python in Pharecia
              Code.
            </p>
          </div>
        </div>

        <div className="mt-4 flex shrink-0 flex-wrap items-center gap-4">
          <div className="flex overflow-hidden rounded-[0.25rem]">
            <button
              type="button"
              className="flex items-center gap-2 border-0 bg-[#2ea043] px-4 py-2 text-[0.85rem] font-light text-white hover:bg-[#3fb950] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span aria-hidden>⬇</span>
              Download Update
            </button>
            <button
              type="button"
              aria-label="Other download options"
              className="border-0 border-l border-white/25 bg-[#2ea043] px-2 text-white hover:bg-[#3fb950] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              ⌄
            </button>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-[0.8rem] text-[#ccc]">
            <input type="checkbox" className="h-4 w-4 accent-[#0e639c]" />
            Auto Updates
          </label>
        </div>

        <div className="mt-4 flex shrink-0 items-stretch border border-[#454545] bg-[#252526]">
          {(["DETAILS", "FEATURES", "CHANGELOG"] as const).map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={
                i === 0
                  ? "relative flex-1 border-0 border-r border-[#454545] bg-transparent py-2.5 text-center text-[0.7rem] font-light tracking-wide text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/30"
                  : "flex-1 border-0 border-r border-[#454545] bg-transparent py-2.5 text-center text-[0.7rem] font-light tracking-wide text-[#888] last:border-r-0 hover:text-[#ccc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/20"
              }
            >
              {tab}
              {i === 0 ? (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-white" />
              ) : null}
            </button>
          ))}
          <button
            type="button"
            aria-label="More"
            className="w-10 shrink-0 border-0 bg-transparent text-[#888] hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/30"
          >
            ⋮
          </button>
        </div>

        <div className="mt-3 flex shrink-0 gap-2 border border-[#454545] bg-[#2a2a2a] px-3 py-2">
          <span className="shrink-0 text-[#ccc]" aria-hidden>
            ›
          </span>
          <div className="min-w-0">
            <div className="flex items-start gap-2">
              <span className="text-lg leading-none text-white" aria-hidden>
                ⚠
              </span>
              <div>
                <p className="text-[0.85rem] font-light text-white">Update V1.202</p>
                <p className="mt-1 text-[0.75rem] leading-snug text-[#b0b0b0]">
                  This is a rollback to 2025.9.1. Changes from 2025.9.100 to
                  2025.10.1 have been reverted.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
          <h3 className="text-[1.1rem] font-light text-white">
            Python extension for Pharecia Code
          </h3>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-[#b8b8b8]">
            A comprehensive toolkit that brings Pylance-powered IntelliSense,
            linting, debugging, testing, and environment management into
            Pharecia Code. Switch interpreters, create virtual environments, and
            keep dependencies aligned with your project—all from one place.
          </p>
          <h4 className="mt-4 text-[0.95rem] font-light text-white">
            Advanced Environment Management
          </h4>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-[#b8b8b8]">
            Configure conda, venv, and Poetry workflows with guided setup and
            quick actions from the command palette.
          </p>
        </div>
      </div>
    </aside>
  );
}
