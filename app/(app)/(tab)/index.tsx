import {Button, Card, Image, Spinner, View, XStack, YStack} from "tamagui";
import Typo from "@/components/libs/Typo";
import DefaultColor from "@/components/ui/defaultColor";
import {FontAwesome, FontAwesome5} from '@expo/vector-icons';
import {FlatList, RefreshControl, TouchableOpacity} from "react-native";
import {DefaultSize} from "@/components/ui/defaultStyle";
import {useTranslation} from "react-i18next";
import {router} from "expo-router";
import LayoutView from "@/components/libs/LayoutView";
import useSearchEventStore from "@/services/event/stores/useSearchEventStore";
import {useAppStore} from "@/services/app/stores/useAppStore";
import HorizontalTabBar from "@/components/libs/HorizontalTabBar";
import {_ActionSearchEvent, _EventStatus} from "@/services/event/const";
import useInfiniteEventList from "@/services/event/hooks/useInfiniteEventList";
import {FC, useEffect, useMemo} from "react";
import Empty from "@/components/libs/Empty";
import {EventListItem} from "@/services/event/types";
import {formatDate} from "@/utils/helper";
import useToast from "@/services/app/hooks/useToast";

export default function HomeScreen() {
    const {t} = useTranslation();
    const {request, setFilter, setAction, label_search, action, setSortBy} = useSearchEventStore();
    const {setLoading, location} = useAppStore();
    const {warning} = useToast();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
        isLoading,
    } = useInfiniteEventList(request);

    const listEvent = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

    useEffect(() => {
        setLoading(isLoading || isRefetching);
    }, [isRefetching, isLoading]);

    useEffect(() => {
        if (action === _ActionSearchEvent.SEARCH) {
            refetch();
            setAction(_ActionSearchEvent.INIT);
        }
    }, [action]);

    return (
        <LayoutView>
            {/*Search*/}
            <YStack gap={DefaultSize["2xl"]}>
                <XStack
                    backgroundColor={DefaultColor.white}
                    borderRadius={50}
                    paddingHorizontal={DefaultSize.base}
                    paddingVertical={DefaultSize.xs}
                    gap={"$4"}
                >
                    <FontAwesome name="search" size={DefaultSize["3xl"]} color={DefaultColor.black}/>
                    <TouchableOpacity style={{flex: 1}} onPress={() => router.push('/(app)/(event)/search')}>
                        <YStack flex={1}>
                            <Typo color={DefaultColor.slate[400]}
                                  fontSize={DefaultSize.sm}>{t('tab.page.index.search_placeholder')}</Typo>
                            <Typo color={DefaultColor.black} weight={"500"} fontSize={DefaultSize.base}
                                  numberOfLines={1}>
                                {label_search.province || label_search.district || label_search.ward ?
                                    `${label_search.ward ? label_search.ward + ',' : ''}${label_search.district ? label_search.district + ',' : ''}${label_search.province}`
                                    : t('common.press_to_search')}
                            </Typo>
                        </YStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}}
                                      onPress={() => {
                                          if (location) {
                                              // nếu đã bật
                                              if (request?.filters?.lat && request?.filters?.lng) {
                                                  setFilter({lat: undefined, lng: undefined});
                                                  setSortBy('');
                                              } else {
                                                  setFilter({
                                                      lat: location.coords.latitude,
                                                      lng: location.coords.longitude
                                                  });
                                                  setSortBy('distance_asc');
                                              }
                                              setAction(_ActionSearchEvent.SEARCH);
                                          } else {
                                              warning({message: t('common_error.warning_location')});
                                          }
                                      }}
                    >
                        <FontAwesome5
                            name="location-arrow" size={DefaultSize["2xl"]}
                            color={(request?.filters?.lat && request?.filters?.lng)
                                ? DefaultColor.primary_color : DefaultColor.slate[400]
                            }/>
                    </TouchableOpacity>
                </XStack>
                <HorizontalTabBar<_EventStatus>
                    tabs={[
                        {
                            key: _EventStatus.FOR_USER,
                            item: (isActive) => (
                                <Card paddingHorizontal={12} paddingVertical={8} borderRadius={30}
                                      backgroundColor={isActive ? DefaultColor.primary_color : DefaultColor.white}
                                >
                                    <Typo
                                        color={isActive ? DefaultColor.white : DefaultColor.black}
                                        fontSize={DefaultSize.base}
                                        weight={isActive ? "700" : "500"}
                                    >
                                        Dành cho bạn
                                    </Typo>
                                </Card>
                            ),
                        },
                        {
                            key: _EventStatus.UPCOMING,
                            item: (isActive) => (
                                <Card paddingHorizontal={12} paddingVertical={8} borderRadius={30}
                                      backgroundColor={isActive ? DefaultColor.primary_color : DefaultColor.white}
                                >
                                    <Typo
                                        color={isActive ? DefaultColor.white : DefaultColor.black}
                                        fontSize={DefaultSize.base}
                                        weight={isActive ? "700" : "500"}
                                    >
                                        Sắp diễn ra
                                    </Typo>
                                </Card>
                            ),
                        },
                        {
                            key: _EventStatus.ACTIVE,
                            item: (isActive) => (
                                <Card paddingHorizontal={12} paddingVertical={8} borderRadius={30}
                                      backgroundColor={isActive ? DefaultColor.primary_color : DefaultColor.white}
                                >
                                    <Typo
                                        color={isActive ? DefaultColor.white : DefaultColor.black}
                                        fontSize={DefaultSize.base}
                                        weight={isActive ? "700" : "500"}
                                    >
                                        Đang diễn ra
                                    </Typo>
                                </Card>
                            ),
                        },
                        {
                            key: _EventStatus.CLOSED,
                            item: (isActive) => (
                                <Card paddingHorizontal={12} paddingVertical={8} borderRadius={30}
                                      backgroundColor={isActive ? DefaultColor.primary_color : DefaultColor.white}
                                >
                                    <Typo
                                        color={isActive ? DefaultColor.white : DefaultColor.black}
                                        fontSize={DefaultSize.base}
                                        weight={isActive ? "700" : "500"}
                                    >
                                        Đã diễn ra
                                    </Typo>
                                </Card>
                            ),
                        },
                    ]}
                    activeKey={request?.filters?.status || _EventStatus.FOR_USER}
                    onTabPress={(tab) => {
                        setFilter({status: tab !== _EventStatus.FOR_USER ? tab : undefined});
                        setAction(_ActionSearchEvent.SEARCH);
                    }}
                />
            </YStack>

            {/*Danh sách event*/}
            <YStack flex={1} marginTop={DefaultSize["3xl"]} gap={"$3"}>
                {(label_search.province || label_search.district || label_search.ward) &&
                    <Typo color={DefaultColor.primary_color} weight={"700"} fontSize={DefaultSize.xl} numberOfLines={1}>
                        Sự kiện
                        tại {label_search.ward ? label_search.ward + ',' : null}{label_search.district ? label_search.district + ',' : null}{label_search.province}
                    </Typo>
                }
                <FlatList
                    data={listEvent}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() => {
                        if (!isFetchingNextPage) return null;
                        return <Spinner marginVertical={16}/>;
                    }}
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()}/>
                    }
                    renderItem={({item, index}) => (
                        <EventItem item={item} key={index}/>
                    )}
                    ListEmptyComponent={() => <Empty/>}
                />
            </YStack>
        </LayoutView>
    )
}

const EventItem: FC<{ item: EventListItem }> = ({item}) => {
    const {t} = useTranslation();
    const language = useAppStore(s => s.language);
    return (
        <TouchableOpacity>
            <YStack marginBottom={24} gap={"$2"}>
                <View position={"relative"}>
                    <Image source={{uri: item.image_represent_path}}
                           height={230}
                           borderRadius={10}
                    />
                    <XStack position="absolute" top={10} right={10} left={10} justifyContent={"space-between"}
                            alignItems={"center"}
                    >
                        <Button
                            backgroundColor={DefaultColor.primary_color}
                            theme={"blue"}
                            borderRadius={30}
                            paddingHorizontal={12}
                        >
                            <Typo color={DefaultColor.white}>{t('common.register')}</Typo>
                        </Button>
                        <Typo color={DefaultColor.white} weight={"700"}
                              fontSize={DefaultSize.md}>{t('common.free_to_join')}</Typo>
                    </XStack>
                </View>
                <YStack gap={"$2"}>
                    <Typo weight={"700"} fontSize={DefaultSize.lg} numberOfLines={2}>{item.name}</Typo>
                    <XStack alignItems={"center"} justifyContent={"space-between"} gap={"$6"}>
                        <Typo weight={"700"} color={DefaultColor.slate["500"]}>
                            {formatDate(item.day_represent, language)}
                        </Typo>
                        <Typo weight={"700"} color={DefaultColor.slate["500"]} numberOfLines={1}>
                            {item.address}
                        </Typo>
                    </XStack>
                </YStack>
            </YStack>
        </TouchableOpacity>
    )
}
