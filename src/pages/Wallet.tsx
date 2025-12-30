import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
// import { useAuth } from '../context/authContext.tsx';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { fetchUserWallet } from '../services/user.service.ts';

// Types
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

const Wallet: React.FC = () => {
  // const { user } = useAuth();
  const navigate = useNavigate();

  const [balance, setBalance] = useState<number>(0);
  const [dues, setDues] = useState<DueItem[]>([]);
  const [incomes, setIncomes] = useState<IncomeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const res = await fetchUserWallet();

        setBalance(res.data.balance || 0);
        setDues(res.data.dues || []);
        setIncomes(res.data.incomes || []);
      } catch (error) {
        console.error('Failed to fetch wallet data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  // Handle Withdraw Simulation
  const handleWithdraw = async () => {
    if (balance <= 0) return;
    alert(
      'In a real app, this connects to Stripe Connect to transfer Rs. ' +
        balance +
        ' to your bank.'
    );
    // You can add an endpoint to reset balance to 0 here for demo
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] flex flex-col">
      <Navbar />
      <MegaMenu />

      <main className="flex-1 pt-[100px] px-4 lg:px-[10%] pb-20">
        <h1 className="text-4xl font-['Playfair_Display'] text-[#d4a574] mb-8">
          My Wallet
        </h1>

        {/* BALANCE CARD */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8 rounded-2xl text-white shadow-xl mb-10 border border-[#d4a574]/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">
              Available Balance
            </p>
            <div className="text-5xl font-bold text-[#d4a574]">
              Rs. {balance.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={balance <= 0}
            className={`px-8 py-3 rounded-lg font-bold transition-all ${
              balance > 0
                ? 'bg-[#d4a574] text-black hover:bg-[#b8894d] shadow-lg'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Withdraw Funds
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* UPCOMING PAYMENTS (DUES) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Outflows (Due Now)
            </h2>

            {dues.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                You are all paid up! 🎉
              </div>
            ) : (
              <div className="space-y-4">
                {dues.map((due, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-red-50/50 border border-red-100 rounded-lg hover:shadow-md transition"
                  >
                    <div className="mb-3 sm:mb-0">
                      <div className="font-bold text-gray-800">
                        {due.groupName}
                      </div>
                      <div className="text-xs text-red-500 font-medium">
                        Cycle #{due.cycle} • Due:{' '}
                        {new Date(due.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/groups/${due.groupId}`)}
                      className="px-5 py-2 bg-black text-white text-sm rounded hover:bg-[#d4a574] transition w-full sm:w-auto"
                    >
                      Pay Rs. {due.amount.toLocaleString()}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EXPECTED INCOMES */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>{' '}
              Inflows (Receivables)
            </h2>

            {incomes.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                No upcoming wins found. Join more groups!
              </div>
            ) : (
              <div className="space-y-4">
                {incomes.map((inc, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 bg-green-50/50 border border-green-100 rounded-lg"
                  >
                    <div>
                      <div className="font-bold text-gray-700">
                        {inc.groupName}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Cycle #{inc.cycle} • Est:{' '}
                        {inc.estimatedDate
                          ? new Date(inc.estimatedDate).toLocaleDateString()
                          : 'TBD'}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-[#d4a574]">
                      Rs. {inc.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default Wallet;
