import { lazy, Suspense } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router";
import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { paths } from "./paths";
import { SiteLayout } from "./SiteLayout";
import { StaffLayout } from "./StaffLayout";
import MemberRegistrationPage from "@/features/members/pages/MemberRegistrationPage";
import MemberCardLayout from "@/features/members/components/MemberCardLayout";
import { ContentSkeleton } from "@/shared/components/ContentSkeleton";

const StaffSession = lazy(() => import("@/features/pos/StaffSession").then(module => ({ default: module.StaffSession })));
const MemberCardPage = lazy(() => import("@/features/members/pages/MemberCardPage"));
const MemberCardDesignPage = lazy(() => import("@/features/members/pages/MemberCardDesignPage"));
const SalePage = lazy(() => import("@/features/pos/pages/SalePage"));
const PosMembersPage = lazy(() => import("@/features/pos/pages/PosMembersPage"));
const ShiftPage = lazy(() => import("@/features/pos/pages/ShiftPage"));
const AdminDashboardPage = lazy(() => import("@/features/admin/pages/AdminDashboardPage"));
const AdminWorkspace = lazy(() => import("@/features/admin/AdminWorkspace"));
const MenuPage = lazy(() => import("@/features/admin/pages/MenuPage"));
const MenuEditorPage = lazy(() => import("@/features/admin/pages/MenuEditorPage"));
const InventoryPage = lazy(() => import("@/features/admin/pages/InventoryPage"));
const AlertsPage = lazy(() => import("@/features/admin/pages/AlertsPage"));
const TeamPage = lazy(() => import("@/features/admin/pages/TeamPage"));

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
        <Route element={<Suspense fallback={<div className="p-5"><strong className="text-primary">THE SIP</strong><ContentSkeleton label="Cargando área del personal" /></div>}><StaffSession /></Suspense>}>
          <Route element={<StaffLayout />}>
            <Route path={paths.sale} element={<SalePage />} />
            <Route path={paths.posMembers} element={<PosMembersPage />} />
            <Route path={paths.shift} element={<ShiftPage />} />
            <Route path={paths.admin} element={<AdminWorkspace />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="menu/:itemId" element={<MenuEditorPage />} />
              <Route path="existencias" element={<InventoryPage />} />
              <Route path="avisos" element={<AlertsPage />} />
              <Route path="cajeros" element={<TeamPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="/dueno" element={<Navigate to={paths.admin} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
