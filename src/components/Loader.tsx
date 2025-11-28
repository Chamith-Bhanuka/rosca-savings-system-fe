import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store.ts';

const Loader: React.FC = () => {
  const isDark = useSelector(
    (state: RootState) => state.theme.value === 'dark'
  );

  return (
    <div
      className={`flex items-center justify-center h-screen w-full ${isDark ? 'bg-gradient-to-br from-[#1a1614] via-[#0f0e0c] to-[#1a1614]' : 'bg-gradient-to-br from-[#f5f3ee] via-[#faf9f6] to-[#f0ede5]'}`}
    >
      {/* Main Loader */}
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex flex-col gap-0.5 group">
          <div
            className={`font-['Gemunu_Libre'] text-[2.6rem] font-bold leading-none tracking-wide ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
          >
            සීට්ටුව
          </div>
          <div
            className={`font-['Inter'] uppercase tracking-[6px] text-[0.56rem] opacity-70 leading-none transition-colors ${isDark ? 'text-[#f2f0ea]' : 'text-[#1a1a1a]'}`}
          >
            Seettuwa
          </div>
        </div>

        {/* Simple spinner */}
        <div className="relative w-12 h-12">
          <div
            className={`absolute inset-0 rounded-full border-2 ${isDark ? 'border-[#d4a574]/20' : 'border-[#b8894d]/20'}`}
          ></div>
          <div
            className={`absolute inset-0 rounded-full border-2 border-transparent ${isDark ? 'border-t-[#d4a574]' : 'border-t-[#b8894d]'} animate-spin`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
