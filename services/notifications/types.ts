import {_UserNotificationStatus, _UserNotificationType} from "./const";
import {PlatformOSType} from "react-native";
import {BaseSearchRequest, ResponseDataSuccessType, ResponsePagingSuccessType} from "@/utils/@types";


export type NotificationListRequest = BaseSearchRequest<object>;

export type NotificationItem = {
    id: string;
    title: string;
    description: string;
    created_at: string;
    notification_type: _UserNotificationType,
    status: _UserNotificationStatus;
};

export type NotificationListResponse = ResponsePagingSuccessType<NotificationItem>


export type UnreadCountResponse = ResponseDataSuccessType<{ unread: number }>

export interface PushTokenRequest {
    expo_push_token: string;
    device_id: string | null;
    device_type: PlatformOSType;
}

export interface PushTokenResponse {
    success: boolean;
    message: string;
}

export type MarkAsReadRequest = {
    id: string
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