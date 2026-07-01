"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { EditorWorkbenchBenchPrefix } from "@/components/code-editor/EditorWorkbench";

const asideItems = [
  {
    href: "/",
    label: "Code Editor",
    src: "/code-editor/aside-menu/CirclesThree.svg",
  },
  {
    href: null as string | null,
    label: "Files",
    src: "/code-editor/aside-menu/FileText.svg",
  },
  {
    href: null as string | null,
    label: "Extensions",
    src: "/code-editor/aside-menu/GitBranch.svg",
  },
  {
    href: "/extensions",
    label: "Rules",
    src: "/code-editor/aside-menu/Gavel.svg",
  },
  {
    href: null as string | null,
    label: "Search",
    src: "/code-editor/aside-menu/MagnifyingGlass.svg",
  },
] as const;

function itemIsActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function EditorAsideNav({
  benchClassPrefix,
}: {
  benchClassPrefix: EditorWorkbenchBenchPrefix;
}) {
  const pathname = usePathname();
  const p = benchClassPrefix;
  const asideBtn = `${p}-aside-btn aside-btn-tooltip`;
  const asideBtnActive = `${p}-aside-btn--active`;
  const asideImg = `${p}-aside-btn-img`;

  return (
    <>
      {asideItems.map((item) => {
        const isActive =
          item.href !== null && itemIsActive(pathname, item.href);
        const className = isActive
          ? `${asideBtn} ${asideBtnActive}`
          : asideBtn;
        const img = (
          <Image
            src={item.src}
            alt=""
            width={26}
            height={26}
            className={asideImg}
            draggable={false}
            unoptimized
          />
        );

        if (item.href !== null) {
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              data-tooltip={item.label}
              aria-current={isActive ? "page" : undefined}
              className={className}
            >
              {img}
            </Link>
          );
        }

        return (
          <button
            key={item.src}
            type="button"
            aria-label={item.label}
            data-tooltip={item.label}
            aria-current={isActive ? "true" : undefined}
            className={className}
          >
            {img}
          </button>
        );
      })}
    </>
  );
}
