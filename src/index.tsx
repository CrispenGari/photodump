import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import ReduxProvider from "./providers/ReduxProvider";
import RouterProvider from "./providers/RouterProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ReduxProvider>
      <RouterProvider>
        <App />
      </RouterProvider>
    </ReduxProvider>
  </React.StrictMode>
);
