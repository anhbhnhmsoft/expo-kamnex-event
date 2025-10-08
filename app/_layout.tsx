import {Stack} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState} from 'react';
import useFontDefault from "@/components/ui/defaultFonts";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import initI18n from '@/utils/i18n';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import DefaultColor from "@/components/ui/defaultColor";
import {createTamagui, TamaguiProvider} from "tamagui";
import {defaultConfig} from "@tamagui/config/v4";
import ToastManager from 'toastify-react-native'
import DefaultHeader from "@/components/page/DefaultHeader";
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const config = createTamagui(defaultConfig);

export default function RootLayout() {
    const [loaded, error] = useFontDefault();
    const [readyI18n, setReadyI18n] = useState(false);

    // Init i18n
    useEffect(() => {
        initI18n().finally(() => setReadyI18n(true));
    }, []);

    useEffect(() => {
        if ((loaded || error) && readyI18n) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error, readyI18n]);

    if (!(loaded || error) || !readyI18n) {
        return null;
    }

    return (

        <GestureHandlerRootView style={{
            flex: 1,
        }}>
            <QueryClientProvider client={queryClient}>
                <TamaguiProvider config={config}>
                    <Stack
                        initialRouteName="index"
                        screenOptions={{
                            contentStyle: {backgroundColor: DefaultColor.primary_bg},
                        }}
                    >
                        <Stack.Screen name="index" options={{headerShown: false}}/>
                        <Stack.Screen name="(app)" options={{headerShown: false}}/>
                        <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                        <Stack.Screen
                            name="qr-scanner"
                            options={{
                                header: () => <DefaultHeader/>,
                                animation: "slide_from_right",
                            }}
                        />
                    </Stack>
                    <ToastManager/>
                </TamaguiProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
