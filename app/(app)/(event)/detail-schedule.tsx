import {useQueryDetailScheduler} from "@/services/schedules/hooks/use-query-schedule";
import {router, useLocalSearchParams} from "expo-router";
import LayoutScrollApp from "@/components/libs/LayoutScrollApp";
import Typo from "@/components/libs/Typo";
import LoadingList from "@/components/libs/LoadingList";
import {Button, Card, useWindowDimensions, View, YStack} from "tamagui";
import {DefaultSize} from "@/components/ui/defaultStyle";
import DefaultColor from "@/components/ui/defaultColor";
import {useEffect} from "react";
import {useAppStore} from "@/services/app/stores/useAppStore";
import useAuthStore from "@/services/auth/stores/useAuthStore";
import RenderHtml from "react-native-render-html";
import {useTranslation} from "react-i18next";
import Empty from "@/components/libs/Empty";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {TouchableOpacity} from "react-native";
import {checkMembershipConfig} from "@/utils/helper";
import {_ConfigMembership} from "@/services/membership/const";

export default function DetailScheduleScreen() {
    const {t} = useTranslation();
    const {id} = useLocalSearchParams<{ id?: string }>();
    const {schedule, loading} = useQueryDetailScheduler(id);
    const {width} = useWindowDimensions();
    const setLoading = useAppStore(s => s.setLoading);
    const user = useAuthStore(s => s.user);

    useEffect(() => {
        setLoading(loading);
    }, [loading]);
    return (
        <LayoutScrollApp paddedTop={false}>
            {schedule
                ?
                <YStack gap={"$4"} flex={1}>
                    <Typo weight={"700"} textAlign={"center"} color={DefaultColor.primary_color}
                          fontSize={DefaultSize['3xl']}>{schedule.title}</Typo>
                    <Typo weight={"700"} textAlign={"center"} color={DefaultColor.slate[500]}
                          fontSize={DefaultSize.md}>{schedule.start_time} - {schedule.end_time}
                    </Typo>
                    <RenderHtml
                        source={{html: schedule.description}}
                        contentWidth={width}
                    />
                    {/*Tài liệu*/}
                    <YStack marginTop={10} gap={"$4"} position={"relative"}>
                        {/*Nếu user chưa mua gói thành viên*/}
                        {!checkMembershipConfig(user, _ConfigMembership.ALLOW_DOCUMENTARY) && (
                            <>
                                <View position={"absolute"} top={-10} bottom={-10} left={-10} right={-10}
                                      opacity={0.8}
                                      backgroundColor={DefaultColor.slate[500]} zIndex={1}
                                      borderRadius={10}>
                                </View>
                                <View position={"absolute"} top={0} bottom={0} left={0} right={0} zIndex={2}
                                      alignItems={"center"} justifyContent={"center"} gap={"$4"}>
                                    <Typo weight={"700"}
                                          fontSize={DefaultSize.base}
                                          color={DefaultColor.white}
                                          textAlign={"center"}
                                    >
                                        {t('event.page.detail.register_membership_to_document')}
                                    </Typo>
                                    <View flexDirection="row" gap={"$3"}>
                                        <Button size={"$3"} paddingHorizontal={DefaultSize['5xl']}
                                                paddingVertical={0}
                                                borderRadius={DefaultSize["4xl"]}
                                                color={DefaultColor.white} theme={"blue"}
                                                backgroundColor={DefaultColor.primary_color}
                                                onPress={() => router.push('/(app)/(account)/membership/register-list')}
                                        >
                                            <Typo color={DefaultColor.white} fontSize={DefaultSize.base}>
                                                {t('common.register_now')}
                                            </Typo>
                                        </Button>
                                        <Button size={"$3"} paddingHorizontal={DefaultSize['5xl']}
                                                paddingVertical={0}
                                                borderRadius={DefaultSize["4xl"]}
                                                color={DefaultColor.white} theme={"blue"}
                                                backgroundColor={DefaultColor.white}
                                                onPress={() => router.push('/')}
                                        >
                                            <Typo color={DefaultColor.black} fontSize={DefaultSize.base}>
                                                {t('common.buy_document')}
                                            </Typo>
                                        </Button>
                                    </View>
                                </View>
                            </>
                        )}
                        <Typo weight={"700"} color={DefaultColor.primary_color}
                              fontSize={DefaultSize['xl']}>
                            {t('common.document')}
                        </Typo>
                        {(schedule.documents && Array.isArray(schedule.documents) && schedule.documents.length > 0) ? schedule.documents.map((document) => (
                            <TouchableOpacity
                                onPress={() => {
                                    router.push({
                                        pathname: '/(app)/(event)/detail-document',
                                        params: {
                                            id: document.id,
                                        }
                                    })
                                }}
                                key={document.id}
                                disabled={!checkMembershipConfig(user, _ConfigMembership.ALLOW_DOCUMENTARY)}
                            >
                                <Card backgroundColor={DefaultColor.slate[100]} padded flexDirection={"row"}
                                      alignItems={"center"} gap={"$2"}>
                                    <FontAwesome name="file-text-o" size={24} color="black"/>
                                    <Typo weight={"700"} fontSize={DefaultSize.base}>{document.title}</Typo>
                                </Card>
                            </TouchableOpacity>
                        )) : <Empty/>}
                    </YStack>
                </YStack>
                :
                <YStack gap={"$2"}>
                    <LoadingList/>
                    <LoadingList/>
                </YStack>
            }
        </LayoutScrollApp>
    )
}