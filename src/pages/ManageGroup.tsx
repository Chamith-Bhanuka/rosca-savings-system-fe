import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import {
  acceptJoinRequest,
  declineJoinRequest,
  getGroupById,
  getGroupContributions,
  triggerGroupDraw,
  verifyContribution,
} from '../services/group.service';
import toast from 'react-hot-toast';
import { calculatePayoutDate } from '../utils/dateUtils';
import { useAuth } from '../context/authContext';
import { releasePayout } from '../services/payment.service';
import {
  Calendar,
  Wallet,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  Unlock,
  Users,
  Settings,
  FileText,
  ExternalLink,
  Shield,
} from 'lucide-react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  trustScore: number;
}

interface Request {
  user: User;
  requestedAt: string;
}

interface GroupData {
  _id: string;
  name: string;
  description: string;
  createdBy: User;
  pendingRequests: Request[];
  members: User[];
  totalMembers: number;
  startDate: any;
  payoutOrder: User[];
  frequency: string;
  amount: number;
  currentCycle: number;
}

interface Contribution {
  _id: string;
  member: {
    _id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  amount: number;
  paymentMethod: 'GATEWAY' | 'BANK_TRANSFER' | 'WALLET';
  status: 'PENDING' | 'PENDING_APPROVAL' | 'CONFIRMED' | 'REJECTED';
  proofUrl?: string;
  createdAt: string;
}

const ManageGroup: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';
  const { user } = useAuth();

  const [group, setGroup] = useState<GroupData | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Manage Group - Seettuwa';
  }, [theme]);

  const totalCollected = contributions
    .filter((c) => c.status === 'CONFIRMED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const targetAmount = group ? group.amount * (group.totalMembers - 1) : 0;
  const progressPercent =
    targetAmount > 0 ? Math.min((totalCollected / targetAmount) * 100, 100) : 0;
  const isPotFull = totalCollected >= targetAmount;

  const fetchData = async () => {
    try {
      if (!groupId) return;
      const groupRes = await getGroupById(groupId);
      setGroup(groupRes.data.data);

      if (groupRes.data.data) {
        const contribRes = await getGroupContributions(
          groupId,
          groupRes.data.data.currentCycle
        );
        setContributions(contribRes.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load group data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const handleJoinAction = async (
    userId: string,
    action: 'accept' | 'decline'
  ) => {
    if (!groupId) return;
    try {
      if (action === 'accept') await acceptJoinRequest(groupId, userId);
      else await declineJoinRequest(groupId, userId);
      toast.success(`User ${action}ed!`);
      fetchData();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleReleasePayout = async () => {
    if (!isPotFull) return toast.error('Pot is not full yet!');
    if (!confirm('Release funds to the winner? This cannot be undone.')) return;
    try {
      await releasePayout(groupId!, group?.currentCycle);
      toast.success('Funds released successfully!');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payout failed');
    }
  };

  const handleDraw = async () => {
    if (!confirm('Generate payout schedule? This is permanent.')) return;
    try {
      await triggerGroupDraw(group!._id);
      toast.success('Schedule generated!');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Draw failed');
    }
  };

  const handleVerify = async (
    contributionId: string,
    action: 'APPROVE' | 'REJECT'
  ) => {
    if (!confirm(`${action} this payment?`)) return;
    try {
      await verifyContribution(contributionId, action);
      toast.success(
        `Payment ${action === 'APPROVE' ? 'Confirmed' : 'Rejected'}`
      );
      fetchData();
    } catch (error: any) {
      toast.error('Action failed');
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
      >
        <div className="w-16 h-16 border-4 border-t-[#d4a574] border-[#d4a574]/20 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!group || (user && group.createdBy._id !== user.id)) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
      >
        <div
          className={`text-center p-8 rounded-2xl ${
            isDark
              ? 'bg-[#1a110d]/80 border border-white/10'
              : 'bg-white border border-gray-200'
          }`}
        >
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Access Denied
          </h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            You don't have permission to manage this group
          </p>
        </div>
      </div>
    );
  }

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
          <div
            className={`rounded-2xl p-6 mb-8 shadow-lg ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Settings
                    className={`w-8 h-8 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                  />
                  <h1
                    className={`text-3xl font-['Playfair_Display'] font-bold ${
                      isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                    }`}
                  >
                    {group.name}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isDark
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                        : 'bg-green-100 border border-green-200 text-green-700'
                    }`}
                  >
                    Active
                  </span>
                </div>
                <p
                  className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Cycle{' '}
                  <span
                    className={isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}
                  >
                    #{group.currentCycle}
                  </span>{' '}
                  Management Console
                </p>
              </div>

              <div className="flex gap-6 text-sm">
                <div className="text-right">
                  <p
                    className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                  >
                    Members
                  </p>
                  <p
                    className={`font-bold text-lg ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                  >
                    {group.members.length} / {group.totalMembers}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                  >
                    Contribution
                  </p>
                  <p
                    className={`font-bold text-lg ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                  >
                    Rs. {group.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid - Optimized Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column - Primary Actions */}
            <div className="xl:col-span-8 space-y-6">
              {/* Cycle Pot Card */}
              <div
                className={`rounded-2xl p-6 shadow-lg ${
                  isDark
                    ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2
                      className={`text-xl font-bold flex items-center gap-2 mb-1 ${
                        isDark ? 'text-[#f2f0ea]' : 'text-gray-900'
                      }`}
                    >
                      <Wallet
                        className={isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}
                      />
                      Cycle Pot Status
                    </h2>
                    <p
                      className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      Collecting funds for Cycle #{group.currentCycle}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                      }`}
                    >
                      Target
                    </p>
                    <p
                      className={`text-2xl font-bold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                    >
                      Rs. {targetAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mb-2 flex justify-between text-sm font-medium">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Collected:{' '}
                    <span className="text-green-500">
                      Rs. {totalCollected.toLocaleString()}
                    </span>
                  </span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {progressPercent.toFixed(0)}%
                  </span>
                </div>
                <div
                  className={`w-full h-3 rounded-full overflow-hidden mb-6 ${
                    isDark ? 'bg-white/10' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`h-full transition-all duration-500 ${
                      isDark
                        ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e]'
                        : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635]'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div
                  className={`p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isDark ? 'bg-white/5' : 'bg-gray-50'
                  }`}
                >
                  <div>
                    <p
                      className={`text-sm font-bold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                    >
                      Winner:{' '}
                      <span
                        className={isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}
                      >
                        {group.payoutOrder[group.currentCycle - 1]?.firstName ||
                          'TBD'}
                      </span>
                    </p>
                    {!isPotFull && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Waiting for all members to pay
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleReleasePayout}
                    disabled={!isPotFull}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${
                      isPotFull
                        ? isDark
                          ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg'
                          : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg'
                        : 'bg-gray-600/30 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isPotFull ? (
                      <Unlock className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    Release Funds
                  </button>
                </div>
              </div>

              {/* Payment Verification */}
              <div
                className={`rounded-2xl p-6 shadow-lg ${
                  isDark
                    ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <h2
                  className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                    isDark ? 'text-[#f2f0ea]' : 'text-gray-900'
                  }`}
                >
                  <FileText className="text-blue-500" />
                  Payment Verification
                </h2>

                {contributions.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-blue-500/10' : 'bg-blue-50'
                      }`}
                    >
                      <FileText
                        className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-blue-500'}`}
                      />
                    </div>
                    <p
                      className={`font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      No payments yet
                    </p>
                    <p
                      className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                    >
                      Payments will appear here once members contribute
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contributions.map((c) => (
                      <div
                        key={c._id}
                        className={`p-4 rounded-xl border transition-all ${
                          isDark
                            ? 'bg-white/5 border-white/10 hover:border-white/20'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden text-sm font-bold ${
                                isDark
                                  ? 'bg-[#d4a574] text-black'
                                  : 'bg-[#b8894d] text-white'
                              }`}
                            >
                              {c.member.avatarUrl ? (
                                <img
                                  src={c.member.avatarUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                c.member.firstName[0]
                              )}
                            </div>
                            <div>
                              <p
                                className={`font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                              >
                                {c.member.firstName} {c.member.lastName}
                              </p>
                              <p
                                className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                              >
                                {new Date(c.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="text-center">
                            <p
                              className={`font-bold ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                            >
                              Rs. {c.amount?.toLocaleString()}
                            </p>
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded ${
                                c.paymentMethod === 'GATEWAY'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}
                            >
                              {c.paymentMethod === 'BANK_TRANSFER'
                                ? 'Manual'
                                : 'Stripe'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {c.status === 'CONFIRMED' && (
                              <span className="text-green-500 font-bold text-sm flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Received
                              </span>
                            )}
                            {c.status === 'REJECTED' && (
                              <span className="text-red-500 font-bold text-sm flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                Rejected
                              </span>
                            )}
                            {c.status === 'PENDING_APPROVAL' && (
                              <>
                                {c.proofUrl && (
                                  <a
                                    href={c.proofUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-400 underline flex items-center gap-1 mr-2"
                                  >
                                    View Slip{' '}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                                <button
                                  onClick={() => handleVerify(c._id, 'REJECT')}
                                  className={`p-2 rounded transition ${
                                    isDark
                                      ? 'hover:bg-red-500/20 text-red-400'
                                      : 'hover:bg-red-100 text-red-600'
                                  }`}
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleVerify(c._id, 'APPROVE')}
                                  className="p-2 rounded bg-green-600 text-white hover:bg-green-500 transition"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            {c.status === 'PENDING' && (
                              <span className="text-yellow-500 text-sm italic">
                                Processing...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Secondary Info */}
            <div className="xl:col-span-4 space-y-6">
              {/* Join Requests */}
              <div
                className={`rounded-2xl p-6 shadow-lg ${
                  isDark
                    ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <h3
                  className={`font-bold mb-4 flex items-center justify-between ${
                    isDark ? 'text-[#f2f0ea]' : 'text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Join Requests
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isDark
                        ? 'bg-[#d4a574] text-black'
                        : 'bg-[#b8894d] text-white'
                    }`}
                  >
                    {group.pendingRequests.length}
                  </span>
                </h3>

                {group.pendingRequests.length === 0 ? (
                  <p
                    className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                  >
                    No new requests
                  </p>
                ) : (
                  <div className="space-y-3">
                    {group.pendingRequests.map((req: any) => (
                      <div
                        key={req.user._id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isDark
                            ? 'bg-white/5 border-white/10'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              isDark
                                ? 'bg-[#d4a574] text-black'
                                : 'bg-[#b8894d] text-white'
                            }`}
                          >
                            {req.user.firstName[0]}
                          </div>
                          <div>
                            <p
                              className={`text-sm font-bold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                            >
                              {req.user.firstName}
                            </p>
                            <p
                              className={`text-[10px] ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                            >
                              Score: {req.user.trustScore}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleJoinAction(req.user._id, 'decline')
                            }
                            className={`p-1.5 rounded transition ${
                              isDark
                                ? 'hover:bg-red-500/20 text-red-400'
                                : 'hover:bg-red-100 text-red-600'
                            }`}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleJoinAction(req.user._id, 'accept')
                            }
                            className={`p-1.5 rounded transition ${
                              isDark
                                ? 'bg-[#d4a574] text-black hover:bg-[#c39464]'
                                : 'bg-[#b8894d] text-white hover:bg-[#a67a42]'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payout Schedule */}
              <div
                className={`rounded-2xl p-6 shadow-lg ${
                  isDark
                    ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`font-bold flex items-center gap-2 ${
                      isDark ? 'text-[#f2f0ea]' : 'text-gray-900'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    Schedule
                  </h3>
                  {group.payoutOrder.length === 0 &&
                    group.members.length === group.totalMembers && (
                      <button
                        onClick={handleDraw}
                        className={`text-xs px-3 py-1 rounded font-bold transition animate-pulse ${
                          isDark
                            ? 'bg-[#d4a574] text-black hover:bg-[#c39464]'
                            : 'bg-[#b8894d] text-white hover:bg-[#a67a42]'
                        }`}
                      >
                        Start Draw
                      </button>
                    )}
                </div>

                {group.payoutOrder.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {group.payoutOrder.map((u, i) => {
                      const isCurrent = i + 1 === group.currentCycle;
                      const isPast = i + 1 < group.currentCycle;

                      return (
                        <div
                          key={u._id}
                          className={`flex items-center justify-between p-2 rounded text-sm transition ${
                            isCurrent
                              ? isDark
                                ? 'bg-[#d4a574]/20 border border-[#d4a574]/50'
                                : 'bg-[#b8894d]/20 border border-[#b8894d]/50'
                              : isDark
                                ? 'hover:bg-white/5'
                                : 'hover:bg-gray-50'
                          } ${isPast ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-mono text-xs ${
                                isCurrent
                                  ? isDark
                                    ? 'text-[#d4a574] font-bold'
                                    : 'text-[#b8894d] font-bold'
                                  : isDark
                                    ? 'text-gray-500'
                                    : 'text-gray-500'
                              }`}
                            >
                              #{i + 1}
                            </span>
                            <span
                              className={
                                isCurrent
                                  ? isDark
                                    ? 'text-[#f2f0ea]'
                                    : 'text-gray-900'
                                  : isDark
                                    ? 'text-gray-400'
                                    : 'text-gray-600'
                              }
                            >
                              {u.firstName} {u.lastName}
                            </span>
                          </div>
                          <span
                            className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                          >
                            {calculatePayoutDate(
                              group.startDate,
                              i,
                              group.frequency
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className={`text-center py-6 border-2 border-dashed rounded-xl ${
                      isDark ? 'border-white/10' : 'border-gray-300'
                    }`}
                  >
                    <Calendar
                      className={`mx-auto mb-2 w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
                    />
                    <p
                      className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                    >
                      {group.members.length < group.totalMembers
                        ? 'Waiting for members...'
                        : 'Ready to draw!'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ManageGroup;
