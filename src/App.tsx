import { css } from "@emotion/css";
import ky from "ky";
import React from "react";
import { Outlet } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";

import { GlobalNav } from "~/components/GlobalNav";

export const App: React.VFC = () => {
  return (
    <RecoilRoot>
      <SWRConfig value={{ fetcher: (res, init) => ky.get(res, init).then((res) => res.json()) }}>
        <div>
          <GlobalNav />
          <div className={css({ margin: "32px 64px" })}>
            <Outlet />
          </div>
        </div>
      </SWRConfig>
    </RecoilRoot>
  );
};
