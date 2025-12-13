import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store.ts';
import {
  Search,
  Filter,
  Users,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  ChevronDown,
  Star,
  Lock,
  UserPlus,
  Crown,
} from 'lucide-react';

import Navbar from '../components/NavBar.tsx';
import Footer from '../components/Footer';
import Toast from '../components/Toast.tsx';
import MegaMenu from '../components/MegaMenu.tsx';
import { getAllGroups, joinUser } from '../services/group.service.ts';
import Pagination from '../components/Pagination.tsx';
import { useAuth } from '../context/authContext';

interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

const JoinGroup: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { user } = useAuth();
  // Filter states
  const [filters, setFilters] = useState({
    minAmount: 0,
    maxAmount: 20000,
    frequency: 'all',
    groupSize: 'all',
    status: 'all',
  });

  const [myGroups, setGroups] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Join a Seettuwa Group';
  }, [theme]);

  useEffect(() => {
    fetchAllGroups();
  }, []);

  const fetchAllGroups = async (pageNumber = 1) => {
    try {
      const res = await getAllGroups(pageNumber, 4);
      const groups = await res.data;

      const mappedGroups = groups.map((g: any) => ({
        id: g._id,
        name: g.name,
        description: g.description,
        amount: g.amount,
        frequency: g.frequency.toLowerCase(),
        currentCycle: g.currentCycle,
        maxCycles: g.maxCycles,
        membersCount: g.members.length,
        members: g.members.map((m: any) => String(m)),
        totalMembers: g.totalMembers,
        pendingRequests: g.pendingRequests.map((p: any) => ({
          user: String(p.user),
          requestedAt: p.requestedAt,
        })),
        createdUserName: g.createdUserName || 'Unknown',
        createdBy: String(g.createdBy),
        rating: parseFloat(g.rating || 0.0),
        status: g.status.toLowerCase(),
        badges: g.badges || [],
      }));

      setGroups(mappedGroups || []);
      setTotalPage(res?.totalPages);
      setPage(pageNumber);
    } catch (error: any) {
      console.error(error);
    }
  };

  const isDark = theme === 'dark';

  const addToast = (type: ToastMessage['type'], message: string) => {
    // eslint-disable-next-line react-hooks/purity
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleJoinGroup = async (group: any) => {
    // prevent joining inactive or full groups
    if (group.status === 'closed' || group.membersCount >= group.totalMembers) {
      addToast('error', 'This group is full or closed.');
      return;
    }

    if (group.members.includes(user.id)) {
      addToast('warning', `You're already a member of ${group.name}.`);
      return;
    }

    if (group.pendingRequests.some((req: any) => req.user === user.id)) {
      addToast(
        'info',
        `Your request to join ${group.name} is pending approval.`
      );
      return;
    }

    try {
      const res = await joinUser(group);
      console.log(res);

      if (res.joined) {
        setGroups((prev) =>
          prev.map((g) =>
            g.id === group.id
              ? {
                  ...g,
                  members: [...g.members, user.id],
                  membersCount: g.membersCount + 1,
                }
              : g
          )
        );

        addToast('success', `You've successfully joined ${group.name}!`);
      } else if (res.pending) {
        setGroups((prev) =>
          prev.map((g) =>
            g.id === group.id
              ? {
                  ...g,
                  pendingRequests: [
                    ...g.pendingRequests,
                    { user: user.id, requestedAt: new Date().toISOString() },
                  ],
                }
              : g
          )
        );

        addToast(
          'info',
          `Your request to join ${group.name} is awaiting approval.`
        );
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to join group.';
      addToast('error', message);
    }
  };

  const filteredGroups = myGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAmount =
      group.amount >= filters.minAmount && group.amount <= filters.maxAmount;

    const matchesFrequency =
      filters.frequency === 'all' || group.frequency === filters.frequency;

    const matchesSize =
      filters.groupSize === 'all' ||
      (filters.groupSize === 'small' && group.totalMembers <= 10) ||
      (filters.groupSize === 'medium' &&
        group.totalMembers > 10 &&
        group.totalMembers <= 20) ||
      (filters.groupSize === 'large' && group.totalMembers > 20);

    const matchesStatus =
      filters.status === 'all' || group.status === filters.status;

    return (
      matchesSearch &&
      matchesAmount &&
      matchesFrequency &&
      matchesSize &&
      matchesStatus
    );
  });

  const getButtonState = (group: (typeof myGroups)[0]) => {
    if (group.createdBy === user.id) {
      return {
        disabled: true,
        text: 'You are the moderator',
        icon: Crown,
        variant: 'disabled',
      };
    }
    if (group.members?.includes(user.id)) {
      return {
        disabled: true,
        text: 'Already Joined',
        icon: CheckCircle,
        variant: 'success',
      };
    }
    if (group.pendingRequests.some((req: any) => req.user === user.id)) {
      return {
        disabled: true,
        text: 'Pending Approval',
        icon: Clock,
        variant: 'warning',
      };
    }
    if (group.status === 'closed' || group.membersCount >= group.totalMembers) {
      return {
        disabled: true,
        text: 'Group Full',
        icon: Lock,
        variant: 'disabled',
      };
    }
    const isAutoAccept = group.badges.includes('Auto-Accept');
    return {
      disabled: false,
      text: isAutoAccept ? 'Join Now' : 'Request to Join',
      icon: UserPlus,
      variant: 'primary',
    };
  };

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <Navbar />

      <MegaMenu />

      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
            isDark={isDark}
          />
        ))}
      </div>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <h1
              className={`text-4xl sm:text-5xl font-['Playfair_Display'] font-extrabold mb-2 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
            >
              Discover Groups
            </h1>
            <p
              className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Find and join savings circles that match your goals
            </p>
          </header>

          {/* Search and Filters */}
          <div
            className={`rounded-2xl p-6 mb-8 shadow-lg ${isDark ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10' : 'bg-white border border-gray-200'}`}
          >
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              />
              <input
                type="text"
                placeholder="Search groups by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-lg text-sm font-medium transition-all focus:ring-2 outline-none ${
                  isDark
                    ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#d4a574] focus:ring-[#d4a574]/50'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                }`}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Amount Range */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Contribution Amount
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minAmount}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          minAmount: Number(e.target.value),
                        })
                      }
                      className={`w-full px-3 py-2 rounded-lg text-sm transition-all focus:ring-2 outline-none ${
                        isDark
                          ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#d4a574] focus:ring-[#d4a574]/50'
                          : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                      }`}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAmount}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          maxAmount: Number(e.target.value),
                        })
                      }
                      className={`w-full px-3 py-2 rounded-lg text-sm transition-all focus:ring-2 outline-none ${
                        isDark
                          ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#d4a574] focus:ring-[#d4a574]/50'
                          : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                      }`}
                    />
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Frequency
                  </label>
                  <select
                    value={filters.frequency}
                    onChange={(e) =>
                      setFilters({ ...filters, frequency: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg text-sm transition-all focus:ring-2 outline-none ${
                      isDark
                        ? 'bg-white/5 border border-white/10 text-white focus:border-[#d4a574] focus:ring-[#d4a574]/50 [&>option]:bg-[#1a110d] [&>option]:text-white'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                    }`}
                  >
                    <option value="all">All</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* Group Size */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Group Size
                  </label>
                  <select
                    value={filters.groupSize}
                    onChange={(e) =>
                      setFilters({ ...filters, groupSize: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg text-sm transition-all focus:ring-2 outline-none ${
                      isDark
                        ? 'bg-white/5 border border-white/10 text-white focus:border-[#d4a574] focus:ring-[#d4a574]/50 [&>option]:bg-[#1a110d] [&>option]:text-white'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                    }`}
                  >
                    <option value="all">All</option>
                    <option value="small">Small (≤10)</option>
                    <option value="medium">Medium (11-20)</option>
                    <option value="large">Large (&gt;20)</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg text-sm transition-all focus:ring-2 outline-none ${
                      isDark
                        ? 'bg-white/5 border border-white/10 text-white focus:border-[#d4a574] focus:ring-[#d4a574]/50 [&>option]:bg-[#1a110d] [&>option]:text-white'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-[#b8894d] focus:ring-[#b8894d]/30'
                    }`}
                  >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div
            className={`mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Found {filteredGroups.length} group
            {filteredGroups.length !== 1 ? 's' : ''}
          </div>

          {/* Group Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredGroups.map((group) => {
              const buttonState = getButtonState(group);
              const ButtonIcon = buttonState.icon;

              return (
                <div
                  key={group.id}
                  className={`rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl ${
                    isDark
                      ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10 hover:border-white/20'
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3
                        className={`text-xl font-bold mb-1 ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                      >
                        {group.name}
                      </h3>
                      <p
                        className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        Created by {group.createdUserName}
                      </p>
                    </div>

                    {/* Trust Score */}
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                        isDark ? 'bg-[#d4a574]/20' : 'bg-amber-100'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'} fill-current`}
                      />
                      <span
                        className={`text-sm font-semibold ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                      >
                        {group.rating}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4 min-h-[28px]">
                    {group.badges.map((badge: any) => (
                      <span
                        key={badge}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          badge === 'Trusted'
                            ? isDark
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-green-100 text-green-700'
                            : badge === 'Premium'
                              ? isDark
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-purple-100 text-purple-700'
                              : badge === 'Auto-Accept'
                                ? isDark
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-blue-100 text-blue-700'
                                : isDark
                                  ? 'bg-orange-500/20 text-orange-400'
                                  : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {badge === 'Invite-Only' && (
                          <Lock className="w-3 h-3 inline mr-1" />
                        )}
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p
                    className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {group.description}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div
                      className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      <DollarSign
                        className={`w-4 h-4 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                      />
                      <div>
                        <p className="text-xs text-gray-500">Contribution</p>
                        <p className="text-sm font-semibold">
                          LKR {group.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      <Calendar
                        className={`w-4 h-4 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                      />
                      <div>
                        <p className="text-xs text-gray-500">Frequency</p>
                        <p className="text-sm font-semibold capitalize">
                          {group.frequency}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      <Users
                        className={`w-4 h-4 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                      />
                      <div>
                        <p className="text-xs text-gray-500">Members</p>
                        <p className="text-sm font-semibold">
                          {group.membersCount}/{group.totalMembers}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      <Clock
                        className={`w-4 h-4 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                      />
                      <div>
                        <p className="text-xs text-gray-500">Cycle</p>
                        <p className="text-sm font-semibold">
                          {group.currentCycle}/{group.maxCycles}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div
                      className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                    >
                      <div
                        className={`h-full transition-all ${isDark ? 'bg-[#d4a574]' : 'bg-[#b8894d]'}`}
                        style={{
                          width: `${(group.membersCount / group.totalMembers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={() => handleJoinGroup(group)}
                    disabled={buttonState.disabled}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                      buttonState.variant === 'primary'
                        ? isDark
                          ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:translate-y-[-1px] hover:shadow-lg hover:shadow-[#d4a574]/30'
                          : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:translate-y-[-1px] hover:shadow-lg hover:shadow-[#b8894d]/30'
                        : buttonState.variant === 'success'
                          ? isDark
                            ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                            : 'bg-green-100 text-green-700 cursor-not-allowed'
                          : buttonState.variant === 'warning'
                            ? isDark
                              ? 'bg-yellow-500/20 text-yellow-400 cursor-not-allowed'
                              : 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                            : isDark
                              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ButtonIcon className="w-5 h-5" />
                    {buttonState.text}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredGroups.length === 0 && (
            <div
              className={`text-center py-16 rounded-2xl ${isDark ? 'bg-[#1a110d]/80 border border-white/10' : 'bg-white border border-gray-200'}`}
            >
              <Search
                className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
              />
              <h3
                className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                No groups found
              </h3>
              <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </main>

      <Pagination
        currentPage={page}
        totalPages={totalPage}
        onPageChange={fetchAllGroups}
        isDark={isDark}
      />

      <Footer />
    </div>
  );
};

export default JoinGroup;
