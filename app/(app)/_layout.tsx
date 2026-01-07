import { Stack} from "expo-router";
import {useAppStore} from "@/services/app/stores/useAppStore";
import FullScreenLoading from "@/components/libs/FullScreenLoading";
import DefaultColor from "@/components/ui/defaultColor";
import useNotification from "@/services/notifications/hooks/useNotification";
import useAuthStore from "@/services/auth/stores/useAuthStore";
import {_AuthStatus} from "@/services/auth/const";

export default function AppLayout(){
    const loading = useAppStore(state => state.loading);
    const status = useAuthStore(state => state.status);

    // sử dụng thông báo
    useNotification();

    return (
        <>
            <FullScreenLoading loading={loading} />
            <Stack
                initialRouteName="(tab)"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: DefaultColor.primary_bg },
                    animation: "fade_from_bottom",
                }}
            >
                <Stack.Screen name="(tab)"/>
                <Stack.Protected guard={status === _AuthStatus.AUTHORIZED}>
                    <Stack.Screen name="(event)"/>
                    <Stack.Screen name="(account)"/>
                </Stack.Protected>
            </Stack>
        </>
    )
}