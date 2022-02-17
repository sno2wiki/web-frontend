import { useEffect, useMemo, useState } from "react";
import fetch from "unfetch";

import { getGetDocHttpEndpoint } from "~/common/endpoint";
import { useAuthToken } from "~/hooks/useAuth";

export const useDocument = (documentId: string | undefined) => {
  const [token] = useAuthToken();
  const [result, setResult] = useState<
    | { loaded: false; }
    | { loaded: true; status: "bad"; }
    | { loaded: true; status: "ok"; data: { documentId: string; ticket: null; }; }
    | { loaded: true; status: "ok"; data: { documentId: string; ticket: string; }; }
  >({ loaded: false });
  const endpoint = useMemo(() => documentId && getGetDocHttpEndpoint(documentId), [documentId]);

  useEffect(() => {
    if (!endpoint) {
      return;
    }

    (async () => {
      const headers = {
        "Cache-Control": "no-store",
        ...(token
          ? { "Authorization": `Bearer ${token}` }
          : {}),
      };
      const { ok, json } = await fetch(endpoint, { headers });
      if (!ok) {
        setResult({ loaded: true, status: "bad" });
      }

      const { documentId, ticket } = await json();
      setResult({ loaded: true, status: "ok", data: { documentId, ticket } });
    })();
  }, [endpoint, token]);

  return result;
};
