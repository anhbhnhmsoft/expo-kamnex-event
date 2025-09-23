import {EventDetailResponse, EventListResponse, SearchEventRequest} from "@/services/event/types";
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
    }
}
export default eventApi;