import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Check if the browser supports service workers
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((err) =>
        console.error("Service Worker Registration Failed:", err)
      );
  });
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
