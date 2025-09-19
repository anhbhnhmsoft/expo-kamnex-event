import {LoginRequest, LoginResponse, RegisterRequest, UserResponse} from "@/services/auth/types";
import {client} from "@/utils/axiosClient";
import {_LanguageCode, ResponseSuccessType} from "@/utils/@types";


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
    user: async (): Promise<UserResponse> =>  {
        const response = await client.get(`/user`);
        return response.data;
    },
    setLang: async (lang: _LanguageCode): Promise<ResponseSuccessType> =>  {
        const response = await client.post(`/set-lang`, {lang});
        return response.data;
    },
}
export default authAPI;