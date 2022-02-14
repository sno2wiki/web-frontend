import { Line } from "@sno2wiki/viewer";
import { useCallback, useMemo, useState } from "react";

import { calcViewDocumentEndpoint } from "~/common/endpoint";
import { useWebSocket } from "~/hooks/useWebSocket";

export const useViewer = ({ documentId }: { documentId: string; }): {
  lines: Line[] | undefined;
} => {
  const [lines, setLines] = useState<Line[] | undefined>(undefined);
  const pullDocument = useCallback(
    (nextLines: Line[], head: string) => {
      setLines(nextLines);
    },
    [],
  );

  const endpoint = useMemo(() => calcViewDocumentEndpoint(documentId), [documentId]);
  const [ws] = useWebSocket(endpoint, {
    onOpen(event, ws) {
      // ws.send(JSON.stringify({ type: "JOIN", userId }));
    },
    onMessage(event) {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "PULL_DOCUMENT":
          pullDocument(data.lines, data.head);
          break;
      }
    },
  });

  return { lines };
};
