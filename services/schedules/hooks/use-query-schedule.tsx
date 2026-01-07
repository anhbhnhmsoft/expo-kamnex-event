import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import schedulesApi from "@/services/schedules/api";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import {useEffect} from "react";
import {router} from "expo-router";
import {ListDocumentRequest} from "@/services/schedules/type";


export const useQueryDetailScheduler = (id?: string) => {
    const query = useQuery({
        queryKey: ["schedulesApi-detail", id],
        queryFn: async () => {
            return await schedulesApi.detail(id || '');
        },
        enabled: !!id,
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
        schedule: query.data,
        get: query.refetch,
        loading: query.isLoading || query.isRefetching
    }
};

export const useQueryDetailDocument = (id?:string ) => {
    const query = useQuery({
        queryKey: ["schedulesApi-detailDocument", id],
        queryFn: async () => {
            return await schedulesApi.detailDocument(id || '');
        },
        enabled: !!id,
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
        document: query.data,
        get: query.refetch,
        loading: query.isLoading || query.isRefetching
    }
}

export const useInfiniteListDocument = (params: ListDocumentRequest) => {
    return useInfiniteQuery({
        queryKey: ['schedulesApi-listDocument', params],
        queryFn: async ({ pageParam }) => {
            return await schedulesApi.listDocument({
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