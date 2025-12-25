import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Navbar from '../components/NavBar';
import MegaMenu from '../components/MegaMenu';
import Footer from '../components/Footer';
import { getGroupById } from '../services/group.service';
import { calculatePayoutDate } from '../utils/dateUtils';
import { useAuth } from '../context/authContext.tsx';
import Loader from '../components/Loader';

const MyGroup: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const theme = useSelector((state: RootState) => state.theme.value);
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (groupId) {
      getGroupById(groupId)
        .then((res) => setGroup(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [groupId]);

  if (loading) return <Loader />;
  if (!group) return <div className="text-center pt-20">Group not found</div>;

  return (
    <div
      className={`flex flex-col min-h-screen font-['Inter'] ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}
    >
      <Navbar />
      <MegaMenu />

      <main className="flex-1 pt-[100px] px-4 md:px-8 lg:px-[10%] pb-20">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-[#d4a574]/20 pb-6">
          <div>
            <h1 className="font-['Playfair_Display'] text-4xl text-[#d4a574] mb-2">
              {group.name}
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {group.description}
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-sm text-gray-500 uppercase tracking-widest">
              Pool Amount
            </div>
            <div className="text-3xl font-bold text-[#d4a574]">
              Rs. {group.amount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* PAYOUT SCHEDULE (Copy of the table from ManageGroup) */}
        <section>
          <h2
            className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
          >
            Payout Schedule
          </h2>

          {group.payoutOrder.length > 0 ? (
            <div
              className={`overflow-hidden rounded-lg border ${theme === 'dark' ? 'border-[#d4a574]/20 bg-white/5' : 'border-gray-200 bg-white'}`}
            >
              <table className="w-full text-left">
                <thead
                  className={`border-b ${theme === 'dark' ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-600'}`}
                >
                  <tr>
                    <th className="p-4">Cycle</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Recipient</th>
                  </tr>
                </thead>
                <tbody>
                  {group.payoutOrder.map((member: any, index: number) => (
                    <tr
                      key={index}
                      className={`border-b last:border-0 ${member._id === user?.id ? 'bg-[#d4a574]/20' : ''}`}
                    >
                      <td className="p-4 text-[#d4a574]">#{index + 1}</td>
                      <td
                        className={
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                        }
                      >
                        {calculatePayoutDate(
                          group.startDate,
                          index,
                          group.frequency
                        )}
                      </td>
                      <td
                        className={`p-4 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}
                      >
                        {member.firstName} {member.lastName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-gray-500 rounded text-gray-400">
              The draw has not taken place yet. Check back on{' '}
              {new Date(group.startDate).toLocaleDateString()}.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MyGroup;
