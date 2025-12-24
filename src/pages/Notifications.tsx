import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  UserPlus,
  CheckCircle,
  AlertCircle,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store.ts';
import { useAuth } from '../context/authContext';
import Navbar from '../components/NavBar.tsx';
import Footer from '../components/Footer';
import MegaMenu from '../components/MegaMenu.tsx';
import Pagination from '../components/Pagination.tsx';

interface NotificationPayload {
  userId?: string;
  groupId?: string;
  amount?: number;
  [key: string]: any;
}

interface Notification {
  _id: string;
  user: string;
  group: string;
  type:
    | 'JOIN_REQUEST'
    | 'GROUP_JOINED'
    | 'PAYMENT_REMINDER'
    | 'DISPUTE_UPDATE'
    | 'GENERAL';
  payload: NotificationPayload;
  read: boolean;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.title = 'Notifications - Seettuwa';
  }, [theme]);

  const fetchNotifications = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const token = user?.token;
      if (!token) return;

      const unreadQuery = filter === 'unread' ? '&unread=true' : '';
      const response = await fetch(
        `http://localhost:5000/api/v1/notifications?limit=10&page=${pageNumber}${unreadQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        setNotifications(data.notifications);
        setTotalPage(data.totalPages || data.total_pages || 1);
        setTotalNotifications(data.total || 0);
        setPage(pageNumber);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, [filter, user]);

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );

    try {
      const token = user?.token;
      await fetch(`http://localhost:5000/api/v1/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }

    if (notification.payload?.groupId) {
      if (notification.type === 'JOIN_REQUEST') {
        navigate(`/groups/manage/${notification.payload.groupId}`);
      } else {
        navigate(`/groups/${notification.payload.groupId}`);
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'JOIN_REQUEST':
        return <UserPlus className="w-5 h-5" />;
      case 'GROUP_JOINED':
        return <CheckCircle className="w-5 h-5" />;
      case 'PAYMENT_REMINDER':
        return <CreditCard className="w-5 h-5" />;
      case 'DISPUTE_UPDATE':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getContent = (n: Notification) => {
    switch (n.type) {
      case 'JOIN_REQUEST':
        return {
          title: 'New Member Request',
          desc: `A user has requested to join your group.`,
        };
      case 'GROUP_JOINED':
        return {
          title: 'Welcome to the Circle',
          desc: 'You have successfully joined the group.',
        };
      case 'PAYMENT_REMINDER':
        return {
          title: 'Payment Due',
          desc: 'Your contribution for the current cycle is due soon.',
        };
      default:
        return {
          title: 'New Update',
          desc: 'You have a new notification.',
        };
    }
  };

  const getIconColor = (type: string, isRead: boolean) => {
    if (isRead) {
      return isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400';
    }

    switch (type) {
      case 'JOIN_REQUEST':
        return isDark
          ? 'bg-blue-500/20 text-blue-400'
          : 'bg-blue-100 text-blue-700';
      case 'GROUP_JOINED':
        return isDark
          ? 'bg-green-500/20 text-green-400'
          : 'bg-green-100 text-green-700';
      case 'PAYMENT_REMINDER':
        return isDark
          ? 'bg-[#d4a574]/20 text-[#d4a574]'
          : 'bg-amber-100 text-[#b8894d]';
      case 'DISPUTE_UPDATE':
        return isDark
          ? 'bg-red-500/20 text-red-400'
          : 'bg-red-100 text-red-700';
      default:
        return isDark
          ? 'bg-purple-500/20 text-purple-400'
          : 'bg-purple-100 text-purple-700';
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <h1
              className={`text-4xl sm:text-5xl font-['Playfair_Display'] font-extrabold mb-2 ${
                isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'
              }`}
            >
              Notifications
            </h1>
            <p
              className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Stay updated with your savings circles
            </p>
          </header>

          {/* Filter Section */}
          <div
            className={`rounded-2xl p-6 mb-8 shadow-lg ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div
                className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Showing {notifications.length} of {totalNotifications}{' '}
                notification{totalNotifications !== 1 ? 's' : ''}
              </div>

              {/* Filter Buttons */}
              <div
                className={`flex items-center p-1 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    filter === 'all'
                      ? isDark
                        ? 'bg-[#d4a574] text-white shadow-md'
                        : 'bg-[#b8894d] text-white shadow-md'
                      : isDark
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    filter === 'unread'
                      ? isDark
                        ? 'bg-[#d4a574] text-white shadow-md'
                        : 'bg-[#b8894d] text-white shadow-md'
                      : isDark
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Unread
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3 mb-8">
            {loading ? (
              // Loading Skeleton
              [1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-20 rounded-xl animate-pulse ${
                    isDark
                      ? 'bg-[#1a110d]/80 border border-white/10'
                      : 'bg-white border border-gray-200'
                  }`}
                />
              ))
            ) : notifications.length === 0 ? (
              // Empty State
              <div
                className={`text-center py-16 rounded-xl shadow-lg ${
                  isDark
                    ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <Bell
                  className={`w-12 h-12 mx-auto mb-3 ${
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  }`}
                />
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  No notifications found
                </h3>
                <p
                  className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}
                >
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.map((note) => {
                const { title, desc } = getContent(note);

                return (
                  <div
                    key={note._id}
                    onClick={() => handleNotificationClick(note)}
                    className={`group rounded-xl p-4 transition-all cursor-pointer hover:shadow-lg ${
                      isDark
                        ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10 hover:border-[#d4a574]/40 hover:bg-[#1a110d]'
                        : 'bg-white border border-gray-200 hover:border-[#b8894d]/40 hover:shadow-md'
                    } ${!note.read ? (isDark ? 'border-l-4 border-l-[#d4a574]' : 'border-l-4 border-l-[#b8894d]') : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon Container */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor(
                          note.type,
                          note.read
                        )}`}
                      >
                        {getIcon(note.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-semibold text-sm truncate ${
                              note.read
                                ? isDark
                                  ? 'text-gray-400'
                                  : 'text-gray-600'
                                : isDark
                                  ? 'text-[#f2f0ea]'
                                  : 'text-gray-900'
                            }`}
                          >
                            {title}
                          </h3>

                          {!note.read && (
                            <div
                              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                isDark ? 'bg-[#d4a574]' : 'bg-[#b8894d]'
                              }`}
                            ></div>
                          )}
                        </div>

                        <p
                          className={`text-xs truncate ${
                            isDark ? 'text-gray-500' : 'text-gray-600'
                          }`}
                        >
                          {desc}
                        </p>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className={`text-xs whitespace-nowrap ${
                            isDark ? 'text-gray-500' : 'text-gray-500'
                          }`}
                        >
                          {formatDistanceToNow(new Date(note.createdAt), {
                            addSuffix: true,
                          })}
                        </span>

                        <ChevronRight
                          className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                            isDark ? 'text-gray-600' : 'text-gray-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <Pagination
        currentPage={page}
        totalPages={totalPage}
        onPageChange={fetchNotifications}
        isDark={isDark}
      />

      <Footer />
    </div>
  );
};

export default Notifications;
