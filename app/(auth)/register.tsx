import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";
import {useCallback, useState} from "react";
import {Keyboard, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Button, Form, Label, Spinner, View, YStack} from "tamagui";
import {router} from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {DefaultSize} from "@/components/ui/defaultStyle";
import Typo from "@/components/libs/Typo";
import DefaultColor from "@/components/ui/defaultColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ChooseOrganizer from "@/components/page/ChooseOrganizer";
import useFormRegister from "@/services/auth/hooks/useFormRegister";
import {RegisterRequest} from "@/services/auth/types";
import {Controller} from "react-hook-form";
import {useMutationRegister} from "@/services/auth/hooks/useMutationAuth";
import {useAppStore} from "@/services/app/stores/useAppStore";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import useToast from "@/services/app/hooks/useToast";

export default function RegisterScreen() {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [openSelectOrg, setOpenSelectOrg] = useState<boolean>(false);
    const [labelOrg, setLabelOrg] = useState<string>(t('common.select'));

    const {control, handleSubmit, formState: {errors, isSubmitting}, setValue, watch} = useFormRegister();
    const organizerId = watch('organizer_id');

    const {mutate, isPending} = useMutationRegister();
    const handleError = useToastErrorHandler();
    const {success} = useToast();

    const lang = useAppStore(s => s.language);

    const onSubmit = useCallback((data: RegisterRequest) => {
        data.locate = lang;
        mutate(data, {
            onError: (error) => {
                handleError(error);
            },
            onSuccess: (res) => {
                success({message: res.message});
                router.replace('/(auth)/login')
            }
        });
    },[lang]);

    return (
        <>
            <SafeAreaView style={[styles.container, {paddingTop: insets.top}]} edges={['top', 'bottom']}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAwareScrollView
                        style={{flex: 1}}
                        contentContainerStyle={{flexGrow: 1}}
                        enableOnAndroid={true}
                        scrollEnabled={true}
                    >
                        <View flex={1}>
                            <TouchableOpacity
                                style={styles.btn_close}
                                onPress={() => router.replace("/(auth)")}
                            >
                                <FontAwesome6 name="xmark" size={DefaultSize["5xl"]} color="black"/>
                            </TouchableOpacity>

                            <View paddingHorizontal={DefaultSize["2xl"]} paddingTop={80} paddingBottom={54}>
                                <Typo weight={"700"} color={DefaultColor.primary_color} fontSize={DefaultSize["5xl"]}>
                                    {t('auth.page.register.title_1')}
                                </Typo>
                                <Typo weight={"700"} color={DefaultColor.primary_color} fontSize={DefaultSize["2xl"]}>
                                    {t('auth.page.register.title_2')}
                                </Typo>
                            </View>
                            <YStack flex={1}
                                    backgroundColor={DefaultColor.white}
                                    borderTopLeftRadius={50}
                                    borderTopRightRadius={50}
                                    paddingHorizontal={24}
                                    paddingTop={40}
                                    paddingBottom={insets.bottom + 10}
                                    justifyContent={"space-between"}
                                    gap={"$8"}
                            >
                                <Form gap={"$2"} onSubmit={handleSubmit(onSubmit)}>
                                    {/*name*/}
                                    <Controller
                                        control={control}
                                        name="name"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <View marginBottom={DefaultSize.base}>
                                                <Typo weight={"700"} color={DefaultColor.primary_color}
                                                      fontSize={DefaultSize["md"]}>
                                                    {t('common.full_name')}
                                                </Typo>
                                                <TextInput
                                                    textContentType={"name"}
                                                    style={styles.input}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    placeholderTextColor={DefaultColor.slate["300"]}
                                                    placeholder={"Abraham Frank"}
                                                />
                                                {!!errors.name && (
                                                    <Label color="red" size="$2">
                                                        {errors.name.message}
                                                    </Label>
                                                )}
                                            </View>
                                        )}
                                    />
                                    {/*Email*/}
                                    <Controller
                                        control={control}
                                        name="email"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <View marginBottom={DefaultSize.base}>
                                                <Typo weight={"700"} color={DefaultColor.primary_color}
                                                      fontSize={DefaultSize["md"]}>
                                                    {t('common.email')}
                                                </Typo>
                                                <TextInput
                                                    textContentType={"emailAddress"}
                                                    style={styles.input}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    placeholderTextColor={DefaultColor.slate["300"]}
                                                    placeholder={"demo@gmail.com"}
                                                />
                                                {!!errors.email && (
                                                    <Label color="red" size="$2">
                                                        {errors.email.message}
                                                    </Label>
                                                )}
                                            </View>
                                        )}
                                    />
                                    {/*password*/}
                                    <Controller
                                        control={control}
                                        name="password"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <View marginBottom={DefaultSize.base}>
                                                <Typo weight={"700"}
                                                      style={{color: DefaultColor.primary_color, fontSize: DefaultSize.md,}}>
                                                    {t('common.password')}
                                                </Typo>
                                                <View position={"relative"}>
                                                    <TextInput
                                                        textContentType={"password"}
                                                        style={styles.input}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                        placeholderTextColor={DefaultColor.slate["300"]}
                                                        placeholder={"......................."}
                                                        secureTextEntry={!showPassword}
                                                    />
                                                    <TouchableOpacity
                                                        style={styles.btn_absolute}
                                                        activeOpacity={0.8}
                                                        onPress={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ?
                                                            <FontAwesome name="unlock" size={DefaultSize["2xl"]}
                                                                         color={DefaultColor.slate["400"]}/>
                                                            :
                                                            <FontAwesome name="lock" size={DefaultSize["2xl"]}
                                                                         color={DefaultColor.slate["400"]}/>}
                                                    </TouchableOpacity>
                                                </View>
                                                {!!errors.password && (
                                                    <Label color="red" size="$2">
                                                        {errors.password.message}
                                                    </Label>
                                                )}
                                            </View>
                                        )}
                                    />
                                    {/*conf_password*/}
                                    <Controller
                                        control={control}
                                        name="confirm_password"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <View marginBottom={DefaultSize.base}>
                                                <Typo weight={"700"}
                                                      style={{color: DefaultColor.primary_color, fontSize: DefaultSize.md,}}>
                                                    {t('common.re_password')}
                                                </Typo>
                                                <View position={"relative"}>
                                                    <TextInput
                                                        textContentType={"password"}
                                                        style={styles.input}
                                                        placeholderTextColor={DefaultColor.slate["300"]}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                        placeholder={"......................."}
                                                        secureTextEntry={!showPassword}
                                                    />
                                                    <TouchableOpacity
                                                        style={styles.btn_absolute}
                                                        activeOpacity={0.8}
                                                        onPress={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ?
                                                            <FontAwesome name="unlock" size={DefaultSize["2xl"]}
                                                                         color={DefaultColor.slate["400"]}/>
                                                            :
                                                            <FontAwesome name="lock" size={DefaultSize["2xl"]}
                                                                         color={DefaultColor.slate["400"]}/>}
                                                    </TouchableOpacity>
                                                </View>
                                                {!!errors.confirm_password && (
                                                    <Label color="red" size="$2">
                                                        {errors.confirm_password.message}
                                                    </Label>
                                                )}
                                            </View>
                                        )}
                                    />

                                    {/*organizer_id*/}
                                    <Controller
                                        control={control}
                                        name="organizer_id"
                                        render={() => (
                                            <View marginBottom={DefaultSize.base}>
                                                <Typo weight={"700"}
                                                      style={{color: DefaultColor.primary_color, fontSize: DefaultSize.md,}}>
                                                    {t('auth.page.register.choose_org')}
                                                </Typo>
                                                <TouchableOpacity style={styles.btn_select_org}
                                                                  onPress={() => setOpenSelectOrg(true)}>
                                                    <Typo numberOfLines={1}>{labelOrg}</Typo>
                                                    <View position={"absolute"} top={10} right={10}>
                                                        <FontAwesome name="chevron-down" size={DefaultSize.base}
                                                                     color={DefaultColor.slate["300"]}/>
                                                    </View>
                                                </TouchableOpacity>
                                                {!!errors.organizer_id && (
                                                    <Label color="red" size="$2">
                                                        {errors.organizer_id.message}
                                                    </Label>
                                                )}
                                            </View>
                                        )}
                                    />

                                    <Form.Trigger asChild disabled={isSubmitting || isPending}>
                                        <Button marginTop={DefaultSize.md} borderRadius={DefaultSize["4xl"]} theme={"blue"}
                                                backgroundColor={DefaultColor.primary_color}
                                                icon={isSubmitting || isPending ? () => <Spinner /> : undefined}
                                        >
                                            <Typo textTransform={"uppercase"} color={DefaultColor.white} weight={"700"}>
                                                {t('common.register')}
                                            </Typo>
                                        </Button>
                                    </Form.Trigger>
                                </Form>
                                <YStack gap={"$2"} alignItems={"flex-end"}>
                                    <Typo>{t('auth.page.register.have_account')}</Typo>
                                    <TouchableOpacity
                                        onPress={() => router.replace("/(auth)/login")}
                                    >
                                        <Typo fontSize={DefaultSize["4xl"]} color={DefaultColor.primary_color}
                                              weight={"700"} textTransform={"uppercase"}>{t('common.login')}</Typo>
                                    </TouchableOpacity>
                                </YStack>
                            </YStack>
                        </View>
                    </KeyboardAwareScrollView>
                </TouchableWithoutFeedback>
            </SafeAreaView>
            <ChooseOrganizer
                open={openSelectOrg}
                setOpen={setOpenSelectOrg}
                onChange={(value) => {
                    setLabelOrg(value.label);
                    setValue('organizer_id', value.item);
                }}
                value={organizerId}/>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        height: "100%",
    },
    btn_close: {
        position: "absolute",
        top: DefaultSize["base"],
        right: DefaultSize["base"],
    },
    input: {
        borderBottomWidth: 1,
        borderColor: DefaultColor.slate["200"],
        paddingVertical: 10,
        paddingHorizontal: 2
    },
    btn_absolute: {
        position: "absolute",
        right: 0,
        top: "50%",
        padding: 10,
        transform: [{
            translateY: "-50%"
        }]
    },
    btn_select_org: {
        marginTop: DefaultSize.base,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: DefaultSize.base,
        borderColor: DefaultColor.slate["300"],
        paddingHorizontal: 15,
        position: "relative"
    },
});