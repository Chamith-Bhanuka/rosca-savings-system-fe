import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login.tsx'));

const LoginWrapper = () => {
  const navigate = useNavigate();
  return <Login onNavigate={(page) => navigate(`/${page}`)} />;
};

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/home" element={<Home />} />

          <Route path="/login" element={<LoginWrapper />} />

          <Route path="/" element={<div>Hello, from router..!</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
