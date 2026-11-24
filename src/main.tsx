import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRoutes } from "@/app/routes";
import { MemberProfileProvider } from "@/features/members/MemberProfileProvider";
import "@/shared/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemberProfileProvider><AppRoutes /></MemberProfileProvider>
  </StrictMode>,
);
