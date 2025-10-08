import {useInfiniteGiftList} from "@/services/auth/hooks/use-query";
import {Card, Spinner, XStack} from "tamagui";
import {FlatList, RefreshControl} from "react-native";
import Empty from "@/components/libs/Empty";
import LayoutView from "@/components/libs/LayoutView";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {useEffect, useMemo} from "react";
import DefaultColor from "@/components/ui/defaultColor";
import Typo from "@/components/libs/Typo";
import {DefaultSize} from "@/components/ui/defaultStyle";
import {useTranslation} from "react-i18next";
import {formatDateFormNow} from "@/utils/helper";

export default function GiftScreen() {
    const setLoading = useAppStore(s => s.setLoading);
    const lang = useAppStore(s => s.language);
    const {t} = useTranslation();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
        isLoading,
    } = useInfiniteGiftList({
        filters: {},
        limit: 10,
        page: 1
    });
    const listGift = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

    useEffect(() => {
        setLoading(isLoading || isRefetching);
    }, [isRefetching, isLoading]);

    return (
        <LayoutView paddedTop={false}>
            <FlatList
                data={listGift}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                style={{
                    flex: 1,
                    position: "relative",
                }}
                contentContainerStyle={{
                    gap: 12,
                    paddingBottom: 40,
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
                    <Card gap={"$3"} key={item.id.toString()} padded backgroundColor={DefaultColor.white}>
                        <Typo fontSize={DefaultSize.md} weight={"700"} numberOfLines={2} color={DefaultColor.primary_color}>{item.gift.name}</Typo>
                        <Typo weight={"700"} numberOfLines={2} color={DefaultColor.slate[500]}>{item.event.name}</Typo>
                        <Typo weight={"700"} numberOfLines={2} color={DefaultColor.slate[500]}>{formatDateFormNow(item.created_at,lang)}</Typo>
                    </Card>
                )}
                ListEmptyComponent={() => <Empty/>}
            />
        </LayoutView>
    )


}
