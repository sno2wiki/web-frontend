import { css } from "@emotion/css";
import React from "react";
import { Outlet } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";

import { atomUser } from "./hooks/useAuth/useAuth";

export const Login: React.VFC = () => {
  const setUser = useSetRecoilState(atomUser);

  return <button onClick={() => setUser({ uid: "01FTD78WNZ2NGCWNTPN59YDKEM" })}>Login</button>;
};

export const App: React.VFC = () => {
  return (
    <RecoilRoot>
      <div
        className={css(
          {
            margin: "64px 64px",
            /*userSelect: "none" */
          },
        )}
      >
        <nav>
          <Login />
        </nav>
        <Outlet />
      </div>
    </RecoilRoot>
  );
};
