import {
    CommentListResponse,
    CommentRequest, EventAreaRequest, EventAreaResponse,
    EventDetailResponse,
    EventListResponse, EventSeatRequest, EventSeatResponse, ListCommentRequest,
    RegisterEventHistoryRequest,
    RegisterEventHistoryResponse,
    SearchEventRequest,
    RegisterDocumentRequest,
    RegisterDocumentResponse
} from "@/services/event/types";
import {client} from "@/utils/axiosClient";
import {ResponseSuccessType} from "@/utils/@types";

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
    registerEventHistory: async (data: RegisterEventHistoryRequest): Promise<RegisterEventHistoryResponse> => {
        const response = await client.post(`${defaultUri}/history_register`, data);
        return response.data;
    },
    comment: async (data: CommentRequest): Promise<ResponseSuccessType> => {
        const response = await client.post(`${defaultUri}/comment`, data);
        return response.data;
    },
    listComment: async (params: ListCommentRequest): Promise<CommentListResponse> => {
        const response = await client.get(`${defaultUri}/list-comment`, {params: params});
        return response.data;
    },
    eventArea: async (params: EventAreaRequest): Promise<EventAreaResponse> => {
        const response = await client.get(`${defaultUri}/${params.event_id}/area`);
        return response.data;
    },
    eventSeat: async (params: EventSeatRequest): Promise<EventSeatResponse> => {
        const response = await client.get(`${defaultUri}/${params.event_id}/area/${params.area_id}`);
        return response.data;
    },
    registerDocument: async (data: RegisterDocumentRequest): Promise<RegisterDocumentResponse> => {
        const response = await client.post('/schedule/document/register', data);
        return response.data;
    }
}
export default eventApi;