import {SearchEventRequest} from "@/services/event/types";
import {useInfiniteQuery} from "@tanstack/react-query";
import eventApi from "@/services/event/api";

const useInfiniteEventList = (params: SearchEventRequest) => {
    return useInfiniteQuery({
        queryKey: ['eventApi-list', params],
        queryFn: async () => await eventApi.list({...params, page: params.page ?? 1}),
        getNextPageParam: (lastPage) => {
            const next = lastPage.pagination.current_page + 1;
            return next <= lastPage.pagination.last_page ? next : undefined;
        },
        initialPageParam: 1,
    })
}

export default useInfiniteEventList;