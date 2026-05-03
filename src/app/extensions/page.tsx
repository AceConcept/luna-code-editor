import type { Metadata } from "next";
import { CodeEditorExtensionsMock } from "@/components/CodeEditorExtensionsMock";
import { ScaledViewport } from "@/components/ScaledViewport";

export const metadata: Metadata = {
  title: "The extension page",
  description: "Editor shell mock",
};

export default function ExtensionsPage() {
  return (
    <ScaledViewport>
      <CodeEditorExtensionsMock />
    </ScaledViewport>
  );
}
