import {EventListItem} from "@/services/event/types";
import {FC} from "react";
import {XStack, YStack} from "tamagui";
import {Image, TouchableOpacity} from "react-native";
import Typo from "@/components/libs/Typo";
import {DefaultSize} from "@/components/ui/defaultStyle";
import DefaultColor from "@/components/ui/defaultColor";
import {formatDate} from "@/utils/helper";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {router} from "expo-router";

type Props = {
    item: EventListItem
}
const EventCard: FC<Props> = ({item}) => {
    const language = useAppStore(s => s.language);

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
                <Image source={{uri: item.image_represent_path}}
                       style={{
                           height: 67,
                           width:"30%",
                           borderRadius: 10
                       }}
                       resizeMode={"cover"}
                />
                <YStack gap={"$2"} alignSelf={"flex-start"} width={"70%"}>
                    <Typo numberOfLines={2} weight={"600"} fontSize={DefaultSize.md}>{item.name}</Typo>
                    <Typo weight={"700"} color={DefaultColor.slate["500"]}>
                        {formatDate(item.day_represent, language)}
                    </Typo>
                </YStack>
            </XStack>
        </TouchableOpacity>
    )
}

export default EventCard;