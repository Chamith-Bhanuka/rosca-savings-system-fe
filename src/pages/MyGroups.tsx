import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../../RAD_Final_Project/ROSCA-fe/src/store/store.ts';
import {
  Users,
  DollarSign,
  Calendar,
  Clock,
  Eye,
  CreditCard,
  TrendingUp,
  Search,
} from 'lucide-react';

import Navbar from '../../../../RAD_Final_Project/ROSCA-fe/src/components/NavBar.tsx';
import Footer from '../../../../RAD_Final_Project/ROSCA-fe/src/components/Footer.tsx';

// Mock data for member's groups
const MEMBER_GROUPS = [
  {
    id: 1,
    name: 'Office Savings Circle 2025',
    amount: 5000,
    frequency: 'monthly',
    currentCycle: 3,
    maxCycles: 12,
    members: 8,
    maxMembers: 12,
    status: 'active',
    badges: ['Trusted', 'Premium'],
    nextAction: 'Pay Now',
    nextActionType: 'payment',
    nextPaymentDate: '2025-12-05',
  },
  {
    id: 2,
    name: 'Community Building Fund',
    amount: 10000,
    frequency: 'monthly',
    currentCycle: 1,
    maxCycles: 20,
    members: 5,
    maxMembers: 20,
    status: 'active',
    badges: ['Trusted'],
    nextAction: 'View Draw',
    nextActionType: 'draw',
    nextDrawDate: '2025-12-10',
  },
  {
    id: 3,
    name: 'Friends Weekly Chit Fund',
    amount: 1000,
    frequency: 'weekly',
    currentCycle: 10,
    maxCycles: 10,
    members: 10,
    maxMembers: 10,
    status: 'completed',
    badges: ['Trusted'],
    nextAction: 'View Summary',
    nextActionType: 'view',
  },
  {
    id: 4,
    name: 'Family Savings Group',
    amount: 3000,
    frequency: 'biweekly',
    currentCycle: 2,
    maxCycles: 8,
    members: 6,
    maxMembers: 8,
    status: 'active',
    badges: ['Trusted', 'Premium'],
    nextAction: 'Pay Now',
    nextActionType: 'payment',
    nextPaymentDate: '2025-12-08',
  },
  {
    id: 5,
    name: 'Tech Startup Fund',
    amount: 15000,
    frequency: 'monthly',
    currentCycle: 4,
    maxCycles: 15,
    members: 10,
    maxMembers: 15,
    status: 'active',
    badges: ['Trusted'],
    nextAction: 'View Draw',
    nextActionType: 'draw',
    nextDrawDate: '2025-12-15',
  },
  {
    id: 6,
    name: 'Student Savings Circle',
    amount: 2000,
    frequency: 'monthly',
    currentCycle: 6,
    maxCycles: 12,
    members: 12,
    maxMembers: 12,
    status: 'active',
    badges: ['Trusted'],
    nextAction: 'Pay Now',
    nextActionType: 'payment',
    nextPaymentDate: '2025-12-12',
  },
];

const MyGroups: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'My Groups | Seettuwa';
  }, [theme]);

  const isDark = theme === 'dark';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return isDark
          ? 'bg-green-500/20 text-green-400 border-green-500/50'
          : 'bg-green-100 text-green-700 border-green-300';
      case 'completed':
        return isDark
          ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
          : 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return isDark
          ? 'bg-gray-500/20 text-gray-400 border-gray-500/50'
          : 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getActionButtonStyle = (type: string) => {
    switch (type) {
      case 'payment':
        return isDark
          ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg hover:shadow-[#d4a574]/30'
          : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg hover:shadow-[#b8894d]/30';
      case 'draw':
        return isDark
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30'
          : 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200';
      default:
        return isDark
          ? 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200';
    }
  };

  // Filter groups based on search
  const filteredGroups = MEMBER_GROUPS.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <Navbar />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <h1
              className={`text-4xl sm:text-5xl font-['Playfair_Display'] font-extrabold mb-2 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
            >
              My Groups
            </h1>
            <p
              className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Manage and track your savings circles
            </p>
          </header>

          {/* Search Bar */}
          <div
            className={`rounded-2xl p-6 mb-8 shadow-lg ${isDark ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10' : 'bg-white border border-gray-200'}`}
          >
            <div className="relative">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              />
              <input
                type="text"
                placeholder="Search your groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-lg text-sm font-medium transition-all focus:ring-2 outline-none ${
                  isDark
                    ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#d4a574] focus:ring-[#d4a574]/50'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                }`}
              />
            </div>
          </div>

          {/* Results Count */}
          <div
            className={`mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {filteredGroups.length} group
            {filteredGroups.length !== 1 ? 's' : ''} found
          </div>

          {/* Groups Grid - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className={`rounded-2xl p-5 shadow-lg transition-all hover:shadow-xl ${
                  isDark
                    ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10 hover:border-white/20'
                    : 'bg-white border border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Header */}
                <div className="mb-4">
                  <h3
                    className={`text-lg font-bold mb-2 ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                  >
                    {group.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.badges.map((badge) => (
                      <span
                        key={badge}
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          badge === 'Trusted'
                            ? isDark
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-green-100 text-green-700'
                            : isDark
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(group.status)}`}
                    >
                      {group.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Contribution
                    </span>
                    <span
                      className={`text-sm font-bold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                    >
                      LKR {group.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Frequency
                    </span>
                    <span
                      className={`text-sm font-bold capitalize ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                    >
                      {group.frequency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Cycle Progress
                    </span>
                    <span
                      className={`text-sm font-bold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                    >
                      {group.currentCycle}/{group.maxCycles}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Members
                    </span>
                    <span
                      className={`text-sm font-bold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                    >
                      {group.members}/{group.maxMembers}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div
                    className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                  >
                    <div
                      className={`h-full transition-all ${isDark ? 'bg-[#d4a574]' : 'bg-[#b8894d]'}`}
                      style={{
                        width: `${(group.currentCycle / group.maxCycles) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Next Action Date */}
                {group.status === 'active' && (
                  <div
                    className={`mb-4 p-2.5 rounded-lg text-center ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}
                  >
                    <p
                      className={`text-xs mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      {group.nextActionType === 'payment'
                        ? 'Next Payment'
                        : 'Next Draw'}
                    </p>
                    <p
                      className={`text-sm font-semibold ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                    >
                      {group.nextPaymentDate || group.nextDrawDate}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/group/${group.id}`)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${getActionButtonStyle(group.nextActionType)}`}
                  >
                    {group.nextActionType === 'payment' && (
                      <CreditCard className="w-4 h-4" />
                    )}
                    {group.nextActionType === 'draw' && (
                      <TrendingUp className="w-4 h-4" />
                    )}
                    {group.nextActionType === 'view' && (
                      <Eye className="w-4 h-4" />
                    )}
                    {group.nextAction}
                  </button>
                  <button
                    onClick={() => navigate(`/group/${group.id}`)}
                    className={`px-3 py-2.5 rounded-lg transition-all border ${
                      isDark
                        ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredGroups.length === 0 && (
            <div
              className={`text-center py-16 rounded-2xl ${
                isDark
                  ? 'bg-[#1a110d]/80 border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <Users
                className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
              />
              <h3
                className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                No groups found
              </h3>
              <p
                className={`mb-6 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}
              >
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Join a group to start saving together'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate('/join')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    isDark
                      ? 'bg-[#d4a574] text-black hover:bg-[#c49563]'
                      : 'bg-[#b8894d] text-white hover:bg-[#a37842]'
                  }`}
                >
                  Browse Groups
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyGroups;
