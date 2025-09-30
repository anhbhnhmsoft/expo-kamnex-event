import { _UserNotificationStatus, _UserNotificationType } from "./const";

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status: _UserNotificationStatus;
};

export interface NotificationListResponse {
  notifications: NotificationItem[];
  unread_count: number;
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface PushTokenRequest {
  expo_push_token: string;
  device_id?: string;
  device_type?: 'ios' | 'android';
}

export interface PushTokenResponse {
  success: boolean;
  message: string;
}

export interface CreateNotificationRequest {
  title: string;
  description: string;
  data?: any;
  notification_type: _UserNotificationType;
  user_ids?: number[];
  organizer_id?: number;
}

export interface CreateNotificationResponse {
  success: boolean;
  message: string;
  notification_ids: number[];
}

export type NotificationDetail = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status: _UserNotificationStatus;
};