"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, type ReactNode } from "react";

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

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Folder / root dropdown — fade the whole block in at once (no height clip stagger). */
const folderReveal = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.18, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: EASE_OUT } },
};

const fileMenuIconBoxClass =
  "h-[1.25rem] w-[1.25rem] shrink-0 object-contain";

function FileTreeCaret({ open }: { open: boolean }) {
  return (
    <motion.span
      className="inline-flex shrink-0"
      animate={{ rotate: open ? 90 : 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
    >
      <Image
        src="/code-editor/folder-menu/Caret.svg"
        alt=""
        width={20}
        height={20}
        className={fileMenuIconBoxClass}
        draggable={false}
        unoptimized
      />
    </motion.span>
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
    <motion.button
      type="button"
      className={className}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 520, damping: 32 }}
    >
      <span className={fileTreeRowContentClass}>{children}</span>
    </motion.button>
  );
}

const fileTreeRowButtonBaseClass =
  "flex h-[3rem] w-full shrink-0 items-center border-0 bg-transparent py-0 pr-0 text-left text-[1.25rem] font-light leading-[1.6] text-[#BDBEBE] transition-colors hover:bg-[#4A4A4A] focus-visible:outline-none";

const fileTreeRowContentClass =
  "flex min-h-0 min-w-0 flex-1 items-center gap-[0.5rem]";

const fileTreeRowButtonClass = `${fileTreeRowButtonBaseClass} pl-[2rem]`;

const fileTreeRowButtonSrcNestedClass = `${fileTreeRowButtonBaseClass} pl-[3.25rem]`;

const fileTreeNestedListClass =
  "mt-0 w-full list-none border-l border-[#3e3e42]";

function FileTreeFolder({
  label,
  className,
  defaultOpen = true,
  nested = false,
  children,
}: {
  label: string;
  className: string;
  defaultOpen?: boolean;
  nested?: boolean;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <li className="list-none">
      <motion.button
        type="button"
        className={className}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.995 }}
        transition={{ type: "spring", stiffness: 520, damping: 32 }}
      >
        <span className={fileTreeRowContentClass}>
          <FileTreeCaret open={open} />
          {label}
        </span>
      </motion.button>
      <AnimatePresence initial={false}>
        {open && children ? (
          <motion.div
            key={`folder-${label}`}
            initial={folderReveal.initial}
            animate={folderReveal.animate}
            exit={folderReveal.exit}
          >
            <ul className={nested ? fileTreeNestedListClass : "list-none"}>
              {children}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

export function ExplorerFileMenu() {
  const [rootOpen, setRootOpen] = useState(true);

  return (
    <div className="hwb-explorer-file-menu" aria-label="Explorer">
      <div
        id="file-menu"
        role="group"
        aria-label="File menu"
        className="hwb-explorer-file-menu-inner"
      >
        <motion.div
          className="flex w-full items-center justify-between gap-[0.5rem] bg-transparent py-[1rem] pl-0 text-[1.25rem] font-light uppercase tracking-wide text-[#BDBEBE]"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
        >
          <motion.button
            type="button"
            aria-label="Luminos explorer title"
            className="cursor-pointer rounded-sm text-inherit transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            whileHover={{ opacity: 1 }}
            whileTap={{ scale: 0.98 }}
          >
            Luminos
          </motion.button>
          <motion.button
            type="button"
            aria-label="Explorer options"
            className="cursor-pointer rounded-sm opacity-80 transition-opacity duration-150 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            whileHover={{ opacity: 1, scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 480, damping: 26 }}
          >
            <Image
              src="/code-editor/folder-menu/DotsThreeOutline.svg"
              alt=""
              width={20}
              height={20}
              className="h-[1.5rem] w-[1.5rem] shrink-0 cursor-pointer object-contain"
              draggable={false}
              unoptimized
            />
          </motion.button>
        </motion.div>
        <div className="min-h-0 flex-1 overflow-auto bg-transparent pb-[1rem] text-[1.25rem] font-light leading-[1.6] text-[#BDBEBE]">
          <motion.button
            type="button"
            className={`${fileTreeRowButtonBaseClass} pl-[0.75rem]`}
            aria-expanded={rootOpen}
            onClick={() => setRootOpen((v) => !v)}
            whileTap={{ scale: 0.995 }}
            transition={{ type: "spring", stiffness: 520, damping: 32 }}
          >
            <span className={fileTreeRowContentClass}>
              <FileTreeCaret open={rootOpen} />
              luminos-next
            </span>
          </motion.button>
          <AnimatePresence initial={false}>
            {rootOpen ? (
              <motion.div
                key="explorer-root-tree"
                initial={folderReveal.initial}
                animate={folderReveal.animate}
                exit={folderReveal.exit}
              >
                <ul className="list-none">
                <FileTreeFolder label=".next/" className={fileTreeRowButtonClass} />
                <FileTreeFolder label="node_modules/" className={fileTreeRowButtonClass} />
                <FileTreeFolder label="public/" className={fileTreeRowButtonClass} />
                <FileTreeFolder
                  label="src/"
                  className={fileTreeRowButtonClass}
                  defaultOpen
                  nested
                >
                  <FileTreeFolder
                    label="app/"
                    className={fileTreeRowButtonSrcNestedClass}
                    defaultOpen
                  />
                  <FileTreeFolder
                    label="types/"
                    className={fileTreeRowButtonSrcNestedClass}
                    defaultOpen
                  />
                </FileTreeFolder>
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
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
