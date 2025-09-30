import {useCallback, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {Card, XStack, YStack, View} from 'tamagui';
import Typo from '@/components/libs/Typo';
import LayoutScrollApp from '@/components/libs/LayoutScrollApp';
import DefaultColor from '@/components/ui/defaultColor';
import {DefaultSize} from '@/components/ui/defaultStyle';
import {FontAwesome} from '@expo/vector-icons';
import {router} from 'expo-router';
import {client} from '@/utils/axiosClient';
import { useNotificationStore } from '@/services/notifications/stores/useNotificationStore';
import NotificationBadge from '@/components/libs/NotificationBadge';
import { NotificationItem } from '@/services/notifications/types';
import { useFocusEffect } from '@react-navigation/native';
import { _UserNotificationStatus } from '@/services/notifications/const';



export default function NotificationsScreen() {
  const notifications = useNotificationStore(s => s.notifications);
  const setNotifications = useNotificationStore(s => s.setNotifications);
  const setUnreadCount = useNotificationStore(s => s.setUnreadCount);
  const unreadCount = useNotificationStore(s => s.unreadCount);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await client.get('/notifications');
      const payload = res?.data;

      const list = payload?.data?.notifications ?? payload?.notifications ?? payload?.data ?? [];
      const mapped: NotificationItem[] = list.map((n: any) => ({
        id: String(n.id),
        title: n.title,
        description: n.description,
        created_at: n.create_at ?? n.created_at ?? new Date().toISOString(),
        status: n.status,
      }));

      setNotifications(mapped);

      const unreadFromApi = payload?.unread_count ?? payload?.data?.unread_count ?? 0;
      setUnreadCount(unreadFromApi);
    } catch (e) {
      setNotifications([]);
    }
  }, [setNotifications, setUnreadCount]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  return (
    <LayoutScrollApp>
      <XStack alignItems={'center'} justifyContent={'space-between'} marginBottom={DefaultSize['3xl']}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={DefaultSize['2xl']} color={DefaultColor.slate[700]} />
        </TouchableOpacity>
        <XStack alignItems={'center'} gap={'$1'}>
          <View position="relative">
            <FontAwesome name="bell" size={DefaultSize['2xl']} color={"#A20000"} />
            <NotificationBadge count={unreadCount} style={{ position: 'absolute', top: -2, right: -6 }} />
          </View>
        </XStack>
      </XStack>
      <Typo weight={'700'} fontSize={DefaultSize['2xl']} marginBottom={DefaultSize['3xl']}>Thông báo</Typo>
      {notifications.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            const updated = notifications.map((n) => String(n.id) === String(item.id) ? { ...n, status: _UserNotificationStatus.READ } : n);
            setNotifications(updated);
            router.push(`/(app)/notification-detail?id=${item.id}`);
          }}
        >
          <Card marginBottom={12} padded backgroundColor={item.status == _UserNotificationStatus.READ ? "#EDEDED" : DefaultColor.white}>
            <XStack alignItems={'center'} gap={'$3'}>
              <View width={DefaultSize['3xl']} height={DefaultSize['3xl']} alignItems={'center'} justifyContent={'center'}>
                <FontAwesome name="bell" size={DefaultSize['xl']} color={DefaultColor.red['600']} />
              </View>
              <YStack flex={1}>
                <Typo weight={'700'} numberOfLines={1}>{item.title}</Typo>
                <Typo color={DefaultColor.slate[500]} numberOfLines={1}>
                  {new Date(item.created_at).toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Typo>
              </YStack>
            </XStack>
          </Card>
        </TouchableOpacity>
      ))}
    </LayoutScrollApp>
  );
}