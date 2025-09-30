import { useQuery } from '@tanstack/react-query';
import notificationAPI from '../api';
import { NotificationListResponse } from '../types';
import { _UserNotificationStatus, _UserNotificationType } from '../const';

interface UseQueryNotificationsParams {
  page?: number;
  per_page?: number;
  status?: _UserNotificationStatus;
  notification_type?: _UserNotificationType;
  enabled?: boolean;
}

export const useQueryNotifications = (params: UseQueryNotificationsParams = {}) => {
  return useQuery<NotificationListResponse>({
    queryKey: ['notifications', params],
    queryFn: () => notificationAPI.getNotifications(params),
    enabled: params.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

