import { css, cx } from "@emotion/css";
import React from "react";

import { useAuthToken } from "~/hooks/useAuth";

export const Login: React.VFC<{ className?: string; }> = ({ className }) => {
  const [, setToken] = useAuthToken();

  return (
    <button
      className={cx(
        className,
        css({
          maxWidth: "960px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
        }),
      )}
      onClick={() => setToken("01FTD78WNZ2NGCWNTPN59YDKEM")}
    >
      Login
    </button>
  );
};

import { SearchBox } from "./SearchBox";
export const GlobalNav: React.VFC<{ className?: string; }> = () => {
  return (
    <nav
      className={cx(
        css({ padding: "16px 0", backgroundColor: "var(--nav-bg-color)" }),
      )}
    >
      <div
        className={css({
          maxWidth: "960px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        })}
      >
        <div className={css({ marginRight: "12px" })}>
          <Login />
        </div>
        <div className={css({ flexGrow: "1" })}>
          <SearchBox />
        </div>
      </div>
    </nav>
  );
};
