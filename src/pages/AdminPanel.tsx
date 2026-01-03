import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import axios from 'axios';
import Loader from '../components/Loader';

// Types for better code safety
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
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Dispute | null>(null);

  // Resolution Form State
  const [adminComment, setAdminComment] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchAllDisputes();
  }, []);

  const fetchAllDisputes = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      // Call the new Admin Route
      const res = await axios.get(
        'http://localhost:5000/api/v1/dispute/admin/all',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDisputes(res.data);
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
      const token = localStorage.getItem('accessToken');
      await axios.put(
        'http://localhost:5000/api/v1/dispute/resolve',
        {
          disputeId: selectedTicket._id,
          resolution,
          adminComment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Ticket Resolved Successfully!');
      setSelectedTicket(null);
      setAdminComment('');
      fetchAllDisputes(); // Refresh list to show new status
    } catch (error: any) {
      alert(error.response?.data?.message || 'Action Failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 font-['Inter']">
      <Navbar />

      <main className="pt-[100px] px-4 lg:px-[10%] pb-20">
        {/* HEADER & STATS */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-500">Manage Disputes & Platform Safety</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200 text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Open Tickets
            </span>
            <span className="text-3xl font-bold text-red-500">
              {disputes.filter((d) => d.status === 'OPEN').length}
            </span>
          </div>
        </div>

        {/* TICKETS TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Ticket ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Issue</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {disputes.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-xs font-bold text-gray-600">
                    {d.ticketId}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">
                      {d.initiator?.firstName} {d.initiator?.lastName}
                    </div>
                    <div className="text-xs text-gray-400">
                      {d.initiator?.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{d.subject}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                      {d.description}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        d.status === 'OPEN'
                          ? 'bg-yellow-100 text-yellow-700'
                          : d.status === 'RESOLVED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedTicket(d)}
                      className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-[#d4a574] transition shadow-sm"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {disputes.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-400">
                    No disputes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* REVIEW MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Review Ticket: {selectedTicket.ticketId}
                </h2>
                <p className="text-sm text-gray-500">
                  Raised by {selectedTicket.initiator?.firstName}
                </p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* User Claim */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-2 text-sm uppercase">
                  User's Statement
                </h3>
                <p className="text-gray-800 leading-relaxed">
                  {selectedTicket.description}
                </p>
                <div className="mt-3 text-xs text-gray-500 border-t border-gray-200 pt-2">
                  Related Group:{' '}
                  <span className="font-bold text-gray-700">
                    {selectedTicket.group?.name}
                  </span>
                </div>
              </div>

              {/* Evidence Image */}
              <div>
                <h3 className="font-bold text-gray-700 mb-2 text-sm uppercase">
                  Attached Evidence
                </h3>
                {selectedTicket.evidenceUrl ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100 text-center">
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
                  <div className="p-6 bg-gray-100 text-gray-400 rounded-lg text-center italic border border-dashed border-gray-300">
                    No screenshot provided by user.
                  </div>
                )}
              </div>

              {/* Admin Action Area */}
              {selectedTicket.status === 'OPEN' ? (
                <div className="border-t pt-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Admin Resolution Comment
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-[#d4a574] focus:border-transparent outline-none transition"
                    placeholder="Write a note explaining your decision (Visible to user)..."
                    rows={3}
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleResolve('REJECT_DISPUTE')}
                      disabled={processing}
                      className="py-3 bg-red-50 text-red-600 font-bold rounded-lg border border-red-100 hover:bg-red-100 transition disabled:opacity-50"
                    >
                      Reject Dispute
                    </button>
                    <button
                      onClick={() => handleResolve('APPROVE_PAYMENT')}
                      disabled={processing}
                      className="py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50 shadow-lg shadow-green-200"
                    >
                      {processing
                        ? 'Processing...'
                        : 'Approve Payment & Restore Trust'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Approving will forcefully mark the contribution as "Paid" in
                    the database.
                  </p>
                </div>
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg text-center border border-gray-200">
                  <span className="font-bold text-gray-500 block mb-1">
                    This ticket is already {selectedTicket.status}.
                  </span>
                  {selectedTicket.adminResponse && (
                    <p className="text-sm text-gray-500 italic">
                      "Admin Note: {selectedTicket.adminResponse}"
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

export default AdminPanel;
