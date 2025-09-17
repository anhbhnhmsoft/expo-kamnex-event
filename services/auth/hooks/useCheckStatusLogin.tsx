import useAuthStore from "@/services/auth/stores/useAuthStore";
import {_AuthStatus} from "@/services/auth/const";
import {useEffect} from "react";
import {router} from "expo-router";


const useCheckStatusLogin = (forTab: 'app' | 'auth') => {
    const status = useAuthStore(s => s.status);
    useEffect(() => {
        if (forTab === 'app') {
            if (status === _AuthStatus.UNAUTHORIZED) {
                router.replace('/(auth)')
            }
        }
        if (forTab === 'auth') {
            if (status === _AuthStatus.AUTHORIZED) {
                router.replace('/(app)');
            }
        }
    }, [status, forTab]);
}

export default useCheckStatusLogin;