import { Editor } from "@sno2wiki/editor";
import React from "react";
import { useParams } from "react-router-dom";

import { generateCommitId, generateLineId } from "~/common/id";
import { useAuth } from "~/hooks/useAuth";
import { useEditor } from "~/hooks/useEditor";

export const EditorWrapper: React.VFC<{ documentId: string; userId: string; }> = ({ documentId, userId }) => {
  const { pushCommits, lines } = useEditor({ documentId, userId });
  return (
    <div>
      {!lines && <p>LOADING</p>}
      {lines
        && (
          <Editor
            synchedLines={lines}
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

export const ViewerWrapper: React.VFC<{ documentId: string; }> = ({ documentId }) => {
  return (
    <div>
      <p>LOADING</p>
    </div>
  );
};

export const DocumentPage: React.VFC = () => {
  const { id: documentId } = useParams<"id">();
  const user = useAuth();

  return (
    <>
      {!documentId && <p>LOADING</p>}
      {documentId && <ViewerWrapper documentId={documentId} />}
      {documentId && !!user && <EditorWrapper documentId={documentId} userId={user.userId} />}
    </>
  );
};
