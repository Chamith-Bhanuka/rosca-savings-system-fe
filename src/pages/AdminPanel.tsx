import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  X,
  FileText,
  Image as ImageIcon,
  Mail,
} from 'lucide-react';
import { getAllDisputes, resolveDispute } from '../services/dispute.service.ts';

interface Dispute {
  _id: string;
  ticketId: string;
  subject: string;
  description: string;
  evidenceUrl?: string;
  status: 'OPEN' | 'RESOLVED' | 'REJECTED';
  initiator: { firstName: string; lastName: string; email: string };
  group: { name: string };
  createdAt: string;
  adminResponse?: string;
}

const AdminPanel: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Dispute | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Admin Panel - Seettuwa';
  }, [theme]);

  useEffect(() => {
    fetchAllDisputes();
  }, []);

  const fetchAllDisputes = async () => {
    try {
      const disputes = await getAllDisputes();
      setDisputes(disputes);
    } catch (error) {
      console.error('Admin Access Error', error);
      alert('Failed to load admin data. Ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (
    resolution: 'APPROVE_PAYMENT' | 'REJECT_DISPUTE'
  ) => {
    if (!selectedTicket) return;
    if (!adminComment)
      return alert('Please add a comment explaining your decision.');

    if (
      !window.confirm(
        `Are you sure you want to ${resolution === 'APPROVE_PAYMENT' ? 'APPROVE' : 'REJECT'} this dispute?`
      )
    )
      return;

    setProcessing(true);
    try {
      const response = await resolveDispute(
        selectedTicket._id,
        resolution,
        adminComment
      );

      alert(response.message);
      setSelectedTicket(null);
      setAdminComment('');
      fetchAllDisputes();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Action Failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loader />;

  const openTicketsCount = disputes.filter((d) => d.status === 'OPEN').length;

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <Navbar />
      <MegaMenu />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header & Stats */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield
                  className={`w-8 h-8 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                />
                <h1
                  className={`text-3xl sm:text-4xl font-['Playfair_Display'] font-bold ${
                    isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                  }`}
                >
                  Admin Dashboard
                </h1>
              </div>
              <p
                className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Manage Disputes & Platform Safety
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/admin/newsletter')}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
                  isDark
                    ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
                    : 'bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100'
                }`}
              >
                <Mail className="w-5 h-5" />
                Newsletter
              </button>

              <div
                className={`rounded-2xl px-6 py-4 shadow-lg text-center ${
                  isDark
                    ? 'bg-red-500/10 border border-red-500/30'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <span
                  className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`}
                >
                  Open Tickets
                </span>
                <span
                  className={`text-3xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}
                >
                  {openTicketsCount}
                </span>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div
            className={`rounded-2xl shadow-lg overflow-hidden ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className={`border-b ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <th
                      className={`p-4 text-xs font-bold uppercase tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Ticket ID
                    </th>
                    <th
                      className={`p-4 text-xs font-bold uppercase tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      User
                    </th>
                    <th
                      className={`p-4 text-xs font-bold uppercase tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Issue
                    </th>
                    <th
                      className={`p-4 text-xs font-bold uppercase tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Status
                    </th>
                    <th
                      className={`p-4 text-xs font-bold uppercase tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Date
                    </th>
                    <th
                      className={`p-4 text-xs font-bold uppercase tracking-wider text-right ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}
                >
                  {disputes.map((d) => (
                    <tr
                      key={d._id}
                      className={`transition ${
                        isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td
                        className={`p-4 font-mono text-xs font-bold ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {d.ticketId}
                      </td>
                      <td className="p-4">
                        <div
                          className={`font-bold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                        >
                          {d.initiator?.firstName} {d.initiator?.lastName}
                        </div>
                        <div
                          className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                        >
                          {d.initiator?.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <div
                          className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-800'}`}
                        >
                          {d.subject}
                        </div>
                        <div
                          className={`text-xs truncate max-w-[200px] ${
                            isDark ? 'text-gray-500' : 'text-gray-500'
                          }`}
                        >
                          {d.description}
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={d.status} isDark={isDark} />
                      </td>
                      <td
                        className={`p-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                      >
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedTicket(d)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ml-auto ${
                            isDark
                              ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg'
                              : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                  {disputes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-10 text-center">
                        <CheckCircle
                          className={`w-16 h-16 mx-auto mb-3 ${
                            isDark ? 'text-gray-600' : 'text-gray-400'
                          }`}
                        />
                        <p
                          className={isDark ? 'text-gray-400' : 'text-gray-500'}
                        >
                          No disputes found. Everything is running smoothly!
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Review Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col ${
              isDark
                ? 'bg-[#1a110d] border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b flex justify-between items-start sticky top-0 z-10 ${
                isDark
                  ? 'bg-[#1a110d] border-white/10'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div>
                <h2
                  className={`text-xl font-bold mb-1 ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                >
                  Review Ticket: {selectedTicket.ticketId}
                </h2>
                <p
                  className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                >
                  Raised by {selectedTicket.initiator?.firstName}{' '}
                  {selectedTicket.initiator?.lastName}
                </p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className={`p-2 rounded-full transition ${
                  isDark
                    ? 'hover:bg-white/10 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* User Statement */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText
                    className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  />
                  <h3
                    className={`font-bold text-sm uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    User's Statement
                  </h3>
                </div>
                <p
                  className={`leading-relaxed mb-3 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}
                >
                  {selectedTicket.description}
                </p>
                <div
                  className={`text-xs pt-3 border-t ${
                    isDark
                      ? 'border-white/10 text-gray-500'
                      : 'border-gray-200 text-gray-500'
                  }`}
                >
                  Related Group:{' '}
                  <span
                    className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {selectedTicket.group?.name}
                  </span>
                </div>
              </div>

              {/* Evidence */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon
                    className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  />
                  <h3
                    className={`font-bold text-sm uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    Attached Evidence
                  </h3>
                </div>
                {selectedTicket.evidenceUrl ? (
                  <div
                    className={`border rounded-lg overflow-hidden text-center ${
                      isDark
                        ? 'border-white/10 bg-white/5'
                        : 'border-gray-200 bg-gray-100'
                    }`}
                  >
                    <a
                      href={selectedTicket.evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={selectedTicket.evidenceUrl}
                        alt="Evidence"
                        className="w-full h-auto max-h-[300px] object-contain hover:opacity-95 transition cursor-zoom-in"
                      />
                    </a>
                  </div>
                ) : (
                  <div
                    className={`p-6 rounded-lg text-center italic border border-dashed ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-gray-500'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}
                  >
                    No screenshot provided by user.
                  </div>
                )}
              </div>

              {/* Admin Action Area */}
              {selectedTicket.status === 'OPEN' ? (
                <div
                  className={`border-t pt-6 ${isDark ? 'border-white/10' : 'border-gray-200'}`}
                >
                  <label
                    className={`block text-sm font-bold mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Admin Resolution Comment
                  </label>
                  <textarea
                    className={`w-full p-3 rounded-lg border outline-none transition-all mb-4 ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#d4a574] focus:bg-white/10'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#b8894d] focus:bg-white focus:ring-2 focus:ring-[#b8894d]/20'
                    }`}
                    placeholder="Write a note explaining your decision (Visible to user)..."
                    rows={3}
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleResolve('REJECT_DISPUTE')}
                      disabled={processing}
                      className={`flex items-center justify-center gap-2 py-3 font-bold rounded-lg border transition disabled:opacity-50 ${
                        isDark
                          ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                          : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Dispute
                    </button>
                    <button
                      onClick={() => handleResolve('APPROVE_PAYMENT')}
                      disabled={processing}
                      className={`flex items-center justify-center gap-2 py-3 font-bold rounded-lg transition disabled:opacity-50 shadow-lg ${
                        isDark
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      {processing ? 'Processing...' : 'Approve & Restore Trust'}
                    </button>
                  </div>
                  <p
                    className={`text-xs mt-3 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    Approving will forcefully mark the contribution as "Paid" in
                    the database.
                  </p>
                </div>
              ) : (
                <div
                  className={`p-4 rounded-lg text-center border ${
                    isDark
                      ? 'bg-white/5 border-white/10'
                      : 'bg-gray-100 border-gray-200'
                  }`}
                >
                  <span
                    className={`font-bold block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    This ticket is already {selectedTicket.status}.
                  </span>
                  {selectedTicket.adminResponse && (
                    <p
                      className={`text-sm italic ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                    >
                      Admin Note: "{selectedTicket.adminResponse}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({
  status,
  isDark,
}: {
  status: string;
  isDark: boolean;
}) => {
  let icon = Clock;
  let colorClass = '';

  if (status === 'OPEN') {
    icon = Clock;
    colorClass = isDark
      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
      : 'bg-yellow-100 text-yellow-700 border border-yellow-200';
  } else if (status === 'RESOLVED') {
    icon = CheckCircle;
    colorClass = isDark
      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
      : 'bg-green-100 text-green-700 border border-green-200';
  } else if (status === 'REJECTED') {
    icon = XCircle;
    colorClass = isDark
      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
      : 'bg-red-100 text-red-700 border border-red-200';
  }

  const Icon = icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${colorClass}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

export default AdminPanel;
