import {Href, router, useLocalSearchParams} from "expo-router";
import {Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState,} from "react";
import {
    Button,
    Card,
    Form,
    Image,
    Label,
    ScrollView,
    Separator,
    Sheet,
    Spinner,
    TextArea,
    useWindowDimensions,
    View,
    XStack,
    YStack,
} from "tamagui";
import {DefaultSize, DefaultStyle} from "@/components/ui/defaultStyle";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DefaultColor from "@/components/ui/defaultColor";
import {Keyboard, RefreshControl, TouchableOpacity, TouchableWithoutFeedback,} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";
import Typo from "@/components/libs/Typo";
import {
    useGetDataEventDetail,
    useInfiniteCommentList,
    useInfiniteEventList,
    useQueryGetEventPoll,
} from "@/services/event/hooks/use-query-event";
import useAuthStore from "@/services/auth/stores/useAuthStore";
import {_ConfigMembership} from "@/services/membership/const";
import LoadingList from "@/components/libs/LoadingList";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {checkIOS, checkMembershipConfig, formatDate, formatDateFormNow,} from "@/utils/helper";
import {CommentRequest, EventDetail} from "@/services/event/types";
import {
    _EventCommentType,
    _EventStatus,
    _EventUserHistory,
    getLabelEventStatus,
    getLabelEventUserRole,
} from "@/services/event/const";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import RenderHtml from "react-native-render-html";
import MapView, {Marker} from "react-native-maps";
import Empty from "@/components/libs/Empty";
import EventCard from "@/components/page/EventCard";
import {useMutateCommentEvent, useMutateRegisterEventHistory,} from "@/services/event/hooks/use-mutate-event";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import useEventDetailStore from "@/services/event/stores/useEventDetailStore";
import useToast from "@/services/app/hooks/useToast";
import {useFormComment} from "@/services/event/hooks/use-form";
import {Controller} from "react-hook-form";
import dayjs from "dayjs";
import {useCheckAuthToRedirect} from "@/services/auth/hooks/useCheckAuth";
import {_AuthStatus} from "@/services/auth/const";

export default function DetailScreen() {
    const [idEvent, setIdEvent] = useState<string | null>(null);
    const [openDesc, setOpenDesc] = useState<boolean>(false);
    const status = useAuthStore(state => state.status);
    const checkAuth = useCheckAuthToRedirect();
    const {id} = useLocalSearchParams<{ id?: string }>();
    const setEventUserHistory = useEventDetailStore((s) => s.setEventUserHistory);
    const {t} = useTranslation();
    const {
        event,
        loading,
        refetch: refetchEvent,
    } = useGetDataEventDetail(idEvent);
    const language = useAppStore((s) => s.language);
    const setLoading = useAppStore((s) => s.setLoading);
    const loadApp = useAppStore((s) => s.loading);
    const {mutate, isPending} = useMutateRegisterEventHistory();
    const handleError = useToastErrorHandler();
    const inset = useSafeAreaInsets();
    const {data} = useInfiniteEventList({
        filters: {
            exclude_id: id,
        },
        limit: 5,
    });

    const infiniteComment = useInfiniteCommentList({
        filters: {
            event_id: idEvent ?? "",
            type: _EventCommentType.PUBLIC,
        },
        limit: 6,
    });

    const {
        data: eventPoll,
        loading: loadingPoll,
        refetch: refetchPoll,
    } = useQueryGetEventPoll(idEvent);

    const listEvent = useMemo(
        () => data?.pages.flatMap((page) => page.data) || [],
        [data]
    );

    useEffect(() => {
        setLoading(loading || isPending || loadingPoll);
    }, [loading, isPending, loadingPoll]);

    useEffect(() => {
        if (id) {
            setIdEvent(id);

            if (status !== _AuthStatus.AUTHORIZED) return;
            mutate(
                {event_id: id, status: _EventUserHistory.SEENED},
                {
                    onSuccess: (res) => {
                        setEventUserHistory(res.data);
                    },
                    onError: (error) => {
                        handleError(error);
                    },
                }
            );
        } else {
            setLoading(false);
            router.back();
        }
        return () => {
            setEventUserHistory(null);
        };
    }, [id, status]);
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <KeyboardAwareScrollView
                style={{flex: 1}}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: inset.bottom + 40,
                }}
                enableOnAndroid={true}
                scrollEnabled={true}
                refreshControl={
                    <RefreshControl
                        refreshing={loadApp}
                        onRefresh={() => {
                            refetchEvent();
                            refetchPoll();
                            infiniteComment.refetch();
                        }}
                    />
                }
            >
                {event ? (
                    <>
                        {/*Image*/}
                        <Image
                            source={{uri: event.image_represent_path}}
                            width={"100%"}
                            height={260}
                            objectFit={"cover"}
                        />

                        <YStack
                            marginBottom={DefaultSize.md}
                            padding={DefaultSize.md}
                            gap={"$4"}
                        >
                            {/*Địa điểm */}
                            <YStack gap={"$2"}>
                                <Typo weight={"700"} fontSize={DefaultSize.xl}>
                                    {event.name}
                                </Typo>
                                <View
                                    alignSelf={"flex-start"}
                                    paddingHorizontal={10}
                                    paddingVertical={2}
                                    borderRadius={10}
                                    backgroundColor={
                                        event.status === _EventStatus.UPCOMING
                                            ? DefaultColor.yellow["500"]
                                            : DefaultColor.primary_color
                                    }
                                >
                                    <Typo
                                        color={
                                            event.status === _EventStatus.UPCOMING
                                                ? DefaultColor.black
                                                : DefaultColor.white
                                        }
                                    >
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
                            <XStack
                                flex={1}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                gap={"$6"}
                            >
                                <Typo
                                    weight={"500"}
                                    color={DefaultColor.slate["500"]}
                                    numberOfLines={2}
                                >
                                    {event.address}
                                </Typo>
                            </XStack>
                            {/*Người tổ chức*/}
                            <CarouselUserParticipants data={event.user_event}/>

                            {/*Event history status*/}
                            <EventHistoryCard/>

                            {/*Lịch trình sự kiện*/}
                            <Typo weight={"700"} marginTop={20} fontSize={DefaultSize.xl}>
                                {t("event.page.detail.agenda_event")}
                            </Typo>
                            <XStack flexWrap={"wrap"}>
                                {event.schedules.map((schedule, index) => (
                                    <View
                                        width={"50%"}
                                        backgroundColor={"transparent"}
                                        paddingVertical={10}
                                        paddingHorizontal={5}
                                        key={schedule.id}
                                    >
                                        <Button
                                            theme={"white"}
                                            justifyContent={"flex-start"}
                                            onPress={() => {
                                                checkAuth({
                                                    pathname: "/(app)/(event)/detail-schedule",
                                                    params: {
                                                        id: schedule.id,
                                                    },
                                                });
                                            }}
                                            backgroundColor={DefaultColor.white}
                                            borderRadius={50}
                                        >
                                            <Typo weight={"500"} fontSize={DefaultSize.sm}>
                                                {index + 1}. {schedule.name}
                                            </Typo>
                                        </Button>
                                    </View>
                                ))}
                            </XStack>

                            {/*Bình chọn sự kiện*/}
                            {eventPoll &&
                                Array.isArray(eventPoll) &&
                                eventPoll.length > 0 && (
                                    <>
                                        <Typo
                                            weight={"700"}
                                            marginTop={20}
                                            fontSize={DefaultSize.xl}
                                        >
                                            {t("event.page.detail.poll_event")}
                                        </Typo>
                                        {eventPoll.map((poll) => {
                                            const now = dayjs();
                                            const start_time = dayjs(poll.start_time);
                                            const end_time = dayjs(poll.end_time);
                                            const disabled =
                                                end_time.isBefore(now) || start_time.isAfter(now);

                                            return (
                                                <TouchableOpacity
                                                    key={`poll_${poll.id}`}
                                                    disabled={disabled}
                                                    onPress={() => {
                                                        checkAuth({
                                                            pathname: "/(app)/(event)/event-poll",
                                                            params: {
                                                                id: poll.id,
                                                            },
                                                        });
                                                    }}
                                                >
                                                    <View
                                                        padding={10}
                                                        backgroundColor={
                                                            disabled
                                                                ? DefaultColor.slate["200"]
                                                                : DefaultColor.white
                                                        }
                                                        borderRadius={5}
                                                    >
                                                        <View
                                                            flexDirection={"row"}
                                                            alignItems={"center"}
                                                            justifyContent={"space-between"}
                                                            gap={"$2"}
                                                            marginBottom={10}
                                                        >
                                                            <Typo
                                                                weight={"700"}
                                                                fontSize={DefaultSize.base}
                                                                numberOfLines={1}
                                                            >
                                                                {poll.title}
                                                            </Typo>
                                                            {/*Badge over time nếu đã disabled*/}
                                                            {disabled && (
                                                                <View
                                                                    paddingHorizontal={4}
                                                                    paddingVertical={2}
                                                                    borderRadius={4}
                                                                    backgroundColor={DefaultColor.primary_color}
                                                                >
                                                                    <Typo
                                                                        weight={"700"}
                                                                        fontSize={DefaultSize.xs}
                                                                        color={DefaultColor.white}
                                                                    >
                                                                        {start_time.isAfter(now)
                                                                            ? t("event.page.detail.not_started_poll")
                                                                            : t("event.page.detail.over_time_poll")}
                                                                    </Typo>
                                                                </View>
                                                            )}
                                                        </View>
                                                        <View gap={"$2"}>
                                                            <Typo
                                                                weight={"500"}
                                                                color={DefaultColor.slate["500"]}
                                                                fontSize={DefaultSize.base}
                                                                numberOfLines={1}
                                                            >
                                                                {t("event.page.detail.number_question_poll")} :{" "}
                                                                {poll.duration_unit}
                                                            </Typo>
                                                            <Typo
                                                                weight={"500"}
                                                                color={DefaultColor.slate["500"]}
                                                                fontSize={DefaultSize.base}
                                                                numberOfLines={1}
                                                            >
                                                                {t("event.page.detail.start_time_poll")} :{" "}
                                                                {start_time.format("DD/MM/YYYY HH:mm")}
                                                            </Typo>
                                                            <Typo
                                                                weight={"500"}
                                                                color={DefaultColor.slate["500"]}
                                                                fontSize={DefaultSize.base}
                                                                numberOfLines={1}
                                                            >
                                                                {t("event.page.detail.end_time_poll")} :{" "}
                                                                {end_time.format("DD/MM/YYYY HH:mm")}
                                                            </Typo>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </>
                                )}

                            {/*Đặt câu hỏi và nhận xét*/}
                            <YStack marginTop={10} gap={"$4"} position={"relative"}>
                                <CommentSection
                                    event_id={event.id}
                                    infiniteComment={infiniteComment}
                                    checkAuth={checkAuth}
                                />
                            </YStack>
                            {/*Tổng quan sự kiện*/}
                            <Card padded marginTop={10} backgroundColor={DefaultColor.white}>
                                <Typo
                                    weight={"700"}
                                    marginBottom={10}
                                    fontSize={DefaultSize.xl}
                                >
                                    {t("event.page.detail.event_overview")}
                                </Typo>
                                <Typo lineHeight={22} marginBottom={10} textAlign={"justify"}>
                                    {event.short_description}
                                </Typo>
                                <TouchableOpacity onPress={() => setOpenDesc(true)}>
                                    <Typo
                                        weight={"700"}
                                        fontSize={DefaultSize.md}
                                        color={DefaultColor.primary_color}
                                    >
                                        {t("common.see_more")}
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
                        <YStack
                            marginBottom={DefaultSize.md}
                            padding={DefaultSize.md}
                            gap={"$4"}
                        >
                            <Typo weight={"700"} fontSize={DefaultSize.xl}>
                                {t("event.page.detail.event_more")}
                            </Typo>
                            {listEvent.length > 0 ? (
                                listEvent.map((item, index) => (
                                    <EventCard item={item} key={item.id}/>
                                ))
                            ) : (
                                <Empty/>
                            )}
                        </YStack>
                        {/*Sheet Tổng quan sự kiện*/}
                        <DescriptionEvent
                            open={openDesc}
                            setOpen={setOpenDesc}
                            event={event}
                        />
                    </>
                ) : (
                    <YStack gap={"$2"}>
                        <LoadingList/>
                        <LoadingList/>
                    </YStack>
                )}
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );
}

export const HeaderDetailScreen = ({id} :{id?:string}) => {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const {error} = useToast();
    const event = useEventDetailStore((s) => s.event);
    const {event_user_history} = useEventDetailStore();
    const user = useAuthStore((s) => s.user);
    return (
        <XStack
            paddingTop={insets.top + 10}
            paddingHorizontal={DefaultSize.md}
            alignItems={"center"}
            justifyContent="space-between"
            paddingBottom={10}
        >
            <TouchableOpacity
                style={DefaultStyle.back_btn}
                onPress={() => router.back()}
            >
                <FontAwesome
                    name="chevron-left"
                    size={12}
                    color={DefaultColor.primary_color}
                />
            </TouchableOpacity>
            <XStack alignItems={"center"} gap={"$2"}>
                <Typo color={DefaultColor.primary_color} weight={"700"}>
                    {event?.free_to_join ? t("common.free_to_join") : ""}
                </Typo>
                {event_user_history &&
                    event &&
                    event.status === _EventStatus.UPCOMING && (
                        <Button
                            size={"$3"}
                            paddingHorizontal={DefaultSize.md}
                            borderRadius={DefaultSize["4xl"]}
                            color={DefaultColor.white}
                            theme={"blue"}
                            backgroundColor={DefaultColor.primary_color}
                            disabled={
                                ![
                                    _EventUserHistory.SEENED,
                                    _EventUserHistory.CANCELLED,
                                ].includes(event_user_history.status)
                            }
                            onPress={() => {
                                if (event_user_history && user && id) {
                                    router.push({
                                        pathname: "/(app)/(event)/booking/area",
                                        params: {
                                            event_id: id,
                                        },
                                    });
                                } else {
                                    error({message: t("common_error.program_error")});
                                }
                            }}
                        >
                            {event_user_history.status === _EventUserHistory.SEENED &&
                                t("common.register")}
                            {event_user_history.status === _EventUserHistory.BOOKED &&
                                t("common.had_register")}
                            {event_user_history.status === _EventUserHistory.PARTICIPATED &&
                                t("common.had_join")}
                            {event_user_history.status === _EventUserHistory.CANCELLED &&
                                t("common.had_cancel")}
                        </Button>
                    )}
            </XStack>
        </XStack>
    );
};

const CarouselUserParticipants: FC<{ data: EventDetail["user_event"] }> = ({
                                                                               data,
                                                                           }) => {
    const {t} = useTranslation();
    return (
        <>
            {data && data.length > 0 ? (
                <ScrollView
                    horizontal
                    flex={1}
                    contentContainerStyle={{
                        gap: 12,
                    }}
                    nestedScrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {data.map((item) => (
                        <XStack key={item.id} alignItems={"center"} gap={"$2"}>
                            {item.avatar_url ? (
                                <Image
                                    source={{uri: item.avatar_url}}
                                    width={50}
                                    height={50}
                                    borderRadius={50}
                                    objectFit="cover"
                                />
                            ) : (
                                <View
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    width={50}
                                    height={50}
                                    borderRadius={50}
                                    backgroundColor={DefaultColor.primary_color}
                                >
                                    <Typo
                                        color={DefaultColor.white}
                                        fontSize={DefaultSize.xl}
                                        textTransform={"uppercase"}
                                        weight={"700"}
                                    >
                                        {item.name?.charAt(0)}
                                    </Typo>
                                </View>
                            )}
                            <YStack gap={"$2"}>
                                <Typo weight={"700"}>{item.name}</Typo>
                                <Typo color={DefaultColor.slate["500"]}>
                                    {t(getLabelEventUserRole(item.role))}
                                </Typo>
                            </YStack>
                        </XStack>
                    ))}
                </ScrollView>
            ) : null}
        </>
    );
};

const EventHistoryCard = () => {
    const event_user_history = useEventDetailStore((s) => s.event_user_history);
    const {t} = useTranslation();
    if (event_user_history) {
        switch (event_user_history.status) {
            case _EventUserHistory.BOOKED:
            case _EventUserHistory.PARTICIPATED:
                return (
                    <Card
                        padded
                        marginTop={10}
                        gap={"$4"}
                        backgroundColor={DefaultColor.primary_color}
                    >
                        <Typo
                            color={DefaultColor.white}
                            weight={"700"}
                            fontSize={DefaultSize.xl}
                        >
                            {t("event.page.detail.thank_for_book_title")}
                        </Typo>
                        <Typo color={DefaultColor.white}>
                            {t("event.page.detail.thank_for_book_desc")}
                        </Typo>
                        {event_user_history.seat && (
                            <Card
                                padded
                                marginTop={10}
                                gap={"$4"}
                                backgroundColor={DefaultColor.white}
                            >
                                <XStack gap={"$2"} flexWrap="wrap">
                                    <Typo color={DefaultColor.black}>
                                        {t("common.ticket_code")}:
                                    </Typo>
                                    <Typo color={DefaultColor.black} weight={"700"}>
                                        {event_user_history.ticket_code}
                                    </Typo>
                                </XStack>
                                <XStack gap={"$2"} flexWrap="wrap">
                                    <Typo color={DefaultColor.black}>
                                        {t("common.area_name")}:
                                    </Typo>
                                    <Typo color={DefaultColor.black} weight={"700"}>
                                        {event_user_history.seat.area_name}
                                    </Typo>
                                </XStack>
                                <XStack gap={"$2"} flexWrap="wrap">
                                    <Typo color={DefaultColor.black}>
                                        {t("common.seat_code")}:
                                    </Typo>
                                    <Typo color={DefaultColor.black} weight={"700"}>
                                        {event_user_history.seat.seat_code}
                                    </Typo>
                                </XStack>
                            </Card>
                        )}
                    </Card>
                );
            default:
                break;
        }
    }
    return null;
};

const CommentSection: FC<{
    event_id: string;
    infiniteComment: ReturnType<typeof useInfiniteCommentList>;
    checkAuth: (redirectTo: Href | (() => void)) => void
}> = ({event_id, infiniteComment, checkAuth}) => {
    const {t} = useTranslation();
    const {
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
        setValue,
    } = useFormComment();
    const [showModal, setShowModal] = useState(false);
    const user = useAuthStore((s) => s.user);
    const isIos = checkIOS();
    useEffect(() => {
        setValue("event_id", event_id);
    }, [event_id]);

    const {data, refetch} = infiniteComment;
    const language = useAppStore((s) => s.language);

    const listComment = useMemo(
        () => data?.pages.flatMap((page) => page.data) || [],
        [data]
    );

    const {mutate, isPending} = useMutateCommentEvent();
    const handleError = useToastErrorHandler();

    const submit = useCallback(
        (data: CommentRequest) => {
            checkAuth(() => {
                mutate(data, {
                    onSuccess: () => {
                        setValue("content", "");
                        refetch();
                    },
                    onError: (error) => {
                        handleError(error);
                    },
                });
            });
        },
        [checkAuth]
    );


    return (
        <>
            <XStack
                alignItems="center"
                justifyContent="space-between"
                marginBottom={DefaultSize.md}
                gap={"$2"}
                flexWrap={"wrap"}
            >
                <Typo weight={"700"} fontSize={DefaultSize.xl}>
                    {t("event.page.detail.question_label")}
                </Typo>
                <Button
                    size={"$3"}
                    minWidth={100}
                    paddingHorizontal={DefaultSize["3xl"]}
                    paddingVertical={0}
                    borderRadius={DefaultSize["4xl"]}
                    color={DefaultColor.white}
                    theme={"blue"}
                    backgroundColor={DefaultColor.primary_color}
                    onPress={() =>
                        checkAuth(() => {
                            if (!checkMembershipConfig(user, _ConfigMembership.ALLOW_COMMENT)) {
                                setShowModal(true);
                            } else {
                                router.push({
                                    pathname: "/(app)/(event)/list-comment",
                                    params: {
                                        event_id: event_id,
                                        type: _EventCommentType.PRIVATE.toString(),
                                    },
                                });
                            }
                        })
                    }

                    alignSelf="flex-end"
                >
                    <Typo
                        color={DefaultColor.white}
                        fontSize={DefaultSize.base}
                        numberOfLines={1}
                    >
                        {t("event.page.detail.private_comment")}
                    </Typo>
                </Button>
            </XStack>
            <YStack gap={"$4"}>
                {listComment && listComment.length > 0 ? (
                    <>
                        {listComment.map((comment, index) => {
                            if (index < 5) {
                                return (
                                    <Card padded backgroundColor={DefaultColor.white} key={index}>
                                        <XStack alignItems={"center"} gap={"$2"}>
                                            {comment.user_comment.avatar_url ? (
                                                <Image
                                                    source={{uri: comment.user_comment.avatar_url}}
                                                    width={30}
                                                    height={30}
                                                    borderRadius={30}
                                                    objectFit="cover"
                                                />
                                            ) : (
                                                <View
                                                    justifyContent={"center"}
                                                    alignItems={"center"}
                                                    width={30}
                                                    height={30}
                                                    borderRadius={30}
                                                    backgroundColor={DefaultColor.primary_color}
                                                >
                                                    <Typo
                                                        color={DefaultColor.white}
                                                        fontSize={DefaultSize.xl}
                                                        textTransform={"uppercase"}
                                                        weight={"700"}
                                                    >
                                                        {comment.user_comment.name?.charAt(0)}
                                                    </Typo>
                                                </View>
                                            )}
                                            <YStack gap={"$2"}>
                                                <Typo weight={"700"} color={DefaultColor.primary_color}>
                                                    {comment.user_comment.name}
                                                </Typo>
                                                <Typo
                                                    weight={"500"}
                                                    fontSize={DefaultSize.sm}
                                                    color={DefaultColor.slate[500]}
                                                >
                                                    {formatDateFormNow(comment.created_at, language)}
                                                </Typo>
                                            </YStack>
                                        </XStack>
                                        <Separator marginVertical={10}/>
                                        <Typo weight={"500"}>{comment.content}</Typo>
                                    </Card>
                                );
                            }
                        })}
                        {listComment.length > 5 && (
                            <XStack alignItems={"center"} justifyContent={"center"}>
                                <TouchableOpacity
                                    onPress={() => checkAuth(() => {
                                        router.push({
                                            pathname: "/(app)/(event)/list-comment",
                                            params: {
                                                event_id: event_id,
                                            },
                                        });
                                    })}
                                >
                                    <Typo weight={"700"} color={DefaultColor.primary_color}>
                                        {t("common.see_more")}
                                    </Typo>
                                </TouchableOpacity>
                            </XStack>
                        )}
                    </>
                ) : (
                    <Empty/>
                )}
            </YStack>
            <Form gap={"$4"} onSubmit={handleSubmit(submit)}>
                <Controller
                    control={control}
                    name="content"
                    render={({field: {onChange, onBlur, value}}) => (
                        <YStack gap={"$2"}>
                            <TextArea
                                placeholder={t("event.page.detail.question_placeholder")}
                                placeholderTextColor={DefaultColor.slate["400"]}
                                borderWidth={0}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                rows={5}
                                size={"$4"}
                                backgroundColor={DefaultColor.white}
                            />
                            {!!errors.content && (
                                <Label color="red" size="$2">
                                    {errors.content.message}
                                </Label>
                            )}
                        </YStack>
                    )}
                />

                <View alignItems={"center"} justifyContent={"center"}>
                    <Form.Trigger asChild disabled={isSubmitting || isPending}>
                        <Button
                            size={"$3"}
                            paddingHorizontal={DefaultSize["5xl"]}
                            paddingVertical={0}
                            borderRadius={DefaultSize["4xl"]}
                            color={DefaultColor.white}
                            theme={"blue"}
                            icon={isSubmitting || isPending ? () => <Spinner/> : undefined}
                            backgroundColor={DefaultColor.primary_color}
                        >
                            <Typo color={DefaultColor.white} fontSize={DefaultSize.base}>
                                {t("common.send")}
                            </Typo>
                        </Button>
                    </Form.Trigger>
                </View>
            </Form>

            <Sheet
                modal
                open={showModal}
                onOpenChange={setShowModal}
                snapPoints={[60]}
                dismissOnSnapToBottom
            >
                <Sheet.Overlay
                    backgroundColor="rgba(0,0,0,0.5)"
                    onPress={() => setShowModal(false)}
                />
                <Sheet.Handle/>
                <Sheet.Frame padding="$4" gap="$4">
                    {isIos ? (
                        <YStack gap="$4" alignItems="center">
                            <View
                                width={50}
                                height={50}
                                borderRadius={25}
                                backgroundColor={DefaultColor.primary_color}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <FontAwesome name="lock" size={24} color={DefaultColor.white}/>
                            </View>

                            <Typo weight="700" fontSize={DefaultSize.xl} textAlign="center">
                                {t("event.page.detail.membership_feature_title")}
                            </Typo>
                            <Typo weight="600" fontSize={DefaultSize.xl} textAlign="center">
                                {t("event.page.detail.register_membership_to_comment_desc")}
                            </Typo>
                            <Button
                                size="$3"
                                paddingHorizontal={DefaultSize["5xl"]}
                                paddingVertical={0}
                                borderRadius={DefaultSize["4xl"]}
                                color={DefaultColor.slate[600]}
                                theme="blue"
                                backgroundColor={DefaultColor.slate[200]}
                                onPress={() => setShowModal(false)}
                            >
                                <Typo
                                    color={DefaultColor.slate[600]}
                                    fontSize={DefaultSize.base}
                                >
                                    {t("common.verify")}
                                </Typo>
                            </Button>
                        </YStack>
                    ) : (
                        <YStack gap="$4" alignItems="center">
                            <View
                                width={50}
                                height={50}
                                borderRadius={25}
                                backgroundColor={DefaultColor.primary_color}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <FontAwesome name="lock" size={24} color={DefaultColor.white}/>
                            </View>

                            <Typo weight="700" fontSize={DefaultSize.xl} textAlign="center">
                                {t("event.page.detail.register_membership_to_comment")}
                            </Typo>

                            <Button
                                size="$3"
                                paddingHorizontal={DefaultSize["5xl"]}
                                paddingVertical={0}
                                borderRadius={DefaultSize["4xl"]}
                                color={DefaultColor.white}
                                theme="blue"
                                backgroundColor={DefaultColor.primary_color}
                                onPress={() => {
                                    setShowModal(false);
                                    router.push("/(app)/(account)/membership/register-list");
                                }}
                            >
                                <Typo color={DefaultColor.white} fontSize={DefaultSize.base}>
                                    {t("common.register_now")}
                                </Typo>
                            </Button>
                            <Button
                                size="$3"
                                paddingHorizontal={DefaultSize["5xl"]}
                                paddingVertical={0}
                                borderRadius={DefaultSize["4xl"]}
                                color={DefaultColor.slate[600]}
                                theme="blue"
                                backgroundColor={DefaultColor.slate[200]}
                                onPress={() => setShowModal(false)}
                            >
                                <Typo
                                    color={DefaultColor.slate[600]}
                                    fontSize={DefaultSize.base}
                                >
                                    {t("common.cancel")}
                                </Typo>
                            </Button>
                        </YStack>
                    )}
                </Sheet.Frame>
            </Sheet>
        </>
    );
};

const DescriptionEvent: FC<{
    event: EventDetail;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({event, setOpen, open}) => {
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
                <ScrollView flex={1} showsHorizontalScrollIndicator={false}>
                    <Typo weight={"700"} marginBottom={10} fontSize={DefaultSize.xl}>
                        {t("event.page.detail.event_overview")}
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
    );
};
