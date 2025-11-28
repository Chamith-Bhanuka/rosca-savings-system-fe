import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loader from '../components/Loader.tsx';

// Lazy load pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login.tsx'));
const Register = lazy(() => import('../pages/Register.tsx'));
const TestSuspend = lazy(() => import('../pages/TestSuspend.tsx'));

const LoginWrapper = () => {
  const navigate = useNavigate();
  return <Login onNavigate={(page) => navigate(`/${page}`)} />;
};

const RegisterWrapper = () => {
  const navigate = useNavigate();
  return <Register onNavigate={(page) => navigate(`/${page}`)} />;
};

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/home" element={<Home />} />

          <Route path="/login" element={<LoginWrapper />} />

          <Route path="/register" element={<RegisterWrapper />} />

          <Route path="/test" element={<TestSuspend />} />

          <Route path="/" element={<div>Hello, from router..!</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
