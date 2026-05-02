"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const asideItems = [
  {
    href: "/",
    label: "Agents",
    src: "/code-editor/aside-menu/CirclesThree.svg",
  },
  {
    href: "/extensions",
    label: "Extensions",
    src: "/code-editor/aside-menu/FileText.svg",
  },
  {
    href: null as string | null,
    label: "Rules",
    src: "/code-editor/aside-menu/Gavel.svg",
  },
  {
    href: null as string | null,
    label: "Git graph",
    src: "/code-editor/aside-menu/GitBranch.svg",
  },
  {
    href: null as string | null,
    label: "Search",
    src: "/code-editor/aside-menu/MagnifyingGlass.svg",
  },
] as const;

const activeBtnClass =
  "flex h-[3.125rem] w-[3.125rem] shrink-0 items-center justify-center rounded-[0.625rem] border border-white/25 bg-white/[0.14] p-0 text-[var(--white)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_0.25rem_0.75rem_rgba(0,0,0,0.2)] backdrop-blur-md transition-[background-color,border-color,box-shadow] hover:border-white/35 hover:bg-white/[0.2] focus-visible:outline-none";

const idleBtnClass =
  "flex h-[3.125rem] w-[3.125rem] shrink-0 items-center justify-center rounded-[0.625rem] border-0 bg-transparent p-0 text-[var(--white)] transition-colors hover:bg-[#3a3a3a] focus-visible:outline-none";

function itemIsActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function EditorAsideNav() {
  const pathname = usePathname();

  return (
    <>
      {asideItems.map((item) => {
        const isActive =
          item.href !== null && itemIsActive(pathname, item.href);
        const className = isActive ? activeBtnClass : idleBtnClass;
        const img = (
          <Image
            src={item.src}
            alt=""
            width={26}
            height={26}
            className="pointer-events-none h-[1.625rem] w-[1.625rem] object-contain"
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
