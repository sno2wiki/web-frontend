import React from "react";
import { Link } from "react-router-dom";

export const TooMany: React.VFC<
  {
    context: string | null;
    term: string;
    documents: { slug: string; }[];
  }
> = (
  { context, term, documents },
) => {
  return (
    <div>
      <p>Contextfull</p>
      <p>Conflict detected for {term} of {context}</p>
      {documents.map(({ slug }) => (
        <div key={slug}>
          <Link to={`/docs/${slug}`}>{slug}</Link>
        </div>
      ))}
    </div>
  );
};
