import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {ListDocumentRequest} from "@/services/schedules/type";
import authAPI from "@/services/auth/api";

export const useInfiniteGiftList = (params: ListDocumentRequest) => {
    return useInfiniteQuery({
        queryKey: ['authAPI-listGift', params],
        queryFn: async ({ pageParam }) => {
            return await authAPI.listGift({
                ...params,
                page: pageParam as number
            });
        },
        getNextPageParam: (lastPage) => {
            const next = lastPage.pagination.current_page + 1;
            return next <= lastPage.pagination.last_page ? next : undefined;
        },
        initialPageParam: 1,
    })
}

export const useQueryGetSupportLink = () => {
    return  useQuery({
        queryKey: ['authAPI-linkSupport'],
        queryFn: async () => authAPI.linkSupport(),
        select: (res) => res.data,
    });
}