import { useNotificationStore } from '@/services/notifications/stores/useNotificationStore';
import { NotificationItem } from '@/services/notifications/types';
import { client } from '@/utils/axiosClient';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { registerForPushNotificationsAsync, sendLocalNotification } from '../notificationService';
import { useMutationSendPushToken } from './useMutationNotifications';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const sendPushTokenMutation = useMutationSendPushToken();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setUnreadCount, setNotifications } = useNotificationStore.getState();

  const fetchNotifications = async () => {
    try {
      const res = await client.get('/notifications');
      const payload = res?.data;
      const list = Array.isArray(payload?.data)
        ? payload.data
        : (payload?.data?.notifications ?? payload?.notifications ?? payload?.data ?? []);

      const mapped: NotificationItem[] = list.map((n: any) => ({
        id: String(n.id),
        title: n.title,
        description: n.description,
        created_at: n.create_at ?? n.created_at ?? new Date().toISOString(),
        status: n.status,
      }));

      setUnreadCount(payload?.unread_count ?? payload?.data?.unread_count ?? 0);
      setNotifications(mapped);
    } catch (e) {
      console.log('fetch notifications error', e);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        console.log('ExpoPushToken:', token);
        
        // Gửi push token lên server (chỉ khi có token)
        if (Device.isDevice && token) {
          sendPushTokenMutation.mutate({
            expo_push_token: token,
            device_id: Device.osInternalBuildId || 'unknown',
            device_type: Platform.OS as 'ios' | 'android',
          });
        }
      }
    });

    // Fetch notifications ngay khi vào app
    fetchNotifications();

    // Fetch notifications mỗi 30 giây
    intervalRef.current = setInterval(fetchNotifications, 30000);

    // Fetch notifications khi app được focus
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        fetchNotifications();
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      appStateSubscription?.remove();
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const showNotification = async (title: string, body: string) => {
    await sendLocalNotification(title, body);
  };

  return {
    expoPushToken,
    notification,
    showNotification,
  };
};
