import {router, useLocalSearchParams} from "expo-router";
import {Dispatch, FC, SetStateAction, useEffect, useMemo, useState} from "react";
import {Button, Image, View, XStack, YStack, ScrollView, TextArea, Card, Sheet, useWindowDimensions} from "tamagui";
import {DefaultSize, DefaultStyle} from "@/components/ui/defaultStyle";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DefaultColor from "@/components/ui/defaultColor";
import {Keyboard, TouchableOpacity, TouchableWithoutFeedback, Platform} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";
import Typo from "@/components/libs/Typo";
import {useGetDataEventDetail} from "@/services/event/hooks/use-query-event";
import LoadingList from "@/components/libs/LoadingList";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {formatDate} from "@/utils/helper";
import {EventDetail} from "@/services/event/types";
import useAuthStore from "@/services/auth/stores/useAuthStore";
import {getLabelEventUserRole} from "@/services/event/const";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import RenderHtml from 'react-native-render-html';
import MapView, {Marker} from 'react-native-maps';
import useInfiniteEventList from "@/services/event/hooks/useInfiniteEventList";
import Empty from "@/components/libs/Empty";
import EventCard from "@/components/page/EventCard";

export default function DetailScreen() {
    const [idEvent, setIdEvent] = useState<string | null>(null);
    const [openDesc, setOpenDesc] = useState<boolean>(false)
    const {id} = useLocalSearchParams<{ id?: string }>();
    const {t} = useTranslation();
    const event = useGetDataEventDetail(idEvent);
    const language = useAppStore(s => s.language);
    const user = useAuthStore(s => s.user);

    const {data} = useInfiniteEventList({
        filters: {
            exclude_id: id
        },
        limit: 5
    });

    const listEvent = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

    useEffect(() => {
        if (!id) {
            router.back();
        } else {
            setIdEvent(id);
        }
    }, [id]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView
                style={{flex: 1}}
                contentContainerStyle={{flexGrow: 1}}
                enableOnAndroid={true}
                scrollEnabled={true}
            >
                {event ?
                    <>
                        {/*Image*/}
                        <Image
                            source={{uri: event.image_represent_path}}
                            width={"100%"}
                            height={260}
                            objectFit={"cover"}
                        />

                        <YStack marginBottom={DefaultSize.md} padding={DefaultSize.md} gap={"$4"}>
                            {/*Địa điểm */}
                            <Typo weight={"700"} fontSize={DefaultSize.xl}>{event.name}</Typo>
                            <XStack alignItems={"center"} justifyContent={"space-between"}>
                                <Typo weight={"500"} color={DefaultColor.slate["500"]}>
                                    {event.start_time} - {event.end_time}
                                </Typo>
                                <Typo weight={"500"} color={DefaultColor.slate["500"]}>
                                    {formatDate(event.day_represent, language)}
                                </Typo>
                            </XStack>
                            <XStack flex={1} alignItems={"center"} justifyContent={"space-between"} gap={"$6"}>
                                <Typo weight={"500"} color={DefaultColor.slate["500"]} numberOfLines={2}>
                                    {event.address}
                                </Typo>
                            </XStack>
                            {/*Người tổ chức*/}
                            <CarouselUserParticipants data={event.user_event}/>
                            {/*Agenda sự kiện*/}
                            <Typo weight={"700"} marginTop={20}
                                  fontSize={DefaultSize.xl}>{t('event.page.detail.agenda_event')}</Typo>
                            <XStack flexWrap={"wrap"}>
                                {event.schedules.map((schedule, index) => (
                                    <View width={"50%"} backgroundColor={"transparent"} paddingVertical={10}
                                          paddingHorizontal={5} key={schedule.id}>
                                        <Button theme={"white"} justifyContent={"flex-start"}
                                                backgroundColor={DefaultColor.white} borderRadius={50}>
                                            <Typo weight={"500"}
                                                  fontSize={DefaultSize.sm}>{index + 1}. {schedule.name}</Typo>
                                        </Button>
                                    </View>
                                ))}
                            </XStack>
                            {/*Đặt câu hỏi và nhận xét*/}
                            <Typo weight={"700"} marginTop={10}
                                  fontSize={DefaultSize.xl}>
                                {t('event.page.detail.question_label')}
                            </Typo>
                            <TextArea
                                placeholder={t('event.page.detail.question_placeholder')}
                                placeholderTextColor={DefaultColor.slate["400"]}
                                borderWidth={0}
                                rows={5}
                                size={"$4"}
                                backgroundColor={DefaultColor.white}
                            />
                            <View alignItems={"center"} justifyContent={"center"}>
                                <Button size={"$3"} paddingHorizontal={DefaultSize['5xl']} paddingVertical={0}
                                        borderRadius={DefaultSize["4xl"]}
                                        color={DefaultColor.white} theme={"blue"}
                                        backgroundColor={DefaultColor.primary_color}>
                                    <Typo color={DefaultColor.white} fontSize={DefaultSize.base}>
                                        {t('common.send')}
                                    </Typo>
                                </Button>
                            </View>
                            {/*Tổng quan sự kiện*/}
                            <Card padded marginTop={10} backgroundColor={DefaultColor.white}>
                                <Typo weight={"700"} marginBottom={10} fontSize={DefaultSize.xl}>
                                    {t('event.page.detail.event_overview')}
                                </Typo>
                                <Typo lineHeight={22} marginBottom={10} textAlign={"justify"}>
                                    {event.short_description}
                                </Typo>
                                <TouchableOpacity onPress={() => setOpenDesc(true)}>
                                    <Typo weight={"700"} fontSize={DefaultSize.md} color={DefaultColor.primary_color}>
                                        {t('common.see_more')}
                                    </Typo>
                                </TouchableOpacity>
                            </Card>
                        </YStack>

                        {/*Map*/}
                        <MapView
                            style={{width: "100%", height: 365}}
                            region={{
                                latitude: parseFloat(event.latitude),
                                longitude: parseFloat(event.longitude),
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: parseFloat(event.latitude),
                                    longitude: parseFloat(event.longitude),
                                }}
                            />

                        </MapView>
                        {/*Sự kiện liên quan*/}
                        <YStack marginBottom={DefaultSize.md} padding={DefaultSize.md} gap={"$4"}>
                            <Typo weight={"700"} fontSize={DefaultSize.xl}>{t('event.page.detail.event_more')}</Typo>
                            {listEvent.length > 0 ?
                                listEvent.map((item, index) => (
                                    <EventCard item={item} key={item.id}/>
                                )) :
                                <Empty/>
                            }
                        </YStack>
                        {/*Sheet Tổng quan sự kiện*/}
                        <DescriptionEvent open={openDesc} setOpen={setOpenDesc} event={event}/>
                    </>
                    :
                    <YStack gap={"$2"}>
                        <LoadingList/>
                        <LoadingList/>
                    </YStack>
                }
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    )
}

export const HeaderDetailScreen = () => {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    return (
        <XStack paddingTop={insets.top + 10} paddingHorizontal={DefaultSize.md} alignItems={"center"}
                justifyContent="space-between" paddingBottom={10}>
            <TouchableOpacity style={DefaultStyle.back_btn} onPress={() => router.back()}>
                <FontAwesome name="chevron-left" size={12} color={DefaultColor.primary_color}/>
            </TouchableOpacity>
            <XStack alignItems={"center"} gap={"$2"}>
                <Typo color={DefaultColor.primary_color} weight={"700"}>{t('common.free_to_join')}</Typo>
                <Button size={"$3"} paddingHorizontal={DefaultSize.md} borderRadius={DefaultSize["4xl"]}
                        color={DefaultColor.white} theme={"blue"} backgroundColor={DefaultColor.primary_color}>
                    {t('common.register')}
                </Button>
            </XStack>
        </XStack>
    )
}

const CarouselUserParticipants: FC<{ data: EventDetail['user_event'] }> = ({data}) => {
    const {t} = useTranslation();
    return (
        <>
            {data && data.length > 0 ?
                <ScrollView
                    horizontal
                    flex={1}
                    nestedScrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {data.map((item) => (
                        <XStack key={item.id} alignItems={"center"} gap={"$2"}>
                            {item.avatar_url ?
                                <Image source={{uri: item.avatar_url}}
                                       width={50}
                                       height={50}
                                       borderRadius={50}
                                       objectFit="cover"/>
                                : <View justifyContent={"center"}
                                        alignItems={"center"}
                                        width={50}
                                        height={50}
                                        borderRadius={50}
                                        backgroundColor={DefaultColor.primary_color}>
                                    <Typo color={DefaultColor.white} fontSize={DefaultSize.xl}
                                          textTransform={"uppercase"}
                                          weight={"700"}>
                                        {item.name?.charAt(0)}
                                    </Typo>
                                </View>
                            }
                            <YStack gap={"$2"}>
                                <Typo weight={"700"}>{item.name}</Typo>
                                <Typo color={DefaultColor.slate['500']}>{t(getLabelEventUserRole(item.role))}</Typo>
                            </YStack>
                        </XStack>
                    ))}
                </ScrollView> : null}
        </>
    )
}

const DescriptionEvent: FC<{ event: EventDetail, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }> = ({
                                                                                                                     event,
                                                                                                                     setOpen,
                                                                                                                     open
                                                                                                                 }) => {
    const {t} = useTranslation();
    const {width} = useWindowDimensions();
    return (
        <Sheet
            forceRemoveScrollEnabled={true}
            modal={true}
            open={open}
            disableDrag={true}
            onOpenChange={setOpen}
            snapPoints={[90]}
            dismissOnSnapToBottom
            zIndex={100_000}
            animation="medium"
        >
            <Sheet.Overlay
                animation="lazy"
                backgroundColor="$shadow6"
                enterStyle={{opacity: 0}}
                exitStyle={{opacity: 0}}
            />
            <Sheet.Handle/>
            <Sheet.Frame padding="$4" gap="$2">
                <ScrollView
                    flex={1}
                    showsHorizontalScrollIndicator={false}
                >
                    <Typo weight={"700"} marginBottom={10} fontSize={DefaultSize.xl}>
                        {t('event.page.detail.event_overview')}
                    </Typo>
                    <Typo lineHeight={22} marginBottom={10} textAlign={"justify"}>
                        {event.short_description}
                    </Typo>
                    <RenderHtml
                        source={{html: event.description}}
                        contentWidth={width}
                    />
                </ScrollView>
            </Sheet.Frame>
        </Sheet>
    )
}