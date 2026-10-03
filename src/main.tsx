import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { NavigationProvider } from "./app/Navigation";
import { CatalogProvider } from "./features/catalog/CatalogProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <NavigationProvider>
        <CatalogProvider>
          <App />
        </CatalogProvider>
      </NavigationProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
