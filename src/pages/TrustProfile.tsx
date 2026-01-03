import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import axios from 'axios';
import Loader from '../components/Loader';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TrustProfile: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrust = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(
          'http://localhost:5000/api/v1/user/trust-profile',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrust();
  }, []);

  if (loading) return <Loader />;

  // Gauge Data Prep
  const score = data?.user?.trustScore || 0;
  const scoreColor =
    score >= 80 ? '#22c55e' : score >= 50 ? '#d4a574' : '#ef4444';

  const pieData = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [scoreColor, '#f3f4f6'],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    rotation: -90, // Start from top
    circumference: 180, // Half circle
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <Navbar />

      <main className="pt-[100px] px-4 lg:px-[20%] pb-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-['Playfair_Display'] text-gray-800">
            Trust Profile
          </h1>
          <p className="text-gray-500">
            Your reputation in the Seettuwa community.
          </p>
        </div>

        {/* 1. SCORE CARD (The Gauge) */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center justify-between">
          {/* Left: Gauge Chart */}
          <div className="relative w-48 h-48">
            <div style={{ width: '100%', height: '100%' }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
            {/* Score Text Overlay */}
            <div className="absolute top-24 left-0 w-full text-center -mt-8">
              <div className="text-4xl font-bold" style={{ color: scoreColor }}>
                {score}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">
                Trust Score
              </div>
            </div>
          </div>

          {/* Right: Badge & Summary */}
          <div className="flex-1 md:ml-10 text-center md:text-left mt-6 md:mt-0">
            <div
              className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2"
              style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}
            >
              {data.user?.level}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {score >= 80
                ? 'Excellent Standing!'
                : score >= 50
                  ? 'Good Standing'
                  : 'Needs Improvement'}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              A higher trust score unlocks larger group amounts and faster
              approval times. Keep making payments on time to reach 100.
            </p>
          </div>
        </div>

        {/* 2. KEY STATISTICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="text-3xl font-bold text-gray-800">
              {data.stats?.onTimePercentage}%
            </div>
            <div className="text-xs text-gray-400 uppercase mt-1">
              On-Time Payments
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="text-3xl font-bold text-gray-800">
              {data.stats?.totalContributions}
            </div>
            <div className="text-xs text-gray-400 uppercase mt-1">
              Total Contributions
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="text-3xl font-bold text-gray-800">
              {data.stats?.completedGroups}
            </div>
            <div className="text-xs text-gray-400 uppercase mt-1">
              Groups Completed
            </div>
          </div>
        </div>

        {/* 3. TRUST FACTORS (Breakdown) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">
            Score Breakdown
          </h3>

          <div className="space-y-4">
            {data?.factors?.map((factor: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${factor.type === 'good' ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                  <span className="text-gray-700 font-medium">
                    {factor.label}
                  </span>
                </div>
                <span
                  className={`font-bold ${factor.type === 'good' ? 'text-green-600' : 'text-red-500'}`}
                >
                  {factor.points}
                </span>
              </div>
            ))}

            {data.factors?.length === 0 && (
              <p className="text-center text-gray-400 italic">
                No activity recorded yet.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrustProfile;
