import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import Toast from '../components/Toast.tsx';
import Loader from '../components/Loader';
import { fetchUserWallet } from '../services/user.service.ts';

interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface DueItem {
  groupId: string;
  groupName: string;
  amount: number;
  dueDate: string;
  cycle: number;
}

interface IncomeItem {
  groupId: string;
  groupName: string;
  amount: number;
  cycle: number;
  estimatedDate: string;
}

const WalletPage: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [balance, setBalance] = useState<number>(0);
  const [dues, setDues] = useState<DueItem[]>([]);
  const [incomes, setIncomes] = useState<IncomeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'My Wallet - Seettuwa';
  }, [theme]);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const res = await fetchUserWallet();
        setBalance(res.data.balance || 0);
        setDues(res.data.dues || []);
        setIncomes(res.data.incomes || []);
      } catch (error) {
        console.error('Failed to fetch wallet data', error);
        addToast('error', 'Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleWithdraw = async () => {
    if (balance <= 0) {
      addToast('warning', 'No balance available to withdraw');
      return;
    }
    addToast(
      'info',
      `Withdrawal of LKR ${balance.toLocaleString()} initiated. Funds will be transferred to your bank account.`
    );
  };

  if (loading) return <Loader />;

  const totalDues = dues.reduce((sum, due) => sum + due.amount, 0);
  const totalIncomes = incomes.reduce((sum, inc) => sum + inc.amount, 0);

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

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <h1
              className={`text-4xl sm:text-5xl font-['Playfair_Display'] font-extrabold mb-2 ${
                isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
              }`}
            >
              My Wallet
            </h1>
            <p
              className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Track your balance and manage payments
            </p>
          </header>

          {/* Balance Card */}
          <div
            className={`rounded-2xl p-8 mb-8 shadow-lg ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                    isDark ? 'bg-[#d4a574]/20' : 'bg-[#b8894d]/20'
                  }`}
                >
                  <Wallet
                    className={`w-10 h-10 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                  />
                </div>
                <div>
                  <p
                    className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Available Balance
                  </p>
                  <p
                    className={`text-5xl font-bold ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                  >
                    {balance.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                  >
                    LKR
                  </p>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={balance <= 0}
                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all ${
                  balance > 0
                    ? isDark
                      ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:translate-y-[-1px] hover:shadow-lg hover:shadow-[#d4a574]/30'
                      : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:translate-y-[-1px] hover:shadow-lg hover:shadow-[#b8894d]/30'
                    : isDark
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ArrowUpRight className="w-5 h-5" />
                Withdraw Funds
              </button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                >
                  Pending Dues
                </h3>
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <p
                className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {totalDues.toLocaleString()}
              </p>
              <p
                className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
              >
                {dues.length} payment{dues.length !== 1 ? 's' : ''} due
              </p>
            </div>

            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-semibold ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                >
                  Expected Income
                </h3>
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <p
                className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {totalIncomes.toLocaleString()}
              </p>
              <p
                className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
              >
                {incomes.length} upcoming payout
                {incomes.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dues */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <h2
                className={`text-xl font-bold mb-6 ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
              >
                Payments Due ({dues.length})
              </h2>

              {dues.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle
                    className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
                  />
                  <p
                    className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    All caught up!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dues.map((due, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isDark
                          ? 'bg-white/5 border-white/10 hover:border-[#d4a574]/40 hover:bg-white/10'
                          : 'bg-gray-50 border-gray-200 hover:border-[#b8894d]/40 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4
                            className={`font-semibold mb-1 ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                          >
                            {due.groupName}
                          </h4>
                          <div
                            className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Cycle {due.cycle}</span>
                            <span>•</span>
                            <span>
                              {new Date(due.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p
                          className={`text-lg font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}
                        >
                          {due.amount.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/groups/${due.groupId}`)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          isDark
                            ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg'
                            : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        Pay Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Income */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <h2
                className={`text-xl font-bold mb-6 ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
              >
                Expected Income ({incomes.length})
              </h2>

              {incomes.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle
                    className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
                  />
                  <p
                    className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    No upcoming payouts
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incomes.map((inc, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border ${
                        isDark
                          ? 'bg-white/5 border-white/10'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4
                            className={`font-semibold mb-1 ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
                          >
                            {inc.groupName}
                          </h4>
                          <div
                            className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Cycle {inc.cycle}</span>
                            <span>•</span>
                            <span>
                              {inc.estimatedDate
                                ? new Date(
                                    inc.estimatedDate
                                  ).toLocaleDateString()
                                : 'TBD'}
                            </span>
                          </div>
                        </div>
                        <p
                          className={`text-lg font-bold ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
                        >
                          {inc.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WalletPage;
