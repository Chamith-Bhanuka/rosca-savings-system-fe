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
import { useAuth } from '../context/authContext.tsx';
import { releasePayout } from '../services/payment.service.ts';

// ... existing interfaces ...
// Types based on your backend response
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
  payoutOrder: any;
  frequency: any;
  amount: any;
  currentCycle: any;
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
  const [group, setGroup] = useState<GroupData | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // FETCH GROUP DATA
  const fetchGroupData = async () => {
    try {
      if (!groupId) return;

      // 1. Get Group Details
      const groupRes = await getGroupById(groupId);
      setGroup(groupRes.data.data);

      // 2. Get Contributions for the CURRENT cycle
      // (You can add a dropdown later to select cycle, for now default to current)
      if (groupRes.data.data) {
        const contribRes = await getGroupContributions(
          groupId,
          groupRes.data.data.currentCycle
        );
        setContributions(contribRes.data.data);
        console.log('Here is data 😡:', contribRes.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load group data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  // 1. Fetch Group Data
  const fetchGroup = async () => {
    try {
      if (!groupId) return;
      console.log('GroupID: ', groupId);
      const res = await getGroupById(groupId);
      setGroup(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  // 2. Handle Actions
  const handleAction = async (userId: string, action: 'accept' | 'decline') => {
    if (!groupId) return;
    try {
      if (action === 'accept') {
        await acceptJoinRequest(groupId, userId);
        toast.success('User accepted!');
      } else {
        await declineJoinRequest(groupId, userId);
        toast.success('User declined.');
      }
      // Refresh list
      fetchGroup();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${action} request.`);
    }
  };

  const handleReleasePayout = async () => {
    if (!confirm("Release total pool funds to this cycle's winner?")) return;
    try {
      await releasePayout(groupId!, group?.currentCycle);
      toast.success('Funds released successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payout failed');
    }
  };

  // 3. Security Check (Frontend only)
  if (!loading && group && user && group.createdBy._id !== user.id) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1a1a1a] text-[#d4a574]">
        Access Denied. You are not the moderator of this group.
      </div>
    );
  }

  const handleDraw = async () => {
    if (!confirm('Are you sure? This will permanently set the payout order.'))
      return;
    try {
      if (!group) return; // Add check
      await triggerGroupDraw(group._id);
      toast.success('Draw completed! Schedule generated.');
      fetchGroup(); // Refresh data to show the new list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Draw failed');
    }
  };

  // HANDLE VERIFICATION (Approve/Reject)
  const handleVerify = async (
    contributionId: string,
    action: 'APPROVE' | 'REJECT'
  ) => {
    if (!confirm(`Are you sure you want to ${action} this payment?`)) return;

    try {
      await verifyContribution(contributionId, action);
      toast.success(
        `Payment ${action === 'APPROVE' ? 'CONFIRMED' : 'Rejected'}`
      );
      fetchGroupData(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-[#d4a574]">Loading...</div>;
  if (!group) return <div>Group not found</div>;

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}
    >
      <Navbar />
      <MegaMenu />

      <main className="flex-1 pt-[100px] px-4 md:px-8 lg:px-[10%] pb-20">
        {/* ... (Your Existing Group Header) ... */}
        {/* HEADER SECTION */}
        <div className="mb-10 border-b border-[#d4a574]/20 pb-6">
          <h1 className="font-['Playfair_Display'] text-4xl text-[#d4a574] mb-2">
            Manage: {group.name}
          </h1>
          <p
            className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Moderated by <span className="text-[#d4a574] font-medium">You</span>{' '}
            • {group.members.length} / {group.totalMembers} Members
          </p>
        </div>
        <div className="mb-10 border-b border-[#d4a574]/20 pb-6">
          <h1 className="font-['Playfair_Display'] text-4xl text-[#d4a574] mb-2">
            {group.name}
          </h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Cycle {group.currentCycle} Management
          </p>
        </div>
        {/* ... (Your Existing Pending Join Requests Section) ... */}
        {/* PENDING REQUESTS SECTION */}
        <section>
          <h2
            className={`text-xl font-semibold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
          >
            Pending Join Requests
            <span className="bg-[#d4a574]/20 text-[#d4a574] text-xs px-2 py-1 rounded-full border border-[#d4a574]/30">
              {group.pendingRequests.length}
            </span>
          </h2>

          {group.pendingRequests.length === 0 ? (
            <div
              className={`p-8 rounded-lg border border-dashed flex flex-col items-center justify-center ${theme === 'dark' ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-50'}`}
            >
              <p className="text-gray-500">
                No pending requests at the moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {group.pendingRequests.map((req: any) => (
                <div
                  key={req.user._id}
                  className={`p-5 rounded-lg border transition-all flex flex-col sm:flex-row items-center justify-between gap-4
                        ${
                          theme === 'dark'
                            ? 'bg-[#1a1a1a] border-[#d4a574]/20 hover:border-[#d4a574]/50'
                            : 'bg-white border-gray-200 hover:border-[#b8894d]/50 shadow-sm'
                        }`}
                >
                  {/* User Info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4a574] to-[#a3784e] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#d4a574]/20">
                      {/* Fallback avatar is initials */}
                      {req.user.avatarUrl ? (
                        <img
                          src={req.user.avatarUrl}
                          alt="avatar"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        `${req.user?.firstName[0]}${req.user?.lastName[0]}`
                      )}
                    </div>
                    <div>
                      <h3
                        className={`font-semibold text-lg ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                      >
                        {req.user.firstName} {req.user.lastName}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{req.user.email}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                        <span className="text-[#d4a574]">
                          Trust Score: {req.user.trustScore}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleAction(req.user._id, 'decline')}
                      className={`px-4 py-2 rounded-md text-sm font-medium border transition-all
                            ${
                              theme === 'dark'
                                ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                : 'border-red-200 text-red-600 hover:bg-red-50'
                            }`}
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAction(req.user._id, 'accept')}
                      className="px-6 py-2 rounded-md text-sm font-bold text-white shadow-lg shadow-[#d4a574]/20 hover:translate-y-[-2px] hover:shadow-[#d4a574]/40 transition-all bg-gradient-to-br from-[#d4a574] to-[#a3784e]"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* PAYOUT SCHEDULE SECTION */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
            >
              Payout Schedule
            </h2>

            {/* SHOW BUTTON ONLY IF: Group Full + Start Date Reached + No Order Yet */}
            {group &&
              group.members.length === group.totalMembers &&
              new Date() >= new Date(group.startDate) &&
              group.payoutOrder.length === 0 && (
                <button
                  onClick={handleDraw}
                  className="px-6 py-2 rounded-md font-bold text-black bg-[#d4a574] hover:bg-[#b8894d] transition-all shadow-lg animate-pulse"
                >
                  🎲 Start Lucky Draw
                </button>
              )}
          </div>

          {/* TABLE DISPLAY */}
          {group && group.payoutOrder.length > 0 ? (
            <div
              className={`overflow-hidden rounded-lg border ${theme === 'dark' ? 'border-[#d4a574]/20 bg-white/5' : 'border-gray-200 bg-white'}`}
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className={`border-b ${theme === 'dark' ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-600'}`}
                  >
                    <th className="p-4 font-medium">Cycle</th>
                    <th className="p-4 font-medium">Payout Date</th>
                    <th className="p-4 font-medium">Recipient (Winner)</th>
                    <th className="p-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {group.payoutOrder.map((member: any, index: number) => (
                    <tr
                      key={index}
                      className={`border-b last:border-0 hover:bg-white/5 transition-colors
                ${member._id === user?.id ? (theme === 'dark' ? 'bg-[#d4a574]/10' : 'bg-[#d4a574]/10') : ''}`}
                    >
                      <td className="p-4 font-mono text-[#d4a574]">
                        #{index + 1}
                      </td>
                      <td
                        className={`p-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {calculatePayoutDate(
                          group.startDate,
                          index,
                          group.frequency
                        )}
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
                          {/* Safety check for avatar */}
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt="av"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-white">
                              {member.firstName?.[0]}
                            </div>
                          )}
                        </div>
                        <span
                          className={
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }
                        >
                          {member.firstName} {member.lastName}
                          {/* Identify Moderator */}
                          {member._id === group.createdBy._id && (
                            <span className="ml-2 text-[10px] border border-[#d4a574] text-[#d4a574] px-1 rounded">
                              MOD
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-[#d4a574]">
                        Rs. {group.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-gray-600 rounded-lg text-gray-500">
              Draw has not started yet. Waiting for group to fill or start date.
            </div>
          )}
        </section>
        {/* NEW: PAYMENT MANAGEMENT SECTION */}
        <section className="mt-12">
          <h2
            className={`text-xl font-semibold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
          >
            Cycle {group.currentCycle} Payments
            <span className="text-sm font-normal text-gray-500">
              (Total Collected: Rs.{' '}
              {contributions
                .filter((c) => c.status === 'CONFIRMED')
                .reduce((acc, curr) => acc + curr.amount, 0)}
              )
            </span>
          </h2>

          {contributions.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-gray-600 rounded-lg text-gray-500">
              No payments found for this cycle yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {contributions.map((contrib) => (
                <div
                  key={contrib._id}
                  className={`p-4 rounded-lg border flex flex-col md:flex-row items-center justify-between gap-4
                     ${theme === 'dark' ? 'bg-[#1a1a1a] border-[#d4a574]/20' : 'bg-white border-gray-200 shadow-sm'}`}
                >
                  {/* MEMBER INFO */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
                      {contrib.member?.avatarUrl ? (
                        <img
                          src={contrib.member.avatarUrl}
                          alt="av"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold">
                          {contrib.member?.firstName?.[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <div
                        className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
                      >
                        {contrib.member?.firstName} {contrib.member?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(contrib.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* PAYMENT METHOD & STATUS */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-[#d4a574] font-bold">
                      Rs. {contrib.amount}
                    </div>

                    {contrib.paymentMethod === 'GATEWAY' && (
                      <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide">
                        STRIPE (AUTO)
                      </span>
                    )}
                    {contrib.paymentMethod === 'BANK_TRANSFER' && (
                      <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide">
                        SLIP UPLOAD
                      </span>
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {/* 1. Verified State */}
                    {contrib.status === 'CONFIRMED' && (
                      <span className="flex items-center gap-1 text-green-500 font-medium">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Received
                      </span>
                    )}

                    {/* 2. Rejected State */}
                    {contrib.status === 'REJECTED' && (
                      <span className="text-red-500 font-medium">Rejected</span>
                    )}

                    {/* 3. Pending Manual Approval */}
                    {contrib.status === 'PENDING_APPROVAL' && (
                      <>
                        <a
                          href={contrib.proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm underline text-blue-400 hover:text-blue-300"
                        >
                          View Slip
                        </a>
                        <div className="h-6 w-[1px] bg-gray-600 mx-2"></div>
                        <button
                          onClick={() => handleVerify(contrib._id, 'REJECT')}
                          className="px-3 py-1.5 rounded text-xs font-bold border border-red-500 text-red-500 hover:bg-red-500/10 transition"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleVerify(contrib._id, 'APPROVE')}
                          className="px-3 py-1.5 rounded text-xs font-bold bg-green-600 text-white hover:bg-green-500 transition shadow-lg shadow-green-900/20"
                        >
                          Approve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/*// 3. The Button UI (Place this near the Total Collected amount)*/}
        <div className="flex justify-between items-center bg-[#d4a574]/10 p-4 rounded-lg border border-[#d4a574]/30 mb-6">
          <div>
            <h3 className="font-bold text-[#d4a574]">
              Cycle #{group.currentCycle} Payout
            </h3>
            <p className="text-xs text-gray-500">
              Winner: {group.payoutOrder[group.currentCycle - 1]?.firstName}
            </p>
          </div>

          <button
            onClick={handleReleasePayout}
            className="bg-[#d4a574] hover:bg-[#b8894d] text-black font-bold py-2 px-6 rounded shadow-lg flex items-center gap-2"
          >
            <span>💰 Release Funds</span>
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageGroup;
