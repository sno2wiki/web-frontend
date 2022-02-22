import React from "react";
import { Navigate, useParams } from "react-router-dom";

import { useAPI } from "./useAPI";

export const ZeroDoc: React.VFC<{ context: string; term: string; }> = (
  { context, term },
) => {
  return (
    <div>
      <p>Contextfull</p>
      <p>There is no document for {term} of {context}</p>
    </div>
  );
};

export const TooManyDoc: React.VFC<{ context: string; term: string; documents: { id: string; }[]; }> = (
  { context, term, documents },
) => {
  return (
    <div>
      <p>Contextfull</p>
      <p>
        <span>{context}</span>
        <span>{term}</span>
      </p>
    </div>
  );
};

export const Loading: React.VFC = () => {
  return <div>Loading</div>;
};

export const PathResolved: React.VFC<{ context: string; term: string; }> = ({ context, term }) => {
  const result = useAPI(context, term);

  if (!result.loaded) return <></>;
  else if (result.status === "bad") return <>?</>;
  else if (result.documents.length === 0) return <ZeroDoc context={context} term={term} />;
  else if (result.documents.length === 1) return <Navigate to={`/docs/${result.documents[0].id}`} replace={true} />;
  else return <TooManyDoc context={context} term={term} documents={result.documents} />;
};

export const ContextfulRedirectPage: React.VFC = () => {
  const { context, term } = useParams<"context" | "term">();

  if (!context || !term) return <Loading />;
  else return <PathResolved context={context} term={term} />;
};
