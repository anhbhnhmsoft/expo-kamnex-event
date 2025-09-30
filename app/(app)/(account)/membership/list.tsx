import {useInfiniteMembershipAccount} from "@/services/membership/hooks/use-query-membership";
import {useEffect, useMemo} from "react";
import LayoutView from "@/components/libs/LayoutView";
import {Button, Card, Spinner, View, XStack} from "tamagui";
import {useTranslation} from "react-i18next";
import DefaultColor from "@/components/ui/defaultColor";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {router} from "expo-router";
import {FlatList, RefreshControl} from "react-native";
import Typo from "@/components/libs/Typo";
import {DefaultSize} from "@/components/ui/defaultStyle";
import {
    _ConfigMembership,
    _MembershipUserStatus,
    getLabelConfigMembership,
    getLabelMembershipUserStatus
} from "@/services/membership/const";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Empty from "@/components/libs/Empty";
import dayjs from "dayjs";


export default function ListScreen() {
    const {t} = useTranslation();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
        isLoading,
    } = useInfiniteMembershipAccount({filters: {}, page: 1, limit: 10});
    const {setLoading} = useAppStore();

    const listMembership = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);
    useEffect(() => {
        setLoading(isLoading || isRefetching);
    }, [isRefetching, isLoading]);

    return (
        <LayoutView paddedTop={false}>
            <XStack marginTop={10} marginBottom={16} alignItems={"center"}>
                <Button
                    onPress={() => router.push("/(app)/(account)/membership/register-list")}
                    size={"$3"} fontWeight={700} theme={"blue"} backgroundColor={DefaultColor.primary_color}
                    color={DefaultColor.white}
                >
                    {t('account.page.membership.list.register')}
                </Button>
            </XStack>
            <FlatList
                data={listMembership}
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
                renderItem={({item, index}) => (
                    <Card padded gap={"$4"} backgroundColor={
                        [_MembershipUserStatus.INACTIVE,_MembershipUserStatus.EXPIRED].includes(item.status) ? DefaultColor.slate[100] : DefaultColor.white
                    } key={index}>
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <XStack alignItems={"center"} gap={"$1"}>
                                <Typo fontSize={DefaultSize.base} weight={"700"}
                                      color={DefaultColor.black}>{t('common.membership')}</Typo>
                                <Typo fontSize={DefaultSize.base} numberOfLines={1} weight={"700"}
                                      color={DefaultColor.green["500"]}>{item.membership.name}</Typo>
                            </XStack>
                            <Typo weight={"700"} color={DefaultColor.primary_color}>
                                {t(getLabelMembershipUserStatus(item.status))}
                            </Typo>
                        </XStack>

                        <Typo weight={"700"} fontSize={DefaultSize.sm} color={DefaultColor.slate["500"]}>
                            {t('common.duration')}: {dayjs(item.start_date).format("DD-MM-YYYY")} {t('common.to')} {dayjs(item.end_date).format("DD-MM-YYYY")}
                        </Typo>
                        <Card padded backgroundColor={"transparent"} gap={"$2"} borderWidth={1}
                              borderColor={DefaultColor.slate["200"]}>
                            {item.membership.config[_ConfigMembership.ALLOW_COMMENT] === true && (
                                <XStack gap={"$2"} alignItems={"center"}>
                                    <View width={20} height={20} borderRadius={40} justifyContent={"center"}
                                          alignItems={"center"} backgroundColor={DefaultColor.green[500]}>
                                        <FontAwesome name="check" size={DefaultSize.xs} color={DefaultColor.white}/>
                                    </View>
                                    <Typo
                                        numberOfLines={2}>{t(getLabelConfigMembership(_ConfigMembership.ALLOW_COMMENT))}</Typo>
                                </XStack>
                            )}
                            {item.membership.config[_ConfigMembership.ALLOW_DOCUMENTARY] === true && (
                                <XStack gap={"$2"} alignItems={"center"}>
                                    <View width={20} height={20} borderRadius={40} justifyContent={"center"}
                                          alignItems={"center"} backgroundColor={DefaultColor.green[500]}>
                                        <FontAwesome name="check" size={DefaultSize.xs} color={DefaultColor.white}/>
                                    </View>
                                    <Typo
                                        numberOfLines={2}>{t(getLabelConfigMembership(_ConfigMembership.ALLOW_DOCUMENTARY))}</Typo>
                                </XStack>
                            )}
                            {item.membership.config[_ConfigMembership.ALLOW_CHOOSE_SEAT] === true && (
                                <XStack gap={"$2"} alignItems={"center"}>
                                    <View width={20} height={20} borderRadius={40} justifyContent={"center"}
                                          alignItems={"center"} backgroundColor={DefaultColor.green[500]}>
                                        <FontAwesome name="check" size={DefaultSize.xs} color={DefaultColor.white}/>
                                    </View>
                                    <Typo
                                        numberOfLines={2}>{t(getLabelConfigMembership(_ConfigMembership.ALLOW_CHOOSE_SEAT))}</Typo>
                                </XStack>
                            )}
                        </Card>

                    </Card>
                )}
                ListEmptyComponent={() => <Empty/>}
            />
        </LayoutView>
    )
}