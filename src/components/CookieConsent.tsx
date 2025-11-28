import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store.ts';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  const isDark = useSelector(
    (state: RootState) => state.theme.value === 'dark'
  );

  useEffect(() => {
    const consent = localStorage.getItem('seettuwa-cookie-consent');

    const isHomePage =
      location.pathname === '/' || location.pathname === '/home';

    if (!consent && isHomePage) {
      // Small delay for smooth entrance animation
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleAccept = () => {
    localStorage.setItem('seettuwa-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('seettuwa-cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      // Fixed to the bottom
      className={`fixed bottom-0 left-0 right-0 z-40 px-4 md:px-0 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      <div className="max-w-4xl mx-auto mb-4">
        <div
          className={`rounded-xl border backdrop-blur-xl shadow-2xl p-6 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors duration-500 ${isDark ? 'bg-[#0f0806]/40 border-white/10 shadow-black/50' : 'bg-[#faf8f5]/70 border-black/10 shadow-black/5'}`}
        >
          {/* Icon & Text */}
          <div className="flex gap-5">
            <div
              className={`hidden md:flex w-12 h-12 rounded-full items-center justify-center flex-shrink-0 ${isDark ? 'bg-white/5 text-[#d4a574]' : 'bg-[#b8894d]'}`}
            >
              <Cookie size={24} />
            </div>

            <div className="space-y-1">
              <h3
                className={`font-['Gemunu_Libre'] text-xl font-bold tracking-wide flex items-center gap-2 ${isDark ? 'text-[#f2f0ea]' : 'text-[#1a1a1a]'}`}
              >
                <span className="md:hidden">
                  <Cookie size={18} className="inline mb-1" />
                </span>
                We Value Your Privacy
              </h3>
              <p
                className={`text-sm leading-relaxed max-w-2xl font-['Inter'] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                We use cookies to enhance your trusted savings experience,
                analyze site traffic, and ensure the security of your circle.
                <a
                  href="#"
                  className={`ml-1 underline hover:no-underline ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                >
                  Read our Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0 font-['Inter']">
            <button
              onClick={handleDecline}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-all ${isDark ? 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white' : 'border-black/10 text-gray-600 hover:bg-black/5 hover:text-black'}`}
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 transition-all bg-gradient-to-r ${isDark ? 'from-[#d4a574] to-[#a3784e] shadow-[#d4a574]/20' : 'from-[#b8894d] to-[#8f6a3b] shadow-[#b8894d]/20'}`}
            >
              Accept All
            </button>
          </div>

          {/* Close X (Optional) */}
          <button
            onClick={() => setIsVisible(false)}
            className={`absolute top-4 right-4 md:hidden ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
