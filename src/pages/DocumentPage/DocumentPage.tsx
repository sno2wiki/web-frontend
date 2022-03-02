import { css } from "@emotion/css";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import fetch from "unfetch";

import { calcEnterDocAPIEndpoint } from "~/common/path";
import { useAuthToken } from "~/hooks/useAuth";

import { EditDocument } from "./EditDocument";
import { RedirectsList } from "./RedirectsList";
import { ViewDocument } from "./ViewDocument";

export const DC: React.VFC<{ slug: string; }> = ({ slug }) => {
  const endpoint = useMemo(() => calcEnterDocAPIEndpoint(slug), [slug]);
  const [authToken] = useAuthToken();

  const [ticket, setTicket] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (!endpoint) return;

    (async () => {
      const { ok, json } = await fetch(endpoint, {
        headers: {
          "Cache-Control": "no-store",
          ...(authToken && { "Authorization": `Bearer ${authToken}` }),
        },
      });
      if (!ok) {
        console.log("?");
      }
      const { ticket } = await json();
      setTicket(ticket);
    })();
  }, [endpoint, authToken]);

  return (
    <>
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
        <div
          className={css({
            marginTop: "12px",
          })}
        >
          {ticket === undefined && <>loading</>}
          {ticket === null && <ViewDocument slug={slug} />}
          {!!ticket && <EditDocument ticket={ticket} slug={slug} />}
        </div>
      </div>
    </>
  );
};

export const DocumentPage: React.VFC = () => {
  const { id: slug } = useParams<"id">();

  if (!slug) return <p>LOADING</p>;
  return <DC slug={slug} />;
};
