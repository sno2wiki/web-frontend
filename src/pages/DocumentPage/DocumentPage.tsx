import { css } from "@emotion/css";
import ky from "ky";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { calcEndpointDocEnter } from "~/common/path";
import { useAuthToken } from "~/hooks/useAuth";

import { EditDocument } from "./EditDocument";
import { RedirectsList } from "./RedirectsList";
import { ViewDocument } from "./ViewDocument";

export const DC: React.VFC<{ slug: string; }> = ({ slug }) => {
  const [authToken] = useAuthToken();

  const [ticket, setTicket] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const { ticket } = await ky
        .get(
          calcEndpointDocEnter(slug),
          { headers: { "Cache-Control": "no-store", ...(authToken && { "Authorization": `Bearer ${authToken}` }) } },
        )
        .json<{ ticket: string | undefined; }>();
      setTicket(ticket);
    })();
  }, [authToken, slug]);

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "960px",
        padding: "24px 32px",
      })}
    >
      <RedirectsList slug={slug} />
      <div className={css({ marginTop: "12px" })}>
        {ticket === undefined && <>loading</>}
        {ticket === null && <ViewDocument slug={slug} />}
        {!!ticket && <EditDocument ticket={ticket} slug={slug} />}
      </div>
    </div>
  );
};

export const DocumentPage: React.VFC = () => {
  const { id: slug } = useParams<"id">();

  if (!slug) return <p>LOADING</p>;
  return <DC slug={slug} />;
};
