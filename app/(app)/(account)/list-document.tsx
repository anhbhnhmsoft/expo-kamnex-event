import LayoutView from "@/components/libs/LayoutView";
import {useInfiniteListDocument} from "@/services/schedules/hooks/use-query-schedule";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {useEffect, useMemo} from "react";
import {FlatList, RefreshControl, TouchableOpacity} from "react-native";
import {Card, Spinner, YStack} from "tamagui";
import DefaultColor from "@/components/ui/defaultColor";
import Typo from "@/components/libs/Typo";
import {DefaultSize} from "@/components/ui/defaultStyle";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Empty from "@/components/libs/Empty";
import {router} from "expo-router";


export default function ListDocumentScreen(){
    const {setLoading} = useAppStore();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
        isLoading,
    } = useInfiniteListDocument({filters: {}, page: 1, limit: 10});
    const listDocument = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

    useEffect(() => {
        setLoading(isLoading || isRefetching);
    }, [isRefetching, isLoading]);


    return (
        <LayoutView paddedTop={false}>
            <FlatList
                data={listDocument}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                style={{
                    flex: 1, // chỉ để FlatList chiếm full vùng bố cục
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
                renderItem={({item, index}) => (
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: '/(app)/(event)/detail-document',
                                params: {
                                    id: item.id,
                                }
                            })
                        }}
                        key={item.id}
                    >
                        <Card backgroundColor={DefaultColor.slate[100]} padded flexDirection={"row"} alignItems={"center"} gap={"$3"}>
                            <FontAwesome name="file-text-o" size={24} color="black"/>
                            <YStack paddingRight={40} alignItems={"flex-start"} gap={"$2"}>
                                <Typo weight={"700"} fontSize={DefaultSize.base} color={DefaultColor.slate[500]}>{item.title}</Typo>
                                <Typo weight={"500"} fontSize={DefaultSize.sm} numberOfLines={1}>{item.event_name}</Typo>
                            </YStack>
                        </Card>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => <Empty/>}
            />
        </LayoutView>
    )
}