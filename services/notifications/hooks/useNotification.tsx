import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import {Platform} from "react-native";
import DefaultColor from "@/components/ui/defaultColor";
import {useEffect, useRef} from "react";
import notificationAPI from "@/services/notifications/api";
import useNotiStore from "@/services/notifications/stores/useNotiStore";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldShowAlert:true,
    }),
});

// Đăng ký cấp quyền thông báo 
const registerForPushNotificationsAsync = async () => {
    // chỉ dùng dc cho thiết bị điện thoại
    try {
        if (Device.isDevice) {
            // Yêu cầu Quyền
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            if (existingStatus !== 'granted') {
                return null;
            }
            // Lấy Expo Push Token
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            if (!projectId) {
                return null;
            }
            const token = (await Notifications.getExpoPushTokenAsync({ projectId: projectId })).data;

            // Cấu hình Channel cho Android
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: DefaultColor.primary_color,
                });
            }
            return token;
        }
    }catch (error) {
        console.log(error);
    }
    return null;
}

const useNotification = () => {
    const notificationListener = useRef<Notifications.EventSubscription>(null);
    const responseListener = useRef<Notifications.EventSubscription>(null);
    const pushNotification = useNotiStore(s => s.pushNotification);
    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
            // send token
            if (token){
                notificationAPI.sendPushToken({
                    expo_push_token: token,
                    device_id: Device.osInternalBuildId ,
                    device_type: Platform.OS
                });
            }
        });
        // Lắng nghe khi thông báo nhận dc (chỉ khi chạy trong app)
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            pushNotification(notification);
        });
        // Lắng Nghe Phản hồi Thông báo
        // Hoạt động ở cả trong app, trong nền hoặc tắt app
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            // lắng nghe response thông báo
            console.log(response);
        });
        return () => {
            if (notificationListener.current){
                notificationListener.current.remove();
            }
            if (responseListener.current){
                responseListener.current.remove();
            }
        };
    }, []);
}

export default useNotification;