import {client} from "@/utils/axiosClient";
import {
    checkTransactionPaymentRequest,
    checkTransactionPaymentResponse,
    MembershipAccountRequest,
    MembershipAccountResponse,
    MembershipListRequest,
    MembershipListResponse,
    RegisterMembershipRequest,
    RegisterMembershipResponse
} from "@/services/membership/type";


const defaultUri = '/membership'
const membershipApi = {
    list: async (params: MembershipListRequest): Promise<MembershipListResponse> => {
        const response = await client.get(`${defaultUri}`, {params: params});
        return response.data;
    },
    account: async (params: MembershipAccountRequest): Promise<MembershipAccountResponse> => {
        const response = await client.get(`${defaultUri}/account`, {params: params});
        return response.data;
    },
    register: async (data: RegisterMembershipRequest): Promise<RegisterMembershipResponse> => {
        const response = await client.post(`${defaultUri}/register`, data);
        return response.data;
    },
    checkPayment: async (params: checkTransactionPaymentRequest): Promise<checkTransactionPaymentResponse> => {
        const response = await client.get(`transaction/check-payment/${params.trans_id}`);
        return response.data;
    }
}

export default membershipApi;