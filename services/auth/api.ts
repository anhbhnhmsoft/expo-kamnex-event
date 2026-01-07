import {
    EditInfoRequest,
    ListGiftRequest, ListGiftResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    UserResponse
} from "@/services/auth/types";
import {client} from "@/utils/axiosClient";
import {_LanguageCode, ResponseSuccessType} from "@/utils/@types";
import {LinkSupportResponse} from "@/services/schedules/type";


const defaultUri = '/auth';
const authAPI = {
    login: async (data: LoginRequest): Promise<LoginResponse> =>  {
        const response = await client.post(`${defaultUri}/login`, data);
        return response.data;
    },
    register: async (data: RegisterRequest): Promise<ResponseSuccessType> =>  {
        const response = await client.post(`${defaultUri}/register`, data);
        return response.data;
    },
    logout: async (): Promise<ResponseSuccessType> =>  {
        const response = await client.post(`${defaultUri}/logout`);
        return response.data;
    },
    user: async (): Promise<UserResponse> =>  {
        const response = await client.get(`${defaultUri}/user`);
        return response.data;
    },
    setLang: async (lang: _LanguageCode): Promise<ResponseSuccessType> =>  {
        const response = await client.post(`${defaultUri}/set-lang`, {lang});
        return response.data;
    },
    editInfo: async (data: EditInfoRequest): Promise<UserResponse> =>  {
        const response = await client.post(`${defaultUri}/edit-info`, data);
        return response.data;
    },
    editAvatar: async (data:FormData): Promise<UserResponse> =>  {
        const response = await client.post(`${defaultUri}/edit-avatar`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    },
    deleteAvatar: async (): Promise<UserResponse> =>  {
        const response = await client.delete(`${defaultUri}/delete-avatar`);
        return response.data;
    },
    listGift: async (params: ListGiftRequest): Promise<ListGiftResponse> =>  {
        const response = await client.get(`${defaultUri}/gift`, {params});
        return response.data;
    },
    linkSupport: async (): Promise<LinkSupportResponse> =>  {
        const response = await client.get(`${defaultUri}/link-support`);
        return response.data;
    },
    deleteAccount: async (): Promise<ResponseSuccessType> =>  {
        const response = await client.delete(`${defaultUri}/delete-account`);
        return response.data;
    },
}
export default authAPI;