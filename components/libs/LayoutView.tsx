import {View} from "tamagui";
import {FC, ReactNode} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {DefaultSize} from "@/components/ui/defaultStyle";

const LayoutView: FC<{
    children: ReactNode,
    padded?: boolean,
    paddedTop?: boolean,
    paddedBottom?: boolean
}> = ({children, padded = true, paddedTop = true, paddedBottom = true}) => {
    const insets = useSafeAreaInsets();
    return (
        <View position={"relative"} flex={1} paddingTop={paddedTop ? insets.top + 20 : 0}
              paddingHorizontal={padded ? DefaultSize.md : 0} paddingBottom={paddedBottom ? insets.bottom + 20 : 0}>
            {children}
        </View>
    )
}
export default LayoutView;