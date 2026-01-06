import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import { useAuth } from '../context/authContext.tsx';
import Loader from '../components/Loader';
import {
  Download,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Award,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getAnalytics } from '../services/user.service.ts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Analytics - Seettuwa';
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAnalytics();
        setData(response);
      } catch (error) {
        console.error('Analytics error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const downloadReport = () => {
    if (!data) return;

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFillColor(212, 165, 116);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Seettuwa - Financial Performance Report', 10, 13);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Generated for: ${user?.firstName} ${user?.lastName}`, 10, 30);
    doc.text(`Date: ${date}`, 10, 36);

    doc.setDrawColor(200, 200, 200);
    doc.rect(10, 45, 190, 25);

    doc.setFontSize(10);
    doc.text('Total Contributions', 20, 55);
    doc.text('Total Winnings', 90, 55);
    doc.text('Net Position', 160, 55);

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Rs. ${data.summary.totalSaved.toLocaleString()}`, 20, 63);
    doc.setTextColor(34, 197, 94);
    doc.text(`Rs. ${data.summary.totalReceived.toLocaleString()}`, 90, 63);
    doc.setTextColor(0, 0, 0);
    doc.text(`Rs. ${data.summary.netPosition.toLocaleString()}`, 160, 63);

    autoTable(doc, {
      startY: 80,
      head: [
        ['Month', 'Contribution (Out)', 'Winnings (In)', 'Balance Change'],
      ],
      body: data.chartData.map((row: any) => [
        row.name,
        `Rs. ${row.saved.toLocaleString()}`,
        `Rs. ${row.received.toLocaleString()}`,
        `Rs. ${(row.received - row.saved).toLocaleString()}`,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [212, 165, 116] },
    });

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated automatically by Seettuwa Platform.', 10, 280);

    doc.save(`Seettuwa_Report_${date}.pdf`);
  };

  if (loading) return <Loader />;

  if (!data || !data.chartData) {
    return (
      <div
        className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
      >
        {isDark && <div className="noise-overlay" />}
        <Navbar />
        <MegaMenu />
        <main className="flex-1 flex items-center justify-center">
          <div
            className={`text-center p-8 rounded-2xl ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <TrendingUp
              className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
            />
            <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              No analytics data available yet.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const chartData = {
    labels: data.chartData.map((d: any) => d.name),
    datasets: [
      {
        label: 'Contributions',
        data: data.chartData.map((d: any) => d.saved),
        fill: true,
        backgroundColor: isDark
          ? 'rgba(212,165,116,0.2)'
          : 'rgba(184,137,77,0.2)',
        borderColor: isDark ? '#d4a574' : '#b8894d',
        tension: 0.4,
        pointBackgroundColor: isDark ? '#d4a574' : '#b8894d',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Winnings',
        data: data.chartData.map((d: any) => d.received),
        fill: true,
        backgroundColor: 'rgba(34,197,94,0.2)',
        borderColor: '#22c55e',
        tension: 0.4,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#f2f0ea' : '#000000',
          font: {
            size: 12,
            family: 'Inter',
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1a110d' : '#ffffff',
        titleColor: isDark ? '#f2f0ea' : '#000000',
        bodyColor: isDark ? '#f2f0ea' : '#000000',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return ` ${context.dataset.label}: Rs. ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
          },
        },
        border: {
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          drawBorder: false,
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
          },
          callback: function (value: any) {
            return 'Rs. ' + value.toLocaleString();
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] relative ${isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'}`}
    >
      {isDark && <div className="noise-overlay" />}

      <Navbar />
      <MegaMenu />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1
                className={`text-3xl sm:text-4xl font-['Playfair_Display'] font-bold mb-2 ${
                  isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
                }`}
              >
                Financial Analytics
              </h1>
              <p
                className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Track your ROSCA performance over time
              </p>
            </div>

            <button
              onClick={downloadReport}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
                isDark
                  ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg'
                  : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg'
              }`}
            >
              <Download className="w-5 h-5" />
              Download Report
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Saved */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <p
                className={`text-xs font-medium mb-2 uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Total Contributions
              </p>
              <h2
                className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {data.summary.totalSaved.toLocaleString()}
              </h2>
              <p
                className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
              >
                LKR
              </p>
            </div>

            {/* Total Winnings */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <p
                className={`text-xs font-medium mb-2 uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Total Winnings
              </p>
              <h2 className={`text-3xl font-bold text-green-500`}>
                {data.summary.totalReceived.toLocaleString()}
              </h2>
              <p
                className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
              >
                LKR
              </p>
            </div>

            {/* Net Benefit */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDark
                  ? 'bg-gradient-to-br from-[#1a110d] to-[#2a1a0d] border border-[#d4a574]/30'
                  : 'bg-gradient-to-br from-[#b8894d] to-[#8b6635] border border-[#8b6635]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-[#d4a574]/20' : 'bg-white/20'
                  }`}
                >
                  <PiggyBank
                    className={`w-6 h-6 ${isDark ? 'text-[#d4a574]' : 'text-white'}`}
                  />
                </div>
              </div>
              <p
                className={`text-xs font-medium mb-2 uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-white/80'
                }`}
              >
                Net Benefit
              </p>
              <h2
                className={`text-3xl font-bold ${
                  isDark ? 'text-[#d4a574]' : 'text-white'
                }`}
              >
                {data.summary.netPosition.toLocaleString()}
              </h2>
              <p
                className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-white/60'}`}
              >
                LKR
              </p>
            </div>
          </div>

          {/* Chart Section */}
          <div
            className={`rounded-2xl p-6 sm:p-8 shadow-lg ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <h3
              className={`text-xl font-bold mb-6 ${isDark ? 'text-[#f2f0ea]' : 'text-gray-900'}`}
            >
              Savings vs. Winnings Overview
            </h3>

            <div style={{ width: '100%', height: 400 }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
