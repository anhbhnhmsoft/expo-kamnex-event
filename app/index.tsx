import {useCallback, useEffect, useRef} from "react";
import {Animated, View, Image,  StyleSheet} from "react-native";
import useAuthStore from "@/services/auth/stores/useAuthStore";
import {_AuthStatus} from "@/services/auth/const";
import {router} from "expo-router";
import FocusAwareStatusBar from "@/components/libs/FocusAwareStatusBar";
import useLocation from "@/services/app/hooks/useLocation";
import authAPI from "@/services/auth/api";
import useToast from "@/services/app/hooks/useToast";
import {useTranslation} from "react-i18next";

export default function IndexScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const {t} = useTranslation();
    const {hydrate, logout, setUser} = useAuthStore();
    const requestLocationPermission = useLocation();
    // Xin cấp quyền các quyền cần thiết
    const grandPermission = useCallback(async () => {
        // Xin cấp quyền vị trí
        await requestLocationPermission();
    }, [])
    const {warning} = useToast();

    useEffect(() => {
        // animate the fade-in and scale-up effect
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 10,
                friction: 2,
                useNativeDriver: true,
            }),
        ]).start();
        const check = setTimeout(async () => {
            await grandPermission();
            await hydrate();
            const freshStatus = useAuthStore.getState().status
            if (freshStatus === _AuthStatus.AUTHORIZED) {
                // Lấy thông tin người dùng, đồng thời kiểm tra xem có authorize ko
                try {
                    const user = await authAPI.user();
                    await setUser(user.data);
                    router.replace('/(app)/(tab)');
                }catch {
                    // Nếu có lỗi thì logout
                    warning({
                        message: t('common_error.invalid_or_expired_token')
                    })
                    await logout();
                    router.replace('/(auth)');
                }
            } else {
                router.replace('/(auth)');
            }
        },2000);

        return () => {
            clearTimeout(check);
        };
    }, [fadeAnim, hydrate, scaleAnim, t]);

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar hidden/>
            <Animated.View
                style={[
                    {
                        alignItems: "center"
                    },
                    {
                        opacity: fadeAnim,
                        transform: [{scale: scaleAnim}],
                    },
                ]}
            >
                <Image
                    source={require('@/assets/images/logo/logo-kamnex.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        height: 200,
        width: 250
    }
})
