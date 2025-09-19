import {View} from "tamagui";
import {FC, ReactNode} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const LayoutView:FC<{children: ReactNode}> = ({children}) => {
    const insets = useSafeAreaInsets();
    return (
        <View flex={1} paddingTop={insets.top + 20} paddingHorizontal={20} paddingBottom={insets.bottom}>
            {children}
        </View>
    )
}
export default LayoutView;