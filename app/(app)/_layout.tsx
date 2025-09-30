import { Stack} from "expo-router";
import {useAppStore} from "@/services/app/stores/useAppStore";
import FullScreenLoading from "@/components/libs/FullScreenLoading";
import DefaultColor from "@/components/ui/defaultColor";
import useCheckStatusLogin from "@/services/auth/hooks/useCheckStatusLogin";
import {useNotifications} from "@/services/notifications/hooks/useNotifications";


export default function AppLayout(){
    const loading = useAppStore(state => state.loading);

    useCheckStatusLogin('app');
    useNotifications();

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
                <Stack.Screen name="(event)"/>
                <Stack.Screen name="(account)"/>
                <Stack.Screen
                    name="notifications"
                    options={{
                        animation: "slide_from_right",
                    }}
                />
            </Stack>
        </>
    )
}