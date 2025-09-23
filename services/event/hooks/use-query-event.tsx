import {useQuery} from "@tanstack/react-query";
import eventApi from "@/services/event/api";
import {useEffect} from "react";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {router} from "expo-router";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";

export const useGetDataEventDetail = (id: string | null) => {
    const query = useQuery({
        queryKey: ['eventApi-detail', id],
        queryFn: async () => eventApi.detail(id || ''),
        enabled: !!id,
        select: (res) => res.data,
    });
    const setLoading = useAppStore(state => state.setLoading);
    const handleError = useToastErrorHandler();

    useEffect(() => {
        setLoading(query.isLoading || query.isRefetching)
    },[query.isLoading, query.isRefetching]);

    useEffect(() => {
        if (query.error){
            handleError(query.error)
            router.back();
        }
    }, [query.error]);

    return query.data;
}