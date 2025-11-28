import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store.ts';
import { toggleTheme } from '../slices/themeSlice.ts';

interface LoginProps {
  onNavigate: (page: 'home' | 'login' | 'register') => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const dispatch = useDispatch();

  const isDark = useSelector(
    (state: RootState) => state.theme.value === 'dark'
  );

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden transition-colors duration-500 font-['Inter'] p-6 ${isDark ? 'bg-gradient-to-br from-[#1a1614] via-[#0f0e0c] to-[#1a1614] text-[#f2f0ea]' : 'bg-gradient-to-br from-[#f5f3ee] via-[#faf9f6] to-[#f0ede5] text-[#1a1a1a]'}`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-[#d4a574]' : 'bg-[#b8894d]'}`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-[#d4a574]' : 'bg-[#b8894d]'}`}
        ></div>
      </div>

      {/* Theme Toggle - Fixed Position */}
      <button
        onClick={() => dispatch(toggleTheme())}
        className={`fixed top-6 right-6 w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:rotate-180 z-50 ${isDark ? 'border-white/10 bg-white/5 hover:bg-[#d4a574]/15' : 'border-black/10 bg-black/5 hover:bg-[#b8894d]/15'}`}
      >
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      {/* Centered Combined Card */}
      <div className="w-full max-w-3xl relative z-20">
        <div
          className={`w-full rounded-3xl border backdrop-blur-xl shadow-2xl overflow-hidden ${isDark ? 'bg-white/[0.02] border-white/5 shadow-black/50' : 'bg-white/70 border-white/50 shadow-xl'}`}
        >
          <div className="grid lg:grid-cols-2 gap-3 lg:gap-4">
            {/* LEFT SIDE: BRANDING */}
            <div className="p-6 lg:p-8 flex flex-col justify-between">
              {/* Logo */}
              <div className="flex flex-col gap-0.5 mb-6 lg:mb-0">
                <div
                  className={`font-['Gemunu_Libre'] text-[2rem] font-bold leading-none tracking-wide transition-colors ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                >
                  සීට්ටුව
                </div>
                <div
                  className={`font-['Inter'] uppercase tracking-[5px] text-[0.4rem] opacity-70 leading-none ${isDark ? 'text-[#f2f0ea]' : 'text-[#1a1a1a]'}`}
                >
                  Seettuwa
                </div>
              </div>

              {/* Center Content */}
              <div className="mb-6 lg:mb-0 relative">
                {/* Decorative element */}
                <div
                  className={`absolute -left-3 top-0 w-1 h-16 rounded-full ${isDark ? 'bg-gradient-to-b from-[#d4a574] to-transparent' : 'bg-gradient-to-b from-[#b8894d] to-transparent'} opacity-50`}
                ></div>

                <h2 className="font-['Playfair_Display'] text-2xl lg:text-3xl mb-3 leading-tight">
                  Welcome back to your{' '}
                  <span
                    className={`${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                  >
                    Circle.
                  </span>
                </h2>
                <p
                  className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Continue your journey of trusted savings. Your community is
                  waiting for your contribution.
                </p>
              </div>

              {/* Footer */}
              <div
                className={`text-[10px] uppercase tracking-widest opacity-40 hidden lg:block`}
              >
                © 2025 Chamith Bhanuka
              </div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="p-6 lg:p-8">
              <div className="mb-7">
                <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-1">
                  Log In
                </h1>
                <p
                  className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  Enter your credentials to access your account.
                </p>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full px-3 py-2.5 rounded-lg border outline-none text-sm transition-all focus:scale-[1.01] ${isDark ? 'bg-white/[0.02] border-white/10 focus:border-[#d4a574] text-white placeholder-gray-600' : 'bg-black/[0.02] border-black/10 focus:border-[#b8894d] text-black placeholder-gray-400'}`}
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      Password
                    </label>
                    <button
                      type="button"
                      className={`text-xs hover:underline transition-all ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`w-full px-3 py-2.5 rounded-lg border outline-none text-sm transition-all pr-10 focus:scale-[1.01] ${isDark ? 'bg-white/[0.02] border-white/10 focus:border-[#d4a574] text-white placeholder-gray-600' : 'bg-black/[0.02] border-black/10 focus:border-[#b8894d] text-black placeholder-gray-400'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity ${isDark ? 'text-white' : 'text-black'}`}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all mt-2 bg-gradient-to-r flex items-center justify-center gap-2 ${isDark ? 'from-[#d4a574] to-[#a3784e] shadow-[#d4a574]/30' : 'from-[#b8894d] to-[#8f6a3b] shadow-[#b8894d]/30'}`}
                >
                  Sign In <ArrowRight size={18} />
                </button>

                {/* Footer */}
                <div className="mt-6 text-center text-sm">
                  <span
                    className={`opacity-60 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Don't have an account?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('register')}
                    className={`font-medium hover:underline ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Footer */}
          <div
            className={`lg:hidden text-center pb-6 text-xs uppercase tracking-widest opacity-40`}
          >
            © 2025 Chamith Bhanuka
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
