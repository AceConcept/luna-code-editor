import { EditorWorkbench } from "@/components/code-editor/EditorWorkbench";
import { ExtensionsFileMenu } from "@/components/extensions/ExtensionsFileMenu";
import { InstalledExtensionsPanel } from "@/components/extensions/InstalledExtensionsPanel";

function CodeWrapperHeader() {
  return (
    <div
      id="code-wrapper-header"
      title="code-wrapper-header"
      role="region"
      aria-label="Editor panel header"
      className="shrink-0 border-b border-white/[0.12] bg-black/[0.12] pl-[3.125rem] pr-[1rem] pt-[1.25rem] pb-[0.75rem]"
    />
  );
}

export function CodeEditorExtensionsMock() {
  return (
    <EditorWorkbench
      codeWrapperHeader={<CodeWrapperHeader />}
      leftSidebar={<ExtensionsFileMenu />}
      mainPanel={<InstalledExtensionsPanel />}
      workspaceBackgroundImageSrc="/extensions/ext-background.jpg"
    />
  );
}
