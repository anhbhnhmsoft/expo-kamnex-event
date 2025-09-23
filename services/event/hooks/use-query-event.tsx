import {useQuery} from "@tanstack/react-query";
import eventApi from "@/services/event/api";
import {useEffect} from "react";
import {router} from "expo-router";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";

export const useGetDataEventDetail = (id: string | null) => {
    const query = useQuery({
        queryKey: ['eventApi-detail', id],
        queryFn: async () => eventApi.detail(id || ''),
        enabled: !!id,
        select: (res) => res.data,
    });
    const handleError = useToastErrorHandler();

    useEffect(() => {
        if (query.error){
            handleError(query.error)
            router.back();
        }
    }, [query.error]);

    return {
        event: query.data,
        loading: query.isLoading || query.isRefetching
    };
}