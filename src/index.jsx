/* global document */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./zip-manager/ZipManager.jsx";

const root = ReactDOM.createRoot(document.body);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);