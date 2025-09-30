import { client } from '@/utils/axiosClient';
import { 
  NotificationListResponse, 
  PushTokenRequest, 
  PushTokenResponse,
  CreateNotificationRequest,
  CreateNotificationResponse 
} from './types';

class NotificationAPI {
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    status?: number;
    notification_type?: number;
  }): Promise<NotificationListResponse> {
    const response = await client.get('/notifications', { params });
    return response.data;
  }

  async markAsRead(notificationId: string): Promise<{ message: string; data: any }> {
    const response = await client.post('/notifications', { notification_id: notificationId });
    return response.data;
  }

  async markAllAsRead(): Promise<{ message: string; data: any }> {
    const response = await client.post('/notifications/read-all');
    return response.data;
  }

  /**
   * Gửi Expo Push Token lên server
   */
  async sendPushToken(data: PushTokenRequest): Promise<PushTokenResponse> {
    const response = await client.post('/notifications/push-token', data);
    return response.data;
  }
}

const notificationAPI = new NotificationAPI();
export default notificationAPI;
