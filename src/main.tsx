import React from "react";
import ReactDOM from "react-dom/client";
import App, { RescanApp } from "./App";
import "./index.css";

const root = document.getElementById("root")!;
const params = new URLSearchParams(window.location.search);
const rescanTarget = params.get("target");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {rescanTarget ? <RescanApp target={rescanTarget} /> : <App />}
  </React.StrictMode>
);
