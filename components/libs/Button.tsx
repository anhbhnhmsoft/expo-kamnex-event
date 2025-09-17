import { FC, ReactNode } from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import DefaultColor from "@/components/ui/defaultColor";
import {DefaultSize} from "@/components/ui/defaultStyle";

interface ButtonProps {
    children: ReactNode;
    onPress?: () => void;
    primary?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

const Button: FC<ButtonProps> = ({
                                     children,
                                     onPress,
                                     primary = true,
                                     disabled = false,
                                     style,
                                 }) => {

    return (
        <TouchableOpacity
            style={[
                styles.button,
                primary ? styles.primary : styles.outline,
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <View style={styles.content}>
                {children}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: DefaultSize.base,
        paddingHorizontal: DefaultSize.xl,
        borderRadius: DefaultSize["4xl"],
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: DefaultColor.primary_color,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: DefaultColor.primary_color,
    },
    disabled: {
        opacity: 0.5,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default Button;
