import React from 'react';
import { Moon, Sun, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store.ts';
import { toggleTheme } from '../slices/themeSlice.ts';
import { toggleMenu } from '../slices/menuSlice.ts';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.value);

  const isDark = theme === 'dark';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 h-[72px] flex justify-between items-center px-[5%] z-50 backdrop-blur-xl border-b transition-all duration-500 ${isDark ? 'border-white/10 bg-[#0f0806]/80' : 'border-black/10 bg-[#faf8f5]/80'}`}
    >
      <a href="#" className="flex flex-col gap-0.5 group">
        <div
          className={`font-['Gemunu_Libre'] text-[2.6rem] font-bold leading-none tracking-wide ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
        >
          සීට්ටුව
        </div>
        <div
          className={`font-['Inter'] uppercase tracking-[6px] text-[0.57rem] opacity-70 leading-none transition-colors ${isDark ? 'text-[#f2f0ea]' : 'text-[#1a1a1a]'}`}
        >
          Seettuwa
        </div>
      </a>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-6">
          <a
            href="#"
            className={`flex items-center text-sm font-medium relative group px-2 py-2 ${isDark ? 'text-gray-400 hover:text-[#d4a574]' : 'text-gray-500 hover:text-[#b8894d]'}`}
          >
            Dashboard
            <span
              className={`absolute -bottom-[2px] left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${isDark ? 'bg-[#d4a574]' : 'bg-[#b8894d]'}`}
            ></span>
          </a>
          <a
            href="#"
            className={`px-6 py-2.5 rounded-full border text-[0.85rem] transition-all ${isDark ? 'border-white/10 bg-white/5 text-[#f2f0ea] hover:bg-[#d4a574]/15 hover:border-[#d4a574]' : 'border-black/10 bg-black/5 text-[#1a1a1a] hover:bg-[#b8894d]/15 hover:border-[#b8894d]'}`}
          >
            Log In
          </a>
        </div>

        <button
          onClick={() => dispatch(toggleTheme())}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:rotate-180 ${isDark ? 'border-white/10 bg-white/5 text-[#f2f0ea] hover:bg-[#d4a574]/15' : 'border-black/10 bg-black/5 text-[#1a1a1a] hover:bg-[#b8894d]/15'}`}
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <button
          onClick={() => dispatch(toggleMenu())}
          className={`flex items-center gap-2 text-sm border-none bg-transparent cursor-pointer ${isDark ? 'text-[#f2f0ea]' : 'text-[#1a1a1a]'}`}
        >
          <span className="hidden sm:inline">Menu</span>
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
