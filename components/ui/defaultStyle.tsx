import {StyleSheet} from "react-native";
import DefaultColor from "@/components/ui/defaultColor";

export const DefaultSize = {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
}

export const DefaultStyle = StyleSheet.create({
    back_btn:{
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        backgroundColor: DefaultColor.white
    }
})