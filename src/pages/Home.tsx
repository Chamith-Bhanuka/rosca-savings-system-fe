import React, { useEffect, useState } from 'react';
import { useSeettuAnimation } from '../hooks/useSeettuAnimation.ts';
import { PARTICIPANTS } from '../data/constant.ts';
import Navbar from '../components/NavBar.tsx';
import MegaMenu from '../components/MegaMenu.tsx';
import Footer from '../components/Footer.tsx';

const Home: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Use the custom hook which returns typed refs
  const { bowlRef, visualRef, handRef, chitRefs } =
    useSeettuAnimation(PARTICIPANTS);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="flex flex-col min-h-screen font-['Inter'] relative">
      <div className="noise-overlay" />

      <Navbar
        toggleTheme={toggleTheme}
        isDark={theme === 'dark'}
        toggleMenu={() => setMenuOpen(true)}
      />
      <MegaMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isDark={theme === 'dark'}
      />

      <main className="flex-1 min-h-[calc(100dvh-0px)] grid grid-cols-1 lg:grid-cols-2 pt-[72px] relative">
        {/* LEFT: CONTENT */}
        <section className="flex flex-col justify-center px-8 lg:pl-[10%] lg:pr-[2%] py-12 lg:py-0 relative z-30 order-2 lg:order-1 text-center lg:text-left">
          <div
            className={`text-xs uppercase tracking-[3px] font-semibold mb-4 ${theme === 'dark' ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
          >
            Authentic Savings Circles
          </div>

          <h1 className="font-['Playfair_Display'] text-5xl lg:text-[3.5rem] leading-[1.15] mb-6 bg-clip-text text-transparent bg-gradient-to-l from-[#d4a574]/40 via-[#d4a574]/70 to-[#d4a574]">
            Digital Trust,
            <br />
            Timeless Tradition.
          </h1>

          <p
            className={`text-lg leading-relaxed max-w-xl mb-8 mx-auto lg:mx-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Experience the transparency of traditional Seettu/Chit Funds with
            the security of modern blockchain. Create groups, bid in real-time,
            and manage your community savings with absolute trust.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              className={`px-8 py-3.5 rounded-md font-semibold text-white shadow-lg shadow-[#d4a574]/30 hover:translate-y-[-2px] hover:shadow-[#d4a574]/40 transition-all bg-gradient-to-br from-[#d4a574] to-[#a3784e]`}
            >
              Explore Groups
            </button>
            <button
              className={`px-8 py-3.5 rounded-md font-medium border-2 transition-all hover:bg-[#d4a574]/10 ${theme === 'dark' ? 'border-white/10 text-[#f2f0ea] hover:border-[#d4a574]' : 'border-black/10 text-[#1a1a1a] hover:border-[#b8894d]'}`}
            >
              How it Works
            </button>
          </div>
        </section>

        {/* RIGHT: ANIMATION SCENE */}
        <section
          ref={visualRef}
          className="relative h-[50vh] lg:h-auto flex justify-center items-center perspective-[1500px] overflow-hidden order-1 lg:order-2"
        >
          {/* SVG Hand */}
          <div ref={handRef} className="hand-cursor">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M20 40C20 40 18 32 18 28C18 24 20 22 22 22C24 22 25 24 25 26V16C25 12 27 10 30 10C33 10 35 12 35 16V18C35 18 36 16 38 16C40 16 42 18 42 20V24C42 24 43 22 45 22C47 22 49 24 49 28C49 32 47 40 47 40L44 50C43 54 40 56 36 56H28C24 56 20 52 20 48V40Z"
                fill="#f4d5b3"
                stroke="#d4a574"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M25 26V16M35 16V20M42 20V24"
                stroke="#d4a574"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div
            ref={bowlRef}
            className="bowl-container relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px]"
          >
            <div className="bowl-outer absolute inset-0 rounded-full before:absolute before:inset-[-3px] before:rounded-full before:bg-gradient-to-br before:from-white/15 before:to-transparent"></div>
            <div className="bowl-inner absolute inset-[25px] rounded-full after:absolute after:bottom-[18%] after:left-1/2 after:-translate-x-1/2 after:w-[35%] after:h-[35%] after:rounded-full"></div>

            {PARTICIPANTS.map((name, i) => (
              <div
                key={i}
                ref={(el) => {
                  chitRefs.current[i] = el;
                }}
                className="chit opacity-0" // Start invisible for air drop
                data-name={name}
              >
                {/* Folded State */}
                <div className="chit-folded w-full h-full relative preserve-3d">
                  <div className="paper-layer absolute inset-0 rounded-[3px] overflow-hidden">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent shadow-[0_1px_0_rgba(255,255,255,0.3)]"></div>
                    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-black/10 to-transparent"></div>
                  </div>
                </div>

                {/* Unfolded State */}
                <div className="chit-unfolded">
                  <div className="unfold-panel left"></div>
                  <div className="unfold-panel center flex items-center justify-center relative z-10">
                    <span className="font-['Kalam'] text-4xl font-bold text-[#2a2a2a]">
                      {name}
                    </span>
                  </div>
                  <div className="unfold-panel right"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="mt-auto">
        <Footer isDark={theme === 'dark'} />
      </div>
    </div>
  );
};

export default Home;
