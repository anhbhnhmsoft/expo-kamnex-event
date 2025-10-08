import {router, useLocalSearchParams} from "expo-router";
import {useQueryGetEventArea} from "@/services/event/hooks/use-query-event";
import {useTranslation} from "react-i18next";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {useEffect} from "react";
import LayoutScrollApp from "@/components/libs/LayoutScrollApp";
import Empty from "@/components/libs/Empty";
import {Card, XStack} from "tamagui";
import {TouchableOpacity} from "react-native";
import DefaultColor from "@/components/ui/defaultColor";
import Typo from "@/components/libs/Typo";


export default function AreaScreen() {
    const {event_id} = useLocalSearchParams<{ event_id?: string }>();
    const {t} = useTranslation();

    const {area, loading} = useQueryGetEventArea(event_id);

    const setLoading = useAppStore(s => s.setLoading);

    useEffect(() => {
        setLoading(loading);
    }, [loading]);


    return (
        <LayoutScrollApp paddedTop={false}>
            {event_id && area && area.length > 0 ? (
                <XStack flexWrap={"wrap"} alignItems={"center"} gap={"$3"}>
                    {area.map((item) => (
                        <TouchableOpacity key={item.id} style={{width: "48%"}}
                            onPress={() => {
                                router.push({
                                    pathname: '/(app)/(event)/booking/seats',
                                    params: {
                                        event_id: event_id,
                                        area_id: item.id
                                    }
                                })
                            }}
                        >
                            <Card padded gap={"$2"}
                                  backgroundColor={item.vip ? DefaultColor.yellow['200'] : DefaultColor.white}>
                                <Typo weight={"700"}>{item.name}</Typo>
                                <XStack gap={"$2"}>
                                    <Typo>{t('common.seat_capacity')}:</Typo>
                                    <Typo
                                        color={item.seat_available_count === 0 ? DefaultColor.red[500] : DefaultColor.green[500]}>
                                        {item.seat_available_count} / {item.capacity}
                                    </Typo>
                                </XStack>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </XStack>
            ) : <Empty/>}
        </LayoutScrollApp>
    )
}