import ky from "ky";
import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import { calcEndpointFindRedirects, calcLocalDocPath } from "~/common/path";

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
  const endpoint = useMemo(() => calcEndpointFindRedirects(context, term), [context, term]);

  useEffect(() => {
    if (!endpoint) return;
    (async () => {
      const headers = { "Cache-Control": "no-store" };
      const { documents } = await ky.get(endpoint, { headers }).json<{ documents: { slug: string; }[]; }>();
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
