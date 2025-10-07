import {
    DetailDocumentResponse,
    DetailScheduleResponse,
    ListDocumentRequest,
    ListDocumentResponse
} from "@/services/schedules/type";
import {client} from "@/utils/axiosClient";


const defaultUri = `/schedule`

const schedulesApi = {
    detail: async (id: string): Promise<DetailScheduleResponse> => {
        const response = await client.get(`${defaultUri}/${id}`);
        return response.data;
    },
    detailDocument: async (id: string): Promise<DetailDocumentResponse> => {
        const response = await client.get(`${defaultUri}/document/${id}`);
        return response.data;
    },
    listDocument: async (params: ListDocumentRequest): Promise<ListDocumentResponse> => {
        const response = await client.get(`${defaultUri}/list-document`, {params});
        return response.data;
    },

}
export default schedulesApi;