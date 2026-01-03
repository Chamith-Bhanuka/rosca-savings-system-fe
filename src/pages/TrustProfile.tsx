import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import axios from 'axios';
import Loader from '../components/Loader';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Award,
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const TrustProfile: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(100);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Trust Profile - Seettuwa';
  }, [theme]);

  useEffect(() => {
    const fetchTrust = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(
          'http://localhost:5000/api/v1/user/trust-profile',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrust();
  }, []);

  // Animate score after data loads
  useEffect(() => {
    if (data) {
      const targetScore = data?.user?.trustScore || 0;
      const duration = 1500; // 1.5 seconds
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth deceleration
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentScore = Math.round(
          100 - (100 - targetScore) * easeOutCubic
        );

        setAnimatedScore(currentScore);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [data]);

  if (loading) return <Loader />;

  const score = data?.user?.trustScore || 0;
  const scoreColor =
    score >= 80
      ? '#22c55e'
      : score >= 50
        ? isDark
          ? '#d4a574'
          : '#b8894d'
        : '#ef4444';

  const pieData = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [animatedScore, 100 - animatedScore],
        backgroundColor: [
          scoreColor,
          isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
        ],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <Navbar />
      <MegaMenu />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield
                className={`w-10 h-10 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
              />
              <h1
                className={`text-3xl sm:text-4xl font-['Playfair_Display'] font-bold ${
                  isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                }`}
              >
                Trust Profile
              </h1>
            </div>
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Your reputation in the Seettuwa community
            </p>
          </div>

          {/* Score Card */}
          <div
            className={`rounded-2xl shadow-lg p-8 mb-8 ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Gauge Chart */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <div style={{ width: '100%', height: '100%' }}>
                  <Pie data={pieData} options={pieOptions} />
                </div>
                <div className="absolute top-24 left-0 w-full text-center -mt-8">
                  <div
                    className="text-5xl font-bold transition-all duration-300"
                    style={{ color: scoreColor }}
                  >
                    {animatedScore}
                  </div>
                  <div
                    className={`text-xs uppercase tracking-widest mt-1 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    Trust Score
                  </div>
                </div>
              </div>

              {/* Badge & Summary */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Award className="w-5 h-5" style={{ color: scoreColor }} />
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: `${scoreColor}20`,
                      color: scoreColor,
                    }}
                  >
                    {data.user?.level || 'Member'}
                  </span>
                </div>
                <h2
                  className={`text-2xl font-bold mb-3 ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                >
                  {score >= 80
                    ? 'Excellent Standing!'
                    : score >= 50
                      ? 'Good Standing'
                      : 'Needs Improvement'}
                </h2>
                <p
                  className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  A higher trust score unlocks larger group amounts and faster
                  approval times. Keep making payments on time to reach 100.
                </p>
              </div>
            </div>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* On-Time Payments */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <h3
                className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {data.stats?.onTimePercentage || 0}%
              </h3>
              <p
                className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
              >
                On-Time Payments
              </p>
            </div>

            {/* Total Contributions */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-[#d4a574]/20' : 'bg-[#b8894d]/20'
                  }`}
                >
                  <TrendingUp
                    className={`w-6 h-6 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                  />
                </div>
              </div>
              <h3
                className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {data.stats?.totalContributions || 0}
              </h3>
              <p
                className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
              >
                Total Contributions
              </p>
            </div>

            {/* Groups Completed */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <h3
                className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {data.stats?.completedGroups || 0}
              </h3>
              <p
                className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
              >
                Groups Completed
              </p>
            </div>
          </div>

          {/* Trust Factors */}
          <div
            className={`rounded-2xl shadow-lg p-6 sm:p-8 ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <h3
              className={`text-xl font-bold mb-6 pb-4 border-b ${
                isDark
                  ? 'text-[#f2f0ea] border-white/10'
                  : 'text-gray-900 border-gray-200'
              }`}
            >
              Score Breakdown
            </h3>

            <div className="space-y-4">
              {data?.factors && data.factors.length > 0 ? (
                data.factors.map((factor: any, index: number) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-4 rounded-lg ${
                      isDark ? 'bg-white/5' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {factor.type === 'good' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span
                        className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {factor.label}
                      </span>
                    </div>
                    <span
                      className={`font-bold text-lg ${
                        factor.type === 'good'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {factor.points > 0 ? '+' : ''}
                      {factor.points}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Shield
                    className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
                  />
                  <p
                    className={`italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    No activity recorded yet. Start participating in groups to
                    build your trust score!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrustProfile;
