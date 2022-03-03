import { css, cx } from "@emotion/css";
import ky from "ky";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "react-use";

import { calcEndpointSearch, calcLocalRedirectPath } from "~/common/path";

export const SearchResult: React.VFC<
  {
    className?: string;
    result: {
      term: null | { context: string; term: string; conflicted: boolean; }[];
    };
  }
> = ({ className, result }) => {
  return (
    <div
      className={cx(
        className,
        css({
          userSelect: "none",
          backgroundColor: "hsla(var(--theme-hue-1), 25%, 50%, 0.75)",
          backdropFilter: "blur(2px)",
        }),
      )}
    >
      {!result.term && (
        <div
          className={css({})}
        >
          <p>No result for term matching</p>
        </div>
      )}
      {result.term && (
        <div>
          {result.term.map(({ context, term, conflicted }, i) => (
            <div
              key={i}
              className={css({
                ":hover": {
                  backgroundColor: "hsla(var(--theme-hue-1), 25%, 37.5%, 0.75)",
                },
              })}
            >
              <Link
                to={calcLocalRedirectPath(context, term)}
                className={css({ display: "block", padding: "8px 8px" })}
              >
                <span
                  className={css({
                    color: "var(--redirects-sect-text-color)",
                    fontFamily: "var(--base-font-family)",
                    fontSize: "14px",
                  })}
                >
                  {"["}
                  <span className={css({ fontWeight: "bold" })}>{context}</span>
                  {"=>"}
                  <span className={css({ fontWeight: "bold" })}>{term}</span>
                  {"]"}
                </span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const SearchBox: React.VFC<{ className?: string; }> = ({ className }) => {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<
    | undefined
    | {
      term: null | { context: string; term: string; conflicted: boolean; }[];
    }
  >(
    undefined,
  );

  useDebounce(
    async () => {
      if (query === "") return;

      const result = await ky
        .get(calcEndpointSearch(query))
        .json<{ query: string; term: null | { context: string; term: string; conflicted: boolean; }[]; }>();
      setResult({ term: result.term });
    },
    250,
    [query],
  );

  return (
    <div
      className={cx(
        className,
        css({ position: "relative" }),
      )}
    >
      <input
        className={cx(
          css({
            width: "100%",
            padding: "8px 12px",
            fontFamily: "var(--base-font-family)",
            fontSize: "0.875rem",
            backgroundColor: "var(--nav-searchbox-bg-color)",
            color: "var(--nav-searchbox-text-color)",
          }),
        )}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      >
      </input>
      {query !== "" && result && (
        <SearchResult
          className={css({
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            "zIndex": 1,
          })}
          result={result}
        />
      )}
    </div>
  );
};
