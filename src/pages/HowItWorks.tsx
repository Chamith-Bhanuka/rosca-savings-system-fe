import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Navbar from '../components/NavBar.tsx';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer.tsx';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  DollarSign,
  Trophy,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'How It Works - Seettuwa';
  }, [theme]);

  const steps = [
    {
      number: '01',
      title: 'Join a Group',
      desc: 'Browse verified savings groups. Check the amount, duration, and cycle frequency. Join the one that fits your budget.',
      icon: Users,
      color: 'blue',
    },
    {
      number: '02',
      title: 'Contribute Securely',
      desc: 'Pay your fixed installment into the secure pool every month/week. All payments are tracked transparently.',
      icon: DollarSign,
      color: 'green',
    },
    {
      number: '03',
      title: 'Win the Pot',
      desc: 'Every cycle, one member gets the "Pot" (Total Collection). This rotates until everyone receives the lump sum once.',
      icon: Trophy,
      color: 'yellow',
    },
    {
      number: '04',
      title: 'Build Trust',
      desc: 'Pay on time to increase your Trust Score. Higher scores unlock bigger groups and instant approvals.',
      icon: Shield,
      color: 'purple',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        iconBg: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
        iconText: 'text-blue-500',
        border: isDark
          ? 'group-hover:border-blue-500/40'
          : 'group-hover:border-blue-300',
        glow: isDark
          ? 'group-hover:shadow-blue-500/20'
          : 'group-hover:shadow-blue-200',
      },
      green: {
        iconBg: isDark ? 'bg-green-500/20' : 'bg-green-100',
        iconText: 'text-green-500',
        border: isDark
          ? 'group-hover:border-green-500/40'
          : 'group-hover:border-green-300',
        glow: isDark
          ? 'group-hover:shadow-green-500/20'
          : 'group-hover:shadow-green-200',
      },
      yellow: {
        iconBg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
        iconText: 'text-yellow-500',
        border: isDark
          ? 'group-hover:border-yellow-500/40'
          : 'group-hover:border-yellow-300',
        glow: isDark
          ? 'group-hover:shadow-yellow-500/20'
          : 'group-hover:shadow-yellow-200',
      },
      purple: {
        iconBg: isDark ? 'bg-purple-500/20' : 'bg-purple-100',
        iconText: 'text-purple-500',
        border: isDark
          ? 'group-hover:border-purple-500/40'
          : 'group-hover:border-purple-300',
        glow: isDark
          ? 'group-hover:shadow-purple-500/20'
          : 'group-hover:shadow-purple-200',
      },
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .step-card:nth-child(1) { animation-delay: 0.1s; }
        .step-card:nth-child(2) { animation-delay: 0.2s; }
        .step-card:nth-child(3) { animation-delay: 0.3s; }
        .step-card:nth-child(4) { animation-delay: 0.4s; }
      `}</style>

      <Navbar />
      <MegaMenu />

      <main className="flex-1 pt-[88px] pb-12 relative z-10">
        {/* HERO SECTION */}
        <div className="text-center px-4 max-w-4xl mx-auto mb-20 pt-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-pulse-glow"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(212,165,116,0.1), rgba(163,120,78,0.1))'
                : 'linear-gradient(135deg, rgba(184,137,77,0.1), rgba(139,102,53,0.1))',
              border: `1px solid ${isDark ? 'rgba(212,165,116,0.3)' : 'rgba(184,137,77,0.3)'}`,
            }}
          >
            <Sparkles
              className={`w-4 h-4 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
            />
            <span
              className={`text-sm font-semibold ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
            >
              Simple. Transparent. Fair.
            </span>
          </div>

          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-bold mb-6 ${
              isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
            }`}
          >
            How Seettuwa Works
          </h1>
          <p
            className={`text-lg md:text-xl leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Seettuwa modernizes the traditional Chit Fund system. We replace
            manual record-keeping with smart contracts and instant payments.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const colors = getColorClasses(step.color);

              return (
                <div
                  key={idx}
                  className={`step-card relative p-8 rounded-2xl border transition-all duration-500 group animate-fade-in-up hover:scale-105 hover:-translate-y-2 ${
                    isDark
                      ? 'bg-[#1a110d]/80 backdrop-blur-xl border-white/10 hover:shadow-2xl'
                      : 'bg-white border-gray-200 hover:shadow-2xl'
                  } ${colors.border} ${colors.glow}`}
                >
                  {/* Background Number */}
                  <div
                    className={`text-7xl font-bold absolute top-4 right-4 transition-all duration-500 ${
                      isDark
                        ? 'text-white/5 group-hover:text-white/10'
                        : 'text-gray-200 group-hover:text-gray-300'
                    }`}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg transition-all duration-500 group-hover:scale-110 animate-float ${colors.iconBg}`}
                  >
                    <Icon className={`w-8 h-8 ${colors.iconText}`} />
                  </div>

                  {/* Content */}
                  <h3
                    className={`text-xl font-bold mb-3 ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {step.desc}
                  </p>

                  {/* Connector Arrow (except last card) */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight
                        className={`w-6 h-6 ${
                          isDark ? 'text-[#d4a574]/50' : 'text-[#b8894d]/50'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA SECTION */}
        <div
          className={`relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-br from-[#1a110d] to-[#2a1a0d]'
              : 'bg-gradient-to-br from-[#b8894d] to-[#8b6635]'
          }`}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
            <Sparkles
              className={`w-12 h-12 mx-auto mb-6 ${isDark ? 'text-[#d4a574]' : 'text-white'}`}
            />
            <h2
              className={`text-3xl md:text-4xl font-['Playfair_Display'] font-bold mb-4 ${
                isDark ? 'text-[#d4a574]' : 'text-white'
              }`}
            >
              Ready to start saving?
            </h2>
            <p
              className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-white/80'}`}
            >
              Join thousands of members already building their financial future
            </p>
            <button
              className={`group px-8 py-4 font-bold rounded-lg transition-all hover:scale-105 shadow-2xl flex items-center gap-2 mx-auto ${
                isDark
                  ? 'bg-[#d4a574] text-black hover:bg-[#c39464]'
                  : 'bg-white text-[#b8894d] hover:bg-gray-100'
              }`}
              onClick={() => navigate('/groups/join')}
            >
              Find a Group
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
