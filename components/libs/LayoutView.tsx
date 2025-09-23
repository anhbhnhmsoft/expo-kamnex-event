import {View} from "tamagui";
import {FC, ReactNode} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {DefaultSize} from "@/components/ui/defaultStyle";

const LayoutView:FC<{children: ReactNode, padded?: boolean}> = ({children, padded = true}) => {
    const insets = useSafeAreaInsets();
    return (
        <View flex={1} paddingTop={insets.top + 20} paddingHorizontal={padded ? DefaultSize.md : 0} paddingBottom={insets.bottom}>
            {children}
        </View>
    )
}
export default LayoutView;