import { CommitUnion, Line } from "@sno2wiki/editor";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PUSH_COMMITS_TIMEOUT = 250;

export const usePushCommitsToServer = (ws: WebSocket | undefined, lines: Line[] | undefined): {
  pushCommitsToServer(commits: CommitUnion[]): void;
  pushed: boolean;
} => {
  const [buffer, setBuffer] = useState<CommitUnion[]>([]);
  const commitTimeoutRef = useRef<NodeJS.Timer>();

  const pushed = useMemo(() => buffer.length !== 0, [buffer.length]);

  const sendCommits = useCallback((commits: CommitUnion[]) => {
    setBuffer(commits);
  }, []);

  useEffect(() => {
    if (!lines || buffer.length === 0) return;
    if (commitTimeoutRef.current) clearTimeout(commitTimeoutRef.current);

    commitTimeoutRef.current = setTimeout(() => {
      if (ws) {
        ws.send(JSON.stringify({ type: "PUSH_COMMITS", lines, commits: buffer }));
        setBuffer([]);
      }
    }, PUSH_COMMITS_TIMEOUT);
  }, [buffer, lines, ws]);

  return { pushCommitsToServer: sendCommits, pushed };
};
