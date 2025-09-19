import Typo from "@/components/libs/Typo";
import {useTranslation} from "react-i18next";
import LayoutScrollApp from "@/components/libs/LayoutScrollApp";
import useAuthStore from "@/services/auth/stores/useAuthStore";
import {Card, View, XStack, Image, YStack, Button, Separator} from "tamagui";
import {DefaultSize} from "@/components/ui/defaultStyle";
import useLanguage from "@/services/app/hooks/useLanguage";
import {StyleSheet, TouchableOpacity} from "react-native";
import {_LanguageCode} from "@/utils/@types";
import useSyncLang from "@/services/auth/hooks/useSyncLang";
import DefaultColor from "@/components/ui/defaultColor";
import Empty from "@/components/libs/Empty";
import {FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import Alert from "@/components/libs/Alert";
import {router} from "expo-router";



export default function AccountScreen() {
    const {t} = useTranslation();
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);
    const {language} = useLanguage();
    const syncLang = useSyncLang();

    return (
        <LayoutScrollApp>
            {/*Header*/}
            <XStack alignItems={"center"} justifyContent={"space-between"} marginBottom={DefaultSize["3xl"]} gap={"$4"}>
                <Typo weight={"700"} fontSize={DefaultSize["4xl"]}>{t('common.account')}</Typo>
                <XStack gap={"$2"}>
                    <TouchableOpacity
                        onPress={() => {
                            syncLang(_LanguageCode.VI);
                        }}
                        disabled={language === _LanguageCode.VI}
                    >
                        <Image
                            source={require('@/assets/images/logo/vietnam.png')}
                            style={styles.logo_lang_btn}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            syncLang(_LanguageCode.EN);
                        }}
                        disabled={language === _LanguageCode.EN}
                    >
                        <Image
                            source={require('@/assets/images/logo/eng.png')}
                            style={styles.logo_lang_btn}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </XStack>
            </XStack>

            {/*User info*/}
            <TouchableOpacity
                activeOpacity={0.6}
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
                                    <Typo fontSize={DefaultSize.xl} numberOfLines={1} weight={"700"}>{user.name}</Typo>
                                    <Typo color={DefaultColor.slate[400]}>{t('common.press_to_see_detail')}</Typo>
                                </YStack>
                            </XStack>
                            {user.memberships && user.memberships.length > 0 && (
                                <View position={"absolute"} top={10} right={10} width={45} justifyContent={"center"}
                                      alignItems={"center"} height={45} borderRadius={40}
                                      backgroundColor={DefaultColor.green[500]}>
                                    <Typo textTransform={"uppercase"} color={DefaultColor.white}
                                          fontSize={DefaultSize.sm} weight={"700"}>{t('common.vip')}</Typo>
                                </View>
                            )}
                        </>)
                        :
                        <Empty/>}
                </Card>
            </TouchableOpacity>

            {/*Membership register*/}
            {user && user.memberships && user.memberships.length === 0 && (
                <Card alignItems={"center"} paddingHorizontal={38} marginBottom={24}
                      paddingVertical={14} backgroundColor={DefaultColor.primary_color}>
                    <YStack gap={"$1"} marginBottom={40}>
                        <Typo textAlign={"center"} weight={"700"} color={DefaultColor.white} fontSize={DefaultSize.md}>{t('tab.page.account.register_membership_1')}</Typo>
                        <Typo textAlign={"center"} weight={"700"} color={DefaultColor.white} fontSize={DefaultSize.md}>{t('tab.page.account.register_membership_2')}</Typo>
                    </YStack>
                    <Button size={"$3"} theme={"white"} backgroundColor={DefaultColor.white} paddingVertical={0}>
                        <Typo weight={"500"}>{t('common.upgrade_now')}</Typo>
                    </Button>
                </Card>
            )}

            {/*List action*/}
            <YStack marginBottom={16}>
                <TouchableOpacity>
                    <XStack gap={"$3"} alignItems={"center"}>
                        <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"} justifyContent={"center"}>
                            <FontAwesome name="user" size={DefaultSize["3xl"]} color={DefaultColor.primary_color} />
                        </View>
                        <Typo fontSize={DefaultSize.md} weight={"500"}>{t('tab.page.account.account_info')}</Typo>
                    </XStack>
                </TouchableOpacity>
                <Separator marginVertical={15} borderColor={DefaultColor.slate[300]} />

                <TouchableOpacity>
                    <XStack gap={"$3"} alignItems={"center"}>
                        <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"} justifyContent={"center"}>
                            <FontAwesome name="bell" size={DefaultSize["3xl"]} color={DefaultColor.red['600']} />
                        </View>
                        <Typo fontSize={DefaultSize.md} weight={"500"}>{t('tab.page.account.manager_notification')}</Typo>
                    </XStack>
                </TouchableOpacity>
                <Separator marginVertical={15} borderColor={DefaultColor.slate[300]} />

                <TouchableOpacity>
                    <XStack gap={"$3"} alignItems={"center"}>
                        <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"} justifyContent={"center"}>
                            <FontAwesome5 name="file" size={DefaultSize["3xl"]} color={DefaultColor.slate['600']} />
                        </View>
                        <Typo fontSize={DefaultSize.md} weight={"500"}>{t('tab.page.account.manager_file')}</Typo>
                    </XStack>
                </TouchableOpacity>
                <Separator marginVertical={15} borderColor={DefaultColor.slate[300]} />

                <TouchableOpacity>
                    <XStack gap={"$3"} alignItems={"center"}>
                        <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"} justifyContent={"center"}>
                            <FontAwesome5 name="ticket-alt" size={DefaultSize["2xl"]} color={DefaultColor.green['500']} />
                        </View>
                        <Typo fontSize={DefaultSize.md} weight={"500"}>{t('tab.page.account.manager_membership')}</Typo>
                    </XStack>
                </TouchableOpacity>
                <Separator marginVertical={15} borderColor={DefaultColor.slate[300]} />

                <TouchableOpacity>
                    <XStack gap={"$3"} alignItems={"center"}>
                        <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"} justifyContent={"center"}>
                            <FontAwesome6 name="gift" size={DefaultSize["2xl"]} color={DefaultColor.red['700']} />
                        </View>
                        <Typo fontSize={DefaultSize.md} weight={"500"}>{t('tab.page.account.manager_gift')}</Typo>
                    </XStack>
                </TouchableOpacity>
                <Separator marginVertical={15} borderColor={DefaultColor.slate[300]} />

                <TouchableOpacity>
                    <XStack gap={"$3"} alignItems={"center"}>
                        <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"} justifyContent={"center"}>
                            <FontAwesome name="envelope" size={DefaultSize["2xl"]} color={DefaultColor.blue['500']} />
                        </View>
                        <Typo fontSize={DefaultSize.md} weight={"500"}>{t('tab.page.account.support')}</Typo>
                    </XStack>
                </TouchableOpacity>
                <Separator marginVertical={15} borderColor={DefaultColor.slate[300]} />

                <Alert
                    trigger={() => (
                        <TouchableOpacity>
                            <XStack gap={"$3"} alignItems={"center"}>
                                <View width={DefaultSize["3xl"]} height={DefaultSize["3xl"]} alignItems={"center"} justifyContent={"center"}>
                                    <FontAwesome name="sign-out" size={DefaultSize["2xl"]} color={DefaultColor.red['500']} />
                                </View>
                                <Typo fontSize={DefaultSize.md} weight={"500"}>{t('common.logout')}</Typo>
                            </XStack>
                        </TouchableOpacity>
                    )}
                    title={t('tab.page.account.title_logout')}
                    description={t('tab.page.account.desc_logout')}
                    onAccept={async () => {
                        await logout();
                        router.replace('/(auth)')
                    }}
                />
            </YStack>

        </LayoutScrollApp>
    )
}

const styles = StyleSheet.create({
    logo_lang_btn: {
        width: 50,
        height: 33,
        borderRadius: 5
    },
})