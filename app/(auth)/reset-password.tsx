import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from "react-native";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, useLocalSearchParams } from "expo-router";
import Typo from "@/components/libs/Typo";
import { useTranslation } from "react-i18next";
import DefaultColor from "@/components/ui/defaultColor";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DefaultSize } from "@/components/ui/defaultStyle";
import { View, YStack, Button, Form, Label, Spinner } from "tamagui";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useResetPasswordForm } from "@/services/auth/hooks";

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const { reset_token } = useLocalSearchParams<{ reset_token: string }>();

  // Logic ẩn/hiện mật khẩu cho 2 trường riêng biệt
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const { form, submit } = useResetPasswordForm(reset_token);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = form;

  return (
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
            {/* Nút X thoát giống Login */}
            <TouchableOpacity
              style={styles.btn_close}
              onPress={() => router.back()}
            >
              <FontAwesome6
                name="xmark"
                size={DefaultSize["5xl"]}
                color="black"
              />
            </TouchableOpacity>

            {/* Header Tiêu đề giống Login */}
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
                {t("auth.page.reset_password.title")}
              </Typo>
              <Typo
                weight={"700"}
                color={DefaultColor.primary_color}
                fontSize={DefaultSize["2xl"]}
              >
                {t("auth.page.reset_password.subtitle")}
              </Typo>
            </View>

            {/* Body Form bo góc giống Login */}
            <YStack
              flex={1}
              backgroundColor={DefaultColor.white}
              borderTopLeftRadius={50}
              borderTopRightRadius={50}
              paddingHorizontal={24}
              paddingTop={40}
              paddingBottom={insets.bottom + 10}
              justifyContent={"space-between"}
              gap={"$8"}
            >
              <Form gap={"$2"} onSubmit={handleSubmit(submit)}>
                {/* Trường Mật khẩu mới */}
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View marginBottom={DefaultSize.base}>
                      <Typo
                        weight={"700"}
                        color={DefaultColor.primary_color}
                        fontSize={DefaultSize["md"]}
                      >
                        {t("auth.page.reset_password.new_password")}
                      </Typo>
                      <View position={"relative"}>
                        <TextInput
                          textContentType="password"
                          secureTextEntry={!showPassword}
                          style={[
                            styles.input,
                            { color: DefaultColor.slate["900"] },
                          ]}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="••••••••••••"
                          placeholderTextColor={
                            isDark
                              ? DefaultColor.slate["400"]
                              : DefaultColor.slate["300"]
                          }
                        />
                        <TouchableOpacity
                          style={styles.btn_password}
                          activeOpacity={0.8}
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          <FontAwesome
                            name={showPassword ? "unlock" : "lock"}
                            size={DefaultSize["2xl"]}
                            color={DefaultColor.slate["400"]}
                          />
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

                {/* Trường Xác nhận mật khẩu */}
                <Controller
                  control={control}
                  name="confirm_password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View marginBottom={DefaultSize.base}>
                      <Typo
                        weight={"700"}
                        color={DefaultColor.primary_color}
                        fontSize={DefaultSize["md"]}
                      >
                        {t("auth.page.reset_password.confirm_password")}
                      </Typo>
                      <View position={"relative"}>
                        <TextInput
                          textContentType="password"
                          secureTextEntry={!showConfirmPassword}
                          style={[
                            styles.input,
                            { color: DefaultColor.slate["900"] },
                          ]}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="••••••••••••"
                          placeholderTextColor={
                            isDark
                              ? DefaultColor.slate["400"]
                              : DefaultColor.slate["300"]
                          }
                        />
                        <TouchableOpacity
                          style={styles.btn_password}
                          activeOpacity={0.8}
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          <FontAwesome
                            name={showConfirmPassword ? "unlock" : "lock"}
                            size={DefaultSize["2xl"]}
                            color={DefaultColor.slate["400"]}
                          />
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

                <Form.Trigger asChild disabled={isSubmitting}>
                  <Button
                    marginTop={DefaultSize.md}
                    borderRadius={DefaultSize["4xl"]}
                    theme={"blue"}
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

              {/* View trống phía dưới để giữ cấu trúc Space-between giống Login */}
              <View height={20} />
            </YStack>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    height: "100%",
  },
  btn_close: {
    position: "absolute",
    top: DefaultSize["base"],
    right: DefaultSize["base"],
    zIndex: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: DefaultColor.slate["200"],
    paddingVertical: 10,
    paddingHorizontal: 2,
    paddingRight: 45, // Chừa chỗ cho icon mắt
  },
  btn_password: {
    position: "absolute",
    right: 0,
    top: "50%",
    padding: 10,
    transform: [
      {
        translateY: "-50%",
      },
    ],
  },
});
