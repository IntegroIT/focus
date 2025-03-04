import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App.tsx";
import "./App.css";
import "./index.css";

const queryClient = new QueryClient();
try {
  const tg = window?.Telegram?.WebApp;
  tg && tg.requestFullscreen();
  tg.addToHomeScreen();
} catch {}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
