import useAuthStore from "@/services/auth/stores/useAuthStore";
import {useMutation} from "@tanstack/react-query";
import authAPI from "@/services/auth/api";
import {useCallback} from "react";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {router} from "expo-router";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";


const useLogout = () => {
    const logout = useAuthStore(state => state.logout);
    const setLoading = useAppStore(s =>s.setLoading)
    const handleError = useToastErrorHandler();
    const {mutate} = useMutation({
        mutationFn: () => authAPI.logout(),
        onSuccess: async () => {
            setLoading(false);
            await logout();
            router.replace('/(auth)');
        },
        onError: (error) => {
            setLoading(false);
            handleError(error);
        },
    })

    return useCallback(async () => {
        setLoading(true);
        mutate();
    },[]);
}

export default useLogout;