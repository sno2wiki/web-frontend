import { css } from "@emotion/css";
import useSWR from "swr";

export const calcGetDocRedirectsAPIEndpoint = (slug: string) => {
  const url = new URL(
    `/docs/${slug}/redirects`,
    import.meta.env.VITE_HTTP_ENDPOINT,
  );
  return url.toString();
};

export const RedirectsList: React.VFC<{ slug: string | undefined; }> = ({ slug }) => {
  const { data } = useSWR<{ redirects: { context: string; term: string; }[]; }>(
    () => slug && calcGetDocRedirectsAPIEndpoint(slug),
  );

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
        <ul
          className={css({
            marginTop: "8px",
          })}
        >
          {data.redirects.map((redirect, i) => (
            <li
              key={i}
              className={css({
                marginTop: "8px",
              })}
            >
              <span
                className={css({
                  color: "var(--redirects-sect-text-color)",
                  fontFamily: "var(--base-font-family)",
                  fontSize: "14px",
                  userSelect: "all",
                })}
              >
                {"["}
                <span className={css({ fontWeight: "bold" })}>
                  {redirect.context}
                </span>
                {"=>"}
                <span className={css({ fontWeight: "bold" })}>
                  {redirect.term}
                </span>
                {"]"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
