import { CommitUnion, Line } from "@sno2wiki/editor";
import { useCallback, useEffect, useMemo, useState } from "react";

import { calcEditDocumentEndpoint } from "~/common/endpoint";
import { useWebSocket } from "~/hooks/useWebSocket";

import { usePushCommitsToServer } from "./usePushCommitsToServer";

export const useEditor = ({ documentId, userId }: { documentId: string; userId: string; }): {
  lines: Line[] | undefined;
  pushCommits(newCommits: CommitUnion[]): void;
  pushed: boolean;
} => {
  const [lines, setLines] = useState<Line[] | undefined>();
  const [commits, setCommits] = useState<CommitUnion[]>([]);
  const pullDocument = useCallback(
    (nextLines: Line[], head: string) => {
      setLines(nextLines);
      setCommits((previous) => {
        const index = previous.findIndex((commit) => commit.id === head);
        return previous.slice(index + 1);
      });
    },
    [],
  );

  const endpoint = useMemo(() => calcEditDocumentEndpoint(documentId), [documentId]);
  const [ws] = useWebSocket(endpoint, {
    onOpen(event, ws) {
      ws.send(JSON.stringify({
        type: "JOIN",
        userId,
      }));
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
  const { pushCommitsToServer, pushed } = usePushCommitsToServer(ws, lines);

  const pushCommits = useCallback(
    (newCommits: CommitUnion[]) => {
      setCommits((previous) => [...previous, ...newCommits]);
    },
    [],
  );

  useEffect(() => {
    pushCommitsToServer(commits);
    return () => pushCommitsToServer(commits);
  }, [commits, pushCommitsToServer]);

  return { lines, pushCommits, pushed };
};
