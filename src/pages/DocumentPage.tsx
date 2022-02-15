import { Editor } from "@sno2wiki/editor";
import { Viewer } from "@sno2wiki/viewer";
import React from "react";
import { useParams } from "react-router-dom";

import { generateCommitId, generateLineId } from "~/common/id";
import { useAuth } from "~/hooks/useAuth";
import { useEditor } from "~/hooks/useEditor";
import { useViewer } from "~/hooks/useViewer";

export const EditorWrapper: React.VFC<{
  documentId: string;
  userId: string;
}> = ({ documentId, userId }) => {
  const { pushCommits, lines } = useEditor({ documentId, userId });
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

export const ViewerWrapper: React.VFC<{
  documentId: string;
  userId: string | undefined;
}> = ({ documentId, userId }) => {
  const { lines } = useViewer({ documentId, userId });
  return (
    <div>
      {!lines && <p>LOADING</p>}
      {lines && <Viewer lines={lines} />}
    </div>
  );
};

export const DocumentPage: React.VFC = () => {
  const { id: documentId } = useParams<"id">();
  const auth = useAuth();

  return (
    <>
      {!documentId && <p>LOADING</p>}
      {documentId && !auth.loading && <ViewerWrapper documentId={documentId} userId={auth.user?.uid} />}
      {documentId && !auth.loading && auth.user && <EditorWrapper documentId={documentId} userId={auth.user.uid} />}
    </>
  );
};
