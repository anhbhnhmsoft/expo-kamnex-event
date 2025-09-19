import {ReactNode, useRef, useState} from "react";
import {
    Animated,
    NativeSyntheticEvent,
    NativeScrollEvent,
    StyleProp,
    ViewStyle
} from 'react-native';
import FocusAwareStatusBar from "@/components/libs/FocusAwareStatusBar";
import LayoutView from "@/components/libs/LayoutView";

export default function LayoutScrollApp({children, style}: {
    children: ReactNode,
    style?: StyleProp<ViewStyle>
}) {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [showHeader, setShowHeader] = useState<boolean>(false);
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
        <>
            <FocusAwareStatusBar hidden={showHeader}/>
            <Animated.ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={style}
            >
                <LayoutView>
                    {children}
                </LayoutView>
            </Animated.ScrollView>
        </>

    )
}
