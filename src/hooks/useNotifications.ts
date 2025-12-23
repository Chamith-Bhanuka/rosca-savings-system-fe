import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useNotifications(token: string | null) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    console.log('🔐 token in App:', token);
    if (!token) return;

    socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('socket connected', socket?.id);
    });

    socket.on('notification:new', (note) => {
      setNotifications((prev) => [note, ...prev]);
      // show toast or badge here
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });

    // fetch missed notifications on mount
    (async () => {
      const res = await fetch('/api/notifications?unread=true', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    })();

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [token]);

  return { notifications, socket };
}
