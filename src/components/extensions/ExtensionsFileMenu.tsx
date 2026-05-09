import Image from "next/image";

/** URL-encoded space — matches `public/extensions/side-menu icons/*.svg` */
const XFM_ICON_BASE = "/extensions/side-menu%20icons";

const extensionsNavItems = [
  {
    id: "installed",
    label: "Installed",
    iconSrc: `${XFM_ICON_BASE}/DownloadSimple.svg`,
    active: true,
  },
  {
    id: "recommended",
    label: "Recommended",
    iconSrc: `${XFM_ICON_BASE}/Gradient.svg`,
    active: false,
  },
  {
    id: "performance",
    label: "Performance",
    iconSrc: `${XFM_ICON_BASE}/Circuitry.svg`,
    active: false,
  },
  {
    id: "version-history",
    label: "Version History",
    iconSrc: `${XFM_ICON_BASE}/ClockCounterClockwise.svg`,
    active: false,
  },
  {
    id: "debuggers",
    label: "Debuggers",
    iconSrc: `${XFM_ICON_BASE}/Terminal.svg`,
    active: false,
  },
  {
    id: "repository",
    label: "Repository",
    iconSrc: `${XFM_ICON_BASE}/CodesandboxLogo.svg`,
    active: false,
  },
  {
    id: "services",
    label: "Services",
    iconSrc: `${XFM_ICON_BASE}/SubtractSquare.svg`,
    active: false,
  },
] as const;

function ExtensionsSidebarIcon({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={36}
      height={36}
      className="xfm-ico"
      draggable={false}
      unoptimized
      aria-hidden
    />
  );
}

function ExtensionsSidebarNav() {
  return (
    <nav className="xfm-nav" aria-label="Extension categories">
      <ul className="xfm-ul">
        {extensionsNavItems.map(({ id, label, iconSrc, active }) => (
          <li key={id} className="xfm-li">
            <button
              type="button"
              className={active ? "xfm-btn xfm-btn--on" : "xfm-btn"}
            >
              <ExtensionsSidebarIcon src={iconSrc} />
              <span className="xfm-cap">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ExtensionsFileMenu() {
  return (
    <div className="xfm-col" aria-label="Extensions">
      <div
        id="file-menu"
        title="Extensions sidebar"
        role="group"
        aria-label="Extension categories"
        className="xfm-panel"
      >
        <div className="xfm-scroll">
          <ExtensionsSidebarNav />
        </div>
      </div>
    </div>
  );
}
