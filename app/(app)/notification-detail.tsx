import { useEffect, useState } from 'react';
import { TouchableOpacity, useWindowDimensions } from 'react-native';
import { Card, XStack, YStack, View } from 'tamagui';
import Typo from '@/components/libs/Typo';
import LayoutScrollApp from '@/components/libs/LayoutScrollApp';
import DefaultColor from '@/components/ui/defaultColor';
import { DefaultSize } from '@/components/ui/defaultStyle';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { client } from '@/utils/axiosClient';
import { NotificationDetail } from '@/services/notifications/types';
import RenderHTML from 'react-native-render-html';
import { useMutationMarkAsRead } from '@/services/notifications/hooks/useMutationNotifications';

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [item, setItem] = useState<NotificationDetail | null>(null);
  const { width } = useWindowDimensions();
  const markAsReadMutation = useMutationMarkAsRead();

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      try {
        const res = await client.get(`/notifications/${id}`).catch(() => null as any);
        if (res?.data?.data) {
          const d = res.data.data;
          setItem({
            id: d.id,
            title: d.title,
            description: d.description,
            created_at: d.create_at ?? d.created_at ?? new Date().toISOString(),
            status: d.status,
          });
        } else {
          const listRes = await client.get('/notifications');
          const list = listRes?.data?.data?.notifications
            ?? listRes?.data?.notifications
            ?? listRes?.data?.data
            ?? listRes?.data
            ?? [];
          const found = list.find((n: any) => String(n.id) === String(id));
          if (found) {
            setItem({
              id: found.id,
              title: found.title,
              description: found.description,
              created_at: found.create_at ?? found.created_at ?? new Date().toISOString(),
              status: found.status,
            });
          }
        }
        if (id) {
          markAsReadMutation.mutate(String(id));
        }
      } catch (e) {
        console.log('load notification detail error', e);
      }
    };
    loadDetail();
  }, [id]);

  return (
    <LayoutScrollApp>
      <XStack alignItems={'center'} justifyContent={'space-between'} marginBottom={DefaultSize['3xl']}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={DefaultSize['2xl']} color={DefaultColor.slate[700]} />
        </TouchableOpacity>
        <Typo weight={'700'} fontSize={DefaultSize['2xl']}>Chi tiết thông báo</Typo>
        <View width={DefaultSize['2xl']} />
      </XStack>

      <Card padded backgroundColor={DefaultColor.white}>
        {item ? (
          <YStack gap={'$3'}>
            <Typo weight={'700'} fontSize={DefaultSize['xl']}>{item.title}</Typo>
            <Typo color={DefaultColor.slate[500]}>
              {new Date(item.created_at).toLocaleDateString('vi-VN', {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
              })}
            </Typo>
            <RenderHTML
              source={{ html: item.description || '' }}
              contentWidth={width}
            />
          </YStack>
        ) : (
          <Typo>Đang tải...</Typo>
        )}
      </Card>
    </LayoutScrollApp>
  );
}


