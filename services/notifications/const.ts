export enum _UserNotificationStatus {
    PENDING = 1,
    SENT = 2,  // chưa đọc (đã gửi)
    READ = 3,  // đã đọc
    FAILED = 4 // gửi thất bại
}

export enum _UserNotificationType {
    EVENT_REMINDER = 1,
    EVENT_INVITATION = 2,
    EVENT_CANCELLED = 3,
    EVENT_UPDATED = 4,
    MEMBERSHIP_APPROVED = 5,
    SYSTEM_ANNOUNCEMENT = 6,
}

export const getLabelUserNotificationStatus = (status: _UserNotificationStatus) => {
    switch (status) {
        case _UserNotificationStatus.READ:
            return 'enum._NotificationRecipientStatus.READ';
        case _UserNotificationStatus.SENT:
            return 'enum._NotificationRecipientStatus.UNREAD';
        case _UserNotificationStatus.FAILED:
        default:
            return 'enum._NotificationRecipientStatus.UNREAD';
    }
}