import { Line } from "@sno2wiki/viewer";
import { useEffect, useMemo, useRef, useState } from "react";

import { calcViewDocumentEndpoint } from "~/common/endpoint";

export const useViewer = (
  { userId, documentId }: { documentId: string; userId: string | undefined; },
): {
  lines: Line[] | undefined;
} => {
  const wsRef = useRef<WebSocket | undefined>(undefined);
  const [lines, setLines] = useState<Line[] | undefined>(undefined);

  const endpoint = useMemo(() => calcViewDocumentEndpoint(documentId), [documentId]);
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    const newSocket = new WebSocket(endpoint);
    newSocket.addEventListener("open", (event) => {
      newSocket.send(JSON.stringify({
        type: "JOIN",
        userId: userId || null,
      }));
    });
    newSocket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "PULL_DOCUMENT":
          setLines(data.lines);
          break;
      }
    });
    wsRef.current = newSocket;

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [endpoint, userId]);

  return { lines };
};
