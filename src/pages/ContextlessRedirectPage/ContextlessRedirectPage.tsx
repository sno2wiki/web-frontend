import React from "react";
import { useParams } from "react-router-dom";

export const ContextlessRedirectPage: React.VFC = () => {
  const { term } = useParams<"term">();

  return (
    <div>
      <p>Contextless</p>
      <p>
        <span>
          {term}
        </span>
      </p>
    </div>
  );
};
