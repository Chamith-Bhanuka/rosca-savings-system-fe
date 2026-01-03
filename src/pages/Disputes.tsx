import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import axios from 'axios';
import Loader from '../components/Loader';

// Simple Tab Helper
const TabButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium transition ${
      active
        ? 'border-b-2 border-[#d4a574] text-[#d4a574]'
        : 'text-gray-500 hover:text-gray-800'
    }`}
  >
    {label}
  </button>
);

const Disputes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState(''); // Would typically be a dropdown
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://localhost:5000/api/v1/dispute', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisputes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId)
      return alert('Please enter a Group ID (Copy from URL for now)');

    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('groupId', groupId);
      formData.append('subject', subject);
      formData.append('description', description);
      if (file) formData.append('evidence', file);

      await axios.post('http://localhost:5000/api/v1/dispute', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Ticket Created!');
      setActiveTab('list');
      fetchDisputes();
      // Reset form
      setSubject('');
      setDescription('');
      setFile(null);
    } catch (err) {
      alert('Failed to raise dispute');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <Navbar />

      <main className="pt-[100px] px-4 lg:px-[20%] pb-20">
        <h1 className="text-3xl font-['Playfair_Display'] text-gray-800 mb-2">
          Resolution Center
        </h1>
        <p className="text-gray-500 mb-8">
          We are here to help resolve issues with your payments or groups.
        </p>

        {/* TABS */}
        <div className="bg-white rounded-t-xl border-b border-gray-100 flex mb-0">
          <TabButton
            active={activeTab === 'list'}
            onClick={() => setActiveTab('list')}
            label="My Tickets"
          />
          <TabButton
            active={activeTab === 'new'}
            onClick={() => setActiveTab('new')}
            label="Raise New Ticket"
          />
        </div>

        <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 border-t-0 p-8 min-h-[400px]">
          {/* TAB 1: LIST VIEW */}
          {activeTab === 'list' && (
            <div>
              {loading && <Loader />}
              {!loading && disputes.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <span className="text-4xl block mb-2">✅</span>
                  No disputes found. Everything looks good!
                </div>
              )}

              <div className="space-y-4">
                {disputes.map((d: any) => (
                  <div
                    key={d._id}
                    className="border border-gray-100 rounded-lg p-5 hover:border-[#d4a574]/30 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded mr-2">
                          {d.ticketId}
                        </span>
                        <span className="font-bold text-gray-800">
                          {d.subject}
                        </span>
                      </div>
                      <StatusBadge status={d.status} />
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {d.description}
                    </p>

                    {/* Admin Reply Section */}
                    {d.adminResponse && (
                      <div className="bg-blue-50 p-4 rounded-lg text-sm">
                        <span className="font-bold text-blue-800 block mb-1">
                          Admin Response:
                        </span>
                        <p className="text-blue-700">{d.adminResponse}</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-400 mt-2">
                      Group: {d.group?.name || 'Unknown'} •{' '}
                      {new Date(d.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CREATE FORM */}
          {activeTab === 'new' && (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 max-w-lg mx-auto"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:border-[#d4a574] outline-none"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="">Select an Issue...</option>
                  <option value="Payment Rejected">
                    My Payment was Rejected unfairly
                  </option>
                  <option value="Payout Missing">
                    I haven't received my Payout
                  </option>
                  <option value="Group Issue">Report a Group/Moderator</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Group ID
                </label>
                <input
                  type="text"
                  placeholder="Paste Group ID here (e.g. 64f2...)"
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:border-[#d4a574] outline-none"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  You can find this in your Group URL.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Please explain the situation in detail..."
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:border-[#d4a574] outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Evidence (Screenshot/Slip)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#d4a574]/10 file:text-[#d4a574] hover:file:bg-[#d4a574]/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-[#d4a574] transition"
              >
                Submit Ticket
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper Component for Status Colors
const StatusBadge = ({ status }: { status: string }) => {
  let color = 'bg-gray-100 text-gray-600';
  if (status === 'OPEN') color = 'bg-yellow-100 text-yellow-700';
  if (status === 'RESOLVED') color = 'bg-green-100 text-green-700';
  if (status === 'REJECTED') color = 'bg-red-100 text-red-700';

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${color}`}
    >
      {status}
    </span>
  );
};

export default Disputes;
