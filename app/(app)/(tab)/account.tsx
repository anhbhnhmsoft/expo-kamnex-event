import Typo from "@/components/libs/Typo";
import {useTranslation} from "react-i18next";
import LayoutScrollApp from "@/components/libs/LayoutScrollApp";
import {Card, View, XStack, Image, YStack, Button, Separator} from "tamagui";
import {DefaultSize} from "@/components/ui/defaultStyle";
import useLanguage from "@/services/app/hooks/useLanguage";
import {StyleSheet, TouchableOpacity} from "react-native";
import {_LanguageCode} from "@/utils/@types";
import useSyncLang from "@/services/auth/hooks/useSyncLang";
import DefaultColor from "@/components/ui/defaultColor";
import Empty from "@/components/libs/Empty";
import {FontAwesome, FontAwesome5, FontAwesome6} from '@expo/vector-icons';
import Alert from "@/components/libs/Alert";
import {router} from "expo-router";
import useGetInfoUser from "@/services/auth/hooks/useGetInfoUser";
import useLogout from "@/services/auth/hooks/useLogout";
import {useGetUnreadCount} from "@/services/notifications/hooks/use-query-notification";

export default function AccountScreen() {
    const {t} = useTranslation();
    const {user, get} = useGetInfoUser();
    const logout = useLogout();
    const {language} = useLanguage();
    const syncLang = useSyncLang();
    const {unread_count} = useGetUnreadCount();
    return (
        <LayoutScrollApp>
            {/*Header*/}
            <XStack alignItems={"center"} justifyContent={"space-between"} marginBottom={DefaultSize["3xl"]} gap={"$4"}>
                <Typo weight={"700"} fontSize={DefaultSize["4xl"]}>{t('common.account')}</Typo>
                <XStack gap={"$2"} alignItems={"center"}>
                    <TouchableOpacity
                        onPress={() => {
                            syncLang(_LanguageCode.VI);
                        }}
                        style={[styles.lang_btn, {
                            borderColor: language === _LanguageCode.VI ? DefaultColor.primary_color : "transparent"
                        }]}
                        disabled={language === _LanguageCode.VI}
                    >
                        <Image
                            source={require('@/assets/images/logo/vietnam.png')}
                            style={styles.logo_lang_img}
                            objectFit="cover"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            syncLang(_LanguageCode.EN);
                        }}
                        style={[styles.lang_btn, {
                            borderColor: language === _LanguageCode.EN ? DefaultColor.primary_color : "transparent"
                        }]}
                        disabled={language === _LanguageCode.EN}
                    >
                        <View>
                            <Image
                                source={require('@/assets/images/logo/eng.png')}
                                style={styles.logo_lang_img}
                                objectFit="cover"
                            />
                        </View>
                    </TouchableOpacity>
                </XStack>
            </XStack>

            {/*User info*/}
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => router.push("/(app)/(account)/edit-info")}
            >
                <Card marginBottom={24} padded backgroundColor={DefaultColor.white} position={"relative"}
                      justifyContent={"space-between"} flexDirection={"row"}>
                    {user
                        ? (<>
                            <XStack alignItems={"center"} gap={"$2"}>
                                {/*Avatar*/}
                                {user.avatar_url ?
                                    <Image source={{uri: user.avatar_url}}
                                           width={70}
                                           height={70}
                                           borderRadius={70}
                                           objectFit="cover"/>
                                    : <View justifyContent={"center"}
                                            alignItems={"center"}
                                            width={70}
                                            height={70}
                                            borderRadius={70}
                                            backgroundColor={DefaultColor.primary_color}>
                                        <Typo color={DefaultColor.white} fontSize={DefaultSize.xl}
                                              textTransform={"uppercase"}
                                              weight={"700"}>
                                            {user.name?.charAt(0)}
                                        </Typo>
                                    </View>
                                }
                                <YStack>
                                    <Typo fontSize={DefaultSize.xl} numberOfLines={1} style={{maxWidth:200}} weight={"700"}>{user.name}</Typo>
                                    <Typo color={DefaultColor.slate[400]}>{t('common.press_to_see_detail')}</Typo>
                                </YStack>
                            </XStack>
                            <XStack position={"absolute"} top={10} right={10} gap={"$2"}>
                                <TouchableOpacity onPress={() => {
                                    get()
                                }} style={[styles.btn_icon_heading, {
                                    backgroundColor: DefaultColor.primary_color
                                }]}>
                                    <FontAwesome name="refresh" size={16} color={DefaultColor.white}/>
                                </TouchableOpacity>
                                {user.membership && (
                                    <View style={styles.btn_icon_heading} backgroundColor={DefaultColor.green[500]}>
                                        <Typo textTransform={"uppercase"} color={DefaultColor.white}
                                              fontSize={DefaultSize.xs} weight={"700"}>{t('common.vip')}</Typo>
                                    </View>
                                )}
                            </XStack>

                        </>)
                        :
                        <Empty/>}
                </Card>
            </TouchableOpacity>

            {/*Membership register*/}
            {user && !user.membership && (
                <Card alignItems={"center"} paddingHorizontal={38} marginBottom={24}
                      paddingVertical={14} backgroundColor={DefaultColor.primary_color}>
                    <YStack gap={"$1"} marginBottom={40}>
                        <Typo textAlign={"center"} weight={"700"} color={DefaultColor.white}
                              fontSize={DefaultSize.md}>{t('tab.page.account.register_membership_1')}</Typo>
                        <Typo textAlign={"center"} weight={"700"} color={DefaultColor.white}
                              fontSize={DefaultSize.md}>{t('tab.page.account.register_membership_2')}</Typo>
                    </YStack>
                    <Button
                        onPress={() => router.push('/(app)/(account)/membership/register-list')}
                        size={"$3"} theme={"white"} backgroundColor={DefaultColor.white} paddingVertical={0}>
                        <Typo weight={"500"}>{t('common.upgrade_now')}</Typo>
                    </Button>
                </Card>
            )}

            {/*List action*/}
            <YStack marginBottom={16}>
                <TouchableOpacity
                    onPress={() => router.push("/(app)/(account)/edit-info")}
                >
                    <XStack gap={"$3"} alignItems={"center"}>
                        <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"}
                              justifyContent={"center"}>
                            <FontAwesome name="user" size={DefaultSize["3xl"]} color={DefaultColor.primary_color}/>
                        </View>
                        <Typo fontSize={DefaultSize.md} weight={"500"}>{t('tab.page.account.account_info')}</Typo>
                    </XStack>
                </TouchableOpacity>
                <Separator marginVertical={15} borderColor={DefaultColor.slate[300]}/>

                {/*Notification*/}
                <TouchableOpacity
                    onPress={() => router.push('/(app)/(account)/notifications')}
                >
                    <XStack gap={"$3"} alignItems={"center"} justifyContent={"space-between"}>
                        <XStack gap={"$3"} alignItems={"center"}>
                            <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"}
                                  justifyContent={"center"}>
                                <FontAwesome name="bell" size={DefaultSize["3xl"]} color={DefaultColor.red['600']}/>
                            </View>
                            <Typo fontSize={DefaultSize.md}
                                  weight={"500"}>{t('tab.page.account.manager_notification')}
                            </Typo>
                        </XStack>
                        {unread_count > 0 &&
                            <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} borderRadius={DefaultSize['3xl']} alignItems={"center"}
                                  justifyContent={"center"} backgroundColor={DefaultColor.primary_color}>
                                <Typo color={DefaultColor.white} weight={"500"}>
                                    {unread_count}
                                </Typo>
                            </View>
                        }
                    </XStack>
                </TouchableOpacity>
                <Separator marginVertical={15} borderColor={DefaultColor.slate[300]}/>

                <TouchableOpacity>
                    <XStack gap={"$3"} alignItems={"center"}>
                        <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"}
                              justifyContent={"center"}>
                            <FontAwesome5 name="file" size={DefaultSize["3xl"]} color={DefaultColor.slate['600']}/>
                        </View>
                        <Typo fontSize={DefaultSize.md} weight={"500"}>{t('tab.page.account.manager_file')}</Typo>
                    </XStack>
                </TouchableOpacity>
                <Separator marginVertical={15} borderColor={DefaultColor.slate[300]}/>

                <TouchableOpacity
                    onPress={() => router.push('/(app)/(account)/membership/list')}
                >
                    <XStack gap={"$3"} alignItems={"center"}>
                        <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"}
                              justifyContent={"center"}>
                            <FontAwesome5 name="ticket-alt" size={DefaultSize["2xl"]}
                                          color={DefaultColor.green['500']}/>
                        </View>
                        <Typo fontSize={DefaultSize.md} weight={"500"}>{t('tab.page.account.manager_membership')}</Typo>
                    </XStack>
                </TouchableOpacity>
                <Separator marginVertical={15} borderColor={DefaultColor.slate[300]}/>

                <TouchableOpacity>
                    <XStack gap={"$3"} alignItems={"center"}>
                        <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"}
                              justifyContent={"center"}>
                            <FontAwesome6 name="gift" size={DefaultSize["2xl"]} color={DefaultColor.red['700']}/>
                        </View>
                        <Typo fontSize={DefaultSize.md} weight={"500"}>{t('tab.page.account.manager_gift')}</Typo>
                    </XStack>
                </TouchableOpacity>
                <Separator marginVertical={15} borderColor={DefaultColor.slate[300]}/>

                <TouchableOpacity>
                    <XStack gap={"$3"} alignItems={"center"}>
                        <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"}
                              justifyContent={"center"}>
                            <FontAwesome name="envelope" size={DefaultSize["2xl"]} color={DefaultColor.blue['500']}/>
                        </View>
                        <Typo fontSize={DefaultSize.md} weight={"500"}>{t('tab.page.account.support')}</Typo>
                    </XStack>
                </TouchableOpacity>
                <Separator marginVertical={15} borderColor={DefaultColor.slate[300]}/>

                <Alert
                    title={t('tab.page.account.title_logout')}
                    description={t('tab.page.account.desc_logout')}
                    trigger={() => (
                        <TouchableOpacity>
                            <XStack gap={"$3"} alignItems={"center"}>
                                <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"}
                                      justifyContent={"center"}>
                                    <FontAwesome name="sign-out" size={DefaultSize["2xl"]}
                                                 color={DefaultColor.red['500']}/>
                                </View>
                                <Typo fontSize={DefaultSize.md} weight={"500"}>{t('common.logout')}</Typo>
                            </XStack>
                        </TouchableOpacity>
                    )}
                    onAccept={async () => {
                        await logout();
                    }}
                />
            </YStack>
        </LayoutScrollApp>
    )
}


const styles = StyleSheet.create({
    lang_btn: {
        borderRadius: 7,
        borderWidth: 2,
    },
    logo_lang_img: {
        width: 50,
        height: 33,
        borderRadius: 5
    },

    btn_icon_heading: {
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
    }
})