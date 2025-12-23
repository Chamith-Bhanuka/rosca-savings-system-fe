import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './authContext';
import NotificationToast from '../components/NotificationToast'; // Import the new component

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const token = user?.token;

  const socketRef = useRef<Socket | null>(null);

  const [notifications, setNotifications] = useState<any[]>([]);

  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (notification: any) => {
    const newToast = {
      id: notification.id || Date.now().toString(),
      title: formatTitle(notification.type),
      message: formatMessage(notification),
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatTitle = (type: string) => {
    switch (type) {
      case 'JOIN_REQUEST':
        return 'New Join Request';
      case 'GROUP_JOINED':
        return 'Welcome!';
      case 'PAYMENT_REMINDER':
        return 'Payment Due';
      default:
        return 'Notification';
    }
  };

  const formatMessage = (note: any) => {
    if (note.type === 'JOIN_REQUEST')
      return `User ${note.payload?.userId || 'someone'} wants to join your group.`;
    if (note.type === 'GROUP_JOINED')
      return `You successfully joined the group!`;
    return 'You have a new update.';
  };

  useEffect(() => {
    if (!token) return;

    socketRef.current = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('🟢 Socket connected');
    });

    socketRef.current.on('notification:new', (note) => {
      console.log('🔔 Notification received', note);

      setNotifications((prev) => [note, ...prev]);

      addToast(note);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}

      <div
        aria-live="assertive"
        className="fixed inset-0 z-50 flex flex-col items-end justify-end pointer-events-none px-4 py-6 sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {toasts.map((toast) => (
            <NotificationToast
              key={toast.id}
              id={toast.id}
              title={toast.title}
              message={toast.message}
              onClose={removeToast}
            />
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
