import React from "react";
import { HashRouter, Route } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/styles/bootstrap.min.css";
import "./assets/scss/now-ui-kit.css";
import "./assets/styles/custom.css";
// styles from Notus template
import "./assets/styles/tailwind.css";
import "./assets/styles/docs.css";

//
import RoutePage from "./RoutePage";

// // custom
import ReactDOM from "react-dom/client";

import { Navigate, Routes } from "react-router";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HashRouter>
    <Routes>
      <Route path="/:id" element={<RoutePage />} />
      <Route path="*" element={<Navigate to="index" />} />
    </Routes>
  </HashRouter>
);
