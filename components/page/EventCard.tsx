import {EventListItem} from "@/services/event/types";
import {FC} from "react";
import {View, XStack, YStack} from "tamagui";
import {Image, TouchableOpacity} from "react-native";
import Typo from "@/components/libs/Typo";
import {DefaultSize} from "@/components/ui/defaultStyle";
import DefaultColor from "@/components/ui/defaultColor";
import {formatDate} from "@/utils/helper";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {router} from "expo-router";
import {getLabelEventStatus, getLabelEventUserHistory} from "@/services/event/const";
import {useTranslation} from "react-i18next";

type Props = {
    item: EventListItem
}
const EventCard: FC<Props> = ({item}) => {
    const language = useAppStore(s => s.language);
    const {t} = useTranslation();
    return (
        <TouchableOpacity onPress={() => {
            router.push({
                pathname: '/(app)/(event)/detail',
                params: {
                    id: item.id,
                }
            })
        }}>
            <XStack alignItems={"flex-start"} gap={"$3"} flexGrow={1} >
                <View position={"relative"} width={"40%"}>
                    <Image source={{uri: item.image_represent_path}}
                           style={{
                               height: 95,
                               width:"100%",
                               borderRadius: 10
                           }}
                           resizeMode={"cover"}
                    />
                    {item.status_history &&
                        <View position={"absolute"} bottom={6} left={0} right={0}>
                            <View alignSelf={"center"} paddingHorizontal={10} paddingVertical={6} borderRadius={20} backgroundColor={DefaultColor.primary_color}>
                                <Typo
                                    color={DefaultColor.white}>
                                    {t(getLabelEventUserHistory(item.status_history))}
                                </Typo>
                            </View>
                        </View>
                    }

                </View>
                <YStack gap={"$2"} alignSelf={"flex-start"} width={"55%"}>
                    <Typo numberOfLines={2} weight={"600"} fontSize={DefaultSize.md}>{item.name}</Typo>
                    <Typo weight={"500"} color={DefaultColor.slate["500"]}>
                        {t(getLabelEventStatus(item.status))}
                    </Typo>
                    <Typo weight={"700"} color={DefaultColor.slate["400"]}>
                        {formatDate(item.day_represent, language)}
                    </Typo>
                </YStack>
            </XStack>
        </TouchableOpacity>
    )
}

export default EventCard;