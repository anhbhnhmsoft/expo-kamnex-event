import {useTranslation} from "react-i18next";
import {Alert,  StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import LayoutView from "@/components/libs/LayoutView";
import {Button, Form, Image, Input, Label, Sheet, Spinner, View, XStack, YStack} from "tamagui";
import DefaultColor from "@/components/ui/defaultColor";
import Typo from "@/components/libs/Typo";
import {DefaultSize} from "@/components/ui/defaultStyle";
import LoadingList from "@/components/libs/LoadingList";
import {Dispatch, FC, SetStateAction, useCallback, useEffect, useState} from "react";
import FadeView from "@/components/libs/FadeView";
import {Controller} from "react-hook-form";
import useFormEditInfoUser from "@/services/auth/hooks/useFormEditInfoUser";
import {EditInfoRequest} from "@/services/auth/types";
import useGetInfoUser from "@/services/auth/hooks/useGetInfoUser";
import {
    useMutationDeleteAccount,
    useMutationDeleteAvatar,
    useMutationEditAvatar,
    useMutationEditUser
} from "@/services/auth/hooks/useMutationAuth";
import useToast from "@/services/app/hooks/useToast";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import {router} from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {useAppStore} from "@/services/app/stores/useAppStore";
import AlertFC from "@/components/libs/Alert";
import useRequestPermissionCamera from "@/services/app/hooks/useRequestPermissionCamera";
import useAuthStore from "@/services/auth/stores/useAuthStore";

export default function EditInfoScreen() {
    const {t} = useTranslation();

    const [changePass, setChangePass] = useState<boolean>(false);

    const {control, handleSubmit, formState: {errors, isSubmitting}, setValue, reset} = useFormEditInfoUser();

    const {user, set} = useGetInfoUser();

    const {mutate, isPending} = useMutationEditUser();

    const {mutate: mutateDeleteAccount, isPending: isPendingDeleteAccount} = useMutationDeleteAccount();

    const {success} = useToast();

    const handleError = useToastErrorHandler();

    const logout = useAuthStore(state => state.logout);

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                introduce: user.introduce ?? undefined,
                address: user.address ?? undefined,
                phone: user.phone ?? undefined
            })
        }
    }, [user]);

    const [openChangePhoto, setOpenChangePhoto] = useState<boolean>(false);


    const sumbit = useCallback((data: EditInfoRequest) => {
        mutate(data, {
            onSuccess: res => {
                set(res.data);
                success({message: res.message});
                router.back();
            },
            onError: error => {
                handleError(error)
            }
        });
    }, []);

    return (
        <>
            <SafeAreaView style={{flex: 1, position: 'relative'}} edges={['bottom']}>
                <TouchableWithoutFeedback>
                    <KeyboardAwareScrollView
                        style={{flex: 1}}
                        contentContainerStyle={{flexGrow: 1}}
                        enableOnAndroid={true}
                        scrollEnabled={true}
                    >
                        {user ?
                            <LayoutView>
                                {/*Avatar*/}
                                <View alignSelf={"center"} gap={"$4"} alignItems={"center"} justifyContent={"center"}>
                                    {user.avatar_url ?
                                        <Image source={{uri: user.avatar_url}}
                                               width={100}
                                               height={100}
                                               borderRadius={100}
                                               objectFit="cover"/>
                                        : <View justifyContent={"center"}
                                                alignItems={"center"}
                                                width={100}
                                                height={100}
                                                borderRadius={100}
                                                backgroundColor={DefaultColor.primary_color}>
                                            <Typo color={DefaultColor.white} fontSize={DefaultSize.xl}
                                                  textTransform={"uppercase"}
                                                  weight={"700"}>
                                                {user.name?.charAt(0)}
                                            </Typo>
                                        </View>
                                    }
                                    <Button onPress={() => setOpenChangePhoto(true)} size={"$3"} theme={"blue"}
                                            backgroundColor={DefaultColor.primary_color}>
                                        <Typo textAlign={"center"} color={DefaultColor.white} weight={"700"}>
                                            {t('account.page.edit_info.change_avatar')}
                                        </Typo>
                                    </Button>
                                </View>
                                <Form gap={"$4"} marginTop={28} paddingBottom={28} onSubmit={handleSubmit(sumbit)}>
                                    {/*email*/}
                                    <YStack gap={"$2"}>
                                        <Typo weight={"700"}
                                              style={{color: DefaultColor.primary_color, fontSize: DefaultSize.md,}}>
                                            {t('common.email')}
                                        </Typo>
                                        <Input
                                            size={"$5"}
                                            disabled
                                            placeholder={t('common.email')}
                                            value={user.email}
                                            backgroundColor={DefaultColor.slate[200]}
                                        />
                                    </YStack>
                                    {/*name*/}
                                    <Controller
                                        control={control}
                                        name="name"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <YStack gap={"$2"}>
                                                <Typo weight={"700"}
                                                      color={DefaultColor.primary_color}
                                                      fontSize={DefaultSize.md}
                                                >
                                                    {t('common.full_name')}
                                                </Typo>
                                                <Input
                                                    size={"$5"}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    textContentType={"name"}
                                                    placeholder={t('common.full_name')}
                                                    backgroundColor={DefaultColor.white}
                                                />
                                                {!!errors.name && (
                                                    <Label color="red" size="$2">
                                                        {errors.name.message}
                                                    </Label>
                                                )}
                                            </YStack>
                                        )}
                                    />
                                    {/*phone*/}
                                    <Controller
                                        control={control}
                                        name="phone"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <YStack gap={"$2"}>
                                                <Typo weight={"700"}
                                                      color={DefaultColor.primary_color}
                                                      fontSize={DefaultSize.md}
                                                >
                                                    {t('common.phone')}
                                                </Typo>
                                                <Input
                                                    size={"$5"}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    textContentType={"telephoneNumber"}
                                                    placeholder={t('common.phone')}
                                                    backgroundColor={DefaultColor.white}
                                                />
                                                {!!errors.phone && (
                                                    <Label color="red" size="$2">
                                                        {errors.phone.message}
                                                    </Label>
                                                )}
                                            </YStack>
                                        )}
                                    />
                                    {/*address*/}
                                    <Controller
                                        control={control}
                                        name="address"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <YStack gap={"$2"}>
                                                <Typo weight={"700"}
                                                      color={DefaultColor.primary_color}
                                                      fontSize={DefaultSize.md}
                                                >
                                                    {t('common.address')}
                                                </Typo>
                                                <Input
                                                    size={"$5"}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    textContentType={"fullStreetAddress"}
                                                    placeholder={t('common.address')}
                                                    backgroundColor={DefaultColor.white}
                                                />
                                                {!!errors.address && (
                                                    <Label color="red" size="$2">
                                                        {errors.address.message}
                                                    </Label>
                                                )}
                                            </YStack>
                                        )}
                                    />

                                    {/*introduce*/}
                                    <Controller
                                        control={control}
                                        name="introduce"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <YStack gap={"$2"}>
                                                <Typo weight={"700"}
                                                      color={DefaultColor.primary_color}
                                                      fontSize={DefaultSize.md}
                                                >
                                                    {t('common.introduce')}
                                                </Typo>
                                                <Input
                                                    size={"$5"}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    placeholder={t('common.introduce')}
                                                    backgroundColor={DefaultColor.white}
                                                />
                                                {!!errors.introduce && (
                                                    <Label color="red" size="$2">
                                                        {errors.introduce.message}
                                                    </Label>
                                                )}
                                            </YStack>
                                        )}
                                    />

                                    {/*Change pass*/}
                                    <FadeView visible={changePass} gap={"$4"} backgroundColor={DefaultColor.white}
                                              borderRadius={10} paddingHorizontal={10} paddingVertical={20}>
                                        <Controller
                                            control={control}
                                            name="password"
                                            render={({field: {onChange, onBlur, value}}) => (
                                                <YStack gap={"$2"}>
                                                    <Typo weight={"700"}
                                                          style={{
                                                              color: DefaultColor.primary_color,
                                                              fontSize: DefaultSize.md,
                                                          }}>
                                                        {t('common.password')}
                                                    </Typo>
                                                    <Input
                                                        size={"$5"}
                                                        secureTextEntry={true}
                                                        value={value || ''}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                        textContentType={"newPassword"}
                                                        placeholder={t('common.password')}
                                                        backgroundColor={DefaultColor.white}
                                                    />
                                                    {!!errors.password && (
                                                        <Label color="red" size="$2">
                                                            {errors.password.message}
                                                        </Label>
                                                    )}
                                                </YStack>
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name="confirm_password"
                                            render={({field: {onChange, onBlur, value}}) => (
                                                <YStack gap={"$2"}>
                                                    <Typo weight={"700"}
                                                          style={{
                                                              color: DefaultColor.primary_color,
                                                              fontSize: DefaultSize.md,
                                                          }}>
                                                        {t('common.re_password')}
                                                    </Typo>
                                                    <Input
                                                        size={"$5"}
                                                        secureTextEntry={true}
                                                        value={value || ''}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                        textContentType={"newPassword"}
                                                        placeholder={t('common.re_password')}
                                                        backgroundColor={DefaultColor.white}
                                                    />
                                                    {!!errors.confirm_password && (
                                                        <Label color="red" size="$2">
                                                            {errors.confirm_password.message}
                                                        </Label>
                                                    )}
                                                </YStack>
                                            )}
                                        />
                                    </FadeView>

                                    {/* Save and Change Password and delete account */}
                                    <XStack gap={"$2"}>
                                        <Form.Trigger asChild disabled={isSubmitting || isPending}>
                                            <Button flex={1} theme={"blue"} backgroundColor={DefaultColor.primary_color}
                                                    icon={isSubmitting || isPending ? () => <Spinner/> : undefined}
                                            >
                                                <Typo textAlign={"center"} color={DefaultColor.white} weight={"700"}>
                                                    {t('common.save')}
                                                </Typo>
                                            </Button>
                                        </Form.Trigger>

                                        <Button flex={1} theme={"white"} backgroundColor={DefaultColor.white}
                                                disabled={isSubmitting || isPending || isPendingDeleteAccount}
                                                onPress={() => {
                                                    setChangePass(!changePass);
                                                    setValue('password', undefined);
                                                    setValue('confirm_password', undefined)
                                                }}>
                                            <Typo textAlign={"center"} color={DefaultColor.primary_color}
                                                  weight={"700"}>
                                                {changePass ? t('account.page.edit_info.active_change_password') : t('account.page.edit_info.unactive_change_password')}
                                            </Typo>
                                        </Button>
                                    </XStack>

                                    {/* Delete account */}
                                    <View>
                                        <Button flex={1} theme={"red"} backgroundColor={DefaultColor.red[400]}
                                                disabled={isSubmitting || isPending || isPendingDeleteAccount}
                                                onPress={() => {
                                                    Alert.alert(
                                                        t('account.page.edit_info.delete_account_title'),
                                                        t('account.page.edit_info.delete_account_desc'),
                                                        [
                                                            {
                                                                text: t('common.cancel'),
                                                                style: "cancel"
                                                            },
                                                            {
                                                                text: t('common.accept'),
                                                                style: "destructive",
                                                                onPress: () => {
                                                                    mutateDeleteAccount(undefined, {
                                                                        onSuccess: async (res) => {
                                                                            await logout();
                                                                            router.replace('/(app)/(tab)');
                                                                        },
                                                                        onError: (error) => {
                                                                            handleError(error)
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        ]
                                                    );
                                                }}>
                                            {isPendingDeleteAccount ? <Spinner color={DefaultColor.white}/> :
                                            <Typo textAlign={"center"} color={DefaultColor.white} weight={"700"}>
                                                {t('account.page.edit_info.delete_account_title')}
                                            </Typo>}
                                        </Button>
                                    </View>
                                </Form>
                            </LayoutView>
                            :
                            <LoadingList/>
                        }
                    </KeyboardAwareScrollView>
                </TouchableWithoutFeedback>
            </SafeAreaView>
            <EditAvatarSheet open={openChangePhoto} setOpen={setOpenChangePhoto}/>
        </>
    )
}


const EditAvatarSheet: FC<{
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
}> = ({open, setOpen}) => {
    const {t} = useTranslation();
    const mutationEditAvatar = useMutationEditAvatar();
    const mutationDeleteAvatar =  useMutationDeleteAvatar();
    const setLoading = useAppStore(state => state.setLoading);
    const {set} = useGetInfoUser();
    const errorHandle = useToastErrorHandler();
    const requestPermissionCamera = useRequestPermissionCamera();

    // Yêu cầu chọn ảnh
    const chooseImageFormLib = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                t('permission.picture_lib.title'),
                t('permission.picture_lib.message')
            );
            return false;
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.5,
                presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
            });
            if (!result.canceled) {
                const form = new FormData();
                form.append('file',{
                    uri: result.assets[0].uri,
                    name: "avatar.jpg",
                    type: "image/jpg"
                } as any);
                setLoading(true);
                mutationEditAvatar.mutate(form,{
                    onSuccess: (res) => {
                        setLoading(false);
                        set(res.data);
                        setOpen(false);
                    },
                    onError: (err) => {
                        setLoading(false);
                        errorHandle(err);
                    }
                });
            }
        }
    },[t]);

    // Xóa ảnh
    const deleteAvatar = useCallback(() => {
        setLoading(true);
        mutationDeleteAvatar.mutate(undefined, {
            onSuccess: (res) => {
                setLoading(false);
                set(res.data);
                setOpen(false);
            },
            onError: (err) => {
                setLoading(false);
                errorHandle(err);
            }
        });
    },[t])

    return (
        <Sheet
            forceRemoveScrollEnabled={true}
            modal={false}
            open={open}
            onOpenChange={setOpen}
            dismissOnSnapToBottom
            snapPointsMode={"fit"}
            zIndex={100_000}
            animation={"manual"}
        >
            <Sheet.Overlay animation="lazy" backgroundColor="$shadow6" enterStyle={{opacity: 0}}
                           exitStyle={{opacity: 0}}/>
            <Sheet.Handle/>
            <Sheet.Frame padding="$2" gap="$2" marginBottom={30}>
                {/*Chụp ảnh*/}
                <TouchableOpacity style={styles.btn_edit_photo} onPress={async () => {
                    await requestPermissionCamera('take-picture')
                }}>
                    <Typo weight={"700"}>{t('account.page.edit_info.take_photo')}</Typo>
                </TouchableOpacity>

                {/*Sử dụng thư viện*/}
                <TouchableOpacity style={styles.btn_edit_photo} onPress={() => {
                    chooseImageFormLib()
                }}>
                    <Typo weight={"700"}>{t('account.page.edit_info.choose_from_lib')}</Typo>
                </TouchableOpacity>

                {/*Xóa*/}
                <AlertFC
                    title={t('account.page.edit_info.delete_avatar_title')}
                    description={t('account.page.edit_info.delete_avatar_desc')}
                    trigger={() => (
                        <TouchableOpacity style={styles.btn_edit_photo}>
                            <Typo weight={"700"}>{t('common.delete')}</Typo>
                        </TouchableOpacity>
                    )}
                    onAccept={deleteAvatar}
                />

            </Sheet.Frame>
        </Sheet>
    )
}


const styles = StyleSheet.create({
    btn_edit_photo: {
        padding: 10,
        flex: 1
    }
});