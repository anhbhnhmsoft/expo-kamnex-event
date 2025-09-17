import {LoginRequest, LoginResponse, RegisterRequest} from "@/services/auth/types";
import {client} from "@/utils/axiosClient";
import {ResponseSuccessType} from "@/utils/@types";


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
}
export default authAPI;