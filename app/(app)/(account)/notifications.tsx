import {useTranslation} from "react-i18next";
import {useGetUnreadCount, useInfiniteNotificationList} from "@/services/notifications/hooks/use-query-notification";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {useEffect, useMemo} from "react";
import {Button, Card, Spinner, View, XStack, YStack} from "tamagui";
import {FlatList, RefreshControl, TouchableOpacity} from "react-native";
import DefaultColor from "@/components/ui/defaultColor";
import Typo from "@/components/libs/Typo";
import {DefaultSize} from "@/components/ui/defaultStyle";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Empty from "@/components/libs/Empty";
import {_UserNotificationStatus} from "@/services/notifications/const";
import {formatDate} from "@/utils/helper";
import LayoutView from "@/components/libs/LayoutView";
import {
    useMutateMarkAllReadNotification,
    useMutateMarkAsReadNotification
} from "@/services/notifications/hooks/use-mutation-notification";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";


export default function NotificationsScreen() {
    const {t} = useTranslation();
    const language = useAppStore(s => s.language);

    const mutateMarkAsRead = useMutateMarkAsReadNotification();

    const mutateMarkAllRead = useMutateMarkAllReadNotification();

    const handleError = useToastErrorHandler();

    const {get} = useGetUnreadCount();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
        isLoading,
    } = useInfiniteNotificationList({filters: {}, page: 1, limit: 10});

    const {setLoading} = useAppStore();

    const listNotification = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

    useEffect(() => {
        setLoading(isLoading || isRefetching);
    }, [isRefetching, isLoading]);


    return (
        <LayoutView paddedTop={false}>
            <XStack marginBottom={16} alignItems={"center"} justifyContent={"flex-start"}>
                <Button size={"$3"} theme={"blue"} backgroundColor={DefaultColor.primary_color} color={DefaultColor.white} onPress={() => {
                    setLoading(true);
                    mutateMarkAllRead.mutate(undefined, {
                        onSuccess: () => {
                            get();
                            refetch();
                            setLoading(false);
                        },
                        onError: (error) => {
                            handleError(error);
                            setLoading(false);
                        }
                    });
                }}>
                    {t('account.page.notifications.mask_all_read')}
                </Button>
            </XStack>
            <FlatList
                data={listNotification}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                contentContainerStyle={{
                    flex: 1,
                    gap: 12
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => {
                    if (!isFetchingNextPage) return null;
                    return <Spinner marginVertical={16}/>;
                }}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()}/>
                }
                renderItem={({item}) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => {
                            if (item.status !== _UserNotificationStatus.READ) {
                                setLoading(true);
                                mutateMarkAsRead.mutate({id: item.id}, {
                                    onSuccess: () => {
                                        get();
                                        refetch();
                                        setLoading(false);
                                    },
                                    onError: (error) => {
                                        handleError(error);
                                        setLoading(false);
                                    }
                                });
                            }
                        }}
                        disabled={item.status === _UserNotificationStatus.READ}
                    >
                        <Card padded backgroundColor={item.status === _UserNotificationStatus.READ ? DefaultColor.gray[300] : DefaultColor.white}>
                            <XStack alignItems={'flex-start'} gap={'$3'}>
                                <View width={DefaultSize['3xl']} height={DefaultSize['3xl']} alignItems={'center'} justifyContent={'center'}>
                                    <FontAwesome name="bell" size={DefaultSize['2xl']} color={DefaultColor.red['600']} />
                                </View>
                                <YStack flex={1} gap={"$2"}>
                                    <Typo weight={'700'} numberOfLines={1}>{item.title}</Typo>
                                    <Typo weight={'500'} numberOfLines={2} lineHeight={DefaultSize.lg}>{item.description}</Typo>
                                    <Typo color={DefaultColor.slate[500]} numberOfLines={1}>
                                        {formatDate(item.created_at, language)}
                                    </Typo>
                                </YStack>
                            </XStack>
                        </Card>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => <Empty/>}
            />
        </LayoutView>
    )

}