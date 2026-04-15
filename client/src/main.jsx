import { StrictMode } from "react";
import { dark } from '@clerk/themes'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext.jsx";

import { useTheme } from "./context/ThemeContext.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

import ApiConfig from "./components/ApiConfig.jsx";

function ClerkAppWrapper() {
  const { theme } = useTheme();
  
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        variables: {
          colorPrimary: '#10b981',
        }
      }}
    >
      <ApiConfig>
        <App />
      </ApiConfig>
    </ClerkProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ClerkAppWrapper />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);


