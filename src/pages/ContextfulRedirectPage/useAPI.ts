import { useEffect, useMemo, useState } from "react";
import fetch from "unfetch";

export const calcEndpoint = (context: string, term: string) => {
  const url = new URL(`/redirects/${context}/${term}`, import.meta.env.VITE_HTTP_ENDPOINT);
  return url.toString();
};

export const useAPI = (context: string, term: string) => {
  const [result, setResult] = useState<
    | { loaded: false; }
    | { loaded: true; status: "bad"; }
    | { loaded: true; status: "ok"; documents: { "id": string; }[]; }
  >({ loaded: false });
  const endpoint = useMemo(() => calcEndpoint(context, term), [context, term]);

  useEffect(() => {
    if (!endpoint) return;
    (async () => {
      const headers = { "Cache-Control": "no-store" };
      const { ok, json } = await fetch(endpoint, { headers });
      if (!ok) {
        setResult({ loaded: true, status: "bad" });
        return;
      }

      const { documents } = await json();

      setResult({ loaded: true, status: "ok", documents });
    })();
  }, [endpoint]);

  return result;
};
