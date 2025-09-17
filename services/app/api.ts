import {GetOrganizersRequest, GetOrganizersResponse} from "@/services/app/types";
import {client} from "@/utils/axiosClient";

const defaultUri = '/common';
const commonAPI = {
    organizers: async (params: GetOrganizersRequest): Promise<GetOrganizersResponse> =>  {
        const response = await client.get(`${defaultUri}/organizers`, {params: params});
        return response.data;
    },
}

export default commonAPI;