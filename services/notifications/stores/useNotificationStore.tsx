import { create } from 'zustand';
import { NotificationItem } from '../types';
import { _UserNotificationStatus } from '../const';

interface NotificationStore {
  notifications: NotificationItem[];
  unreadCount: number;
  lastFetched: Date | null;
  setNotifications: (notifications: NotificationItem[]) => void;
  addNotification: (notification: NotificationItem) => void;
  updateNotification: (id: string, updates: Partial<NotificationItem>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setUnreadCount: (count: number) => void;
  setLastFetched: (date: Date) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  lastFetched: null,

  setNotifications: (notifications) => set({ notifications }),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),

  updateNotification: (id, updates) => set((state) => ({
    notifications: state.notifications.map((notification: NotificationItem) =>
      notification.id === id ? { ...notification, ...updates } : notification
    ),
  })),

  markAsRead: (id) => set((state) => {
    const notifications: NotificationItem[] = state.notifications.map((n: NotificationItem) =>
      n.id === id ? { ...n, status: _UserNotificationStatus.READ } : n
    );
    return {
      notifications,
      unreadCount: Math.max(0, state.unreadCount - 1),
    };
  }),
  
  markAllAsRead: () => set((state) => {
    const notifications: NotificationItem[] = state.notifications.map((n: NotificationItem) => ({
      ...n,
      status: _UserNotificationStatus.READ,
    }));
    return { notifications, unreadCount: 0 };
  }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  setLastFetched: (date) => set({ lastFetched: date }),

  clearNotifications: () => set({ 
    notifications: [], 
    unreadCount: 0, 
    lastFetched: null 
  }),
}));
