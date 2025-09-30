
export enum _MembershipUserStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    EXPIRED = 2,
}
export const getLabelMembershipUserStatus  = (param: _MembershipUserStatus) => {
    switch (param) {
        case _MembershipUserStatus.INACTIVE:
            return 'enum._MembershipUserStatus.INACTIVE';
        case _MembershipUserStatus.ACTIVE:
            return 'enum._MembershipUserStatus.ACTIVE';
        case _MembershipUserStatus.EXPIRED:
            return 'enum._MembershipUserStatus.EXPIRED';
        default:
            return '';
    }
}
export enum _ConfigMembership {
    ALLOW_COMMENT = "allow_comment",
    ALLOW_CHOOSE_SEAT = "allow_choose_seat",
    ALLOW_DOCUMENTARY = "allow_documentary",
}
export const getLabelConfigMembership = (param: _ConfigMembership) => {
    switch (param) {
        case _ConfigMembership.ALLOW_COMMENT:
            return 'enum._ConfigMembership.ALLOW_COMMENT';
        case _ConfigMembership.ALLOW_CHOOSE_SEAT:
            return 'enum._ConfigMembership.ALLOW_CHOOSE_SEAT';
        case _ConfigMembership.ALLOW_DOCUMENTARY:
            return 'enum._ConfigMembership.ALLOW_DOCUMENTARY';
        default:
            return '';
    }
}
