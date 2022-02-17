import { Editor } from "@sno2wiki/editor";
import React from "react";

import { generateCommitId, generateLineId } from "~/common/id";
import { useEditor } from "~/hooks/useEditor";

export const EditorWrapper: React.VFC<{
  documentId: string;
  ticket: string;
}> = ({ documentId, ticket }) => {
  const { pushCommits, lines } = useEditor({ documentId, ticket });
  return (
    <div>
      {!lines && <p>LOADING</p>}
      {lines
        && (
          <Editor
            lines={lines}
            pushCommits={(commits) => {
              pushCommits(commits);
            }}
            generateCommitId={generateCommitId}
            generateLineId={generateLineId}
          />
        )}
    </div>
  );
};
