import {Card, Separator, View, YStack, Input, Button} from "tamagui";
import Typo from "@/components/libs/Typo";
import {router, useLocalSearchParams} from "expo-router";
import {Fragment, useEffect, useMemo} from "react";
import {useQueryGetEventPollItem} from "@/services/event/hooks/use-query-event";
import {useAppStore} from "@/services/app/stores/useAppStore";
import LayoutScrollApp from "@/components/libs/LayoutScrollApp";
import LoadingList from "@/components/libs/LoadingList";
import DefaultColor from "@/components/ui/defaultColor";
import {DefaultSize} from "@/components/ui/defaultStyle";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {useFormSubmitPoll} from "@/services/event/hooks/use-form";
import {
   TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Controller } from 'react-hook-form';
import {_EventPollQuestionType} from "@/services/event/const";
import {SubmitPollForm, SubmitPollRequest} from "@/services/event/types";
import {useMutateSubmitPoll} from "@/services/event/hooks/use-mutate-event";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import useToast from "@/services/app/hooks/useToast";

export default function EventPoll() {
    const {t} = useTranslation();
    const {id} = useLocalSearchParams<{ id?: string }>();
    const {data, loading} = useQueryGetEventPollItem(id || '');
    const {control, handleSubmit, formState: { errors }} = useFormSubmitPoll(data?.questions)
    const setLoading = useAppStore(s => s.setLoading);
    const {mutate: submitPoll} = useMutateSubmitPoll();
    const handleError = useToastErrorHandler();
    const {success} = useToast();
    useEffect(() => {
        setLoading(loading);
    }, [loading]);

    const submit = (formData: Record<string, any>) => {
        if (data && data.questions) {
            const payload: SubmitPollForm[] = data.questions.map(q => {
                const rawValue = formData[q.id];
                if (q.type === _EventPollQuestionType.MULTIPLE) {
                    return {
                        question_id: q.id,
                        answer: "",
                        answer_ids: rawValue || [] // Mảng ID
                    };
                } else {
                    return {
                        question_id: q.id,
                        answer: rawValue || "", // Text trả lời
                        answer_ids: []
                    };
                }
            });
            const submitData: SubmitPollRequest = {
                poll_id: data.id,
                questions: payload
            }
            setLoading(true);
            submitPoll(submitData, {
                onSuccess: () => {
                    setLoading(false);
                    success({message: t('event.page.event_poll.poll_success')});
                    router.back();
                },
                onError: (err) => {
                    setLoading(false);
                    handleError(err);
                }
            });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <LayoutScrollApp paddedTop={false}>
                {data ? (
                    <>
                        <Typo weight={"700"} color={DefaultColor.primary_color} fontSize={DefaultSize['xl']}
                              marginBottom={16}>
                            {data.title}
                        </Typo>
                        <View padding={10} backgroundColor={DefaultColor.white} borderRadius={5}>
                            <View gap={"$2"}>
                                <Typo weight={"500"} color={DefaultColor.slate["500"]} fontSize={DefaultSize.base} numberOfLines={1}>
                                    {t('event.page.detail.number_question_poll')} :  {data.duration_unit}
                                </Typo>
                                <Typo weight={"500"} color={DefaultColor.slate["500"]} fontSize={DefaultSize.base} numberOfLines={1}>
                                    {t('event.page.detail.start_time_poll')} :  {dayjs(data.start_time).format('DD/MM/YYYY HH:mm')}
                                </Typo>
                                <Typo weight={"500"} color={DefaultColor.slate["500"]} fontSize={DefaultSize.base} numberOfLines={1}>
                                    {t('event.page.detail.end_time_poll')} :  {dayjs(data.end_time).format('DD/MM/YYYY HH:mm')}
                                </Typo>
                            </View>
                        </View>
                        <Separator marginVertical={14}/>
                        {data.questions && data.questions.length > 0 ? (
                            <YStack gap={"$4"}>
                                <YStack gap={"$2"}>
                                    {data.questions.map((item, index) => (
                                        <View key={index} padding={10} backgroundColor={DefaultColor.white} borderRadius={5}>
                                            <Typo weight={"500"} fontSize={DefaultSize.base}>
                                                {item.question}
                                            </Typo>
                                            <Separator marginVertical={14}/>
                                            <Controller
                                                control={control}
                                                name={item.id} // Name trùng với ID câu hỏi (khớp với schema Zod)
                                                render={({ field: { onChange, value } }) => {
                                                    // --- CASE 1: TRẮC NGHIỆM (MULTIPLE) ---
                                                    if (item.type === _EventPollQuestionType.MULTIPLE) {
                                                        // Đảm bảo value luôn là mảng để tránh lỗi
                                                        const selectedIds: string[] = Array.isArray(value) ? value : [];
                                                        return (
                                                            <View
                                                                flexWrap={"wrap"}
                                                                alignItems={"flex-start"}
                                                                justifyContent={"flex-start"}
                                                                gap={"$2"}
                                                            >
                                                                {item.options?.map(opt => {
                                                                    const isSelected = selectedIds.includes(opt.id);
                                                                    return (
                                                                        <TouchableOpacity
                                                                            key={opt.id}
                                                                            style={{flex: 1, width:"100%"}}
                                                                            onPress={() => {
                                                                                if (isSelected) {
                                                                                    onChange(selectedIds.filter(id => id !== opt.id));
                                                                                } else {
                                                                                    onChange([...selectedIds, opt.id]);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Card padded gap={"$2"}
                                                                                  flex={1}
                                                                                  borderWidth={1}
                                                                                  borderColor={isSelected ? DefaultColor.primary_color : DefaultColor.slate["300"]}
                                                                                  backgroundColor={isSelected ? DefaultColor.primary_color : DefaultColor.white}
                                                                                  justifyContent={"center"}
                                                                            >
                                                                                <Typo weight={"700"}
                                                                                      color={isSelected ? DefaultColor.white : DefaultColor.black}>{opt.label}</Typo>
                                                                            </Card>
                                                                        </TouchableOpacity>
                                                                    );
                                                                })}
                                                                {errors[item.id] && (
                                                                    <Typo color={DefaultColor.red["500"]}>
                                                                        {errors[item.id]?.message as string}
                                                                    </Typo>
                                                                )}
                                                            </View>
                                                        );
                                                    }

                                                    // --- CASE 2: TỰ LUẬN (OPEN ENDED) ---
                                                    if (item.type === _EventPollQuestionType.OPEN_ENDED) {
                                                        return (
                                                            <>
                                                                <Input
                                                                    placeholder={t('event.page.event_poll.write_answer')}
                                                                    multiline
                                                                    backgroundColor={DefaultColor.white}
                                                                    value={value}
                                                                    onChangeText={onChange} // React Hook Form tự bind
                                                                />
                                                                {errors[item.id] && (
                                                                    <Typo color={DefaultColor.red["500"]}>
                                                                        {errors[item.id]?.message as string}
                                                                    </Typo>
                                                                )}
                                                            </>
                                                        );
                                                    }
                                                    return <Fragment/>;
                                                }}
                                            />
                                        </View>
                                    ))}
                                </YStack>
                                <Button size={"$3"} paddingHorizontal={DefaultSize.md}
                                        color={DefaultColor.white} theme={"blue"} backgroundColor={DefaultColor.primary_color}
                                        onPress={handleSubmit(submit)}
                                >
                                    <Typo color={DefaultColor.white} fontSize={DefaultSize.base} weight={"700"}>{t('event.page.event_poll.submit')}</Typo>
                                </Button>

                            </YStack>
                        ) : null}
                    </>

                ) : (
                    <YStack gap={"$2"}>
                        <LoadingList/>
                        <LoadingList/>
                    </YStack>
                )}
            </LayoutScrollApp>
        </KeyboardAvoidingView>
    );
}
