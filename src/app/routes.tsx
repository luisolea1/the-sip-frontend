import { lazy } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router";
import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { paths } from "./paths";
import { SiteLayout } from "./SiteLayout";
import { StaffLayout } from "./StaffLayout";
import MemberRegistrationPage from "@/features/members/pages/MemberRegistrationPage";
import MemberCardLayout from "@/features/members/components/MemberCardLayout";

const StaffSession = lazy(() => import("@/features/pos/StaffSession").then(module => ({ default: module.StaffSession })));
const MemberCardPage = lazy(() => import("@/features/members/pages/MemberCardPage"));
const MemberCardDesignPage = lazy(() => import("@/features/members/pages/MemberCardDesignPage"));
const SalePage = lazy(() => import("@/features/pos/pages/SalePage"));
const PosMembersPage = lazy(() => import("@/features/pos/pages/PosMembersPage"));
const ShiftPage = lazy(() => import("@/features/pos/pages/ShiftPage"));
const AdminDashboardPage = lazy(() => import("@/features/admin/pages/AdminDashboardPage"));

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Navigate to={paths.registration} replace />} />
          <Route path={paths.registration} element={<MemberRegistrationPage />} />
          <Route path="*" element={<>
            <AreaIntroduction title="Página no encontrada" description="Esta dirección no corresponde a una página de THE SIP." />
            <Link to={paths.registration}>Ir al registro de miembros</Link>
          </>} />
        </Route>
        <Route element={<MemberCardLayout />}>
          <Route path={paths.memberCard} element={<MemberCardPage />} />
          <Route path={paths.memberCardDesigns} element={<MemberCardDesignPage />} />
        </Route>
        <Route element={<StaffLayout />}>
          <Route element={<StaffSession />}>
            <Route path={paths.sale} element={<SalePage />} />
            <Route path={paths.posMembers} element={<PosMembersPage />} />
            <Route path={paths.shift} element={<ShiftPage />} />
            <Route path={paths.admin} element={<AdminDashboardPage />} />
          </Route>
        </Route>
        <Route path="/dueno" element={<Navigate to={paths.admin} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
