import { css } from "@emotion/css";
import React from "react";
import { Outlet } from "react-router-dom";

export const App: React.VFC = () => {
  return (
    <div
      className={css(
        {
          margin: "64px 64px",
          /*userSelect: "none" */
        },
      )}
    >
      <Outlet />
    </div>
  );
};
