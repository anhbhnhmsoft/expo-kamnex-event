import {
    EventDetailResponse,
    EventListResponse,
    RegisterEventHistoryRequest,
    RegisterEventHistoryResponse,
    SearchEventRequest
} from "@/services/event/types";
import {client} from "@/utils/axiosClient";

const defaultUri = '/event';

const eventApi = {
    list: async (params: SearchEventRequest): Promise<EventListResponse> => {
        const response = await client.get(`${defaultUri}`, {params: params});
        return response.data;
    },
    detail: async (id: string): Promise<EventDetailResponse> => {
        const response = await client.get(`${defaultUri}/${id}`);
        return response.data;
    },
    registerEventHistory: async (data: RegisterEventHistoryRequest) :Promise<RegisterEventHistoryResponse> => {
        const response = await client.post(`${defaultUri}/history_register`, data);
        return response.data;
    }

}
export default eventApi;