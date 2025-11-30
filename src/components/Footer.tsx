import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import { footerConfig } from '../config/footerConfig';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../slices/languageSlice';

const Footer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isDark = useSelector(
    (state: RootState) => state.theme.value === 'dark'
  );
  const currentLang = useSelector((state: RootState) => state.language.value);

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'si' : 'en';
    i18n.changeLanguage(newLang);
    dispatch(setLanguage(newLang));
  };

  const handleClick = (route: string) => {
    if (route === 'LANGUAGE_TOGGLE') {
      toggleLanguage();
      return;
    }

    navigate(route);
  };

  return (
    <footer
      className={`relative z-20 mt-auto py-16 px-[5%] border-t ${
        isDark ? 'border-white/5 bg-[#0f0806]' : 'border-black/5 bg-[#faf8f5]'
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex flex-col gap-0.5 mb-6">
            <div
              className={`font-['Gemunu_Libre'] text-3xl font-bold ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
            >
              සීට්ටුව
            </div>
            <div
              className={`text-[0.43rem] uppercase tracking-[4px] opacity-70 ${isDark ? 'text-[#f2f0ea]' : 'text-[#1a1a1a]'}`}
            >
              Seettuwa
            </div>
          </div>
          <p
            className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            The world's first blockchain-powered ROSCA platform. Saving
            together, growing together.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className={`transition-colors ${isDark ? 'text-gray-500 hover:text-[#d4a574]' : 'text-gray-400 hover:text-[#b8894d]'}`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Dynamic Footer Columns */}
        {footerConfig.map((col) => (
          <div key={col.title}>
            <h5
              className={`font-semibold mb-6 ${
                isDark ? 'text-[#f2f0ea]' : 'text-[#1a1a1a]'
              }`}
            >
              {t(col.title)}
            </h5>

            <ul className="space-y-3">
              {col.items.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleClick(item.route)}
                    className={`text-sm text-left w-full transition-colors ${
                      isDark
                        ? 'text-gray-400 hover:text-[#d4a574]'
                        : 'text-gray-600 hover:text-[#b8894d]'
                    }`}
                  >
                    {t(item.label)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter Column */}
        <div>
          <h5
            className={`font-semibold mb-6 ${
              isDark ? 'text-[#f2f0ea]' : 'text-[#1a1a1a]'
            }`}
          >
            {t('footer.newsletter')}
          </h5>

          <div className="relative">
            <input
              type="email"
              placeholder="Email address"
              className={`w-full py-3 px-4 pr-12 rounded-lg border focus:outline-none transition-colors ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white focus:border-[#d4a574]'
                  : 'bg-black/5 border-black/10 text-black focus:border-[#b8894d]'
              }`}
            />

            <button
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
              }`}
            >
              <Send size={18} />
            </button>
          </div>

          <p className={`text-xs mt-4 text-gray-500`}>
            {t('footer.newsletterDescription')}
          </p>
        </div>
      </div>

      {/* Bottom Line */}
      <div
        className={`mt-16 pt-8 border-t text-center text-xs ${
          isDark
            ? 'border-white/5 text-gray-500'
            : 'border-black/5 text-gray-400'
        }`}
      >
        © 2025 Chamith Bhanuka. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
