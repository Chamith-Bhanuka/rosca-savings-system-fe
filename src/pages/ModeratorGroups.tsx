import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store.ts';
import {
  Users,
  DollarSign,
  Calendar,
  Clock,
  Star,
  Shield,
  CheckCircle,
  AlertTriangle,
  Settings,
  Mail,
  Search,
  X,
} from 'lucide-react';

import Navbar from '../components/NavBar.tsx';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer.tsx';
import { getAllGroups } from '../services/group.service.ts';
import Pagination from '../components/Pagination.tsx';

interface Member {
  id: string;
  name: string;
  email: string;
  trustScore: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  avatar: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

interface ModeratorGroup {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  currentCycle: number;
  maxCycles: number;
  members: Member[];
  disputeCount: number;
  status: string;
}

const ModeratorGroups: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<ModeratorGroup | null>(
    null
  );
  const [myGroups, setGroups] = useState<ModeratorGroup[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'My Managed Groups | Seettuwa';
  }, [theme]);

  const fetchAllGroups = async (pageNumber = 1) => {
    try {
      const res = await getAllGroups(pageNumber, 6, 'created');
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
        members: g.members.map((m: any, idx: number) => ({
          ...m,
          id: m._id || m.id || `member-${idx}`,
        })),
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
        disputeCount: g.disputeCount || 0,
      }));

      setGroups(mappedGroups || []);
      setTotalPage(res?.totalPages || 1);
      setPage(pageNumber);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      setGroups([]);
    }
  };

  useEffect(() => {
    fetchAllGroups();
  }, []);

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return isDark
          ? 'bg-green-500/20 text-green-400'
          : 'bg-green-100 text-green-700';
      case 'pending':
        return isDark
          ? 'bg-yellow-500/20 text-yellow-400'
          : 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return isDark
          ? 'bg-red-500/20 text-red-400'
          : 'bg-red-100 text-red-700';
      default:
        return isDark
          ? 'bg-gray-500/20 text-gray-400'
          : 'bg-gray-100 text-gray-700';
    }
  };

  const filteredGroups = myGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <Navbar />
      <MegaMenu />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield
                className={`w-10 h-10 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
              />
              <h1
                className={`text-4xl sm:text-5xl font-['Playfair_Display'] font-extrabold ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
              >
                Managed Groups
              </h1>
            </div>
            <p
              className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Oversee and manage your created groups
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
                placeholder="Search managed groups..."
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

          {/* Groups Grid */}
          {filteredGroups.length > 0 ? (
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

                    {/* Dispute Alert */}
                    {group.disputeCount > 0 && (
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg mb-2 ${
                          isDark
                            ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                            : 'bg-red-100 border border-red-300 text-red-700'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-semibold">
                          {group.disputeCount} Dispute
                          {group.disputeCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
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
                        {group.members.length}
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
                          width: `${Math.min((group.currentCycle / group.maxCycles) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Member Avatars Preview */}
                  <div
                    className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        Members
                      </span>
                      <button
                        onClick={() => setSelectedGroup(group)}
                        className={`text-xs font-semibold ${isDark ? 'text-[#d4a574] hover:text-[#c49563]' : 'text-[#b8894d] hover:text-[#a37842]'}`}
                      >
                        View All
                      </button>
                    </div>
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 5).map((member) => (
                        <div
                          key={member.id}
                          title={member.name}
                          className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden text-xs font-bold border-2 ${
                            isDark
                              ? 'bg-[#d4a574] text-black border-[#1a110d]'
                              : 'bg-[#b8894d] text-white border-white'
                          }`}
                        >
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>
                              {member.firstName?.[0]?.toUpperCase() || ''}
                              {member.lastName?.[0]?.toUpperCase() || ''}
                            </span>
                          )}
                        </div>
                      ))}
                      {group.members.length > 5 && (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                            isDark
                              ? 'bg-gray-700 text-gray-300 border-[#1a110d]'
                              : 'bg-gray-300 text-gray-700 border-white'
                          }`}
                        >
                          +{group.members.length - 5}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/groups/manage/${group.id}`)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isDark
                        ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg hover:shadow-[#d4a574]/30'
                        : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg hover:shadow-[#b8894d]/30'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Manage Group
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div
              className={`text-center py-16 rounded-2xl ${
                isDark
                  ? 'bg-[#1a110d]/80 border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <Shield
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
                  : 'Create your first group to get started'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate('/groups/create')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    isDark
                      ? 'bg-[#d4a574] text-black hover:bg-[#c49563]'
                      : 'bg-[#b8894d] text-white hover:bg-[#a37842]'
                  }`}
                >
                  Create Group
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredGroups.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPage}
              onPageChange={fetchAllGroups}
              isDark={isDark}
            />
          )}
        </div>
      </main>

      {/* Members Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
              isDark
                ? 'bg-[#1a110d] border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Modal Header */}
            <div
              className={`sticky top-0 p-6 border-b ${isDark ? 'bg-[#1a110d] border-white/10' : 'bg-white border-gray-200'} z-10`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className={`text-2xl font-bold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                  >
                    {selectedGroup.name}
                  </h2>
                  <p
                    className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {selectedGroup.members.length} Members
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className={`p-2 rounded-lg transition-all ${
                    isDark
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-3">
                {selectedGroup.members.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden text-sm font-bold ${
                          isDark
                            ? 'bg-[#d4a574] text-black'
                            : 'bg-[#b8894d] text-white'
                        }`}
                      >
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={`${member.firstName} ${member.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {member.firstName?.[0]?.toUpperCase() || ''}
                            {member.lastName?.[0]?.toUpperCase() || ''}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <p
                          className={`font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                        >
                          {member.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail
                            className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                          />
                          <span
                            className={
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }
                          >
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Trust Score */}
                      <div
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                          isDark ? 'bg-[#d4a574]/20' : 'bg-amber-100'
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'} fill-current`}
                        />
                        <span
                          className={`text-sm font-semibold ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                        >
                          {member.trustScore}
                        </span>
                      </div>

                      {/* Payment Status */}
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getPaymentStatusColor(member.paymentStatus)}`}
                      >
                        {member.paymentStatus === 'paid' && (
                          <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                        )}
                        {member.paymentStatus === 'overdue' && (
                          <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                        )}
                        {member.paymentStatus === 'pending' && (
                          <Clock className="w-3.5 h-3.5 inline mr-1" />
                        )}
                        {member?.paymentStatus?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ModeratorGroups;
