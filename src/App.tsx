import { css } from "@emotion/css";
import React from "react";
import { Outlet } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";
import unfetch from "unfetch";

import { useAuthToken } from "./hooks/useAuth";

export const Login: React.VFC = () => {
  const [, setToken] = useAuthToken();

  return <button onClick={() => setToken("01FTD78WNZ2NGCWNTPN59YDKEM")}>Login</button>;
};

export const App: React.VFC = () => {
  return (
    <RecoilRoot>
      <SWRConfig value={{ fetcher: (res, init) => unfetch(res, init).then((res) => res.json()) }}>
        <div>
          <nav
            className={css({
              padding: "16px 0",
              backgroundColor: "var(--nav-bg-color)",
            })}
          >
            <div className={css({ maxWidth: "960px", margin: "0 auto" })}>
              <Login />
            </div>
          </nav>
          <div className={css({ margin: "32px 64px" })}>
            <Outlet />
          </div>
        </div>
      </SWRConfig>
    </RecoilRoot>
  );
};
