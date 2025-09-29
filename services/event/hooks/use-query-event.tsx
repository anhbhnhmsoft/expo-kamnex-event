import {useQuery} from "@tanstack/react-query";
import eventApi from "@/services/event/api";
import {useEffect} from "react";
import {router} from "expo-router";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import useEventDetailStore from "@/services/event/stores/useEventDetailStore";

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
        loading: query.isLoading || query.isRefetching
    };
}