import {useCallback} from "react";
import {useTranslation} from "react-i18next";
import {Alert as AlertRN} from "react-native";
import {router} from "expo-router";
import {useCameraPermissions} from "expo-camera";

type ToRouter = 'QR-scanner' | 'take-picture';

const useRequestPermissionCamera = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const {t} = useTranslation();
    return useCallback(async (toRoute?: ToRouter) => {
        // Nếu chưa có quyền, yêu cầu
        if (!permission?.granted) {
            const res = await requestPermission();
            if (!res.granted) {
                AlertRN.alert(
                    t('permission.camera.title'),
                    t('permission.camera.message')
                );
                return false;
            }
        }
        switch (toRoute) {
            case 'QR-scanner':
                router.push("/qr-scanner")
                return true;
            case "take-picture":
                router.push('/(app)/(account)/take-picture')
                return true;
            default:
                return true;
        }
    }, [permission?.granted, t]);
}

export default useRequestPermissionCamera;