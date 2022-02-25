import { Descendant, Editor2 } from "@sno2wiki/editor";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import fetch from "unfetch";

import { useAuthToken } from "~/hooks/useAuth";

export const getViewDocWSEndpoint = (id: string): string => {
  const url = new URL(`/docs/${id}/view`, import.meta.env.VITE_WS_ENDPOINT);
  return url.toString();
};

export const getEditDocWSEndpoint = (id: string): string => {
  const url = new URL(`/docs/${id}/edit`, import.meta.env.VITE_WS_ENDPOINT);
  return url.toString();
};

export const getGetDocHttpEndpoint = (documentId: string) => {
  const url = new URL(`/docs/${documentId}/enter`, import.meta.env.VITE_HTTP_ENDPOINT);
  return url.toString();
};

export const EditDocument: React.VFC<{ ticket: string; }> = ({ ticket }) => {
  const { id: documentId } = useParams<"id">();

  const wsRef = useRef<WebSocket | undefined>(undefined);

  const [pushVal, setPushVal] = useState<null | Descendant[]>(null);
  const pushOpsTimeoutRef = useRef<NodeJS.Timer>();

  const [externalValue, setPullVal] = useState<Descendant[] | undefined>(undefined);

  const endpoint = useMemo(() => documentId && getEditDocWSEndpoint(documentId), [documentId]);

  useEffect(() => {
    if (!endpoint) return;

    if (wsRef.current) wsRef.current.close();

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
            setPullVal(value);
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
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) wsRef.current.close();
    };
  }, [endpoint, ticket]);

  useEffect(() => {
    if (!pushVal) return;
    if (pushOpsTimeoutRef.current) clearTimeout(pushOpsTimeoutRef.current);

    pushOpsTimeoutRef.current = setTimeout(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      wsRef.current.send(JSON.stringify({ type: "PUSH_VAL", value: pushVal }));
      setPushVal(null);
    }, 250);
  }, [pushVal]);

  return (
    <>
      {!externalValue && <p>LOADING</p>}
      {externalValue && (
        <Editor2
          redirectHref={(context, term) => context ? `/redirects/${context}/${term}` : `/redirects/_/${term}`}
          externalValue={externalValue}
          pushValue={(value) => {
            setPushVal(value);
          }}
        />
      )}
    </>
  );
};

export const DocumentPage: React.VFC = () => {
  const { id: documentId } = useParams<"id">();

  const endpoint = useMemo(() => documentId && getGetDocHttpEndpoint(documentId), [documentId]);
  const [authToken] = useAuthToken();

  const [ticket, setTicket] = useState(undefined);

  useEffect(() => {
    if (!endpoint) return;

    (async () => {
      const { ok, json } = await fetch(endpoint, {
        headers: {
          "Cache-Control": "no-store",
          ...(authToken && { "Authorization": `Bearer ${authToken}` }),
        },
      });
      if (!ok) {
        console.log("?");
      }
      const { ticket } = await json();
      if (ticket) setTicket(ticket);
    })();
  }, [endpoint, authToken]);

  return (
    <>
      {ticket && <EditDocument ticket={ticket} />}
    </>
  );
};
