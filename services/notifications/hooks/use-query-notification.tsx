import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {NotificationListRequest} from "@/services/notifications/types";
import notificationAPI from "@/services/notifications/api";
import useNotiStore from "@/services/notifications/stores/useNotiStore";
import {useEffect} from "react";


export const useGetUnreadCount = () => {
    const query = useQuery({
        queryKey: ['notificationAPI-unreadCount'],
        queryFn: async () => notificationAPI.unreadCount(),
        select: (res) => res.data,
    });

    const setUnreadCount = useNotiStore(s=> s.setUnreadCount);
    const unreadCount = useNotiStore(s=> s.unread_count);

    useEffect(() => {
        if (query.error){
            setUnreadCount(0);
        }
    }, [query.error]);

    useEffect(() => {
        if (query.data){
            setUnreadCount(query.data.unread);
        }
    }, [query.data]);

    return {
        unread_count: unreadCount,
        loading: query.isLoading || query.isRefetching,
        get: query.refetch,
    }

}

export const useInfiniteNotificationList = (params: NotificationListRequest) => {
    return useInfiniteQuery({
        queryKey: ['notificationAPI-list', params],
        queryFn: async () => await notificationAPI.list({...params, page: params.page ?? 1}),
        getNextPageParam: (lastPage) => {
            const next = lastPage.pagination.current_page + 1;
            return next <= lastPage.pagination.last_page ? next : undefined;
        },
        initialPageParam: 1,
    })
}
