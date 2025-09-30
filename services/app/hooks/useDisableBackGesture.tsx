import {useFocusEffect, useNavigation} from "expo-router";
import {useCallback} from "react";
import { BackHandler } from "react-native";
/**
 * Ngăn hành vi vuốt về
 * @param enabled
 */
export default function useDisableBackGesture() {
    const navigation = useNavigation();
    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({ gestureEnabled: false });
            const onBackPress = () => true;
            // chặn back trên androids
            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );
            return () => {
                navigation.setOptions({ gestureEnabled: true });
                subscription.remove();
            };
        }, [navigation])
    );
}
