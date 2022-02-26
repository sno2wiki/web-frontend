import React from "react";
import { Link } from "react-router-dom";

export const TooMany: React.VFC<
  {
    context: string | null;
    term: string;
    documents: { id: string; }[];
  }
> = (
  { context, term, documents },
) => {
  return (
    <div>
      <p>Contextfull</p>
      <p>Conflict detected for {term} of {context}</p>
      {documents.map(({ id }) => (
        <div key={id}>
          <Link to={`/docs/${id}`}>{id}</Link>
        </div>
      ))}
    </div>
  );
};
