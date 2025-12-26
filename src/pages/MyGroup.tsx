import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import {
  Calendar,
  Users,
  Clock,
  Upload,
  CreditCard,
  CheckCircle,
  X,
  FileText,
  TrendingUp,
  AlertCircle,
  Image,
} from 'lucide-react';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import Toast from '../components/Toast.tsx';
import { getGroupById } from '../services/group.service';
import { calculatePayoutDate } from '../utils/dateUtils';
import { useAuth } from '../context/authContext.tsx';
import Loader from '../components/Loader';
import { PaymentModal } from '../components/PaymentModal.tsx';

interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

const MyGroup: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'My Group - Seettuwa';
  }, [theme]);

  useEffect(() => {
    if (groupId) {
      getGroupById(groupId)
        .then((res) => setGroup(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [groupId]);

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('error', 'Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        addToast('error', 'File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSlip = async () => {
    if (!selectedFile) {
      addToast('error', 'Please select a file');
      return;
    }

    try {
      // API call to upload slip
      addToast('success', 'Payment slip uploaded successfully!');
      setShowUploadModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      addToast('error', 'Failed to upload payment slip');
    }
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  if (loading) return <Loader />;

  if (!group) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
      >
        <div className="text-center">
          <AlertCircle
            className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
          />
          <h3
            className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Group not found
          </h3>
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

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className={`relative w-full max-w-md mx-4 rounded-2xl p-6 shadow-2xl ${
              isDark
                ? 'bg-[#1a110d] border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <button
              onClick={closeUploadModal}
              className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <h2
              className={`text-2xl font-['Playfair_Display'] font-bold mb-6 ${
                isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
              }`}
            >
              Upload Payment Slip
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="file-upload"
                  className={`block w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    isDark
                      ? 'border-white/20 hover:border-[#d4a574] bg-white/5'
                      : 'border-gray-300 hover:border-[#b8894d] bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Upload
                      className={`w-12 h-12 mb-3 ${
                        isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                      }`}
                    />
                    <p
                      className={`text-sm font-medium mb-1 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Click to upload payment slip
                    </p>
                    <p
                      className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                    >
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {previewUrl && (
                <div
                  className={`rounded-xl p-4 ${
                    isDark
                      ? 'bg-white/5 border border-white/10'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      className={`w-5 h-5 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                      >
                        {selectedFile?.name}
                      </p>
                      <p
                        className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                      >
                        {(selectedFile?.size! / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className={`p-1 rounded ${
                        isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeUploadModal}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                    isDark
                      ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadSlip}
                  disabled={!selectedFile}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedFile
                      ? isDark
                        ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Upload Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPayModal && (
        <PaymentModal
          groupId={group._id}
          cycle={group.currentCycle}
          amount={group.amount}
          onSuccess={() => {
            setShowPayModal(false);
            addToast('success', 'Payment successful!');
            window.location.reload();
          }}
          onClose={() => setShowPayModal(false)}
        />
      )}

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div
            className={`rounded-2xl p-6 mb-8 shadow-lg ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1">
                <h1
                  className={`text-4xl font-['Playfair_Display'] font-extrabold mb-2 ${
                    isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                  }`}
                >
                  {group.name}
                </h1>
                <p
                  className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {group.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.badges?.map((badge: string) => (
                    <span
                      key={badge}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isDark
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className={`p-6 rounded-xl text-center ${
                  isDark
                    ? 'bg-[#d4a574]/10 border border-[#d4a574]/30'
                    : 'bg-[#b8894d]/10 border border-[#b8894d]/30'
                }`}
              >
                <p
                  className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Pool Amount
                </p>
                <p
                  className={`text-3xl font-bold ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                >
                  LKR {group.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}
                >
                  <Calendar
                    className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}
                  />
                </div>
                <div>
                  <p
                    className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                  >
                    Current Cycle
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    {group.currentCycle}/{group.maxCycles}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-green-500/20' : 'bg-green-100'
                  }`}
                >
                  <Users
                    className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-700'}`}
                  />
                </div>
                <div>
                  <p
                    className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                  >
                    Members
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    {group.members?.length || 0}/{group.totalMembers}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                  }`}
                >
                  <TrendingUp
                    className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}
                  />
                </div>
                <div>
                  <p
                    className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                  >
                    Frequency
                  </p>
                  <p
                    className={`text-xl font-bold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    {group.frequency}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-orange-500/20' : 'bg-orange-100'
                  }`}
                >
                  <Clock
                    className={`w-6 h-6 ${isDark ? 'text-orange-400' : 'text-orange-700'}`}
                  />
                </div>
                <div>
                  <p
                    className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                  >
                    Status
                  </p>
                  <p
                    className={`text-xl font-bold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    {group.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl p-6 mb-8 shadow-lg ${
              isDark
                ? 'bg-gradient-to-r from-[#1a110d] to-[#2a1a0d] border border-[#d4a574]/30'
                : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] border border-[#8b6635]'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-[#d4a574]' : 'text-white'
                  }`}
                >
                  Cycle {group.currentCycle} Payment
                </h2>
                {group.nextPaymentDate ? (
                  <p
                    className={`flex items-center gap-2 ${
                      isDark ? 'text-gray-400' : 'text-white/80'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                    Due Date:{' '}
                    {new Date(group.nextPaymentDate).toLocaleDateString()}
                  </p>
                ) : (
                  <p
                    className={`flex items-center gap-2 ${
                      isDark ? 'text-gray-400' : 'text-white/80'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                    Make your contribution for this cycle
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  Upload Slip
                </button>

                <button
                  onClick={() => setShowPayModal(true)}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                    isDark
                      ? 'bg-[#d4a574] text-gray-900 hover:bg-[#c39464]'
                      : 'bg-white text-[#b8894d] hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Pay Now (LKR {group.amount.toLocaleString()})
                </button>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl p-6 shadow-lg ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <h2
              className={`text-2xl font-['Playfair_Display'] font-bold mb-6 ${
                isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
              }`}
            >
              Payout Schedule
            </h2>

            {group.payoutOrder && group.payoutOrder.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b ${
                        isDark ? 'border-white/10' : 'border-gray-200'
                      }`}
                    >
                      <th
                        className={`text-left p-4 text-sm font-semibold ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Cycle
                      </th>
                      <th
                        className={`text-left p-4 text-sm font-semibold ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Date
                      </th>
                      <th
                        className={`text-left p-4 text-sm font-semibold ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Recipient
                      </th>
                      <th
                        className={`text-left p-4 text-sm font-semibold ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.payoutOrder.map((member: any, index: number) => {
                      const isCurrentUser = member._id === user?.id;
                      const isPast = index < group.currentCycle - 1;
                      const isCurrent = index === group.currentCycle - 1;

                      return (
                        <tr
                          key={index}
                          className={`border-b last:border-0 transition-colors ${
                            isDark ? 'border-white/5' : 'border-gray-100'
                          } ${
                            isCurrentUser
                              ? isDark
                                ? 'bg-[#d4a574]/10'
                                : 'bg-[#b8894d]/10'
                              : ''
                          }`}
                        >
                          <td className="p-4">
                            <span
                              className={`font-semibold ${
                                isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                              }`}
                            >
                              #{index + 1}
                            </span>
                          </td>
                          <td
                            className={`p-4 ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {calculatePayoutDate(
                              group.startDate,
                              index,
                              group.frequency
                            )}
                          </td>
                          <td
                            className={`p-4 font-medium ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {member.firstName} {member.lastName}
                            {isCurrentUser && (
                              <span
                                className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                  isDark
                                    ? 'bg-[#d4a574]/20 text-[#d4a574]'
                                    : 'bg-[#b8894d]/20 text-[#b8894d]'
                                }`}
                              >
                                You
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {isPast && (
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                  isDark
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-green-100 text-green-700'
                                }`}
                              >
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                            {isCurrent && (
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                  isDark
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                <Clock className="w-3 h-3" />
                                Active
                              </span>
                            )}
                            {!isPast && !isCurrent && (
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                  isDark
                                    ? 'bg-gray-500/20 text-gray-400'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                Upcoming
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                className={`text-center py-16 rounded-xl border-2 border-dashed ${
                  isDark ? 'border-white/10' : 'border-gray-300'
                }`}
              >
                <FileText
                  className={`w-16 h-16 mx-auto mb-4 ${
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  }`}
                />
                <p
                  className={`text-lg font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Draw Not Yet Completed
                </p>
                <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Check back on {new Date(group.startDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyGroup;
