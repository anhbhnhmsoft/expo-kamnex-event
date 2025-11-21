import {DefaultSize, DefaultStyle} from "@/components/ui/defaultStyle";
import {XStack} from "tamagui";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {TouchableOpacity} from "react-native";
import {router} from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DefaultColor from "@/components/ui/defaultColor";
import {FC} from "react";
import Typo from "@/components/libs/Typo";
import {useTranslation} from "react-i18next";
import {useNavigationState} from "@react-navigation/core";


const DefaultHeader: FC<{ title?: string, onBack?: () => void, centerTitle?: boolean }> = ({title, onBack, centerTitle = false}) => {
	const {t} = useTranslation();
	const insets = useSafeAreaInsets();
	const state = useNavigationState((s) => s);
	return (
		<XStack paddingTop={insets.top + 10} paddingHorizontal={DefaultSize.md}
					alignItems={"center"}
					justifyContent="space-between" paddingBottom={10} borderBottomWidth={1}
					borderBottomColor={DefaultColor.slate[200]}>
			<TouchableOpacity
					style={DefaultStyle.back_btn}
					onPress={() => {
						if (onBack) {
							onBack();
						}else {
							if (state.routeNames.length > 0) {
								router.back();
							} else {
								router.replace("/")
							}
						}
					}}
			>
				<FontAwesome name="chevron-left" size={12} color={DefaultColor.primary_color}/>
			</TouchableOpacity>
			{title && (
				centerTitle ? (
					<XStack flex={1} justifyContent="center">
						<Typo weight={"700"} fontSize={DefaultSize['lg']} numberOfLines={1} color={DefaultColor.primary_color}>
							{t(title)}
						</Typo>
					</XStack>
				) : (
					<Typo weight={"700"} fontSize={DefaultSize['lg']} numberOfLines={1} color={DefaultColor.primary_color}>
						{t(title)}
					</Typo>
				)
			)}
			{centerTitle ? (
				<TouchableOpacity style={[DefaultStyle.back_btn, {opacity: 0}]} disabled/>
			) : null}
		</XStack>

	)
}

export default DefaultHeader;