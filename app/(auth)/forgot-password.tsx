import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import Typo from "@/components/libs/Typo";
import { useTranslation } from "react-i18next";
import DefaultColor from "@/components/ui/defaultColor";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DefaultSize } from "@/components/ui/defaultStyle";
import { View, YStack, Button, Form, Label, Spinner } from "tamagui";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { Controller } from "react-hook-form";
import ChooseOrganizer from "@/components/page/ChooseOrganizer";
import { useForgotPasswordForm } from "@/services/auth/hooks";

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [openSelectOrg, setOpenSelectOrg] = useState<boolean>(false);
  const [labelOrg, setLabelOrg] = useState<string>(t("common.select"));

  // Lấy logic từ custom hook của bạn
  const { form, submit } = useForgotPasswordForm();
  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = form;

  const organizerId = watch("organizer_id");

  return (
    <>
      <SafeAreaView
        style={[styles.container, { paddingTop: insets.top }]}
        edges={["top", "bottom"]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            scrollEnabled={true}
            bounces={false}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
          >
            <View flex={1}>
              {/* Nút Back */}
              <TouchableOpacity
                style={styles.btn_close}
                onPress={() => router.back()}
              >
                <FontAwesome6
                  name="chevron-left"
                  size={DefaultSize["2xl"]}
                  color="black"
                />
              </TouchableOpacity>

              {/* Tiêu đề */}
              <View
                paddingHorizontal={DefaultSize["2xl"]}
                paddingTop={80}
                paddingBottom={54}
              >
                <Typo
                  weight={"700"}
                  color={DefaultColor.primary_color}
                  fontSize={DefaultSize["5xl"]}
                >
                  {t("auth.page.forgot_password.title")}
                </Typo>
                <Typo
                  weight={"500"}
                  color={DefaultColor.slate["500"]}
                  fontSize={DefaultSize["md"]}
                  marginTop={8}
                >
                  {t("auth.page.forgot_password.description")}
                </Typo>
              </View>

              {/* Form Nội dung */}
              <YStack
                flex={1}
                backgroundColor={DefaultColor.white}
                borderTopLeftRadius={50}
                borderTopRightRadius={50}
                paddingHorizontal={24}
                paddingTop={40}
                paddingBottom={insets.bottom + 10}
                gap={"$8"}
              >
                <Form gap={"$4"} onSubmit={submit}>
                  {/* Email hoặc Số điện thoại */}
                  <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View marginBottom={DefaultSize.base}>
                        <Typo
                          weight={"700"}
                          color={DefaultColor.primary_color}
                          fontSize={DefaultSize["md"]}
                        >
                          {t("common.email_or_phone")}
                        </Typo>
                        <TextInput
                          textContentType={"username"}
                          style={styles.input}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholderTextColor={DefaultColor.slate["300"]}
                          placeholder={t(
                            "auth.page.login.placeholder_username",
                          )}
                        />
                        {!!errors.username && (
                          <Label color="red" size="$2">
                            {errors.username.message}
                          </Label>
                        )}
                      </View>
                    )}
                  />

                  {/* Chọn Đơn vị (Organizer) */}
                  <Controller
                    control={control}
                    name="organizer_id"
                    render={() => (
                      <View marginBottom={DefaultSize.base}>
                        <Typo
                          weight={"700"}
                          style={{
                            color: DefaultColor.primary_color,
                            fontSize: DefaultSize.md,
                          }}
                        >
                          {t("auth.page.register.choose_org")}
                        </Typo>
                        <TouchableOpacity
                          style={styles.btn_select_org}
                          onPress={() => setOpenSelectOrg(true)}
                        >
                          <Typo numberOfLines={1}>{labelOrg}</Typo>
                          <View position={"absolute"} top={10} right={10}>
                            <FontAwesome
                              name="chevron-down"
                              size={DefaultSize.base}
                              color={DefaultColor.slate["300"]}
                            />
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
                  {/* Nút Gửi yêu cầu */}
                  <Form.Trigger asChild disabled={isSubmitting}>
                    <Button
                      marginTop={DefaultSize.xl}
                      borderRadius={DefaultSize["4xl"]}
                      backgroundColor={DefaultColor.primary_color}
                      icon={isSubmitting ? () => <Spinner /> : undefined}
                    >
                      <Typo
                        textTransform={"uppercase"}
                        color={DefaultColor.white}
                        weight={"700"}
                      >
                        {t("common.verify")}
                      </Typo>
                    </Button>
                  </Form.Trigger>
                </Form>
              </YStack>
            </View>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>

      {/* Modal chọn đơn vị */}
      <ChooseOrganizer
        open={openSelectOrg}
        setOpen={setOpenSelectOrg}
        onChange={(value) => {
          setLabelOrg(value.label);
          setValue("organizer_id", value.item.toString()); // Đảm bảo là string cho validation
        }}
        value={organizerId}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn_close: {
    position: "absolute",
    top: DefaultSize["base"],
    left: DefaultSize["base"],
    padding: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: DefaultColor.slate["200"],
    paddingVertical: 10,
    paddingHorizontal: 2,
    fontSize: DefaultSize.md,
  },
  btn_select_org: {
    marginTop: DefaultSize.base,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: DefaultSize.base,
    borderColor: DefaultColor.slate["300"],
    paddingHorizontal: 15,
    position: "relative",
  },
});
