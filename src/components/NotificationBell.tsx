import { useNotifications } from '../context/NotificationProvider';

export default function NotificationBell() {
  const { notifications } = useNotifications();

  return <div>🔔 {notifications.length}</div>;
}
