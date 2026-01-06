import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import type { RootState } from '../store/store';
import Navbar from './NavBar';
import MegaMenu from './MegaMenu';
import Footer from './Footer';

const Layout: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <Navbar />
      <MegaMenu />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
