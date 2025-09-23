export enum _ActionSearchEvent {
    SEARCH = 'SEARCH',
    INIT = 'INIT',
}

export enum _EventStatus {
    FOR_USER = 0,
    ACTIVE = 1,
    UPCOMING = 2,
    CLOSED = 3,
}

export const getLabelEventStatus = (param: _EventStatus) => {
    switch (param) {
        case _EventStatus.ACTIVE:
            return 'enum._EventStatus.ACTIVE';
        case _EventStatus.UPCOMING:
            return 'enum._EventStatus.UPCOMING';
        case _EventStatus.CLOSED:
            return 'enum._EventStatus.CLOSED';
        default:
            return '';
    }
}


export enum _EventUserRole {
    ORGANIZER = 1, // Người tổ chức
    PRESENTER = 2, // Người dẫn trương trình
}

export const getLabelEventUserRole = (event: _EventUserRole) => {
    switch (event) {
        case _EventUserRole.ORGANIZER:
            return 'enum._EventUserRole.ORGANIZER';
        case _EventUserRole.PRESENTER:
        default:
            return 'enum._EventUserRole.PRESENTER';
    }
}

export enum _EventUserHistory {
    SEENED = 1, // đã xem
    BOOKED = 2, // đặt vẽ
    PARTICIPATED = 3, // đã tham gia
    CANCELLED = 4 // đã hủy
}