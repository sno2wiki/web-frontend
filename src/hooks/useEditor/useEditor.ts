import { CommitUnion, Line } from "@sno2wiki/editor";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getEditDocWSEndpoint } from "~/common/endpoint";
const PUSH_COMMITS_TIMEOUT = 250;

export const useEditor = ({ documentId, ticket }: { documentId: string; ticket: string; }): {
  lines: Line[] | undefined;
  pushCommits(newCommits: CommitUnion[]): void;
  pushed: boolean;
} => {
  const endpoint = useMemo(() => getEditDocWSEndpoint(documentId), [documentId]);

  const wsRef = useRef<WebSocket | undefined>(undefined);
  const commitTimeoutRef = useRef<NodeJS.Timer>();

  const [lines, setLines] = useState<Line[] | undefined>();
  const [head, setHead] = useState<string | undefined>();
  const [commits, setCommits] = useState<CommitUnion[]>([]);
  const [pushed, setPushed] = useState<boolean>(true);

  useEffect(() => {
    if (wsRef.current) wsRef.current.close();

    const newSocket = new WebSocket(endpoint);
    newSocket.addEventListener("open", (event) => {
      newSocket.send(JSON.stringify({ type: "JOIN", ticket }));
    });
    newSocket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "PULL_DOCUMENT":
          setLines(() => data.lines);
          break;
      }
    });
    wsRef.current = newSocket;

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) wsRef.current.close();
    };
  }, [endpoint, ticket]);

  const buffer = useMemo(() => {
    if (!head) return commits;

    const index = commits.findIndex((commit) => commit.id === head);

    if (index === -1) return [];
    else return commits.slice(index + 1);
  }, [head, commits]);

  useEffect(() => {
    if (buffer.length === 0) return;
    if (commitTimeoutRef.current) clearTimeout(commitTimeoutRef.current);

    setPushed(false);
    commitTimeoutRef.current = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "PUSH_COMMITS", ticket, lines, commits: buffer }));

        setHead(() => buffer[buffer.length - 1].id);
        setPushed(true);
      }
    }, PUSH_COMMITS_TIMEOUT);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [buffer]);

  const pushCommits = useCallback(
    (newCommits: CommitUnion[]) => {
      setCommits((previous) => [...previous, ...newCommits]);
    },
    [],
  );

  return { lines, pushCommits, pushed };
};
