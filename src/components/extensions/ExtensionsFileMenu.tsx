function ExtIconInstalled() {
  return (
    <svg
      className="xfm-ico"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v9" />
      <path d="M8 12l4 4 4-4" />
      <path d="M4 19c0 1 1 2 2 2h12c1 0 2-1 2-2v-2H4v2Z" />
    </svg>
  );
}

function ExtIconRecommended() {
  return (
    <svg
      className="xfm-ico"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 7l4 4-4 4" />
      <path d="M13 17h7" />
    </svg>
  );
}

function ExtIconPerformance() {
  return (
    <svg
      className="xfm-ico"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M7 14l3-3 3 2 4-5" />
      <path d="M17 8v4h-4" />
    </svg>
  );
}

function ExtIconVersionHistory() {
  return (
    <svg
      className="xfm-ico"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 8v5l3 2" />
      <circle cx="12" cy="12" r="9" />
      <path d="M5 3v4h4" />
    </svg>
  );
}

function ExtIconDebuggers() {
  return (
    <svg
      className="xfm-ico"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="12" height="12" rx="1" />
      <rect x="9" y="9" width="12" height="12" rx="1" />
    </svg>
  );
}

function ExtIconRepository() {
  return (
    <svg
      className="xfm-ico"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 6h14" strokeDasharray="3 2" />
      <path d="M5 12h14" strokeDasharray="3 2" />
      <path d="M5 18h14" strokeDasharray="3 2" />
    </svg>
  );
}

function ExtIconServices() {
  return (
    <svg
      className="xfm-ico"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l8.5 5v8L12 21l-8.5-5V8L12 3Z" />
      <path d="M12 12l8.5-4" />
      <path d="M12 12v9" />
      <path d="M12 12L3.5 8" />
    </svg>
  );
}

const extensionsNavItems = [
  { id: "installed", label: "Installed", Icon: ExtIconInstalled, active: true },
  { id: "recommended", label: "Recommended", Icon: ExtIconRecommended, active: false },
  { id: "performance", label: "Performance", Icon: ExtIconPerformance, active: false },
  {
    id: "version-history",
    label: "Version History",
    Icon: ExtIconVersionHistory,
    active: false,
  },
  { id: "debuggers", label: "Debuggers", Icon: ExtIconDebuggers, active: false },
  { id: "repository", label: "Repository", Icon: ExtIconRepository, active: false },
  { id: "services", label: "Services", Icon: ExtIconServices, active: false },
] as const;

function ExtensionsSidebarNav() {
  return (
    <nav className="xfm-nav" aria-label="Extension categories">
      <ul className="xfm-ul">
        {extensionsNavItems.map(({ id, label, Icon, active }) => (
          <li key={id} className="xfm-li">
            <button
              type="button"
              className={active ? "xfm-btn xfm-btn--on" : "xfm-btn"}
            >
              <Icon />
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
