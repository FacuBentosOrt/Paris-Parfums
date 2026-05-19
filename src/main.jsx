import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PerfumeStoreProvider } from "./context/PerfumeStore";
import "./styles/global.css";
import "./styles/app.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PerfumeStoreProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PerfumeStoreProvider>
  </React.StrictMode>
);
