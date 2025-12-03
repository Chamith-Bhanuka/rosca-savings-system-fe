import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Moon, Sun, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store.ts';
import { toggleTheme } from '../slices/themeSlice.ts';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service.ts';
import toast from 'react-hot-toast';

interface RegisterProps {
  onNavigate: (page: 'home' | 'login' | 'register') => void;
}

const calculatePasswordStrength = (password: string): number => {
  if (password.length === 0) return 0;
  let strength = 0;
  // Length check (0-2 points)
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  // Has lowercase and uppercase
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  // Has special characters
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return Math.min(4, strength);
};

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const isDark = useSelector(
    (state: RootState) => state.theme.value === 'dark'
  );

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = 'Register | Seettuwa';
  }, []);

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const getStrengthColor = (index: number) => {
    if (index >= passwordStrength) {
      return isDark ? 'bg-white/10' : 'bg-black/10';
    }

    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return isDark ? 'bg-[#d4a574]' : 'bg-[#b8894d]';

    return isDark ? 'bg-white/10' : 'bg-black/10';
  };

  const getStrengthText = () => {
    if (password.length === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    if (passwordStrength === 4) return 'Strong';
    return '';
  };

  // only letters
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  // email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    // if (passwordStrength < 2) {
    //   alert('Please use a stronger password');
    //   return;
    // }

    if (!firstName.trim()) {
      toast.error('Please enter your first name');
      return;
    }

    if (!nameRegex.test(firstName)) {
      toast.error('First name can contain letters only');
      return;
    }

    if (!lastName.trim()) {
      toast.error('Please enter your last name');
      return;
    }

    if (!nameRegex.test(lastName)) {
      toast.error('Last name can contain letters only');
      return;
    }

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
      await register(firstName, lastName, email, password);
      toast.success('Register Successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message || 'Something went wrong');
      console.error(error);
    }
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
      <div className="w-full max-w-4xl relative z-20">
        <div
          className={`w-full rounded-3xl border backdrop-blur-xl shadow-2xl overflow-hidden ${isDark ? 'bg-white/[0.02] border-white/5 shadow-black/50' : 'bg-white/70 border-white/50 shadow-xl'}`}
        >
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            {/* LEFT SIDE: BRANDING */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              {/* Logo */}
              <div className="flex flex-col gap-0.5 mb-8 lg:mb-0">
                <div
                  className={`font-['Gemunu_Libre'] text-[2.6rem] font-bold leading-none tracking-wide transition-colors ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                >
                  සීට්ටුව
                </div>
                <div
                  className={`font-['Inter'] uppercase tracking-[6px] text-[0.57rem] opacity-70 leading-none ${isDark ? 'text-[#f2f0ea]' : 'text-[#1a1a1a]'}`}
                >
                  Seettuwa
                </div>
              </div>

              {/* Center Content */}
              <div className="mb-8 lg:mb-0 relative">
                {/* Decorative element */}
                <div
                  className={`absolute -left-4 top-0 w-1 h-24 rounded-full ${isDark ? 'bg-gradient-to-b from-[#d4a574] to-transparent' : 'bg-gradient-to-b from-[#b8894d] to-transparent'} opacity-50`}
                ></div>

                <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl mb-5 leading-tight">
                  Join the new era of{' '}
                  <span
                    className={`${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                  >
                    Trust.
                  </span>
                </h2>
                <p
                  className={`text-base lg:text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Create an account to start your own group, or join an existing
                  circle of trust.
                </p>
              </div>

              {/* Footer */}
              <div
                className={`text-xs uppercase tracking-widest opacity-40 hidden lg:block`}
              >
                © 2025 Chamith Bhanuka
              </div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="p-8 lg:p-10">
              <div className="mb-7">
                <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-1">
                  Create Account
                </h1>
                <p
                  className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  Start your journey with Seettuwa today.
                </p>
              </div>

              <div className="space-y-4">
                {/* Google Sign In */}
                <button
                  type="button"
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
                    Sign up with Google
                  </span>
                </button>

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

                {/* Name Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Ishara"
                      className={`w-full px-3 py-2.5 rounded-lg border outline-none text-sm transition-all focus:scale-[1.01] ${isDark ? 'bg-white/[0.02] border-white/10 focus:border-[#d4a574] text-white placeholder-gray-600' : 'bg-black/[0.02] border-black/10 focus:border-[#b8894d] text-black placeholder-gray-400'}`}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Perera"
                      className={`w-full px-3 py-2.5 rounded-lg border outline-none text-sm transition-all focus:scale-[1.01] ${isDark ? 'bg-white/[0.02] border-white/10 focus:border-[#d4a574] text-white placeholder-gray-600' : 'bg-black/[0.02] border-black/10 focus:border-[#b8894d] text-black placeholder-gray-400'}`}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
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
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                    Password
                  </label>
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
                  {/* Password strength indicator */}
                  {password.length > 0 && (
                    <>
                      <div className="flex gap-1 mt-2">
                        {[0, 1, 2, 3].map((index) => (
                          <div
                            key={index}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${getStrengthColor(index)}`}
                          ></div>
                        ))}
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          passwordStrength === 1
                            ? 'text-red-500'
                            : passwordStrength === 2
                              ? 'text-orange-500'
                              : passwordStrength === 3
                                ? 'text-yellow-500'
                                : passwordStrength === 4
                                  ? isDark
                                    ? 'text-[#d4a574]'
                                    : 'text-[#b8894d]'
                                  : 'text-gray-500'
                        }`}
                      >
                        {getStrengthText()}
                      </p>
                    </>
                  )}
                </div>

                {/* Submit */}
                {/*<button*/}
                {/*  onClick={handleSubmit}*/}
                {/*  className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all mt-2 bg-gradient-to-r ${isDark ? 'from-[#d4a574] to-[#a3784e] shadow-[#d4a574]/30' : 'from-[#b8894d] to-[#8f6a3b] shadow-[#b8894d]/30'}`}*/}
                {/*>*/}
                {/*  Create Account*/}
                {/*</button>*/}

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all mt-2 bg-gradient-to-r flex items-center justify-center gap-2 ${
                    isDark
                      ? 'from-[#d4a574] to-[#a3784e] shadow-[#d4a574]/30'
                      : 'from-[#b8894d] to-[#8f6a3b] shadow-[#b8894d]/30'
                  } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Footer */}
                <div className="mt-6 text-center text-sm">
                  <span
                    className={`opacity-60 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Already have an account?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className={`font-medium hover:underline ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                  >
                    Log In
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

export default Register;
