import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './authContext';

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // 1. Get the user object from AuthContext
  const { user } = useAuth();

  // 2. Extract the token from the user object (if user exists)
  const token = user?.token;

  const socketRef = useRef<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // 3. This check now works correctly. If no token, don't connect.
    if (!token) return;

    console.log('🔌 Initializing socket with token...');

    socketRef.current = io('http://localhost:5000', {
      auth: { token }, // Pass the valid token here
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log(
        '🟢 Socket connected successfully via Provider. ID:',
        socketRef.current?.id
      );
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('🔴 Socket connection error:', err.message);
    });

    socketRef.current.on('notification:new', (note) => {
      console.log('🔔 New Notification Received:', note);
      setNotifications((prev) => [note, ...prev]);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [token]); // Re-run this effect when the token changes

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
