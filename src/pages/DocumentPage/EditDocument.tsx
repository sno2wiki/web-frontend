import { css } from "@emotion/css";
import { Editor, EditorValue } from "@sno2wiki/editor";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { calcEditDocAPIEndpoint, calcLocalRedirectPath } from "~/common/path";

export const EditDocument: React.VFC<{ slug: string; ticket: string; }> = ({ slug, ticket }) => {
  const wsRef = useRef<WebSocket | undefined>(undefined);

  const [pushVal, setPushVal] = useState<null | EditorValue>(null);
  const pushOpsTimeoutRef = useRef<NodeJS.Timer>();

  const [exVal, setExVal] = useState<EditorValue | undefined>(undefined);

  const endpoint = useMemo(() => slug && calcEditDocAPIEndpoint(slug), [slug]);

  useEffect(() => {
    if (!endpoint) {
      return;
    }

    if (wsRef.current) {
      wsRef.current.close();
    }

    const newSocket = new WebSocket(endpoint);
    newSocket.addEventListener("open", (event) => {
      newSocket.send(JSON.stringify({ type: "ENTER", ticket }));
    });
    newSocket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "PULL_VAL":
          {
            const { value, userId } = data;
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
  }, [endpoint, ticket]);

  useEffect(() => {
    if (!pushVal) {
      return;
    }
    if (pushOpsTimeoutRef.current) {
      clearTimeout(pushOpsTimeoutRef.current);
    }

    pushOpsTimeoutRef.current = setTimeout(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        return;
      }
      wsRef.current.send(JSON.stringify({ type: "PUSH_VAL", value: pushVal }));
      setPushVal(null);
    }, 250);
  }, [pushVal]);

  return (
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
        <Editor
          redirectHref={calcLocalRedirectPath}
          externalValue={exVal}
          pushValue={(value) => {
            setPushVal(value);
          }}
        />
      )}
    </div>
  );
};
