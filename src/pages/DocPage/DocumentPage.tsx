import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import fetch from "unfetch";

import { useAuthToken } from "~/hooks/useAuth";

import { EditDocument } from "./EditDocument";
import { ViewDocument } from "./ViewDocument";

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

export const DocumentPage: React.VFC = () => {
  const { id: documentId } = useParams<"id">();

  const endpoint = useMemo(() => documentId && getGetDocHttpEndpoint(documentId), [documentId]);
  const [authToken] = useAuthToken();

  const [ticket, setTicket] = useState<string | null | undefined>(undefined);

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
      setTicket(ticket);
    })();
  }, [endpoint, authToken]);

  return (
    <>
      {ticket === undefined && <>loading</>}
      {ticket === null && <ViewDocument />}
      {!!ticket && <EditDocument ticket={ticket} />}
    </>
  );
};
