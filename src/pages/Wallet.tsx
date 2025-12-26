import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import { useAuth } from '../context/authContext.tsx';

import Footer from '../components/Footer';

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const [dues, setDues] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);

  // Fetch Wallet Data (You'll need a backend endpoint for this aggregation later)
  // For now, I'll mock the logic you would use:
  // 1. Get all groups user is in.
  // 2. Calculate next payment date.
  // 3. Check if they are the winner (Income) or payer (Due).

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <Navbar />
      <MegaMenu />

      <main className="pt-[100px] px-4 lg:px-[10%] pb-20">
        <h1 className="text-4xl font-['Playfair_Display'] text-[#d4a574] mb-8">
          My Wallet
        </h1>

        {/* BALANCE CARD */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8 rounded-2xl text-white shadow-xl mb-10 border border-[#d4a574]/30">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">
            Estimated Total Savings
          </p>
          <div className="text-5xl font-bold text-[#d4a574]">Rs. 45,000</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* UPCOMING PAYMENTS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Outflows
              (Due)
            </h2>
            {/* Map through due payments */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-bold text-gray-700">
                    Office Chit Group
                  </div>
                  <div className="text-xs text-red-500">Due in 2 days</div>
                </div>
                <button className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-[#d4a574] transition">
                  Pay Rs. 5,000
                </button>
              </div>
            </div>
          </div>

          {/* EXPECTED INCOMES */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>{' '}
              Inflows (Receivables)
            </h2>
            {/* Map through when user is payoutOrder winner */}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-bold text-gray-700">Family Savings</div>
                <div className="text-xs text-green-600">
                  Cycle #4 (Feb 2026)
                </div>
              </div>
              <div className="text-xl font-bold text-[#d4a574]">Rs. 50,000</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default Wallet;
