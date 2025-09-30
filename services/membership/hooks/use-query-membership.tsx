import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import membershipApi from "@/services/membership/api";
import {MembershipAccountRequest, MembershipListRequest} from "@/services/membership/type";


export const useInfiniteMembershipList = (params: MembershipListRequest) => {
    return useInfiniteQuery({
        queryKey: ['membershipApi-list', params],
        queryFn: async () => await membershipApi.list({...params, page: params.page ?? 1}),
        getNextPageParam: (lastPage) => {
            const next = lastPage.pagination.current_page + 1;
            return next <= lastPage.pagination.last_page ? next : undefined;
        },
        initialPageParam: 1,
    })
}

export const useQueryCheckPayment = (tranId?: string | null) => useQuery({
    queryKey: ["paymentStatus", tranId],
    queryFn: async () => {
        return  await membershipApi.checkPayment({trans_id: tranId || ''});
    },
    refetchInterval: 5000,
    enabled: !!tranId,
    select: (res) => res.data,
});

export const useInfiniteMembershipAccount = (params: MembershipAccountRequest) => {
    return useInfiniteQuery({
        queryKey: ['membershipApi-account', params],
        queryFn: async () => await membershipApi.account({...params, page: params.page ?? 1}),
        getNextPageParam: (lastPage) => {
            const next = lastPage.pagination.current_page + 1;
            return next <= lastPage.pagination.last_page ? next : undefined;
        },
        initialPageParam: 1,
    })
}
