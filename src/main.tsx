import "./style.css";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { App } from "./App";
import { ContextfulRedirectPage } from "./pages/ContextfulRedirectPage";
import { ContextlessRedirectPage } from "./pages/ContextlessRedirectPage";
import { DocPage } from "./pages/DocPage";
import { DocumentPage } from "./pages/DocumentPage";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="d">
            <Route path=":id" element={<DocPage />} />
          </Route>
          <Route path="docs">
            <Route path=":id" element={<DocumentPage />} />
          </Route>
          <Route path="redirects">
            <Route path="_">
              <Route path=":term" element={<ContextlessRedirectPage />} />
            </Route>
            <Route path=":context">
              <Route path=":term" element={<ContextfulRedirectPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);
