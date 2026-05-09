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
        body: "The Spring Boot extension connects your workspace to first-class Java language features—run configurations, live application dashboard hooks, and templates that stay aligned with upstream Spring guides.",
      },
      {
        heading: "Java developer workflow",
        body: "Navigate beans, endpoints, and configuration with minimal friction. Pair it with your favorite test runner for a consistent loop from edit to deploy.",
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
        body: "See quality gates before you push—highlights appear inline with quick-fix suggestions when SonarQube provides them. Connect to your project binding to sync severities with the server.",
      },
      {
        heading: "Team-ready",
        body: "Developers can jump from an issue to documentation or suppress with a documented reason, keeping security and maintainability conversations in one place.",
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
        body: "Open .sqlite and .db assets from the explorer, run ad hoc SQL against attached files, and export result grids when you need a snapshot for teammates.",
      },
      {
        heading: "Lightweight databases",
        body: "Ideal for local features, fixtures, and embedded projects where a full server stack is unnecessary.",
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
        body: "Target firmware with CMake presets that match ESP-IDF releases. Switch MCUs from the status bar when your workspace includes multiple board profiles.",
      },
      {
        heading: "Hardware loop",
        body: "Capture UART logs alongside build output so firmware bring-up stays in one panel.",
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
        body: "Install once to light up solution loading, Razor helpers, and IntelliCode-friendly completions tuned for modern C# patterns.",
      },
      {
        heading: "Ship with confidence",
        body: "Pair with your preferred formatter and analyzer profile—Pharecia keeps the integration paths stable across SDK updates.",
      },
    ],
  },
};
