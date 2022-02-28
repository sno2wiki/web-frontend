import { css, cx } from "@emotion/css";

export const ListItem: React.VFC<{ className?: string; context: string; term: string; }> = (
  { className, context, term },
) => {
  return (
    <li className={cx(className)}>
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
    </li>
  );
};
