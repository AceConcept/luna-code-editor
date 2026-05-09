const ICON_BASE = "/extensions/code-icons/Component%203";

export const installedExtensions = [
  {
    id: "python-environments",
    title: "Python Environments",
    description: "Provides a unified python environment experience",
    version: "v.2.12",
    updateAvailable: true,
    iconSrc: "/extensions/code-icons/python-extension-icon.png",
  },
  {
    id: "spring-boot",
    title: "Spring Boot Extension",
    description: "Tools for faster Java and Spring development.",
    version: "v.5.66",
    updateAvailable: false,
    iconSrc: `${ICON_BASE}/Variant6.png`,
  },
  {
    id: "sonarqube",
    title: "SonarQube for IDE",
    description: "Performs static analysis to detect technical debt.",
    version: "v.2.311",
    updateAvailable: true,
    iconSrc: `${ICON_BASE}/Variant5.png`,
  },
  {
    id: "sqlite",
    title: "SQLite",
    description: "A serverless, file-based SQL database engine.",
    version: "v.3.122",
    updateAvailable: false,
    iconSrc: `${ICON_BASE}/sql.png`,
  },
  {
    id: "esp-idf",
    title: "ESP-IDF",
    description: "The official development framework for ESP32 chips.",
    version: "v.8.5",
    updateAvailable: false,
    iconSrc: `${ICON_BASE}/esp.png`,
  },
  {
    id: "dotnet-pack",
    title: ".NET Extension Pack",
    description: "Essential tools for building C# applications easily.",
    version: "v.3.122",
    updateAvailable: false,
    iconSrc: `${ICON_BASE}/.net.png`,
  },
] as const;

export type InstalledExtensionId = (typeof installedExtensions)[number]["id"];

const EXTENSION_IDS = new Set<string>(installedExtensions.map((e) => e.id));

export function isInstalledExtensionId(
  id: string | null | undefined,
): id is InstalledExtensionId {
  return id != null && EXTENSION_IDS.has(id);
}

export function getInstalledExtension(id: InstalledExtensionId) {
  return installedExtensions.find((e) => e.id === id)!;
}
