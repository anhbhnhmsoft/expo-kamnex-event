import { useMutation, useQueryClient } from '@tanstack/react-query';
import notificationAPI from '../api';
import useToastErrorHandler from '@/services/app/hooks/useToastErrorHandler';
import { useNotificationStore } from '@/services/notifications/stores/useNotificationStore';

export const useMutationMarkAsRead = () => {
  const queryClient = useQueryClient();
  const handleError = useToastErrorHandler();
  const markAsReadInStore = useNotificationStore((s) => s.markAsRead);

  return useMutation({
    mutationFn: (notificationId: string) => notificationAPI.markAsRead(notificationId),
    onSuccess: (_response, notificationId) => {
      if (typeof notificationId === 'string') {
        markAsReadInStore(notificationId);
      }
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: handleError,
  });
};

export const useMutationSendPushToken = () => {
  const handleError = useToastErrorHandler();

  return useMutation({
    mutationFn: (data: { expo_push_token: string; device_id?: string; device_type?: 'ios' | 'android' }) => 
      notificationAPI.sendPushToken(data),
    onError: handleError,
  });
};

export const useMutationMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  const handleError = useToastErrorHandler();
  const markAllAsReadInStore = useNotificationStore((s) => s.markAllAsRead);

  return useMutation({
    mutationFn: () => notificationAPI.markAllAsRead(),
    onSuccess: () => {
      markAllAsReadInStore();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: handleError,
  });
};
