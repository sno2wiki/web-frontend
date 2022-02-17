import { Editor } from "@sno2wiki/editor";
import { Viewer } from "@sno2wiki/viewer";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import fetch from "unfetch";

import { getGetDocHttpEndpoint } from "~/common/endpoint";
import { generateCommitId, generateLineId } from "~/common/id";
import { useAuthToken } from "~/hooks/useAuth";
import { useEditor } from "~/hooks/useEditor";
import { useViewer } from "~/hooks/useViewer";

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

export const ViewerWrapper: React.VFC<{ documentId: string; }> = ({ documentId }) => {
  const { lines } = useViewer({ documentId });
  return (
    <div>
      {!lines && <p>LOADING</p>}
      {lines && <Viewer lines={lines} />}
    </div>
  );
};

export const useDocument = (
  documentId: string | undefined,
) => {
  const [token] = useAuthToken();
  const [result, setResult] = useState<
    | { loaded: false; }
    | { loaded: true; status: "bad"; }
    | { loaded: true; status: "ok"; data: { documentId: string; ticket: null; }; }
    | { loaded: true; status: "ok"; data: { documentId: string; ticket: string; }; }
  >({ loaded: false });
  const endpoint = useMemo(() => documentId && getGetDocHttpEndpoint(documentId), [documentId]);

  useEffect(() => {
    if (!endpoint) return;

    (async () => {
      const headers = {
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      };
      const { ok, json } = await fetch(endpoint, { headers });
      if (!ok) setResult({ loaded: true, status: "bad" });

      const { documentId, ticket } = await json();
      setResult({ loaded: true, status: "ok", data: { documentId, ticket } });
    })();
  }, [endpoint, token]);

  console.dir(result);

  return result;
};

export const DocumentPage: React.VFC = () => {
  const { id: documentId } = useParams<"id">();
  const document = useDocument(documentId);

  return (
    <>
      {!document.loaded && <p>LOADING</p>}
      {document.loaded && (
        <>
          {document.status === "bad" && (
            <>
              <p>Document cannot view</p>
            </>
          )}
          {document.status === "ok" && (
            <>
              {document.data.ticket === null && (
                <ViewerWrapper
                  documentId={document.data.documentId}
                />
              )}
              {document.data.ticket !== null && (
                <EditorWrapper
                  documentId={document.data.documentId}
                  ticket={document.data.ticket}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
