import {router, useLocalSearchParams} from "expo-router";
import {Dispatch, FC, SetStateAction, useEffect, useMemo, useState} from "react";
import {Button, Card, Image, ScrollView, Sheet, TextArea, useWindowDimensions, View, XStack, YStack} from "tamagui";
import {DefaultSize, DefaultStyle} from "@/components/ui/defaultStyle";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DefaultColor from "@/components/ui/defaultColor";
import {Keyboard, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";
import Typo from "@/components/libs/Typo";
import {useGetDataEventDetail} from "@/services/event/hooks/use-query-event";
import LoadingList from "@/components/libs/LoadingList";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {formatDate} from "@/utils/helper";
import {EventDetail} from "@/services/event/types";
import useAuthStore from "@/services/auth/stores/useAuthStore";
import {_EventStatus, _EventUserHistory, getLabelEventStatus, getLabelEventUserRole} from "@/services/event/const";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import RenderHtml from 'react-native-render-html';
import MapView, {Marker} from 'react-native-maps';
import useInfiniteEventList from "@/services/event/hooks/useInfiniteEventList";
import Empty from "@/components/libs/Empty";
import EventCard from "@/components/page/EventCard";
import {useMutateRegisterEventHistory} from "@/services/event/hooks/use-mutate-event";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import useEventDetailStore from "@/services/event/stores/useEventDetailStore";
import useToast from "@/services/app/hooks/useToast";

export default function DetailScreen() {
    const [idEvent, setIdEvent] = useState<string | null>(null);
    const [openDesc, setOpenDesc] = useState<boolean>(false);
    const {id} = useLocalSearchParams<{ id?: string }>();
    const setEventUserHistory = useEventDetailStore(s => s.setEventUserHistory)
    const {t} = useTranslation();
    const {event, loading} = useGetDataEventDetail(idEvent);
    const language = useAppStore(s => s.language);
    const setLoading = useAppStore(s => s.setLoading);
    const {mutate, isPending} = useMutateRegisterEventHistory();
    const handleError = useToastErrorHandler();

    const {data} = useInfiniteEventList({
        filters: {
            exclude_id: id
        },
        limit: 5
    });

    const listEvent = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

    useEffect(() => {
        setLoading(loading || isPending);
    }, [loading, isPending]);

    useEffect(() => {
        if (id) {
            setIdEvent(id);
            mutate({event_id: id, status: _EventUserHistory.SEENED}, {
                onSuccess: (res) => {
                    setEventUserHistory(res.data);
                },
                onError: (error) => {
                    handleError(error);
                }
            })
        } else {
            router.back();
        }
        return () => {
            setEventUserHistory(null)
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
                            <YStack gap={"$2"}>
                                <Typo weight={"700"} fontSize={DefaultSize.xl}>{event.name}</Typo>
                                <View alignSelf={"flex-start"} paddingHorizontal={10} paddingVertical={2}
                                      borderRadius={10} backgroundColor={
                                    event.status === _EventStatus.UPCOMING ? DefaultColor.yellow["500"] : DefaultColor.primary_color["500"]
                                }>
                                    <Typo
                                        color={event.status === _EventStatus.UPCOMING ? DefaultColor.black : DefaultColor.white}>
                                        {t(getLabelEventStatus(event.status))}
                                    </Typo>
                                </View>
                            </YStack>
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

                            {/*Event history status*/}
                            <EventHistoryCard/>

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
    const {id} = useLocalSearchParams<{ id?: string }>();
    const {error} = useToast();
    const handleError = useToastErrorHandler();
    const setLoading = useAppStore(s => s.setLoading);

    const {event_user_history, setEventUserHistory} = useEventDetailStore();
    const user = useAuthStore(s => s.user);
    const {mutate} = useMutateRegisterEventHistory();
    return (
        <XStack paddingTop={insets.top + 10} paddingHorizontal={DefaultSize.md} alignItems={"center"}
                justifyContent="space-between" paddingBottom={10}>
            <TouchableOpacity style={DefaultStyle.back_btn} onPress={() => router.back()}>
                <FontAwesome name="chevron-left" size={12} color={DefaultColor.primary_color}/>
            </TouchableOpacity>
            <XStack alignItems={"center"} gap={"$2"}>
                <Typo color={DefaultColor.primary_color} weight={"700"}>{t('common.free_to_join')}</Typo>
                {event_user_history &&
                    <Button size={"$3"} paddingHorizontal={DefaultSize.md} borderRadius={DefaultSize["4xl"]}
                            color={DefaultColor.white} theme={"blue"} backgroundColor={DefaultColor.primary_color}
                            disabled={![_EventUserHistory.SEENED, _EventUserHistory.CANCELLED].includes(event_user_history.status)}
                            onPress={() => {
                                if (event_user_history && user && id) {
                                    // nếu ko có membership
                                    if (!user.membership) {
                                        setLoading(true);
                                        mutate({event_id: id, status: _EventUserHistory.BOOKED}, {
                                            onSuccess: (res) => {
                                                setEventUserHistory(res.data);
                                                setLoading(false);
                                            },
                                            onError: (err) => {
                                                handleError(err);
                                                setLoading(false);
                                            }
                                        })
                                    } else {
                                        // làm sau
                                    }
                                } else {
                                    error({message: t('common_error.program_error')})
                                }
                            }}
                    >
                        {event_user_history.status === _EventUserHistory.SEENED && t('common.register')}
                        {event_user_history.status === _EventUserHistory.BOOKED && t('common.had_register')}
                        {event_user_history.status === _EventUserHistory.PARTICIPATED && t('common.had_join')}
                        {event_user_history.status === _EventUserHistory.CANCELLED && t('common.had_cancel')}
                    </Button>
                }

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

const EventHistoryCard = () => {
    const event_user_history = useEventDetailStore(s => s.event_user_history);
    const {t} = useTranslation();
    if (event_user_history) {
        switch (event_user_history.status) {
            case _EventUserHistory.BOOKED:
            case _EventUserHistory.PARTICIPATED:
                return (
                    <Card padded marginTop={10} gap={"$4"} backgroundColor={DefaultColor.primary_color}>
                        <Typo color={DefaultColor.white} weight={"700"}
                              fontSize={DefaultSize.xl}>{t('event.page.detail.thank_for_book_title')}</Typo>
                        <Typo color={DefaultColor.white}>{t('event.page.detail.thank_for_book_desc')}</Typo>
                        {event_user_history.seat &&
                            <Card padded marginTop={10} gap={"$4"} backgroundColor={DefaultColor.white}>
                                <XStack gap={"$2"}>
                                    <Typo color={DefaultColor.black}>
                                        {t('common.ticket_code')}:
                                    </Typo>
                                    <Typo color={DefaultColor.black} weight={"700"}>
                                        {event_user_history.ticket_code}
                                    </Typo>
                                </XStack>
                                <XStack gap={"$2"}>
                                    <Typo color={DefaultColor.black}>
                                        {t('common.area_name')}:
                                    </Typo>
                                    <Typo color={DefaultColor.black} weight={"700"}>
                                        {event_user_history.seat.area_name}
                                    </Typo>
                                </XStack>
                                <XStack gap={"$2"}>
                                    <Typo color={DefaultColor.black}>
                                        {t('common.seat_code')}:
                                    </Typo>
                                    <Typo color={DefaultColor.black} weight={"700"}>
                                        {event_user_history.seat.seat_code}
                                    </Typo>
                                </XStack>
                            </Card>
                        }
                    </Card>
                )
            default:
                break;
        }
    }
    return null;
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
