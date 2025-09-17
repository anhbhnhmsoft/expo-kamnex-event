import {useEffect, useRef} from "react";
import {Animated, View, Image,  StyleSheet} from "react-native";
import useAuthStore from "@/services/auth/stores/useAuthStore";
import {_AuthStatus} from "@/services/auth/const";
import {router} from "expo-router";
import FocusAwareStatusBar from "@/components/libs/FocusAwareStatusBar";

export default function IndexScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const {hydrate} = useAuthStore();

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
        const check = setTimeout( async () => {
            await hydrate()
            const freshStatus = useAuthStore.getState().status
            if (freshStatus === _AuthStatus.AUTHORIZED) {
                router.replace('/(app)');
            } else {
                router.replace('/(auth)');
            }
        },2000);

        return () => {
            clearTimeout(check);
        };
    }, [fadeAnim, hydrate, scaleAnim]);

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
