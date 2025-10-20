import FocusAwareStatusBar from "@/components/libs/FocusAwareStatusBar";
import LayoutView from "@/components/libs/LayoutView";
import LoadingList from "@/components/libs/LoadingList";
import Typo from "@/components/libs/Typo";
import DefaultColor from "@/components/ui/defaultColor";
import { DefaultSize } from "@/components/ui/defaultStyle";
import useCountDown from "@/services/app/hooks/useCountDown";
import useDisableBackGesture from "@/services/app/hooks/useDisableBackGesture";
import useToast from "@/services/app/hooks/useToast";
import useGetInfoUser from "@/services/auth/hooks/useGetInfoUser";
import { useQueryCheckPayment } from "@/services/membership/hooks/use-query-membership";
import useStoreTransactionMembership from "@/services/membership/stores/useStoreTransactionMembership";
import { generateQRCodeImageUrl } from "@/utils/helper";
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Clipboard from 'expo-clipboard';
import { Directory, File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { Button, Image, View, XGroup, XStack } from "tamagui";

export default function CheckTransScreen() {
    useDisableBackGesture();

    const trans = useStoreTransactionMembership(s => s.trans);
    const {t} = useTranslation();
    const {error, success} = useToast();
    const timeLeft = useCountDown(trans?.expired_at);

    const {data} = useQueryCheckPayment(trans?.trans_id);

    const {get} = useGetInfoUser();


    const urlQr = useMemo(() => {
        if (trans) {
            return generateQRCodeImageUrl({
                bin: trans.config_pay.bin,
                numberCode: trans.config_pay.number,
                name: trans.config_pay.name,
                money: trans.money,
                desc: trans.description
            })
        } else {
            return '';
        }
    }, [trans]);

    const saveQRcode = useCallback(async (url: string) => {
        const {status} = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                t('permission.picture_lib.title'),
                t('permission.picture_lib.message')
            );
            return;
        }
        const destination = new Directory(Paths.cache, 'qrimage');
        try {
            // uri của thư mục cache
            if (!destination.exists) {
                destination.create();
            }
            const qrFile = new File(destination, `vietqr_${Date.now()}_${Math.floor(Math.random() * 10000)}.png`);
            // download file
            const output = await File.downloadFileAsync(url, qrFile);
            if (output.exists) {
                await MediaLibrary.saveToLibraryAsync(output.uri);
                success({message: t('common_success.save_image_success')})
            } else {
                error({message: t('account.error.error_save_qr')})
            }
        } catch {
            error({
                message: t('account.error.error_save_qr')
            })
        }
    }, [t]);

    useEffect(() => {
        if (!trans) {
            error({message: t('account.error.empty_trans')})
            router.replace("/(app)/(tab)/account");
        }
    }, [trans, t]);

    useEffect(() => {
        if (data){
            if (data.status === true){
                get().then(() => {
                    success({message: t('common_success.payment_success')})
                    router.replace("/(app)/(tab)/account");
                });
            }
        }
    }, [data, t]);

    return (
        <LayoutView>
            <FocusAwareStatusBar hidden={true} />
            {trans ? (
                <>
                    <Typo textAlign={"center"} fontSize={DefaultSize["2xl"]} color={DefaultColor.primary_color}
                          marginBottom={16} weight={"700"}
                    >
                        {t('account.page.membership.check_trans.title')}
                    </Typo>
                    <View height={"60%"}>
                        <Image
                            source={{uri: urlQr}}
                            width={"100%"}
                            height={"100%"}
                            objectFit={"contain"}
                        />
                    </View>
                    <View marginTop={20} gap={"$2"}>
                        <XStack alignItems={"center"} justifyContent={"center"} gap={"$2"}>
                            <Typo>{t('common.account_number')}: {trans.config_pay.number}</Typo>
                            <Button size={"$2"} icon={<AntDesign name="copy" size={12} color="black" />}
                                    onPress={async () => {
                                        await Clipboard.setStringAsync(trans.config_pay.number);
                                        success({message: t('common_success.copy_success')})
                                    }}
                            />
                        </XStack>
                        <XStack alignItems={"center"} justifyContent={"center"} gap={"$2"}>
                            <Typo>{t('common.desc')}: {trans.description}</Typo>
                            <Button size={"$2"} icon={<AntDesign name="copy" size={12} color="black" />}
                                onPress={async () => {
                                    await Clipboard.setStringAsync(trans.description);
                                    success({message: t('common_success.copy_success')})
                                }}
                            />
                        </XStack>
                        <XGroup>
                            <XGroup.Item>
                                <Button
                                    width="50%"
                                    theme={"blue"}
                                    backgroundColor={DefaultColor.primary_color}
                                    icon={<AntDesign name="download" size={DefaultSize.md} color={DefaultColor.white}/>}
                                    color={DefaultColor.white}
                                    onPress={() => {
                                        saveQRcode(urlQr);
                                    }}
                                >
                                    {t('common.download_qr_code')}
                                </Button>
                            </XGroup.Item>

                            <XGroup.Item>
                                <Button width="50%" disabled fontWeight={700}>
                                    {timeLeft.formatted}
                                </Button>
                            </XGroup.Item>
                        </XGroup>
                    </View>
                </>
            ) : <LoadingList/>}
        </LayoutView>
    )
}