import type { Metadata } from "next";
import { CodeEditorMock } from "@/components/CodeEditorMock";
import { ScaledViewport } from "@/components/ScaledViewport";

export const metadata: Metadata = {
  title: "The extension page",
  description: "Editor shell mock",
};

export default function ExtensionsPage() {
  return (
    <ScaledViewport>
      <CodeEditorMock />
    </ScaledViewport>
  );
}
