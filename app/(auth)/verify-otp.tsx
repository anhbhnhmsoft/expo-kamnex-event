import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Form, Label, Spinner, View, YStack, XStack } from "tamagui";
import {router, useLocalSearchParams} from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { DefaultSize } from "@/components/ui/defaultStyle";
import Typo from "@/components/libs/Typo";
import DefaultColor from "@/components/ui/defaultColor";
import { Controller } from "react-hook-form";
import { CodeField, Cursor, useClearByFocusCell } from 'react-native-confirmation-code-field';
import {CELL_COUNT, formatTime, useVerifyForm} from "@/services/auth/hooks/useVerifyForm";


export default function VerifyOTPScreen() {
    const { username, organizer_id , type } = useLocalSearchParams<{
        username: string;
        organizer_id: string;
        type : string;
    }>();
    const insets = useSafeAreaInsets();
    const {
        control, handleSubmit, setValue, otpValue, errors,
        isSubmitting, isPending, timer, isCanResend, onResendOTP, t
    } = useVerifyForm({
        username,
        organizer_id: organizer_id ? Number(organizer_id) : undefined,
        type
    });

    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: otpValue,
        setValue: (val) => setValue('otp', val),
    });

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={['top', 'bottom']}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid bounces={false}>
                    <View flex={1}>
                        <TouchableOpacity style={styles.btn_close} onPress={() => router.back()}>
                            <FontAwesome6 name="chevron-left" size={DefaultSize["2xl"]} color="black" />
                        </TouchableOpacity>

                        <View paddingHorizontal={DefaultSize["2xl"]} paddingTop={80} paddingBottom={54}>
                            <Typo weight={"700"} color={DefaultColor.primary_color} fontSize={DefaultSize["5xl"]}>
                                {t('auth.page.verify.title')}
                            </Typo>
                            <Typo weight={"500"} color={DefaultColor.slate["500"]} fontSize={DefaultSize["md"]} marginTop={10}>
                                {t('auth.page.verify.subtitle')}
                            </Typo>
                        </View>

                        <YStack flex={1} backgroundColor={DefaultColor.white} borderTopLeftRadius={50} borderTopRightRadius={50}
                                paddingHorizontal={24} paddingTop={50} paddingBottom={insets.bottom + 20} gap={"$8"}>
                            <Form onSubmit={handleSubmit}>
                                <Controller
                                    control={control}
                                    name="otp"
                                    render={({ field: { onChange, value } }) => (
                                        <View>
                                            <CodeField
                                                {...props}
                                                value={value}
                                                onChangeText={onChange}
                                                cellCount={CELL_COUNT}
                                                rootStyle={styles.codeFieldRoot}
                                                keyboardType="number-pad"
                                                renderCell={({ index, symbol, isFocused }) => (
                                                    <View key={index} style={[styles.cell, isFocused && styles.focusCell]} onLayout={getCellOnLayoutHandler(index)}>
                                                        <Typo fontSize={24} weight="700" color={isFocused ? DefaultColor.primary_color : "black"}>
                                                            {symbol || (isFocused ? <Cursor /> : null)}
                                                        </Typo>
                                                    </View>
                                                )}
                                            />
                                            {!!errors.otp && <Label color="red" size="$2" textAlign="center" marginTop={10}>{errors.otp.message}</Label>}
                                        </View>
                                    )}
                                />

                                <View marginTop={40}>
                                    <Form.Trigger asChild>
                                        <Button borderRadius={DefaultSize["4xl"]} backgroundColor={DefaultColor.primary_color}
                                                disabled={isSubmitting || isPending}
                                                icon={isSubmitting || isPending ? () => <Spinner /> : undefined}>
                                            <Typo textTransform={"uppercase"} color={DefaultColor.white} weight={"700"}>{t('common.verify')}</Typo>
                                        </Button>
                                    </Form.Trigger>
                                </View>
                            </Form>

                            <YStack alignItems="center" gap="$3">
                                <Typo color={DefaultColor.slate["500"]}>{t('auth.page.verify.not_receive_code')}</Typo>
                                {isCanResend ? (
                                    <TouchableOpacity onPress={onResendOTP}>
                                        <Typo color={DefaultColor.primary_color} weight="700">{t('auth.page.verify.resend_now')}</Typo>
                                    </TouchableOpacity>
                                ) : (
                                    <XStack gap="$1">
                                        <Typo color={DefaultColor.slate["400"]}>{t('auth.page.verify.resend_in')}</Typo>
                                        <Typo color={DefaultColor.primary_color} weight="700">{formatTime(timer)}</Typo>
                                    </XStack>
                                )}
                            </YStack>
                        </YStack>
                    </View>
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    btn_close: { position: "absolute", top: DefaultSize["base"], left: DefaultSize["base"], padding: 10 },
    codeFieldRoot: { marginTop: 20, width: '100%', justifyContent: 'center', gap: 10 },
    cell: { width: 45, height: 55, borderBottomWidth: 2, borderColor: DefaultColor.slate["200"], alignItems: 'center', justifyContent: 'center' },
    focusCell: { borderColor: DefaultColor.primary_color, borderBottomWidth: 3 },
});