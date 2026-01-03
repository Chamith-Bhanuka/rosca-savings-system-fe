import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import { useAuth } from '../context/authContext.tsx';
import axios from 'axios';
import Loader from '../components/Loader';
import { Trophy, Medal, Award, Crown, Star } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';
  const [leaders, setLeaders] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Leaderboard - Seettuwa';
  }, [theme]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(
          'http://localhost:5000/api/v1/user/leaderboard',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLeaders(res.data.leaderboard);
        setMyRank(res.data.myRank);
      } catch (error) {
        console.error('Leaderboard error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <Loader />;

  const topThree = leaders.slice(0, 3);
  const theRest = leaders.slice(3);

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <Navbar />
      <MegaMenu />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy
                className={`w-10 h-10 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
              />
              <h1
                className={`text-3xl sm:text-4xl font-['Playfair_Display'] font-bold ${
                  isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                }`}
              >
                Community Leaderboard
              </h1>
            </div>
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Top savers with the highest Trust Scores
            </p>
          </div>

          {/* Podium - Top 3 */}
          {topThree.length > 0 && (
            <div className="flex justify-center items-end gap-4 md:gap-8 mb-16 px-4">
              {/* Rank 2 (Silver) */}
              {topThree[1] && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <img
                      src={
                        topThree[1].avatarUrl ||
                        'https://via.placeholder.com/150'
                      }
                      className="w-20 h-20 rounded-full border-4 border-gray-400 object-cover shadow-lg"
                      alt="Rank 2"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                      <Medal className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div
                    className={`font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {topThree[1].firstName}
                  </div>
                  <div
                    className={`w-28 h-36 rounded-t-2xl shadow-xl flex flex-col items-center justify-center relative ${
                      isDark
                        ? 'bg-gradient-to-t from-gray-700 to-gray-600 border-t-4 border-gray-500'
                        : 'bg-gradient-to-t from-gray-300 to-gray-200 border-t-4 border-gray-400'
                    }`}
                  >
                    <span
                      className={`text-4xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      2
                    </span>
                    <div
                      className={`absolute -bottom-4 px-4 py-1.5 rounded-full shadow-lg text-xs font-bold ${
                        isDark
                          ? 'bg-[#1a110d] border border-white/10 text-gray-300'
                          : 'bg-white border border-gray-200 text-gray-700'
                      }`}
                    >
                      {topThree[1].trustScore} pts
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold) */}
              {topThree[0] && (
                <div className="flex flex-col items-center z-10">
                  <Crown
                    className={`w-10 h-10 mb-2 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                  />
                  <div className="relative mb-3">
                    <img
                      src={
                        topThree[0].avatarUrl ||
                        'https://via.placeholder.com/150'
                      }
                      className={`w-28 h-28 rounded-full border-4 object-cover shadow-2xl ${
                        isDark ? 'border-[#d4a574]' : 'border-[#b8894d]'
                      }`}
                      alt="Rank 1"
                    />
                    <div
                      className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-xl ${
                        isDark ? 'bg-[#d4a574]' : 'bg-[#b8894d]'
                      }`}
                    >
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div
                    className={`font-bold text-lg mb-3 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                  >
                    {topThree[0].firstName}
                  </div>
                  <div
                    className={`w-36 h-48 rounded-t-2xl shadow-2xl flex flex-col items-center justify-center relative ${
                      isDark
                        ? 'bg-gradient-to-t from-[#d4a574] to-[#c39464] border-t-4 border-[#f3dca6]'
                        : 'bg-gradient-to-t from-[#b8894d] to-[#c39464] border-t-4 border-[#d4a574]'
                    }`}
                  >
                    <span className="text-5xl font-bold text-white">1</span>
                    <div
                      className={`absolute -bottom-4 px-5 py-2 rounded-full shadow-2xl text-sm font-bold ${
                        isDark
                          ? 'bg-[#1a110d] border-2 border-[#d4a574] text-[#d4a574]'
                          : 'bg-black border-2 border-[#b8894d] text-[#b8894d]'
                      }`}
                    >
                      {topThree[0].trustScore} pts
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {topThree[2] && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <img
                      src={
                        topThree[2].avatarUrl ||
                        'https://via.placeholder.com/150'
                      }
                      className="w-20 h-20 rounded-full border-4 border-orange-400 object-cover shadow-lg"
                      alt="Rank 3"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div
                    className={`font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {topThree[2].firstName}
                  </div>
                  <div
                    className={`w-28 h-28 rounded-t-2xl shadow-xl flex flex-col items-center justify-center relative ${
                      isDark
                        ? 'bg-gradient-to-t from-orange-600 to-orange-500 border-t-4 border-orange-400'
                        : 'bg-gradient-to-t from-orange-400 to-orange-300 border-t-4 border-orange-500'
                    }`}
                  >
                    <span
                      className={`text-4xl font-bold ${isDark ? 'text-orange-100' : 'text-orange-900'}`}
                    >
                      3
                    </span>
                    <div
                      className={`absolute -bottom-4 px-4 py-1.5 rounded-full shadow-lg text-xs font-bold ${
                        isDark
                          ? 'bg-[#1a110d] border border-white/10 text-gray-300'
                          : 'bg-white border border-gray-200 text-gray-700'
                      }`}
                    >
                      {topThree[2].trustScore} pts
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rankings List */}
          <div
            className={`rounded-2xl shadow-lg overflow-hidden ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Table Header */}
            <div
              className={`grid grid-cols-12 gap-4 p-4 border-b ${
                isDark
                  ? 'bg-white/5 border-white/10'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div
                className={`col-span-2 text-center text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Rank
              </div>
              <div
                className={`col-span-7 text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                User
              </div>
              <div
                className={`col-span-3 text-right text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Trust Score
              </div>
            </div>

            {/* Table Rows */}
            <div
              className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}
            >
              {theRest.map((leader: any, index: number) => {
                const rank = index + 4;
                const isMe = user && leader._id === user._id;

                return (
                  <div
                    key={leader._id}
                    className={`grid grid-cols-12 gap-4 p-4 items-center transition-all ${
                      isMe
                        ? isDark
                          ? 'bg-[#d4a574]/10 border-l-4 border-[#d4a574]'
                          : 'bg-[#b8894d]/10 border-l-4 border-[#b8894d]'
                        : isDark
                          ? 'hover:bg-white/5'
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`col-span-2 text-center font-bold ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      #{rank}
                    </div>
                    <div className="col-span-7 flex items-center gap-3">
                      <img
                        src={
                          leader.avatarUrl || 'https://via.placeholder.com/40'
                        }
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                        alt={leader.firstName}
                      />
                      <div>
                        <div
                          className={`font-bold flex items-center gap-2 ${
                            isMe
                              ? isDark
                                ? 'text-[#d4a574]'
                                : 'text-[#b8894d]'
                              : isDark
                                ? 'text-[#f2f0ea]'
                                : 'text-gray-900'
                          }`}
                        >
                          {leader.firstName} {leader.lastName}
                          {isMe && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                isDark
                                  ? 'bg-[#d4a574] text-black'
                                  : 'bg-[#b8894d] text-white'
                              }`}
                            >
                              YOU
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                        >
                          Member
                        </div>
                      </div>
                    </div>
                    <div
                      className={`col-span-3 text-right font-bold flex items-center justify-end gap-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {leader.trustScore}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* My Rank Footer (if rank > 20) */}
            {myRank && myRank.rank > 20 && (
              <div
                className={`sticky bottom-0 p-4 grid grid-cols-12 gap-4 items-center shadow-2xl border-t ${
                  isDark
                    ? 'bg-[#1a110d] border-[#d4a574]/30'
                    : 'bg-black border-gray-800'
                }`}
              >
                <div
                  className={`col-span-2 text-center font-bold ${
                    isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                  }`}
                >
                  #{myRank.rank}
                </div>
                <div className="col-span-7 flex items-center gap-3">
                  <img
                    src={
                      myRank.user.avatarUrl || 'https://via.placeholder.com/40'
                    }
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    alt="You"
                  />
                  <div>
                    <div className="font-bold text-white">You</div>
                    <div
                      className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                      Keep saving to rise up!
                    </div>
                  </div>
                </div>
                <div
                  className={`col-span-3 text-right font-bold flex items-center justify-end gap-1 ${
                    isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                  {myRank.score}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
