import { Editor } from "@sno2wiki/editor";

import { generateCommitId, generateLineId } from "~/common/id";
import { useEditor } from "~/hooks/useEditor";

export const DocumentPage: React.VFC = () => {
  const { pushCommits, synchedLines } = useEditor();
  return (
    <div>
      <p>Document</p>
      <Editor
        synchedLines={synchedLines}
        pushCommits={(commits) => {
          pushCommits(commits);
        }}
        generateCommitId={generateCommitId}
        generateLineId={generateLineId}
      />
    </div>
  );
};
