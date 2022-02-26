import { EditorValue, Viewer } from "@sno2wiki/editor";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { calcLocalRedirectPath, calcViewDocAPIEndpoint } from "~/common/path";

export const ViewDocument: React.VFC<{}> = ({}) => {
  const { id: documentId } = useParams<"id">();

  const wsRef = useRef<WebSocket | undefined>(undefined);

  const [exVal, setExVal] = useState<EditorValue | undefined>(undefined);

  const endpoint = useMemo(() => documentId && calcViewDocAPIEndpoint(documentId), [documentId]);

  useEffect(() => {
    if (!endpoint) return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const newSocket = new WebSocket(endpoint);
    newSocket.addEventListener("open", (event) => {
      newSocket.send(JSON.stringify({ type: "ENTER" }));
    });
    newSocket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "PULL_VAL":
          {
            const { value } = data;
            setExVal(value);
          }
          break;
        case "FORCE_EXIT":
          {
            newSocket.close();
          }
          break;
      }
    });
    wsRef.current = newSocket;

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [endpoint]);

  return (
    <>
      {!exVal && <p>LOADING</p>}
      {exVal && (
        <Viewer
          redirectHref={calcLocalRedirectPath}
          externalValue={exVal}
        />
      )}
    </>
  );
};
