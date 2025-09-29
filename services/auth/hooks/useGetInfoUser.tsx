import {useQuery} from "@tanstack/react-query";
import authAPI from "@/services/auth/api";
import useAuthStore from "@/services/auth/stores/useAuthStore";
import {useEffect} from "react";
import {useAppStore} from "@/services/app/stores/useAppStore";

const useGetInfoUser = () => {
    const user = useAuthStore(state => state.user);
    const setUser = useAuthStore(state => state.setUser);
    const setLoading = useAppStore(state => state.setLoading);
    const query = useQuery({
        queryKey: ['authAPI-user'],
        queryFn: async () => authAPI.user(),
        enabled: false,
        select: (res) => res.data,
    });

    useEffect(() => {
        if (!user){
            query.refetch();
        }
    }, [user]);

    useEffect(() => {
        if (query.data){
            setUser(query.data).then();
        }
    }, [query.data]);

    useEffect(() => {
        setLoading(query.isLoading || query.isRefetching)
    },[query.isLoading , query.isRefetching])

    return {
        user: user,
        error: query.error,
        get: query.refetch,
        set: setUser,
    }
}
export default useGetInfoUser;