import { lazy, Suspense } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router";
import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { paths } from "./paths";
import { SiteLayout } from "./SiteLayout";

const MemberRegistrationPage = lazy(() => import("@/features/members/pages/MemberRegistrationPage"));
const MemberCardPage = lazy(() => import("@/features/members/pages/MemberCardPage"));
const SalePage = lazy(() => import("@/features/pos/pages/SalePage"));
const OwnerDashboardPage = lazy(() => import("@/features/owner/pages/OwnerDashboardPage"));

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p role="status">Cargando página…</p>}>
        <Routes>
          <Route element={<SiteLayout area="members" />}>
            <Route index element={<Navigate to={paths.registration} replace />} />
            <Route path={paths.registration} element={<MemberRegistrationPage />} />
            <Route path={paths.memberCard} element={<MemberCardPage />} />
            <Route path="*" element={<>
              <AreaIntroduction title="Página no encontrada" description="Esta dirección no corresponde a una página de THE SIP." />
              <Link to={paths.registration}>Ir al registro de miembros</Link>
            </>} />
          </Route>
          <Route element={<SiteLayout area="pos" />}>
            <Route path={paths.sale} element={<SalePage />} />
          </Route>
          <Route element={<SiteLayout area="owner" />}>
            <Route path={paths.owner} element={<OwnerDashboardPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
