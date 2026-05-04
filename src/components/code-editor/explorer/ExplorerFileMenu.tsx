import Image from "next/image";
import type { ReactNode } from "react";

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

function FileTreeCaret() {
  return (
    <Image
      src="/code-editor/folder-menu/Caret.svg"
      alt=""
      width={20}
      height={20}
      className={`${fileMenuIconBoxClass} rotate-90`}
      draggable={false}
      unoptimized
    />
  );
}

function FileTreeFileIcon({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={20}
      height={20}
      className={fileMenuIconBoxClass}
      draggable={false}
      unoptimized
    />
  );
}

function FileTreeRow({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <button type="button" className={className}>
      <span className={fileTreeRowContentClass}>{children}</span>
    </button>
  );
}

const fileTreeRowButtonBaseClass =
  "flex h-[3rem] w-full shrink-0 items-center border-0 bg-transparent py-0 pr-0 text-left text-[1.25rem] font-light leading-[1.6] text-white transition-colors hover:bg-[#4A4A4A] focus-visible:outline-none";

const fileTreeRowContentClass =
  "flex min-h-0 min-w-0 flex-1 items-center gap-[0.5rem]";

const fileTreeRowButtonClass = `${fileTreeRowButtonBaseClass} pl-[2rem]`;

const fileTreeRowButtonSrcNestedClass = `${fileTreeRowButtonBaseClass} pl-[3.25rem]`;

export function ExplorerFileMenu() {
  return (
    <div className="hwb-explorer-file-menu" aria-label="Explorer">
      <div
        id="file-menu"
        title="File menu"
        role="group"
        aria-label="File menu"
        className="hwb-explorer-file-menu-inner"
      >
        <div className="flex w-full items-center justify-between gap-[0.5rem] bg-transparent py-[1rem] pl-0 text-[1.25rem] font-light uppercase tracking-wide text-white">
          <span>Luminos</span>
          <Image
            src="/code-editor/folder-menu/DotsThreeOutline.svg"
            alt=""
            width={20}
            height={20}
            className={fileMenuIconBoxClass}
            draggable={false}
            unoptimized
          />
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-transparent pb-[1rem] text-[1.25rem] font-light leading-[1.6] text-white">
          <FileTreeRow className={`${fileTreeRowButtonBaseClass} pl-[0.75rem]`}>
            <FileTreeCaret />
            luminos-next
          </FileTreeRow>
          <ul className="list-none">
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeCaret />
                .next/
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeCaret />
                node_modules/
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeCaret />
                public/
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeCaret />
                src/
              </FileTreeRow>
              <ul className="mt-0 w-full list-none border-l border-[#3e3e42]">
                <li className="list-none">
                  <FileTreeRow className={fileTreeRowButtonSrcNestedClass}>
                    <FileTreeCaret />
                    app/
                  </FileTreeRow>
                </li>
                <li className="list-none">
                  <FileTreeRow className={fileTreeRowButtonSrcNestedClass}>
                    <FileTreeCaret />
                    types/
                  </FileTreeRow>
                </li>
              </ul>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeFileIcon src={FI.json} />
                .eslintrc.json
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeFileIcon src={FI.git} />
                .gitignore
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeFileIcon src={FI.js} />
                eslint.config.mjs
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeFileIcon src={FI.ts} />
                next-env.d.ts
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeFileIcon src={FI.ts} />
                next.config.ts
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeFileIcon src={FI.npm} />
                package-lock.json
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeFileIcon src={FI.json} />
                package.json
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeFileIcon src={FI.js} />
                postcss.config.mjs
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeFileIcon src={FI.readme} />
                README.md
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeFileIcon src={FI.tailwind} />
                tailwind.config.ts
              </FileTreeRow>
            </li>
            <li className="list-none">
              <FileTreeRow className={fileTreeRowButtonClass}>
                <FileTreeFileIcon src={FI.json} />
                tsconfig.json
              </FileTreeRow>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
