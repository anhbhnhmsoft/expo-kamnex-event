import {GetOrganizersRequest, GetOrganizersResponse, ProvinceResponse} from "@/services/app/types";
import {client} from "@/utils/axiosClient";

const defaultUri = '/common';
const commonAPI = {
    organizers: async (params: GetOrganizersRequest): Promise<GetOrganizersResponse> =>  {
        const response = await client.get(`${defaultUri}/organizers`, {params: params});
        return response.data;
    },
    province: async (): Promise<ProvinceResponse> => {
        const response = await client.get(`${defaultUri}/province`);
        return response.data;
    },
    district: async (code:string): Promise<ProvinceResponse> => {
        const response = await client.get(`${defaultUri}/district/${code}`);
        return response.data;
    },
    ward: async (code:string): Promise<ProvinceResponse> => {
        const response = await client.get(`${defaultUri}/ward/${code}`);
        return response.data;
    },
}

export default commonAPI;