import {useMutation} from "@tanstack/react-query";
import authAPI from "@/services/auth/api";
import {_LanguageCode} from "@/utils/@types";
import useLanguage from "@/services/app/hooks/useLanguage";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {useCallback} from "react";

const useSyncLang = () => {
    const {setLanguage} = useLanguage();
    const setLoading = useAppStore(state => state.setLoading);
    const toastErrorHandler = useToastErrorHandler();
    const {mutate} = useMutation({
        mutationFn: async (lang: _LanguageCode) => await authAPI.setLang(lang),
        onSuccess: async (_, variables) => {
            setLoading(false);
            await setLanguage(variables);
        },
        onError: (error) => {
            toastErrorHandler(error)
        },
    });

    return useCallback((lang: _LanguageCode) => {
        mutate(lang);
        setLoading(true);
    },[]);

}

export default useSyncLang;