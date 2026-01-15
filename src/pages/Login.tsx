import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, ArrowRight, Moon, Sun, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store.ts';
import { toggleTheme } from '../slices/themeSlice.ts';
import toast from 'react-hot-toast';
import { getMyDetails, login } from '../services/auth.service.ts';
import { useAuth } from '../context/authContext.tsx';
import { useNavigate } from 'react-router-dom';
import type { ApiError } from '../services/api.ts';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const isDark = useSelector(
    (state: RootState) => state.theme.value === 'dark'
  );

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = 'Login | Seettuwa';
  }, []);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password);
      localStorage.setItem('accessToken', res.accessToken);

      const me = await getMyDetails();
      const userData = me.data;
      console.log(userData);

      setUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: Array.isArray(userData.role) ? userData.role : [userData.role],
        id: userData._id,
        avatarUrl: userData.avatarUrl,
        phone: userData.phone,
      });

      toast.success('Successfully logged in!');
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (error: unknown) {
      setIsLoading(false);
      const err = error as ApiError;
      toast.error(err.message || 'Something went wrong');
      console.error(error);
    }
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign-in logic here
    console.log('Google sign-in clicked');
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
                {/* Sign in with Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className={`w-full py-3 rounded-lg border flex items-center justify-center gap-3 transition-all hover:scale-[1.01] ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-black/10 text-black hover:bg-black/5'}`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Sign in with Google
                  </span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-1">
                  <div
                    className={`flex-grow border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}
                  ></div>
                  <span
                    className={`flex-shrink-0 mx-4 text-[10px] uppercase tracking-widest opacity-50 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Or continue with
                  </span>
                  <div
                    className={`flex-grow border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}
                  ></div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full px-3 py-2.5 rounded-lg border outline-none text-sm transition-all focus:scale-[1.01] ${isDark ? 'bg-white/[0.02] border-white/10 focus:border-[#d4a574] text-white placeholder-gray-600' : 'bg-black/[0.02] border-black/10 focus:border-[#b8894d] text-black placeholder-gray-400'}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all bg-gradient-to-r flex items-center justify-center gap-2 ${
                    isDark
                      ? 'from-[#d4a574] to-[#a3784e] shadow-[#d4a574]/30'
                      : 'from-[#b8894d] to-[#8f6a3b] shadow-[#b8894d]/30'
                  } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                >
                  {/*Sign In <ArrowRight size={18} />*/}
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      signing in...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight size={18} />
                    </>
                  )}
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
                    onClick={() => navigate('/register')}
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
