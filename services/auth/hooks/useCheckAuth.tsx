import useAuthStore from "@/services/auth/stores/useAuthStore";
import {_AuthStatus} from "@/services/auth/const";
import {useCallback} from "react";
import {Href, router} from "expo-router";

/**
 * Hook để kiểm tra xem user có đang được xác thực hay không, nếu không thì push về màn hình auth
 */
export const useCheckAuthToRedirect = () => {
    const status = useAuthStore((state) => state.status);
    // Kiểu dữ liệu nhận vào: Href (URL) HOẶC một hàm callback
    return useCallback(
        (redirectTo: Href | (() => void)) => {
            if (status !== _AuthStatus.AUTHORIZED) {
                router.push('/(auth)');
            } else {
                if (typeof redirectTo === 'function') {
                    redirectTo();
                } else {
                    router.push(redirectTo);
                }
            }
        },
        [status]
    );
};