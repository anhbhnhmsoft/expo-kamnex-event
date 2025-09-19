import {ReactNode, useRef, useState} from "react";
import {
    Animated,
    NativeSyntheticEvent,
    NativeScrollEvent,
    StyleProp,
    ViewStyle
} from 'react-native';
import {View} from "tamagui";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import FocusAwareStatusBar from "@/components/libs/FocusAwareStatusBar";
import {DefaultSize} from "@/components/ui/defaultStyle";

export default function LayoutScrollApp({children, style}: {
    children: ReactNode,
    style?: StyleProp<ViewStyle>
}) {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [showHeader, setShowHeader] = useState<boolean>(false);
    const insets = useSafeAreaInsets();
    const handleScroll = Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollY}}}],
        {
            useNativeDriver: false,
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                setShowHeader(offsetY > 40);
            },
        }
    );
    return (
        <View flex={1}>
            <FocusAwareStatusBar hidden={showHeader}/>
            <Animated.ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    padding: DefaultSize.sm,
                    paddingTop: insets.top > 0 ? insets.top : DefaultSize.md
                }}
                style={style}
            >
                {children}
            </Animated.ScrollView>
        </View>
    )
}
