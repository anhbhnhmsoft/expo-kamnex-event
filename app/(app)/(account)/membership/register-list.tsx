import {useInfiniteMembershipList} from "@/services/membership/hooks/use-query-membership";
import {useEffect, useMemo} from "react";
import LayoutView from "@/components/libs/LayoutView";
import Typo from "@/components/libs/Typo";
import {useTranslation} from "react-i18next";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {Button, Card, Spinner, View, XStack} from "tamagui";
import {FlatList, RefreshControl} from "react-native";
import Empty from "@/components/libs/Empty";
import DefaultColor from "@/components/ui/defaultColor";
import {DefaultSize} from "@/components/ui/defaultStyle";
import {formatCurrency} from "@/utils/helper";
import {_ConfigMembership, getLabelConfigMembership} from "@/services/membership/const";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useMutateRegisterMembership} from "@/services/membership/hooks/use-mutation-membership";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import useStoreTransactionMembership from "@/services/membership/stores/useStoreTransactionMembership";
import {router} from "expo-router";

export default function RegisterListScreen() {
    const {t} = useTranslation();
    const {setLoading} = useAppStore();
    const handleError = useToastErrorHandler();
    const setTrans =  useStoreTransactionMembership(s => s.setTrans);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
        isLoading,
    } = useInfiniteMembershipList({filters: {}, page: 1, limit: 10});

    const {mutate, isPending} = useMutateRegisterMembership();

    useEffect(() => {
        setLoading(isLoading || isRefetching);
    }, [isRefetching, isLoading]);

    const listMembership = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

    return (
        <LayoutView paddedTop={false}>
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
                    <Card gap={"$4"} key={index} backgroundColor={DefaultColor.white} padded>
                        {/*Name*/}
                        <View justifyContent={"center"} alignItems={"center"} borderRadius={40}
                              backgroundColor={DefaultColor.green[500]} padding={5}>
                            <Typo fontSize={DefaultSize.xl} weight={"700"} color={DefaultColor.white}>{item.name}</Typo>
                        </View>
                        <XStack alignItems={"center"} gap={"$1"}>
                            <Typo fontSize={DefaultSize.xl} weight={"700"}
                                  color={DefaultColor.black}>{t('common.membership')}</Typo>
                            <Typo fontSize={DefaultSize.xl} numberOfLines={1} weight={"700"}
                                  color={DefaultColor.green["500"]}>{item.name}</Typo>
                        </XStack>
                        <XStack alignItems={"flex-end"} gap={"$1"}>
                            <Typo fontSize={DefaultSize['2xl']} weight={"700"}
                                  color={DefaultColor.black}>{formatCurrency(item.price)} đ</Typo>
                            <Typo fontSize={DefaultSize.lg} weight={"700"}
                                  color={DefaultColor.gray["400"]}>/ {item.duration} {t('common.month')}</Typo>
                        </XStack>
                        {/*badge*/}
                        {item.badge &&
                            <View alignSelf={"flex-start"} alignItems={"center"} justifyContent={"center"}
                                  backgroundColor={item.badge_color_background ? item.badge_color_background : "transparent"}
                                  paddingVertical={5} paddingHorizontal={10} borderRadius={40}>
                                <Typo fontSize={DefaultSize['base']}
                                      color={item.badge_color_text ? item.badge_color_text : DefaultColor.black}>{item.badge}</Typo>
                            </View>
                        }
                        {/*Config*/}
                        <Card padded backgroundColor={"transparent"} gap={"$4"} borderWidth={1} borderColor={DefaultColor.slate["200"]}>
                            {item.config[_ConfigMembership.ALLOW_COMMENT] === true && (
                                <XStack gap={"$2"} alignItems={"flex-start"}>
                                    <View width={20} height={20} borderRadius={40} justifyContent={"center"} alignItems={"center"} backgroundColor={DefaultColor.green[500]}>
                                        <FontAwesome name="check" size={DefaultSize.xs} color={DefaultColor.white} />
                                    </View>
                                    <Typo numberOfLines={2}>{t(getLabelConfigMembership(_ConfigMembership.ALLOW_COMMENT))}</Typo>
                                </XStack>
                            )}
                            {item.config[_ConfigMembership.ALLOW_DOCUMENTARY] === true && (
                                <XStack gap={"$2"} alignItems={"flex-start"}>
                                    <View width={20} height={20} borderRadius={40} justifyContent={"center"} alignItems={"center"} backgroundColor={DefaultColor.green[500]}>
                                        <FontAwesome name="check" size={DefaultSize.xs} color={DefaultColor.white} />
                                    </View>
                                    <Typo numberOfLines={2}>{t(getLabelConfigMembership(_ConfigMembership.ALLOW_DOCUMENTARY))}</Typo>
                                </XStack>
                            )}
                            {item.config[_ConfigMembership.ALLOW_CHOOSE_SEAT] === true && (
                                <XStack gap={"$2"} alignItems={"flex-start"}>
                                    <View width={20} height={20} borderRadius={40} justifyContent={"center"} alignItems={"center"} backgroundColor={DefaultColor.green[500]}>
                                        <FontAwesome name="check" size={DefaultSize.xs} color={DefaultColor.white} />
                                    </View>
                                    <Typo numberOfLines={2}>{t(getLabelConfigMembership(_ConfigMembership.ALLOW_CHOOSE_SEAT))}</Typo>
                                </XStack>
                            )}
                        </Card>

                        <Button size={"$3"}
                                theme={"green"}
                                borderRadius={40}
                                disabled={isPending}
                                backgroundColor={DefaultColor.green[500]}
                                onPress={() => {
                                    setLoading(true);
                                    mutate({membership_id: item.id},{
                                        onSuccess: (res) => {
                                            setLoading(false);
                                            setTrans(res.data);
                                            router.replace('/(app)/(account)/membership/check-trans');
                                        },
                                        onError: (err) => {
                                            setLoading(false);
                                            handleError(err);
                                        }
                                    })
                                }}
                        >
                            <Typo fontSize={DefaultSize.base} weight={"700"}
                                  color={DefaultColor.white}> {t('common.register_now')}</Typo>
                        </Button>
                    </Card>
                )}
                ListEmptyComponent={() => <Empty/>}
            />
        </LayoutView>
    )
}