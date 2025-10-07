import {BaseSearchRequest, ResponseDataSuccessType, ResponsePagingSuccessType} from "@/utils/@types";
import {_ConfigMembership, _MembershipUserStatus} from "@/services/membership/const";


export type MembershipListRequest = BaseSearchRequest<object>

export type ConfigMembership = {
    [_ConfigMembership.ALLOW_COMMENT]: boolean;
    [_ConfigMembership.ALLOW_CHOOSE_SEAT]: boolean;
    [_ConfigMembership.ALLOW_DOCUMENTARY]: boolean;
}

export type MembershipListItem = {
    id: string;
    name: string;
    description: string;
    price: string;
    duration: number;
    badge: string | null;
    sort: number;
    badge_color_background: string | null;
    badge_color_text: string | null;
    config: ConfigMembership;
    status: boolean;
}

export type MembershipListResponse = ResponsePagingSuccessType<MembershipListItem[]>

export type MembershipAccountRequest = BaseSearchRequest<object>

export type MembershipAccountResponse = ResponsePagingSuccessType<{
    id: string,
    start_date: string,
    end_date: string,
    status: _MembershipUserStatus,
    membership: MembershipListItem
}[]>



export type RegisterMembershipRequest = {
    membership_id: string;
}

export type RegisterMembershipResponse = ResponseDataSuccessType<{
    trans_id: string;
    expired_at: string;
    config_pay:{
        name: string,
        bin: string,
        number: string,
    };
    money: string,
    description:string,
}>

export type checkTransactionPaymentRequest = {
    trans_id: string;
}
export type checkTransactionPaymentResponse = ResponseDataSuccessType<{
    status: boolean,
}>