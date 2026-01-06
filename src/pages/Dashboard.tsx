import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  PiggyBank,
  Shield,
  Users,
  Settings,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { getDashboard } from '../services/user.service.ts';

const Dashboard: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Dashboard - Seettuwa';
  }, [theme]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await getDashboard();
        setData(result);
      } catch (error) {
        console.error('Dashboard error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <style>{`
        /* Custom Scrollbar Styles */
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? '#d4a574' : '#b8894d'};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#c39464' : '#a67a42'};
        }

        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? '#d4a574 rgba(255, 255, 255, 0.05)' : '#b8894d rgba(0, 0, 0, 0.05)'};
        }
      `}</style>

      <Navbar />
      <MegaMenu />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div
            className={`rounded-2xl p-6 mb-8 shadow-lg ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={
                      data?.user?.avatarUrl || 'https://via.placeholder.com/150'
                    }
                    className={`w-16 h-16 rounded-full object-cover border-2 ${
                      isDark ? 'border-[#d4a574]' : 'border-[#b8894d]'
                    }`}
                    alt="Profile"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1
                    className={`text-2xl sm:text-3xl font-['Playfair_Display'] font-bold ${
                      isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                    }`}
                  >
                    Welcome back, {data?.user?.firstName}!
                  </h1>
                  <p
                    className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Your financial hub at a glance
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/settings')}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${
                  isDark
                    ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-[#d4a574]/40'
                    : 'bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-[#b8894d]/40'
                }`}
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Wallet Balance */}
            <div
              className={`rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                isDark
                  ? 'bg-gradient-to-br from-[#1a110d] to-[#2a1a0d] border border-[#d4a574]/30'
                  : 'bg-gradient-to-br from-[#b8894d] to-[#8b6635] border border-[#8b6635]'
              }`}
              onClick={() => navigate('/wallet')}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-[#d4a574]/20' : 'bg-white/20'
                  }`}
                >
                  <Wallet
                    className={`w-6 h-6 ${isDark ? 'text-[#d4a574]' : 'text-white'}`}
                  />
                </div>
                <ArrowUpRight
                  className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-white/80'}`}
                />
              </div>
              <p
                className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-white/80'}`}
              >
                Wallet Balance
              </p>
              <h2
                className={`text-3xl font-bold ${isDark ? 'text-[#d4a574]' : 'text-white'}`}
              >
                {data?.stats?.walletBalance?.toLocaleString() || '0'}
              </h2>
              <p
                className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-white/60'}`}
              >
                LKR
              </p>
            </div>

            {/* Total Savings */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <PiggyBank className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                  +12%
                </span>
              </div>
              <p
                className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Total Saved
              </p>
              <h2
                className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {data?.stats?.totalSaved?.toLocaleString() || '0'}
              </h2>
              <p
                className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
              >
                LKR
              </p>
            </div>

            {/* Active Groups */}
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
              <p
                className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Active Groups
              </p>
              <h2
                className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {data?.stats?.activeGroupCount || '0'}
              </h2>
              <p
                className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
              >
                Participating
              </p>
            </div>

            {/* Trust Score */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <p
                className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Trust Score
              </p>
              <h2
                className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {data?.stats?.totalTrust || '0'}/100
              </h2>
              <div
                className={`w-full h-2 rounded-full mt-3 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
              >
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${data?.stats?.totalTrust || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="space-y-6">
            {/* Active Groups - Horizontal Scroll Cards */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-2xl font-['Playfair_Display'] font-bold ${
                    isDark ? 'text-[#f2f0ea]' : 'text-gray-900'
                  }`}
                >
                  Your Active Groups
                </h2>
                {data?.activeGroups?.length > 0 && (
                  <button
                    onClick={() => navigate('/groups')}
                    className={`text-sm font-medium flex items-center gap-1 ${
                      isDark
                        ? 'text-[#d4a574] hover:text-[#c39464]'
                        : 'text-[#b8894d] hover:text-[#a67a42]'
                    }`}
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {!data?.activeGroups || data.activeGroups.length === 0 ? (
                <div
                  className={`rounded-2xl p-12 text-center border-2 border-dashed ${
                    isDark
                      ? 'bg-[#1a110d]/80 border-white/10'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Users
                    className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
                  />
                  <h3
                    className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    No Active Groups
                  </h3>
                  <p
                    className={`mb-6 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}
                  >
                    Join your first group and start saving together
                  </p>
                  <button
                    onClick={() => navigate('/groups')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      isDark
                        ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg'
                    }`}
                  >
                    Find Groups
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                  <div className="flex gap-4 min-w-max">
                    {data.activeGroups.map((group: any) => (
                      <div
                        key={group._id}
                        onClick={() => navigate(`/groups/${group._id}`)}
                        className={`group w-80 flex-shrink-0 rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] ${
                          isDark
                            ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10 hover:border-[#d4a574]/40 hover:shadow-2xl'
                            : 'bg-white border border-gray-200 hover:border-[#b8894d]/40 hover:shadow-2xl'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3
                              className={`text-xl font-bold mb-1 ${
                                isDark ? 'text-[#f2f0ea]' : 'text-gray-900'
                              }`}
                            >
                              {group.name}
                            </h3>
                            <p
                              className={`text-sm flex items-center gap-1 ${
                                isDark ? 'text-gray-500' : 'text-gray-500'
                              }`}
                            >
                              <Calendar className="w-3 h-3" />
                              Cycle {group.currentCycle}
                            </p>
                          </div>
                          <ChevronRight
                            className={`w-6 h-6 transition-transform group-hover:translate-x-1 ${
                              isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                            }`}
                          />
                        </div>

                        <div
                          className={`py-4 border-t border-b mb-4 ${
                            isDark ? 'border-white/10' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                            >
                              Amount
                            </span>
                            <span
                              className={`text-3xl font-bold ${
                                isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                              }`}
                            >
                              {group.amount?.toLocaleString() || '0'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p
                            className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                          >
                            Next Payment
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {new Date(group.nextPaymentDate).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Section: Next Payout + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Next Payout */}
              {data?.nextPayout && (
                <div
                  className={`rounded-2xl p-6 shadow-lg ${
                    isDark
                      ? 'bg-[#d4a574]/10 border border-[#d4a574]/30'
                      : 'bg-[#b8894d]/10 border border-[#b8894d]/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp
                      className={`w-5 h-5 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                    />
                    <h3
                      className={`text-sm font-bold uppercase tracking-wider ${
                        isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                      }`}
                    >
                      Upcoming Win
                    </h3>
                  </div>
                  <p
                    className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    {data.nextPayout.amount?.toLocaleString() || '0'}
                  </p>
                  <p
                    className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}
                  >
                    from{' '}
                    <span className="font-semibold">
                      {data.nextPayout.groupName}
                    </span>
                  </p>
                  <p
                    className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}
                  >
                    Cycle #{data.nextPayout.cycle}
                  </p>
                </div>
              )}

              {/* Activity Feed */}
              <div
                className={`rounded-2xl p-6 shadow-lg ${
                  isDark
                    ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-4 ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                >
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {data?.activityFeed && data.activityFeed.length > 0 ? (
                    data.activityFeed
                      .slice(0, 3)
                      .map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            isDark ? 'bg-white/5' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                item.type === 'CONTRIBUTION'
                                  ? 'bg-red-500/20'
                                  : 'bg-green-500/20'
                              }`}
                            >
                              {item.type === 'CONTRIBUTION' ? (
                                <ArrowDownLeft className="w-4 h-4 text-red-500" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <div>
                              <p
                                className={`text-sm font-medium ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                              >
                                {item.type === 'CONTRIBUTION'
                                  ? 'Contribution'
                                  : 'Payout'}
                              </p>
                              <p
                                className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                              >
                                {new Date(item.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`font-bold ${
                              item.type === 'CONTRIBUTION'
                                ? isDark
                                  ? 'text-red-400'
                                  : 'text-red-600'
                                : isDark
                                  ? 'text-green-400'
                                  : 'text-green-600'
                            }`}
                          >
                            {item.type === 'CONTRIBUTION' ? '-' : '+'}
                            {item.amount?.toLocaleString() || '0'}
                          </span>
                        </div>
                      ))
                  ) : (
                    <p
                      className={`text-sm text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                    >
                      No recent activity
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
