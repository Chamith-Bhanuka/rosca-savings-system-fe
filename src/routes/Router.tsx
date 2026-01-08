import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Loader from '../components/Loader.tsx';
import { useAuth } from '../context/authContext.tsx';
import Layout from '../components/Layout';

// Lazy load pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login.tsx'));
const Register = lazy(() => import('../pages/Register.tsx'));
const TestSuspend = lazy(() => import('../pages/TestSuspend.tsx'));
const CreateGroup = lazy(() => import('../pages/CreateGroup.tsx'));
const JoinGroup = lazy(() => import('../pages/JoinGroup.tsx'));
const ModeratorGroups = lazy(() => import('../pages/ModeratorGroups.tsx'));
const MyGroups = lazy(() => import('../pages/MyGroups.tsx'));
const MyGroup = lazy(() => import('../pages/MyGroup.tsx'));
const Notifications = lazy(() => import('../pages/Notifications.tsx'));
const ManageGroup = lazy(() => import('../pages/ManageGroup.tsx'));
const Wallet = lazy(() => import('../pages/Wallet.tsx'));
const Settings = lazy(() => import('../pages/Settings.tsx'));
const Dashboard = lazy(() => import('../pages/Dashboard.tsx'));
const Leaderboard = lazy(() => import('../pages/Leaderboard.tsx'));
const Analytics = lazy(() => import('../pages/Analytics.tsx'));
const TrustProfile = lazy(() => import('../pages/TrustProfile.tsx'));
const Disputes = lazy(() => import('../pages/Disputes.tsx'));
const AdminPanel = lazy(() => import('../pages/AdminPanel.tsx'));
const Support = lazy(() => import('../pages/Support.tsx'));
const AdminNewsletter = lazy(() => import('../components/AdminNewsletter.tsx'));
const HowItWorks = lazy(() => import('../pages/HowItWorks.tsx'));
const StaticPage = lazy(() => import('../pages/static/StaticPage.tsx'));

const ProtectedRoute = ({ children, roles }: any) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.some((role: any) => user.role?.includes(role))) {
    console.log(user.role);
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-[#1a1614] via-[#0f0e0c] to-[#1a1614]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#d4a574]/10">
            <svg
              className="w-8 h-8 text-[#d4a574]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-[#f2f0ea]">Access Denied</h2>
            <p className="text-base text-[#f2f0ea]/70">
              You do not have permission to view this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/home" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/test" element={<TestSuspend />} />

          <Route
            path="/groups/create"
            element={
              <ProtectedRoute>
                <CreateGroup />
              </ProtectedRoute>
            }
          />

          <Route path="/groups/join" element={<JoinGroup />} />

          <Route path="/groups/" element={<ModeratorGroups />} />

          <Route path="/contributions" element={<MyGroups />} />

          <Route path="/groups/manage/:groupId" element={<ManageGroup />} />

          <Route path="/groups/my/:groupId" element={<MyGroup />} />

          <Route path="/wallet" element={<Wallet />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          <Route path="/trust" element={<TrustProfile />} />

          <Route path="/disputes" element={<Disputes />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="/help" element={<Support />} />

          <Route path="/admin/newsletter" element={<AdminNewsletter />} />

          <Route path="/howItWorks" element={<HowItWorks />} />

          <Route
            path="/about"
            element={
              <StaticPage title="About Us">
                <p>
                  Seettuwa is a fintech startup dedicated to digitizing the
                  ROSCA model...
                </p>
                <h3>Our Mission</h3>
                <p>
                  To provide accessible, community-driven finance to everyone.
                </p>
              </StaticPage>
            }
          />

          <Route
            path="/security"
            element={
              <StaticPage title="Security">
                <p>
                  Your security is our priority. We use Stripe for payments and
                  256-bit encryption...
                </p>
                <ul>
                  <li>Payments are held in escrow.</li>
                  <li>Identity verification.</li>
                </ul>
              </StaticPage>
            }
          />

          <Route
            path="/fees"
            element={
              <StaticPage title="Platform Fees">
                <p>
                  We charge a flat <b>1% service fee</b> on the Pot amount to
                  cover server costs and payment gateway charges.
                </p>
              </StaticPage>
            }
          />

          <Route
            path="/terms"
            element={
              <StaticPage title="Terms of Use" lastUpdated="Jan 01, 2026">
                <p>By using Seettuwa, you agree to the following terms...</p>
              </StaticPage>
            }
          />

          <Route
            path="/privacy"
            element={
              <StaticPage title="Privacy Policy" lastUpdated="Jan 01, 2026">
                <p>
                  We do not sell your data. Here is how we use your
                  information...
                </p>
              </StaticPage>
            }
          />

          <Route
            path="/cookies"
            element={
              <StaticPage title="Cookie Policy" lastUpdated="Jan 01, 2026">
                <p>
                  We do not sell your data. Here is how we use your
                  information...
                </p>
              </StaticPage>
            }
          />

          <Route
            path="/compliance"
            element={
              <StaticPage title="Compliance">
                <p>
                  Seettuwa complies with local financial regulations regarding
                  Chit Funds...
                </p>
              </StaticPage>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
