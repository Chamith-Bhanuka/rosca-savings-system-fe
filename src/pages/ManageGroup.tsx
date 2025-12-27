import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store.ts';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import {
  getGroupById,
  acceptJoinRequest,
  declineJoinRequest,
} from '../services/group.service';
import { useAuth } from '../context/authContext.tsx'; // Assuming you have this from your summary
import toast from 'react-hot-toast'; // Optional: for success/error messages
import { triggerGroupDraw } from '../services/group.service';
import { calculatePayoutDate } from '../utils/dateUtils';

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
}

const ManageGroup: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  //const navigate = useNavigate();
  const { user } = useAuth(); // Logged in user info
  const theme = useSelector((state: RootState) => state.theme.value);

  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}
    >
      <Navbar />
      <MegaMenu />

      <main className="flex-1 pt-[100px] px-4 md:px-8 lg:px-[10%] pb-20">
        {loading ? (
          <div className="text-center text-[#d4a574] mt-20">
            Loading Group Details...
          </div>
        ) : !group ? (
          <div className="text-center text-red-500 mt-20">Group not found.</div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* HEADER SECTION */}
            <div className="mb-10 border-b border-[#d4a574]/20 pb-6">
              <h1 className="font-['Playfair_Display'] text-4xl text-[#d4a574] mb-2">
                Manage: {group.name}
              </h1>
              <p
                className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Moderated by{' '}
                <span className="text-[#d4a574] font-medium">You</span> •{' '}
                {group.members.length} / {group.totalMembers} Members
              </p>
            </div>

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
                  {group.pendingRequests.map((req) => (
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
          </div>
        )}

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
      </main>

      <Footer />
    </div>
  );
};

export default ManageGroup;
