import {useLocalSearchParams} from "expo-router";
import {useInfiniteCommentList} from "@/services/event/hooks/use-query-event";
import LayoutView from "@/components/libs/LayoutView";
import {useCallback, useEffect, useMemo} from "react";
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    TouchableWithoutFeedback
} from "react-native";
import {Card, Form, Image, Separator, Spinner, View, XStack, Input, Button, Label, YStack} from "tamagui";
import DefaultColor from "@/components/ui/defaultColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Typo from "@/components/libs/Typo";
import {DefaultSize} from "@/components/ui/defaultStyle";
import Empty from "@/components/libs/Empty";
import {useTranslation} from "react-i18next";
import {useAppStore} from "@/services/app/stores/useAppStore";
import {useFormComment} from "@/services/event/hooks/use-form";
import {useMutateCommentEvent} from "@/services/event/hooks/use-mutate-event";
import { Controller } from "react-hook-form";
import {formatDateFormNow} from "@/utils/helper";
import {CommentRequest} from "@/services/event/types";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";


export default function ListCommentScreen() {
    const {t} = useTranslation();
    const {event_id} = useLocalSearchParams<{ event_id?: string }>();
    const setLoading = useAppStore(s => s.setLoading);
    const {control, handleSubmit, formState: {errors, isSubmitting}, setValue} = useFormComment();
    const {mutate, isPending} = useMutateCommentEvent();
    const handleError = useToastErrorHandler();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
        isLoading,
    } = useInfiniteCommentList({
        filters: {
            event_id: event_id
        },
        limit: 10,
        page: 1
    });

    useEffect(() => {
        if (event_id) {
            setValue("event_id", event_id);
        }
    }, [event_id]);

    useEffect(() => {
        setLoading(isLoading || isRefetching || isPending);
    }, [isRefetching, isLoading, isPending]);

    const listComment = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);
    const language = useAppStore(s => s.language);
    const submit = useCallback((data: CommentRequest) => {
        mutate(data,{
            onSuccess: () => {
                setValue('content','');
                refetch();
            },
            onError: (error) => {
                handleError(error)
            }
        });
    }, []);

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <LayoutView paddedTop={false}>
                    <FlatList
                        data={listComment}
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
                        renderItem={({item, index}) => (
                            <Card padded backgroundColor={DefaultColor.white} key={index}>
                                <XStack alignItems={"center"} gap={"$2"}>
                                    {item.user_comment.avatar_url ?
                                        <Image source={{uri: item.user_comment.avatar_url}}
                                               width={30}
                                               height={30}
                                               borderRadius={30}
                                               objectFit="cover"/>
                                        : <View justifyContent={"center"}
                                                alignItems={"center"}
                                                width={30}
                                                height={30}
                                                borderRadius={30}
                                                backgroundColor={DefaultColor.primary_color}>
                                            <Typo color={DefaultColor.white} fontSize={DefaultSize.xl}
                                                  textTransform={"uppercase"}
                                                  weight={"700"}>
                                                {item.user_comment.name?.charAt(0)}
                                            </Typo>
                                        </View>
                                    }
                                    <YStack gap={"$2"}>
                                        <Typo weight={"700"} color={DefaultColor.primary_color}>{item.user_comment.name}</Typo>
                                        <Typo weight={"500"} fontSize={DefaultSize.sm} color={DefaultColor.slate[500]}>{formatDateFormNow(item.created_at,language)}</Typo>
                                    </YStack>
                                </XStack>
                                <Separator marginVertical={10}/>
                                <Typo weight={"500"}>{item.content}</Typo>
                            </Card>
                        )}
                        ListEmptyComponent={() => <Empty/>}
                    >
                    </FlatList>
                    <Form gap={"$2"} paddingTop={20} onSubmit={handleSubmit(submit)}>
                        <XStack gap={"$2"} alignItems={"center"}>
                            <Controller
                                control={control}
                                name="content"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <Input
                                        size={"$4"}
                                        flex={1}
                                        theme={"blue"}
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        borderWidth={0}
                                        placeholder={t('event.page.detail.question_placeholder')}
                                        placeholderTextColor={DefaultColor.slate["400"]}
                                        backgroundColor={DefaultColor.white}
                                    />
                                )}
                            />
                            <Form.Trigger asChild disabled={isSubmitting || isPending}>
                                <Button size={"$4"} paddingVertical={0}
                                        color={DefaultColor.white} theme={"blue"}
                                        icon={isSubmitting || isPending ? () => <Spinner/> :
                                            <FontAwesome name="send-o" size={DefaultSize.md} color={DefaultColor.white}/>}
                                        backgroundColor={DefaultColor.primary_color}>

                                </Button>
                            </Form.Trigger>
                        </XStack>
                        {!!errors.content && (
                            <Label color="red" size="$2">
                                {errors.content.message}
                            </Label>
                        )}
                    </Form>
                </LayoutView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    )
}