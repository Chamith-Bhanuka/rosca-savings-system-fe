import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, type ReactNode, Suspense } from 'react';
import Loader from '../components/Loader.tsx';
import JoinGroup from '../pages/JoinGroup.tsx';
import { useAuth } from '../context/authContext.tsx';
import ModeratorGroups from '../pages/ModeratorGroups.tsx';
import MyGroups from '../pages/MyGroups.tsx';
import MyGroup from '../pages/MyGroup.tsx';
import Notifications from '../pages/Notifications.tsx';
import ManageGroup from '../pages/ManageGroup.tsx';
import Wallet from '../pages/Wallet.tsx';
import Settings from '../pages/Settings.tsx';
import Dashboard from '../pages/Dashboard.tsx';
import Leaderboard from '../pages/Leaderboard.tsx';
import Analytics from '../pages/Analytics.tsx';
import TrustProfile from '../pages/TrustProfile.tsx';
import Disputes from '../pages/Disputes.tsx';
import AdminPanel from '../pages/AdminPanel.tsx';
import Support from '../pages/Support.tsx';
import AdminNewsletter from '../components/AdminNewsletter.tsx';
import HowItWorks from '../pages/HowItWorks.tsx';
import StaticPage from '../pages/static/StaticPage.tsx';

// Lazy load pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login.tsx'));
const Register = lazy(() => import('../pages/Register.tsx'));
const TestSuspend = lazy(() => import('../pages/TestSuspend.tsx'));
const CreateGroup = lazy(() => import('../pages/CreateGroup.tsx'));

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
