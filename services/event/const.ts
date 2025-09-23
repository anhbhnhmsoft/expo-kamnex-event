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