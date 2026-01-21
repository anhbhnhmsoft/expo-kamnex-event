import Typo from "@/components/libs/Typo";
import {Spinner} from "tamagui";
import {_EventUserHistory} from "@/services/event/const";
import {useEffect, useMemo} from "react";
import LayoutView from "@/components/libs/LayoutView";
import {useTranslation} from "react-i18next";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {DefaultSize} from "@/components/ui/defaultStyle";
import {FlatList, RefreshControl} from "react-native";
import Empty from "@/components/libs/Empty";
import EventCard from "@/components/page/EventCard";
import {useInfiniteEventList} from "@/services/event/hooks/use-query-event";


export default function SeenScreen() {
    const {t} = useTranslation();
    const {setLoading} = useAppStore();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
        isLoading,
    } = useInfiniteEventList({
        filters: {
            event_history_status: _EventUserHistory.SEENED
        },
        page: 1,
        limit: 10,
    });
    const listEvent = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

    useEffect(() => {
        setLoading(isLoading || isRefetching);
    }, [isRefetching, isLoading]);

    return (
        <LayoutView>
            <Typo marginBottom={16} weight={"700"} fontSize={DefaultSize['2xl']}>{t('tab.page.seen.title')}</Typo>
            <FlatList
                data={listEvent}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                contentContainerStyle={{
                    gap: 12,
                    paddingTop: 20,
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
                    <EventCard item={item} key={index}/>
                )}
                ListEmptyComponent={() => <Empty/>}
            />
        </LayoutView>
    )
}