import {SafeAreaProvider} from 'react-native-safe-area-context';
import useCheckStatusLogin from "@/services/auth/hooks/useCheckStatusLogin";
import FocusAwareStatusBar from "@/components/libs/FocusAwareStatusBar";
import {Stack} from "expo-router";
import DefaultColor from "@/components/ui/defaultColor";


export default function AuthLayout() {

    useCheckStatusLogin('auth');

    return (
        <SafeAreaProvider>
            <FocusAwareStatusBar hidden/>
            <Stack
                initialRouteName="index"
                screenOptions={{
                    contentStyle: { backgroundColor: DefaultColor.primary_bg },
                    animation:"fade",
                    headerShown: false,
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
            </Stack>
        </SafeAreaProvider>
    )
}