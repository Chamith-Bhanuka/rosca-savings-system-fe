import { BrowserRouter, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';

const Home = lazy(() => import('../pages/Home'));

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
          <Route path="/" element={<div>Hello, from router..!</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
