import { css } from "@emotion/css";
import { EditorValue, Viewer } from "@sno2wiki/editor";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { calcEndpointViewDoc, calcLocalRedirectPath } from "~/common/path";

export const ViewDocument: React.VFC<{ slug: string; }> = ({ slug }) => {
  const wsRef = useRef<WebSocket | undefined>(undefined);

  const [exVal, setExVal] = useState<EditorValue | undefined>(undefined);

  const endpoint = useMemo(() => slug && calcEndpointViewDoc(slug), [slug]);

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
    <div
      className={css({
        display: "flex",
        justifyContent: "center",
      })}
    >
      <div
        className={css({
          width: "100%",
          maxWidth: "960px",
          padding: "24px 32px",
          backgroundColor: "var(--editor-bg-color)",
          boxShadow: "var(--editor-box-shadow)",
        })}
      >
        {!exVal && <p>LOADING</p>}
        {exVal && (
          <Viewer
            redirectHref={calcLocalRedirectPath}
            externalValue={exVal}
          />
        )}
      </div>
    </div>
  );
};
