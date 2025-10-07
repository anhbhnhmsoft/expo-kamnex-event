import {View} from "tamagui";
import {FC, ReactNode} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {DefaultSize} from "@/components/ui/defaultStyle";

const LayoutView:FC<{children: ReactNode, padded?: boolean, paddedTop?:boolean}> = ({children, padded = true, paddedTop = true}) => {
    const insets = useSafeAreaInsets();
    return (
        <View flex={1} paddingTop={paddedTop ? insets.top + 20 : 0} paddingHorizontal={padded ? DefaultSize.md : 0} paddingBottom={insets.bottom + 20}>
            {children}
        </View>
    )
}
export default LayoutView;