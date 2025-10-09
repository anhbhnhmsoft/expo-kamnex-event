import {_LanguageCode, BaseSearchRequest, ResponseDataSuccessType, ResponsePagingSuccessType} from "@/utils/@types";
import {ConfigMembership} from "@/services/membership/type";


export type LoginRequest = {
    email: string;
    password: string;
    organizer_id: string;
    locate?: _LanguageCode

}
export type LoginResponse = {
    token: string;
    user: User;
};
export type User = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    introduce?: string;
    gender: 'male' | 'female' | 'other';
    avatar_url: string | null;
    organizer_id: string;
    lang: _LanguageCode,
    membership: {
        id: string;
        name: string;
        config: ConfigMembership
    } | null
}

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    organizer_id: string;
    locate?: _LanguageCode
}

export type UserResponse = ResponseDataSuccessType<User>

export type EditInfoRequest = {
    name: string;
    phone?: string;
    address?: string;
    introduce?:string;
    password?:string;
    confirm_password?:string;
}

export type ListGiftRequest = BaseSearchRequest<object>

export type ListGiftResponse = ResponsePagingSuccessType<{
    id: string,
    event: {
        id: string,
        name: string,
    },
    gift: {
        id: string,
        name: string,
        description: string | null,
    },
    created_at: string
}>
