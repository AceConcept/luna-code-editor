import type { InstalledExtensionId } from "./installedExtensionsData";

export type ExtensionUpdateBullet = { strong: string; text: string };

export type ExtensionDetailCopy = {
  publisher: string;
  downloads: string;
  lead: string;
  updateTitle: string;
  updateSummary: string;
  updateBullets: ExtensionUpdateBullet[];
  proseTitle: string;
  proseBlocks: {
    heading?: string;
    body: string;
    /** Renders “Visual Studio Code” + linked “extension” + body (Python-only mock). */
    linkExtensionWord?: boolean;
  }[];
};

export const extensionDetailCopy: Record<
  InstalledExtensionId,
  ExtensionDetailCopy
> = {
  "python-environments": {
    publisher: "pythonCo.",
    downloads: "12,000,367",
    lead: "A performant, feature-rich language server for Python in Pharecia Code.",
    updateTitle: "Update V1.202",
    updateSummary:
      "This is a rollback to 2025.9.1. Changes from 2025.9.100 to 2025.10.1 have been reverted.",
    updateBullets: [
      {
        strong: "Bug fix: ",
        text: "Pylance 2025.10.1 no longer detects workspace or PEP 420 namespace packages after update pylance-release#7737",
      },
      {
        strong: "Bug fix: ",
        text: "Crash when importing inherited TypedDict pylance-release#7736",
      },
      {
        strong: "Bug fix: ",
        text: "[pharecia-extension] 2025.10.1 failed upon starting pylance-release#7735",
      },
      {
        strong: "Bug fix: ",
        text: "Error: command 'pylance.registerNotebookStartupCommands' already exists pylance-release#7734",
      },
    ],
    proseTitle: "Python extension for Pharecia Code",
    proseBlocks: [
      {
        body: "Pharecia offers comprehensive support for the Python language across all currently maintained versions. It serves as a central hub where various tools integrate smoothly to provide advanced IntelliSense via Pylance and robust debugging through the Python Debugger. Within Pharecia, developers can easily manage code formatting, linting, and complex refactoring, while navigating projects using the built-in variable and test explorers. Additionally, it streamlines workflow through the latest environment management features found in the new Pharecia Environments Extension.",
      },
      {
        heading: "Advanced Environment Management",
        body: "with rich support for the Python language (for all actively supported Python versions), providing access points for extensions to seamlessly integrate and offer support for IntelliSense (Pylance), debugging (Python Debugger), formatting, linting, code navigation.",
        linkExtensionWord: true,
      },
      {
        heading: "Tooling and diagnostics",
        body: "Workspace symbols, signature help, and import resolution stay in sync with your selected interpreter and virtual environment. Diagnostic squiggles surface type issues and deprecated APIs early, while code actions suggest fixes that match your formatter and linter configuration. For notebooks, cell boundaries and kernel selection integrate cleanly so mixed file layouts remain predictable from edit to run.",
      },
    ],
  },
  "spring-boot": {
    publisher: "vmware.",
    downloads: "5,420,100",
    lead: "Build and run Spring Boot applications with guided tooling, live hovers, and rich navigation.",
    updateTitle: "May 2026 patch",
    updateSummary:
      "Compatibility with Spring Boot 3.4.x and improved classpath refresh when switching branches.",
    updateBullets: [
      {
        strong: "Enhancement: ",
        text: "Faster symbol index for multi-module Gradle and Maven layouts.",
      },
      {
        strong: "Bug fix: ",
        text: "Spring Initializr wizard no longer drops custom dependency toggles when offline.",
      },
    ],
    proseTitle: "Spring Boot in Pharecia Code",
    proseBlocks: [
      {
        body: "The Spring Boot extension connects your workspace to first-class Java language features—run configurations, live application dashboard hooks, and templates that stay aligned with upstream Spring guides. It recognizes Gradle and Maven layouts, surfaces `@ConfigurationProperties` and profile-specific files, and keeps launch presets tied to the module you are editing.",
      },
      {
        heading: "Java developer workflow",
        body: "Navigate beans, endpoints, and configuration with minimal friction. Pair it with your favorite test runner for a consistent loop from edit to deploy. Live hovers show request mappings, conditional beans, and actuator metadata where available so you spend less time hunting through XML or YAML for the same answer.",
      },
      {
        heading: "From scaffold to production",
        body: "Use Spring Initializr without leaving the editor to bootstrap services, batch jobs, or reactive stacks. After generation, refactor packages safely with rename-aware imports and let the tooling keep your `application.yml` fragments organized. When incidents hit, jump from log stack traces back to controllers and filters with one click.",
      },
    ],
  },
  sonarqube: {
    publisher: "sonarsource.",
    downloads: "880,234",
    lead: "Bring Sonar rules and issue overlays directly into the editor while you type.",
    updateTitle: "Rule pack 2026.1",
    updateSummary:
      "Adds coverage for new CWE mappings and trims noise on generated files.",
    updateBullets: [
      {
        strong: "Rule: ",
        text: "New checks for common secret patterns in CI configuration snippets.",
      },
      {
        strong: "Bug fix: ",
        text: "Taint analysis no longer stalls on very large JSX files.",
      },
    ],
    proseTitle: "SonarQube for IDE",
    proseBlocks: [
      {
        body: "See quality gates before you push—highlights appear inline with quick-fix suggestions when SonarQube provides them. Connect to your project binding to sync severities with the server. Issue locations map cleanly across renamed files, and diffs show whether a finding is new so noisy legacy debt does not drown out regressions you just introduced.",
      },
      {
        heading: "Team-ready",
        body: "Developers can jump from an issue to documentation or suppress with a documented reason, keeping security and maintainability conversations in one place. Hotspots and security categories surface early in the pull request loop, while coverage and duplication hints give reviewers shared vocabulary for what “done” means on each change.",
      },
      {
        heading: "Focused triage",
        body: "Filter by rule repository, tag, or impact to build personal dashboards that match your squad’s policy pack. When the server rule set updates, the IDE refreshes expectations without forcing a context switch—so “why is this suddenly red?” stays explainable from the gutter.",
      },
    ],
  },
  sqlite: {
    publisher: "pharecia.",
    downloads: "2,109,445",
    lead: "Browse schemas, run queries, and inspect results without leaving the editor.",
    updateTitle: "SQLite tools 3.122",
    updateSummary:
      "Adds virtual table introspection helpers and safer default pragmas for read-only buffers.",
    updateBullets: [
      {
        strong: "Enhancement: ",
        text: "Explain plan view highlights the dominant cost nodes.",
      },
      {
        strong: "Bug fix: ",
        text: "Parameterized scripts no longer lose binding counts after buffer reload.",
      },
    ],
    proseTitle: "SQLite workspace integration",
    proseBlocks: [
      {
        body: "Open .sqlite and .db assets from the explorer, run ad hoc SQL against attached files, and export result grids when you need a snapshot for teammates. Bind parameters safely for repeat runs, pin frequently used queries beside your code, and preview schema diffs when migrations land from another branch.",
      },
      {
        heading: "Lightweight databases",
        body: "Ideal for local features, fixtures, and embedded projects where a full server stack is unnecessary. Transaction boundaries stay visible in the status bar, and WAL versus rollback modes are spelled out so you do not accidentally leave a writer lock behind when switching tasks.",
      },
      {
        heading: "Schema awareness",
        body: "Autocompletion pulls live column names and FK targets from attached databases so refactor moves stay honest. For larger files, outline views jump to tables and indexes without expanding every `CREATE` statement by hand.",
      },
    ],
  },
  "esp-idf": {
    publisher: "espressif.",
    downloads: "641,022",
    lead: "Flash, monitor, and configure ESP32 toolchains with guided setup.",
    updateTitle: "IDF 5.4 support",
    updateSummary:
      "Adds menuconfig integration tweaks and a clearer flash size warning before build.",
    updateBullets: [
      {
        strong: "Enhancement: ",
        text: "Serial monitor preserves scrollback when a task panics and resets.",
      },
      {
        strong: "Bug fix: ",
        text: "Resolved intermittent OpenOCD attach failure on Windows 11 24H2.",
      },
    ],
    proseTitle: "ESP-IDF development",
    proseBlocks: [
      {
        body: "Target firmware with CMake presets that match ESP-IDF releases. Switch MCUs from the status bar when your workspace includes multiple board profiles. Flash size, partition tables, and secure boot hints carry through from `sdkconfig` into build diagnostics so mismatched targets surface before you burn a device image.",
      },
      {
        heading: "Toolchain and configuration",
        body: "Pick a tagged ESP-IDF checkout or containerized toolchain and let the extension keep `idf.py` tasks, Python environment, and compiler discovery in agreement. `menuconfig` edits round-trip cleanly into stored defaults, and component paths stay indexed for jump-to-definition across CMake components and third-party libs you vendor into `components/`. When a dependency revs, the IDE highlights Kconfig deltas that need a rebuild.",
      },
      {
        heading: "Hardware loop",
        body: "Capture UART logs alongside build output so firmware bring-up stays in one panel. Decode panic backtraces when `configASSERT` fires, filter noisy boot banners, and time-stamp lines when reproducing rare RF or power glitches. JTAG/OpenOCD attach is one click away from the same breakpoint set you used on the last board.",
      },
      {
        heading: "Day-two engineering",
        body: "OTA and partition migration notes appear next to the images you flash so field upgrades stay traceable. Power-profiling hooks align with the peripheral drivers you selected, and NimBLE or Wi-Fi coexistence reminders show up when configs collide. Whether you are shipping a low-duty sensor or a UI-heavy gadget, the loop from edit, flash, to serial evidence stays in Pharecia without juggling three terminals.",
      },
    ],
  },
  "dotnet-pack": {
    publisher: "ms-dotnettools.",
    downloads: "11,203,991",
    lead: "One meta-pack that wires up C#, test discovery, and solution tooling.",
    updateTitle: ".NET bundle refresh",
    updateSummary:
      "Aligns with the latest .NET 9 SDK diagnostics and improves SDK-style restore output.",
    updateBullets: [
      {
        strong: "Enhancement: ",
        text: "Test explorer groups parameterized cases more predictably.",
      },
      {
        strong: "Bug fix: ",
        text: "Blazor WebAssembly hot reload no longer drops static asset globs on folder rename.",
      },
    ],
    proseTitle: ".NET Extension Pack",
    proseBlocks: [
      {
        body: "Install once to light up solution loading, Razor helpers, and IntelliCode-friendly completions tuned for modern C# patterns. Multi-target frameworks resolve consistently in shared projects, and source-generated APIs stay indexed as you expand partials or `Regex`-derived types.",
      },
      {
        heading: "Ship with confidence",
        body: "Pair with your preferred formatter and analyzer profile—Pharecia keeps the integration paths stable across SDK updates. Test discovery picks up xUnit, NUnit, or MSTest without hand-maintaining file lists, and coverage overlays point to the exact branch that missed assertions.",
      },
      {
        heading: "Full-stack .NET",
        body: "Minimal APIs, gRPC, and Blazor routes share hover text for routes and validation attributes. Container tooling ties published outputs to the Dockerfile you edit in-repo, so promoting a build to staging stays one cohesive story from commit to compose.",
      },
    ],
  },
};
