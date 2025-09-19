import {_LanguageCode, ResponseDataSuccessType} from "@/utils/@types";


export type LoginRequest = {
    email: string;
    password: string;
    organizer_id: number;
    locate?: _LanguageCode

}
export type LoginResponse = {
    token: string;
    user: User;
};
export type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string;
    introduce: string | null;
    gender: 'male' | 'female' | 'other';
    avatar_url: string | null;
    organizer_id: number;
    lang: _LanguageCode
}

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    organizer_id: number;
    locate?: _LanguageCode
}

export type UserResponse = ResponseDataSuccessType<User>