import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, type ReactNode, Suspense } from 'react';
import Loader from '../components/Loader.tsx';
import JoinGroup from '../pages/JoinGroup.tsx';
import { useAuth } from '../context/authContext.tsx';

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

          <Route path="/" element={<div>Hello, from router..!</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
