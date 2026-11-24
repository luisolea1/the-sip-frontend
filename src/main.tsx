import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/shared/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main><h1>THE SIP</h1></main>
  </StrictMode>,
);
