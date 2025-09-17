import {useQuery} from "@tanstack/react-query";
import {GetOrganizersRequest} from "@/services/app/types";
import commonAPI from "@/services/app/api";


const useQueryGetOrganizers = (params: GetOrganizersRequest, enable: boolean = false) => useQuery({
    queryKey: ['commonAPI-organizers', params],
    queryFn: async () => commonAPI.organizers(params),
    enabled: enable,
    select: (res) => res.data,
})

export default useQueryGetOrganizers;