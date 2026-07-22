import { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string, type?: Notification['type']) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', message: 'Welcome to Restaurant Management System', type: 'info', timestamp: new Date().toISOString(), read: false },
    { id: 'n2', message: 'Lettuce stock is running low', type: 'warning', timestamp: new Date().toISOString(), read: false },
  ]);

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const n: Notification = { id: `n_${Date.now()}`, message, type, timestamp: new Date().toISOString(), read: false };
    setNotifications((prev) => [n, ...prev.slice(0, 49)]);
  };

  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const removeNotification = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount: notifications.filter((n) => !n.read).length, addNotification, markRead, markAllRead, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
