import {DefaultSize, DefaultStyle} from "@/components/ui/defaultStyle";
import {XStack} from "tamagui";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {TouchableOpacity} from "react-native";
import {router} from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DefaultColor from "@/components/ui/defaultColor";


const DefaultHeader = () => {
    const insets = useSafeAreaInsets();
    return (
        <XStack paddingTop={insets.top + 10} paddingHorizontal={DefaultSize.md} alignItems={"center"}
                justifyContent="space-between" paddingBottom={10} borderBottomWidth={1} borderBottomColor={DefaultColor.slate[200]}>
            <TouchableOpacity style={DefaultStyle.back_btn} onPress={() => router.back()}>
                <FontAwesome name="chevron-left" size={12} color={DefaultColor.primary_color}/>
            </TouchableOpacity>
        </XStack>

    )
}

export default DefaultHeader;