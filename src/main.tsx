import { AuthProvider } from "./features/auth/AuthProvider";
import { PreferencesProvider } from "./features/interests/PreferencesProvider";
import { LocaleProvider } from "./i18n/LocaleProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { NavigationProvider } from "./app/Navigation";
import { CatalogProvider } from "./features/catalog/CatalogProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocaleProvider>
      <ThemeProvider>
        <NavigationProvider>
          <AuthProvider>
            <PreferencesProvider>
              <CatalogProvider>
                <App />
              </CatalogProvider>
            </PreferencesProvider>
          </AuthProvider>
        </NavigationProvider>
      </ThemeProvider>
    </LocaleProvider>
  </React.StrictMode>,
);
