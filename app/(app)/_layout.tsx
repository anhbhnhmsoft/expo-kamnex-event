import {router, Stack} from "expo-router";
import useAuthStore from "@/services/auth/stores/useAuthStore";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {useEffect} from "react";
import {_AuthStatus} from "@/services/auth/const";
import FullScreenLoading from "@/components/libs/FullScreenLoading";
import DefaultColor from "@/components/ui/defaultColor";


export default function AppLayout(){
    const status = useAuthStore(state => state.status);
    const loading = useAppStore(state => state.loading);

    useEffect(() => {
        if (status === _AuthStatus.UNAUTHORIZED) {
            router.replace('/(auth)')
        }
    }, [status]);
    return (
        <>
            <FullScreenLoading loading={loading} />
            <Stack
                initialRouteName="(tab)"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: DefaultColor.primary_bg },
                }}
            >
                <Stack.Screen name="(tab)"/>
            </Stack>
        </>
    )
}