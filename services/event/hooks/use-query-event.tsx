import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import eventApi from "@/services/event/api";
import {useEffect} from "react";
import {router} from "expo-router";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import useEventDetailStore from "@/services/event/stores/useEventDetailStore";
import {ListCommentRequest, SearchEventRequest} from "@/services/event/types";

export const useGetDataEventDetail = (id: string | null) => {
    const query = useQuery({
        queryKey: ['eventApi-detail', id],
        queryFn: async () => eventApi.detail(id || ''),
        enabled: !!id,
        select: (res) => res.data,
    });
    const handleError = useToastErrorHandler();
    const setEvent = useEventDetailStore(s => s.setEvent);
    const event = useEventDetailStore(s => s.event);
    useEffect(() => {
        if (query.error){
            handleError(query.error);
            setEvent(null);
            router.back();
        }
    }, [query.error]);

    useEffect(() => {
        if (query.data){
            setEvent(query.data);
        }
    }, [query.data]);

    return {
        event,
        loading: query.isLoading || query.isRefetching,
        refetch: query.refetch,
    };
}

export const useInfiniteEventList = (params: SearchEventRequest) => {
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

export const useInfiniteCommentList = (params: ListCommentRequest) => {
    return useInfiniteQuery({
        queryKey: ['eventApi-listComment', params],
        enabled: !!params?.filters?.event_id,
        queryFn: async () => await eventApi.listComment({...params, page: params.page ?? 1}),
        getNextPageParam: (lastPage) => {
            const next = lastPage.pagination.current_page + 1;
            return next <= lastPage.pagination.last_page ? next : undefined;
        },
        initialPageParam: 1,
    })
}

export const useQueryGetEventArea = (event_id?: string) => {
    const query = useQuery({
        queryKey: ['eventApi-eventArea', event_id],
        queryFn: async () => eventApi.eventArea({
            event_id: event_id ?? ''
        }),
        enabled: !!event_id,
        select: (res) => res.data,
    });

    const handleError = useToastErrorHandler();
    const setArea = useEventDetailStore(s => s.setEventArea);
    const area = useEventDetailStore(s => s.event_area);
    useEffect(() => {
        if (query.error){
            handleError(query.error);
            setArea([]);
            router.back();
        }
    }, [query.error]);

    useEffect(() => {
        if (query.data){
            setArea(query.data);
        }
    }, [query.data]);

    return {
        area,
        loading: query.isLoading || query.isRefetching
    };
}

export const useQueryGetEventSeat = (event_id?: string, area_id?: string) => {
    const query = useQuery({
        queryKey: ['eventApi-eventSeat', event_id, area_id],
        queryFn: async () => eventApi.eventSeat({
            event_id: event_id ?? '',
            area_id: area_id ?? ''
        }),
        enabled: !!event_id && !!area_id,
        select: (res) => res.data,
    });
    const handleError = useToastErrorHandler();
    const setEventSeat = useEventDetailStore(s => s.setEventSeat);
    const event_seat = useEventDetailStore(s => s.event_seat);
    useEffect(() => {
        if (query.error){
            handleError(query.error);
            setEventSeat([]);
            router.back();
        }
    }, [query.error]);

    useEffect(() => {
        if (query.data){
            setEventSeat(query.data);
        }
    }, [query.data]);

    return {
        event_seat,
        loading: query.isLoading || query.isRefetching
    };
}

/**
 * Lấy thông danh sách khảo sát của sự kiện
 */
export const useQueryGetEventPoll = (event_id: string | null) => {
    const query = useQuery({
        queryKey: ['eventApi-listPoll', event_id],
        queryFn: async () => eventApi.listPoll({
            event_id: event_id ?? ''
        }),
        enabled: !!event_id,
        select: (res) => res.data,
    });
    const handleError = useToastErrorHandler();

    useEffect(() => {
        if (query.error){
            handleError(query.error);
        }
    }, [query.error]);


    return {
        data: query.data,
        loading: query.isLoading || query.isRefetching,
        refetch: query.refetch,
    };
}

/**
 * Lấy thông tin khảo sát của sự kiện
 */
export const useQueryGetEventPollItem = (poll_id: string | null) => {
    const query = useQuery({
        queryKey: ['eventApi-itemPoll', poll_id],
        queryFn: async () => eventApi.itemPoll({
            poll_id: poll_id ?? ''
        }),
        enabled: !!poll_id,
        select: (res) => res.data,
    });
    const handleError = useToastErrorHandler();
    useEffect(() => {
        if (query.error){
            handleError(query.error);
            router.back();
        }
    }, [query.error]);

    return {
        data: query.data,
        loading: query.isLoading || query.isRefetching,
        refetch: query.refetch,
    };
}
