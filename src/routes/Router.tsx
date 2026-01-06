import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, type ReactNode, Suspense } from 'react';

import Loader from '../components/Loader.tsx';
import { useAuth } from '../context/authContext.tsx';

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

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
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

          <Route path="/notifications" element={<Notifications />} />

          <Route path="/groups/manage/:groupId" element={<ManageGroup />} />

          <Route path="/groups/my/:groupId" element={<MyGroup />} />

          <Route path="/wallet" element={<Wallet />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/leaderboard" element={<Leaderboard />} />

          <Route path="/analytics" element={<Analytics />} />

          <Route path="/trust" element={<TrustProfile />} />

          <Route path="/disputes" element={<Disputes />} />

          <Route path="/admin" element={<AdminPanel />} />

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

          <Route path="/" element={<div>Hello, from router..!</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
