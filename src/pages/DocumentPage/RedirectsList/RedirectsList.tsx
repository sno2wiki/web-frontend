import { css } from "@emotion/css";
import ky from "ky";
import { useCallback } from "react";
import useSWR from "swr";

import { calcEndpointAddRedirect, calcEndpointDocRedirects } from "~/common/path";

import { AddRedirect } from "./AddRedirect";
import { ListItem } from "./RedirectItem";

export const RedirectsList: React.VFC<{ slug: string | undefined; }> = ({ slug }) => {
  const { data, mutate } = useSWR<{ redirects: { context: string; term: string; }[]; }>(
    () => slug && calcEndpointDocRedirects(slug),
  );

  const add = useCallback(async (context: string, term: string) => {
    if (!slug) return;

    await ky.put(calcEndpointAddRedirect(slug, context, term)).json();
    await mutate();
  }, [mutate, slug]);

  return (
    <div
      className={css({
        width: "100%",
        maxWidth: "960px",
        padding: "24px 32px",
        backgroundColor: "var(--redirects-sect-bg-color)",
        boxShadow: "var(--redirects-sect-box-shadow)",
      })}
    >
      <p
        className={css({
          color: "var(--redirects-sect-text-color)",
          fontFamily: "var(--base-font-family)",
          fontSize: "16px",
          fontStyle: "italic",
        })}
      >
        Redirects
      </p>
      {data && (
        <ul className={css({ marginTop: "8px" })}>
          {data.redirects.map((redirect, i) => (
            <ListItem
              key={i}
              className={css({ marginTop: "8px" })}
              context={redirect.context}
              term={redirect.term}
            />
          ))}
        </ul>
      )}
      {slug && <AddRedirect className={css({ marginTop: "8px" })} addRedirect={add} />}
    </div>
  );
};
