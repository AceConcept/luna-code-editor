import { EditorWorkbench } from "@/components/code-editor/EditorWorkbench";
import { ExplorerFileMenu } from "@/components/code-editor/explorer/ExplorerFileMenu";

export function CodeEditorMock() {
  return <EditorWorkbench leftSidebar={<ExplorerFileMenu />} />;
}
