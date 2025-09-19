import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { YStack, YStackProps } from 'tamagui';

interface FadeViewProps extends YStackProps {
    visible: boolean;
    duration?: number;
}

const FadeView: React.FC<FadeViewProps> = ({
                                               children,
                                               visible,
                                               duration = 300,
                                               ...props
                                           }) => {
    const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration,
            useNativeDriver: true,
        }).start();
    }, [visible, duration]);

    return (
        <Animated.View style={{ opacity }}>
            <YStack {...props}>{children}</YStack>
        </Animated.View>
    );
};

export default FadeView;
