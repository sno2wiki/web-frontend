import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import fetch from "unfetch";

import { calcLocalDocPath, calcRedirectAPIEndpoint } from "~/common/path";

import { None } from "./None";
import { TooMany } from "./TooMany";

export const Loading: React.VFC = () => {
  return <div>Loading</div>;
};

export const PathResolved: React.VFC<{
  context: string | null;
  term: string;
}> = ({ context, term }) => {
  const [result, setResult] = useState<
    | { loaded: false; }
    | { loaded: true; status: "bad"; }
    | { loaded: true; status: "ok"; documents: { "slug": string; }[]; }
  >({ loaded: false });
  const endpoint = useMemo(() => calcRedirectAPIEndpoint(context, term), [context, term]);

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
      console.dir(await json());

      setResult({ loaded: true, status: "ok", documents });
    })();
  }, [endpoint]);

  if (!result.loaded) return <></>;
  else if (result.status === "bad") return <>?</>;
  else if (result.documents.length === 1) {
    return <Navigate to={calcLocalDocPath(result.documents[0].slug)} replace={true} />;
  } else if (result.documents.length === 0) {
    return <None context={context} term={term} />;
  } else {
    return <TooMany context={context} term={term} documents={result.documents} />;
  }
};

export const RedirectPage: React.VFC = () => {
  const { context, term } = useParams<"context" | "term">();

  if (!context || !term) return <Loading />;

  if (context === "") {
    return <PathResolved context={null} term={term} />;
  } else {
    return <PathResolved context={context} term={term} />;
  }
};
