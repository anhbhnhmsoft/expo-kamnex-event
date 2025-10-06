import {useMutation} from "@tanstack/react-query";
import notificationAPI from "@/services/notifications/api";
import {MarkAsReadRequest} from "@/services/notifications/types";


export const useMutateMarkAsReadNotification = () => {
    return useMutation({
        mutationFn: (data: MarkAsReadRequest) => notificationAPI.markAsRead(data),
    })
}

export const useMutateMarkAllReadNotification = () => {
    return useMutation({
        mutationFn: () => notificationAPI.markAllAsRead(),
    })
}