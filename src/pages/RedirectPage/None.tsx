import React from "react";

export const None: React.VFC<{ context: string | null; term: string; }> = (
  { context, term },
) => {
  return (
    <div>
      <p>Contextfull</p>
      <p>There is no document for {term} of {context}</p>
    </div>
  );
};
