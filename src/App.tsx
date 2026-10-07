import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp, roleHomePath } from '@/context/AppContext';
import { Spinner } from '@/components/ui/Feedback';
import { BeneficiaryLayout } from '@/layouts/BeneficiaryLayout';
import { InstitutionLayout } from '@/layouts/InstitutionLayout';
import { RegulatorLayout } from '@/layouts/RegulatorLayout';
import { ExecutiveLayout } from '@/layouts/ExecutiveLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import type { Role } from '@/types';

const LandingPage = lazy(() => import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const DiscoveryWizard = lazy(() => import('@/pages/DiscoveryWizard').then((m) => ({ default: m.DiscoveryWizard })));
const SearchingPage = lazy(() => import('@/pages/SearchingPage').then((m) => ({ default: m.SearchingPage })));
const MatchResultsPage = lazy(() => import('@/pages/MatchResultsPage').then((m) => ({ default: m.MatchResultsPage })));
const MatchDetailsPage = lazy(() => import('@/pages/MatchDetailsPage').then((m) => ({ default: m.MatchDetailsPage })));
const NewClaimPage = lazy(() => import('@/pages/NewClaimPage').then((m) => ({ default: m.NewClaimPage })));
const ClaimTrackingPage = lazy(() => import('@/pages/ClaimTrackingPage').then((m) => ({ default: m.ClaimTrackingPage })));
const ClaimsListPage = lazy(() => import('@/pages/ClaimsListPage').then((m) => ({ default: m.ClaimsListPage })));
const BeneficiaryDashboard = lazy(() => import('@/pages/BeneficiaryDashboard').then((m) => ({ default: m.BeneficiaryDashboard })));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const SupportPage = lazy(() => import('@/pages/SupportPage').then((m) => ({ default: m.SupportPage })));
const InstitutionDashboard = lazy(() => import('@/pages/institution/InstitutionDashboard').then((m) => ({ default: m.InstitutionDashboard })));
const InstitutionMatchQueue = lazy(() => import('@/pages/institution/InstitutionMatchQueue').then((m) => ({ default: m.InstitutionMatchQueue })));
const InstitutionClaimsQueue = lazy(() => import('@/pages/institution/InstitutionClaimsQueue').then((m) => ({ default: m.InstitutionClaimsQueue })));
const InstitutionProfilePage = lazy(() => import('@/pages/institution/InstitutionProfilePage').then((m) => ({ default: m.InstitutionProfilePage })));
const RiskPanel = lazy(() => import('@/pages/institution/RiskPanel').then((m) => ({ default: m.RiskPanel })));
const AuditLogPage = lazy(() => import('@/pages/institution/AuditLogPage').then((m) => ({ default: m.AuditLogPage })));
const RegulatorDashboard = lazy(() => import('@/pages/RegulatorDashboard').then((m) => ({ default: m.RegulatorDashboard })));
const ExecutiveDashboard = lazy(() => import('@/pages/ExecutiveDashboard').then((m) => ({ default: m.ExecutiveDashboard })));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );
}

// Brief overlay shown while switching demo roles (~350ms).
function WorkspaceTransition() {
  const { switching } = useApp();
  return (
    <AnimatePresence>
      {switching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-slate-500">Switching workspace…</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Redirects to the active role's home if the route belongs to another role,
// so a role switch always lands on the correct experience even with a stale URL.
function RoleGate({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { role } = useApp();
  if (!allow.includes(role)) {
    return <Navigate to={roleHomePath(role)} replace />;
  }
  return <>{children}</>;
}

const guarded = (allow: Role[], element: ReactNode) => (
  <RoleGate allow={allow}>{element}</RoleGate>
);

function RoleRedirect() {
  const { role } = useApp();
  return <Navigate to={roleHomePath(role)} replace />;
}

// Helper to get layout component based on role
function getLayoutComponent(role: Role) {
  switch (role) {
    case 'beneficiary':
      return BeneficiaryLayout;
    case 'institution':
      return InstitutionLayout;
    case 'regulator':
      return RegulatorLayout;
    case 'executive':
      return ExecutiveLayout;
    case 'admin':
      return AdminLayout;
    default:
      return BeneficiaryLayout;
  }
}

function AppRoutes() {
  const { role } = useApp();
  const Layout = getLayoutComponent(role);
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isDiscovery = location.pathname === '/app/discovery';
  const isSearching = location.pathname === '/app/searching';

  const isStandalone = isLanding || isDiscovery || isSearching;
  const isLogin = location.pathname === '/login';

  if (isStandalone || isLogin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/app/discovery" element={<DiscoveryWizard />} />
          <Route path="/app/searching" element={<SearchingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      {/* key={role} forces the layout and all page content to remount on role
          switch, so no previous role's state or UI survives. */}
      <Layout key={role}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/app" element={<RoleRedirect />} />
            <Route path="/app/dashboard" element={guarded(['beneficiary'], <BeneficiaryDashboard />)} />
            <Route path="/app/matches" element={guarded(['beneficiary'], <MatchResultsPage />)} />
            <Route path="/app/matches/:id" element={guarded(['beneficiary'], <MatchDetailsPage />)} />
            <Route path="/app/claims" element={guarded(['beneficiary'], <ClaimsListPage />)} />
            <Route path="/app/claims/:id" element={guarded(['beneficiary'], <ClaimTrackingPage />)} />
            <Route path="/app/claims/new" element={guarded(['beneficiary'], <NewClaimPage />)} />
            <Route path="/app/notifications" element={<NotificationsPage />} />
            <Route path="/app/profile" element={guarded(['beneficiary'], <ProfilePage />)} />
            <Route path="/app/settings" element={<SettingsPage />} />
            <Route path="/app/support" element={guarded(['beneficiary'], <SupportPage />)} />
            <Route path="/app/institution" element={guarded(['institution'], <InstitutionDashboard />)} />
            <Route path="/app/institution/matches" element={guarded(['institution'], <InstitutionMatchQueue />)} />
            <Route path="/app/institution/claims" element={guarded(['institution'], <InstitutionClaimsQueue />)} />
            <Route path="/app/institution/profile" element={guarded(['institution'], <InstitutionProfilePage />)} />
            <Route path="/app/institution/risk" element={guarded(['institution'], <RiskPanel />)} />
            <Route path="/app/institution/audit" element={guarded(['institution'], <AuditLogPage />)} />
            <Route path="/app/regulator" element={guarded(['regulator'], <RegulatorDashboard />)} />
            <Route path="/app/regulator/institutions" element={guarded(['regulator'], <RegulatorDashboard />)} />
            <Route path="/app/executive" element={guarded(['executive'], <ExecutiveDashboard />)} />
            <Route path="/app/executive/institutions" element={guarded(['executive'], <ExecutiveDashboard />)} />
            <Route path="/app/admin" element={guarded(['admin'], <AdminDashboard />)} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </Suspense>
      </Layout>
      <WorkspaceTransition />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
