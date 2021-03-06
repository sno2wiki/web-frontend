import "./style.css";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { App } from "./App";
import { DocumentPage } from "./pages/DocumentPage";
import { RedirectPage } from "./pages/RedirectPage";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="docs">
            <Route path=":id" element={<DocumentPage />} />
          </Route>
          <Route path="redirects">
            <Route path=":context/:term" element={<RedirectPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);
