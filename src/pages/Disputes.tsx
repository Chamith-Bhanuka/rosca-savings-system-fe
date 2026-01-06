import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import axios from 'axios';
import Loader from '../components/Loader';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  Send,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { raiseDispute } from '../services/dispute.service.ts';

const TabButton = ({ active, onClick, label, icon: Icon }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
      active
        ? 'border-b-2 text-gray-900 dark:text-[#d4a574]'
        : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300'
    }`}
    style={active ? { borderColor: 'var(--border-active)' } : {}}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const Disputes: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Resolution Center - Seettuwa';

    // active tab
    document.documentElement.style.setProperty(
      '--border-active',
      isDark ? '#d4a574' : '#b8894d'
    );
  }, [theme, isDark]);

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
      const response = await raiseDispute(groupId, subject, description, file);
      alert(response.message);
      setActiveTab('list');
      await fetchDisputes();
      setSubject('');
      setDescription('');
      setGroupId('');
      setFile(null);
    } catch (err) {
      alert('Failed to raise dispute');
      console.error(err);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <Navbar />
      <MegaMenu />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare
                className={`w-8 h-8 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
              />
              <h1
                className={`text-3xl sm:text-4xl font-['Playfair_Display'] font-bold ${
                  isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                }`}
              >
                Resolution Center
              </h1>
            </div>
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              We are here to help resolve issues with your payments or groups
            </p>
          </div>

          {/* Tabs Container */}
          <div
            className={`rounded-2xl shadow-lg overflow-hidden ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Tab Buttons */}
            <div
              className={`flex border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}
            >
              <TabButton
                active={activeTab === 'list'}
                onClick={() => setActiveTab('list')}
                label="My Tickets"
                icon={FileText}
              />
              <TabButton
                active={activeTab === 'new'}
                onClick={() => setActiveTab('new')}
                label="Raise New Ticket"
                icon={Send}
              />
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:p-8 min-h-[400px]">
              {/* TAB 1: LIST VIEW */}
              {activeTab === 'list' && (
                <div>
                  {loading && <Loader />}
                  {!loading && disputes.length === 0 && (
                    <div className="text-center py-16">
                      <CheckCircle
                        className={`w-20 h-20 mx-auto mb-4 ${
                          isDark ? 'text-green-500/50' : 'text-green-500/70'
                        }`}
                      />
                      <p
                        className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        No disputes found. Everything looks good!
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {disputes.map((d: any) => (
                      <div
                        key={d._id}
                        className={`rounded-xl p-6 border transition-all hover:shadow-lg ${
                          isDark
                            ? 'bg-white/5 border-white/10 hover:border-[#d4a574]/40'
                            : 'bg-white border-gray-200 hover:border-[#b8894d]/40'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                          <div>
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded mr-2 ${
                                isDark
                                  ? 'bg-white/10 text-gray-400'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {d.ticketId}
                            </span>
                            <span
                              className={`font-bold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                            >
                              {d.subject}
                            </span>
                          </div>
                          <StatusBadge status={d.status} isDark={isDark} />
                        </div>

                        <p
                          className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                        >
                          {d.description}
                        </p>

                        {/* Admin Reply Section */}
                        {d.adminResponse && (
                          <div
                            className={`p-4 rounded-lg text-sm mb-3 ${
                              isDark
                                ? 'bg-blue-500/10 border border-blue-500/20'
                                : 'bg-blue-50 border border-blue-100'
                            }`}
                          >
                            <span
                              className={`font-bold block mb-1 ${
                                isDark ? 'text-blue-400' : 'text-blue-800'
                              }`}
                            >
                              Admin Response:
                            </span>
                            <p
                              className={
                                isDark ? 'text-blue-300' : 'text-blue-700'
                              }
                            >
                              {d.adminResponse}
                            </p>
                          </div>
                        )}

                        <div
                          className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                        >
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
                  className="space-y-6 max-w-2xl mx-auto"
                >
                  <div>
                    <label
                      className={`block text-sm font-bold mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Subject
                    </label>
                    <select
                      className={`w-full p-3 rounded-lg border outline-none transition-all ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white focus:border-[#d4a574] focus:bg-white/10 [&>option]:bg-[#1a110d] [&>option]:text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#b8894d] focus:bg-white [&>option]:bg-white [&>option]:text-gray-900'
                      }`}
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
                      <option value="Group Issue">
                        Report a Group/Moderator
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-bold mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Group ID
                    </label>
                    <input
                      type="text"
                      placeholder="Paste Group ID here (e.g. 64f2...)"
                      className={`w-full p-3 rounded-lg border outline-none transition-all ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#d4a574] focus:bg-white/10'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#b8894d] focus:bg-white'
                      }`}
                      value={groupId}
                      onChange={(e) => setGroupId(e.target.value)}
                      required
                    />
                    <p
                      className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                      You can find this in your Group URL.
                    </p>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-bold mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please explain the situation in detail..."
                      className={`w-full p-3 rounded-lg border outline-none transition-all ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#d4a574] focus:bg-white/10'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#b8894d] focus:bg-white'
                      }`}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-bold mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Evidence (Screenshot/Slip)
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                        isDark
                          ? 'border-white/10 hover:border-[#d4a574]/40 bg-white/5'
                          : 'border-gray-300 hover:border-[#b8894d]/40 bg-gray-50'
                      }`}
                    >
                      <Upload
                        className={`w-10 h-10 mx-auto mb-3 ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setFile(e.target.files ? e.target.files[0] : null)
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <p
                        className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </p>
                      <p
                        className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                      >
                        PNG, JPG or PDF up to 10MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
                      isDark
                        ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                    Submit Ticket
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
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
  } else {
    icon = AlertCircle;
    colorClass = isDark
      ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
      : 'bg-gray-100 text-gray-600 border border-gray-200';
  }

  const Icon = icon;

  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase ${colorClass}`}
    >
      <Icon className="w-4 h-4" />
      {status}
    </span>
  );
};

export default Disputes;
