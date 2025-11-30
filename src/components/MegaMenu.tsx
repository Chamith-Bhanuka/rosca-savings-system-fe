import React from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { closeMenu } from '../slices/menuSlice';
import { useNavigate } from 'react-router-dom';
import { menuConfig } from '../config/menuConfig';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../slices/languageSlice';
import type { MenuItem } from '../config/menuConfig';

const MegaMenu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isOpen = useSelector((state: RootState) => state.menu.isOpen);
  const isDark = useSelector(
    (state: RootState) => state.theme.value === 'dark'
  );

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    console.log('Toggle language clicked');
    const newLang = i18n.language === 'en' ? 'si' : 'en';
    i18n.changeLanguage(newLang);
    dispatch(setLanguage(newLang));
  };

  const handleClick = (item: MenuItem) => {
    if (item.route === 'LANGUAGE_TOGGLE') {
      toggleLanguage();
      return;
    }

    navigate(item.route);
    dispatch(closeMenu());
  };

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-500 ${
        isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`absolute inset-0 ${isDark ? 'bg-[#0f0806]/98' : 'bg-[#faf8f5]/98'}`}
      />

      <div className="relative z-10 w-full h-full pt-28 px-[10%] flex justify-center">
        <button
          onClick={() => dispatch(closeMenu())}
          className={`absolute top-8 right-[5%] text-4xl hover:rotate-90 transition-transform ${
            isDark ? 'text-[#f2f0ea]' : 'text-[#1a1a1a]'
          }`}
        >
          <X />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl w-full">
          {menuConfig.map((col) => (
            <div key={col.title} className="flex flex-col">
              <h4
                className={`text-xs uppercase tracking-widest mb-6 pb-3 border-b ${
                  isDark
                    ? 'text-[#d4a574] border-white/10'
                    : 'text-[#b8894d] border-black/10'
                }`}
              >
                {t(col.title)}
              </h4>

              <ul className="space-y-4">
                {col.items.map((item) => {
                  const label =
                    item.route === 'LANGUAGE_TOGGLE'
                      ? i18n.language === 'en'
                        ? 'Language: EN'
                        : 'භාෂාව: සිංහල'
                      : t(item.label);

                  return (
                    <li key={label}>
                      <button
                        onClick={() => handleClick(item)}
                        className={`text-left w-full text-lg font-light transition-all hover:translate-x-2 block ${
                          isDark
                            ? 'text-[#f2f0ea] hover:text-[#d4a574]'
                            : 'text-[#1a1a1a] hover:text-[#b8894d]'
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
