import {client} from '@/utils/axiosClient';
import {ResponseSuccessType} from "@/utils/@types";
import {
    MarkAsReadRequest,
    NotificationListRequest,
    NotificationListResponse,
    PushTokenRequest,
    PushTokenResponse,
    UnreadCountResponse
} from "@/services/notifications/types";


const defaultUri = '/notifications';

const notificationAPI = {
    list: async (params: NotificationListRequest): Promise<NotificationListResponse> => {
        const response = await client.get(`${defaultUri}`, {params});
        return response.data;
    },
    unreadCount: async (): Promise<UnreadCountResponse> => {
        const response = await client.get(`${defaultUri}/unread`);
        return response.data;
    },
    sendPushToken: async (data: PushTokenRequest): Promise<PushTokenResponse> => {
        const response = await client.post(`${defaultUri}/push-token`, data);
        return response.data;
    },
    markAsRead: async (data: MarkAsReadRequest): Promise<ResponseSuccessType> => {
        const response = await client.post(`${defaultUri}/read`, data);
        return response.data;
    },
    markAllAsRead: async (): Promise<ResponseSuccessType> => {
        const response = await client.post(`${defaultUri}/read-all`);
        return response.data;
    },
}

export default notificationAPI;
