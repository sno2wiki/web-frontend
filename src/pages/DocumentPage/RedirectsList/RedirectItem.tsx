import { css, cx } from "@emotion/css";
import isURLString from "is-url";
import { useMemo } from "react";
import { HiExternalLink } from "react-icons/hi";

export const ListItem: React.VFC<{ className?: string; context: string; term: string; }> = (
  { className, context, term },
) => {
  const isURL = useMemo(() => context.toLowerCase() === "url" && isURLString(term), [context, term]);

  return (
    <li
      className={cx(
        className,
        css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }),
      )}
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
        <span className={css({ fontWeight: "bold" })}>{context}</span>
        {"=>"}
        <span className={css({ fontWeight: "bold" })}>{term}</span>
        {"]"}
      </span>
      <div
        className={css({
          marginLeft: "4px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        })}
      >
        {isURL && (
          <a
            className={css({
              display: "inline-flex",
              color: "hsl(var(--theme-hue-2), 95%, 60%)",
              fontSize: "1rem",
            })}
            href={term}
            target="_blank"
            rel="noreferrer"
          >
            <HiExternalLink />
          </a>
        )}
      </div>
    </li>
  );
};
