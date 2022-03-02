import { css, cx } from "@emotion/css";
import ky from "ky";
import React, { useEffect, useMemo, useState } from "react";
import { useDebounce } from "react-use";

import { calcRedirectAPIEndpoint } from "~/common/path";

export const AddRedirect: React.VFC<{ className?: string; addRedirect(context: string, term: string): void; }> = (
  { className, addRedirect },
) => {
  const [value, setValue] = useState<string>("");

  const splited = useMemo(() => {
    const result = /^\[(.+)=>(.+)\]$/.exec(value);
    if (!result) return;
    const [, context, term] = result;
    return { context, term };
  }, [value]);

  const [conflicted, setConflicted] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!splited) return;
    setConflicted(undefined);
  }, [splited]);

  useDebounce(
    async () => {
      if (!splited) return;

      const { documents } = await ky
        .get(calcRedirectAPIEndpoint(splited.context, splited.term))
        .json<{ documents: []; }>();

      if (1 <= documents.length) setConflicted(true);
      else setConflicted(false);
    },
    250,
    [splited],
  );

  const [width, setWidth] = useState(0);

  return (
    <div
      className={cx(className, css({ display: "flex", flexDirection: "row", alignItems: "center" }))}
    >
      <div className={css({ position: "relative" })}>
        <div
          className={cx(
            css({
              position: "absolute",
              visibility: "hidden",
              whiteSpace: "nowrap",
              fontSize: "14px",
              fontFamily: "var(--base-font-family)",
            }),
          )}
          ref={(e) => {
            if (e) setWidth(e.offsetWidth);
          }}
        >
          {value === "" ? "[context=>term]" : value}
        </div>
        <input
          type="text"
          className={cx(
            css({
              padding: "4px 0",
              fontSize: "14px",
              fontFamily: "var(--base-font-family)",
              backgroundColor: "hsla(var(--theme-hue-1), 20%, 35%, 0.75)",
              color: "var(--redirects-sect-text-color)",
            }),
          )}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ ...(width && { width }) }}
          placeholder="[context=>term]"
        >
        </input>
      </div>
      {value !== "" && (
        <div className={css({ marginLeft: "8px" })}>
          {!splited && (
            <span
              className={css({
                padding: "2px 4px",
                borderRadius: "4px",
                fontFamily: "var(--base-font-family)",
                fontSize: "12px",
                backgroundColor: "hsla(-8, 95%, 50%, 0.5)",
                color: "hsla(-8, 25%, 95%, 0.75)",
              })}
            >
              Invalid
            </span>
          )}
          {splited && (
            <div className={css({ display: "flex", flexDirection: "row", alignItems: "cetner" })}>
              {conflicted === undefined
                && (
                  <span
                    className={css({
                      padding: "2px 4px",
                      borderRadius: "4px",
                      fontFamily: "var(--base-font-family)",
                      fontSize: "12px",
                      lineHeight: "1em",
                      backgroundColor: "hsla(185, 95%, 50%, 0.5)",
                      color: "hsla(185, 25%, 95%, 0.75)",
                    })}
                  >
                    Checking
                  </span>
                )}
              {conflicted === true && (
                <span
                  className={css({
                    padding: "2px 4px",
                    borderRadius: "4px",
                    fontFamily: "var(--base-font-family)",
                    fontSize: "12px",
                    lineHeight: "1em",
                    backgroundColor: "hsla(55, 95%, 50%, 0.5)",
                    color: "hsla(55, 25%, 95%, 0.75)",
                  })}
                >
                  Conflicted
                </span>
              )}
              {conflicted === false && (
                <span
                  className={css({
                    padding: "2px 4px",
                    borderRadius: "4px",
                    fontFamily: "var(--base-font-family)",
                    fontSize: "12px",
                    lineHeight: "1em",
                    backgroundColor: "hsla(155, 95%, 50%, 0.5)",
                    color: "hsla(155, 25%, 95%, 0.75)",
                  })}
                >
                  No Problem
                </span>
              )}
              {conflicted !== undefined && (
                <AddButton
                  className={css({ marginLeft: "8px" })}
                  onClick={() => {
                    addRedirect(splited.context, splited.term);
                    setValue("");
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AddButton: React.VFC<{ className?: string; onClick(): void; }> = (
  { className, onClick },
) => {
  return (
    <button
      className={cx(
        className,
        css({
          cursor: "pointer",
          display: "block",
          padding: "2px 8px",
          borderRadius: "4px",
          fontFamily: "var(--base-font-family)",
          fontSize: "12px",
          lineHeight: "1em",
          backgroundColor: "hsla(155, 95%, 50%, 0.5)",
          color: "hsla(155, 25%, 95%, 0.75)",
        }),
      )}
      onClick={() => onClick()}
    >
      GO!
    </button>
  );
};
