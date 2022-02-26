import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import fetch from "unfetch";

import { calcEnterDocAPIEndpoint } from "~/common/path";
import { useAuthToken } from "~/hooks/useAuth";

import { EditDocument } from "./EditDocument";
import { ViewDocument } from "./ViewDocument";

export const DocumentPage: React.VFC = () => {
  const { id: documentId } = useParams<"id">();

  const endpoint = useMemo(() => documentId && calcEnterDocAPIEndpoint(documentId), [documentId]);
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
