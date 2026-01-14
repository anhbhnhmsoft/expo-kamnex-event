import Typo from "@/components/libs/Typo";
import { useTranslation } from "react-i18next";
import LayoutScrollApp from "@/components/libs/LayoutScrollApp";
import {
  Card,
  View,
  XStack,
  Image,
  YStack,
  Button,
  Separator,
  Sheet,
} from "tamagui";
import { DefaultSize } from "@/components/ui/defaultStyle";
import useLanguage from "@/services/app/hooks/useLanguage";
import { Linking, StyleSheet, TouchableOpacity } from "react-native";
import { _LanguageCode } from "@/utils/@types";
import useSyncLang from "@/services/auth/hooks/useSyncLang";
import DefaultColor from "@/components/ui/defaultColor";
import Empty from "@/components/libs/Empty";
import {
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Alert from "@/components/libs/Alert";
import { router } from "expo-router";
import useGetInfoUser from "@/services/auth/hooks/useGetInfoUser";
import useLogout from "@/services/auth/hooks/useLogout";
import { useGetUnreadCount } from "@/services/notifications/hooks/use-query-notification";
import useRequestPermissionCamera from "@/services/app/hooks/useRequestPermissionCamera";
import { useQueryGetSupportLink } from "@/services/auth/hooks/use-query";
import { FC, useState, Dispatch, SetStateAction, useCallback } from "react";
import { LinkSupportResponse } from "@/services/schedules/type";
import { useAppStore } from "@/services/app/stores/useAppStore";
import useToast from "@/services/app/hooks/useToast";
import { checkIOS } from "@/utils/helper";

export default function AccountScreen() {
  const { t } = useTranslation();
  const { user, get } = useGetInfoUser();
  const logout = useLogout();
  const { language } = useLanguage();
  const syncLang = useSyncLang();
  const { unread_count } = useGetUnreadCount();
  const [openSupportLink, setOpenSupportLink] = useState<boolean>(false);

  const requestPermission = useRequestPermissionCamera();

  const querySupportLink = useQueryGetSupportLink();

  const isIos = checkIOS();

  return (
    <>
      <LayoutScrollApp>
        {/*Header*/}
        <XStack
          alignItems={"center"}
          justifyContent={"space-between"}
          marginBottom={DefaultSize["3xl"]}
          gap={"$4"}
        >
          <Typo weight={"700"} fontSize={DefaultSize["4xl"]}>
            {t("common.account")}
          </Typo>
          <XStack gap={"$2"} alignItems={"center"}>
            <TouchableOpacity
              onPress={() => {
                syncLang(_LanguageCode.VI);
              }}
              style={[
                styles.lang_btn,
                {
                  borderColor:
                    language === _LanguageCode.VI
                      ? DefaultColor.primary_color
                      : "transparent",
                },
              ]}
              disabled={language === _LanguageCode.VI}
            >
              <Image
                source={require("@/assets/images/logo/vietnam.png")}
                style={styles.logo_lang_img}
                objectFit="cover"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                syncLang(_LanguageCode.EN);
              }}
              style={[
                styles.lang_btn,
                {
                  borderColor:
                    language === _LanguageCode.EN
                      ? DefaultColor.primary_color
                      : "transparent",
                },
              ]}
              disabled={language === _LanguageCode.EN}
            >
              <View>
                <Image
                  source={require("@/assets/images/logo/eng.png")}
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
          <Card
            marginBottom={24}
            padded
            backgroundColor={DefaultColor.white}
            position={"relative"}
            justifyContent={"space-between"}
            flexDirection={"row"}
          >
            {user ? (
              <>
                <XStack alignItems={"center"} gap={"$2"}>
                  {/*Avatar*/}
                  {user.avatar_url ? (
                    <Image
                      source={{ uri: user.avatar_url }}
                      width={70}
                      height={70}
                      borderRadius={70}
                      objectFit="cover"
                    />
                  ) : (
                    <View
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={70}
                      height={70}
                      borderRadius={70}
                      backgroundColor={DefaultColor.primary_color}
                    >
                      <Typo
                        color={DefaultColor.white}
                        fontSize={DefaultSize.xl}
                        textTransform={"uppercase"}
                        weight={"700"}
                      >
                        {user.name?.charAt(0)}
                      </Typo>
                    </View>
                  )}
                  <YStack>
                    <Typo
                      fontSize={DefaultSize.xl}
                      numberOfLines={1}
                      style={{ maxWidth: 200 }}
                      weight={"700"}
                    >
                      {user.name}
                    </Typo>
                    <Typo color={DefaultColor.slate[400]}>
                      {t("common.press_to_see_detail")}
                    </Typo>
                  </YStack>
                </XStack>
                <XStack position={"absolute"} top={10} right={10} gap={"$2"}>
                  <TouchableOpacity
                    onPress={() => {
                      get();
                    }}
                    style={[
                      styles.btn_icon_heading,
                      {
                        backgroundColor: DefaultColor.primary_color,
                      },
                    ]}
                  >
                    <FontAwesome
                      name="refresh"
                      size={16}
                      color={DefaultColor.white}
                    />
                  </TouchableOpacity>
                  {user.membership && (
                    <View
                      style={styles.btn_icon_heading}
                      backgroundColor={DefaultColor.green[500]}
                    >
                      <Typo
                        textTransform={"uppercase"}
                        color={DefaultColor.white}
                        fontSize={DefaultSize.xs}
                        weight={"700"}
                      >
                        {t("common.vip")}
                      </Typo>
                    </View>
                  )}
                </XStack>
              </>
            ) : (
              <Empty />
            )}
          </Card>
        </TouchableOpacity>

        {/*Membership register*/}
        {user && !user.membership && !isIos && (
          <Card
            alignItems={"center"}
            paddingHorizontal={38}
            marginBottom={24}
            paddingVertical={14}
            backgroundColor={DefaultColor.primary_color}
          >
            <YStack gap={"$1"} marginBottom={40}>
              <Typo
                textAlign={"center"}
                weight={"700"}
                color={DefaultColor.white}
                fontSize={DefaultSize.md}
              >
                {t("tab.page.account.register_membership_1")}
              </Typo>
              <Typo
                textAlign={"center"}
                weight={"700"}
                color={DefaultColor.white}
                fontSize={DefaultSize.md}
              >
                {t("tab.page.account.register_membership_2")}
              </Typo>
            </YStack>
            <Button
              onPress={() =>
                router.push("/(app)/(account)/membership/register-list")
              }
              size={"$3"}
              theme={"white"}
              backgroundColor={DefaultColor.white}
              paddingVertical={0}
            >
              <Typo weight={"500"}>{t("common.upgrade_now")}</Typo>
            </Button>
          </Card>
        )}

        {/*List action*/}
        <YStack marginBottom={16}>
          {/*info*/}
          <TouchableOpacity
            onPress={() => router.push("/(app)/(account)/edit-info")}
          >
            <XStack gap={"$3"} alignItems={"center"}>
              <View
                width={DefaultSize["3xl"]}
                height={DefaultSize["3xl"]}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <FontAwesome
                  name="user"
                  size={DefaultSize["3xl"]}
                  color={DefaultColor.primary_color}
                />
              </View>
              <Typo fontSize={DefaultSize.md} weight={"500"}>
                {t("tab.page.account.account_info")}
              </Typo>
            </XStack>
          </TouchableOpacity>
          <Separator
            marginVertical={15}
            borderColor={DefaultColor.slate[300]}
          />

          {/*QR scanner*/}
          <TouchableOpacity onPress={() => requestPermission("QR-scanner")}>
            <XStack gap={"$3"} alignItems={"center"}>
              <View
                width={DefaultSize["3xl"]}
                height={DefaultSize["3xl"]}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={DefaultSize["3xl"]}
                  color={DefaultColor.slate[500]}
                />
              </View>
              <Typo fontSize={DefaultSize.md} weight={"500"}>
                {t("tab.page.account.qr_scan")}
              </Typo>
            </XStack>
          </TouchableOpacity>
          <Separator
            marginVertical={15}
            borderColor={DefaultColor.slate[300]}
          />

          {/*Notification*/}
          <TouchableOpacity
            onPress={() => router.push("/(app)/(account)/notifications")}
          >
            <XStack
              gap={"$3"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <XStack gap={"$3"} alignItems={"center"}>
                <View
                  width={DefaultSize["3xl"]}
                  height={DefaultSize["3xl"]}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <FontAwesome
                    name="bell"
                    size={DefaultSize["3xl"]}
                    color={DefaultColor.red["600"]}
                  />
                </View>
                <Typo fontSize={DefaultSize.md} weight={"500"}>
                  {t("tab.page.account.manager_notification")}
                </Typo>
              </XStack>
              {unread_count > 0 && (
                <View
                  width={DefaultSize["3xl"]}
                  height={DefaultSize["3xl"]}
                  borderRadius={DefaultSize["3xl"]}
                  alignItems={"center"}
                  justifyContent={"center"}
                  backgroundColor={DefaultColor.primary_color}
                >
                  <Typo color={DefaultColor.white} weight={"500"}>
                    {unread_count}
                  </Typo>
                </View>
              )}
            </XStack>
          </TouchableOpacity>
          <Separator
            marginVertical={15}
            borderColor={DefaultColor.slate[300]}
          />

          {/*document*/}
          <TouchableOpacity
            onPress={() => router.push("/(app)/(account)/list-document")}
          >
            <XStack gap={"$3"} alignItems={"center"}>
              <View
                width={DefaultSize["3xl"]}
                height={DefaultSize["3xl"]}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <FontAwesome5
                  name="file"
                  size={DefaultSize["3xl"]}
                  color={DefaultColor.slate["600"]}
                />
              </View>
              <Typo fontSize={DefaultSize.md} weight={"500"}>
                {t("tab.page.account.manager_file")}
              </Typo>
            </XStack>
          </TouchableOpacity>
          <Separator
            marginVertical={15}
            borderColor={DefaultColor.slate[300]}
          />

          {/*Membership*/}
          {!isIos && (
            <YStack>
              <TouchableOpacity
                onPress={() => router.push("/(app)/(account)/membership/list")}
              >
                <XStack gap={"$3"} alignItems={"center"}>
                  <View
                    width={DefaultSize["3xl"]}
                    height={DefaultSize["3xl"]}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <FontAwesome5
                      name="ticket-alt"
                      size={DefaultSize["2xl"]}
                      color={DefaultColor.green["500"]}
                    />
                  </View>
                  <Typo fontSize={DefaultSize.md} weight={"500"}>
                    {t("tab.page.account.manager_membership")}
                  </Typo>
                </XStack>
              </TouchableOpacity>
              <Separator
                marginVertical={15}
                borderColor={DefaultColor.slate[300]}
              />
            </YStack>
          )}

          {/*Gift*/}
          <TouchableOpacity
            onPress={() => router.push("/(app)/(account)/gift")}
          >
            <XStack gap={"$3"} alignItems={"center"}>
              <View
                width={DefaultSize["3xl"]}
                height={DefaultSize["3xl"]}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <FontAwesome6
                  name="gift"
                  size={DefaultSize["2xl"]}
                  color={DefaultColor.red["700"]}
                />
              </View>
              <Typo fontSize={DefaultSize.md} weight={"500"}>
                {t("tab.page.account.manager_gift")}
              </Typo>
            </XStack>
          </TouchableOpacity>
          <Separator
            marginVertical={15}
            borderColor={DefaultColor.slate[300]}
          />

          {/*Support*/}
          <TouchableOpacity
            disabled={querySupportLink.isError || !querySupportLink.data}
            onPress={() => {
              setOpenSupportLink(true);
            }}
          >
            <XStack gap={"$3"} alignItems={"center"}>
              <View
                width={DefaultSize["3xl"]}
                height={DefaultSize["3xl"]}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <FontAwesome
                  name="envelope"
                  size={DefaultSize["2xl"]}
                  color={DefaultColor.blue["500"]}
                />
              </View>
              <Typo
                fontSize={DefaultSize.md}
                color={
                  querySupportLink.isError || !querySupportLink.data
                    ? DefaultColor.slate[300]
                    : DefaultColor.black
                }
                weight={"500"}
              >
                {t("tab.page.account.support")}
              </Typo>
            </XStack>
          </TouchableOpacity>
          <Separator
            marginVertical={15}
            borderColor={DefaultColor.slate[300]}
          />

          <Alert
            title={t("tab.page.account.title_logout")}
            description={t("tab.page.account.desc_logout")}
            trigger={() => (
              <TouchableOpacity>
                <XStack gap={"$3"} alignItems={"center"}>
                  <View
                    width={DefaultSize["3xl"]}
                    height={DefaultSize["3xl"]}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <FontAwesome
                      name="sign-out"
                      size={DefaultSize["2xl"]}
                      color={DefaultColor.red["500"]}
                    />
                  </View>
                  <Typo fontSize={DefaultSize.md} weight={"500"}>
                    {t("common.logout")}
                  </Typo>
                </XStack>
              </TouchableOpacity>
            )}
            onAccept={async () => {
              await logout();
            }}
          />
        </YStack>
      </LayoutScrollApp>
      <SupportLinkSheet
        open={openSupportLink}
        setOpen={setOpenSupportLink}
        data={querySupportLink.data}
      />
    </>
  );
}

const SupportLinkSheet: FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  data?: LinkSupportResponse["data"];
}> = ({ open, setOpen, data }) => {
  const { t } = useTranslation();
  const setLoading = useAppStore((state) => state.setLoading);
  const { error } = useToast();
  const openExternalLink = useCallback(
    async (url: string) => {
      setLoading(true);
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          error({ message: t("common_error.linking_not_support") });
        }
      } catch (_) {
        error({ message: t("common_error.linking_not_support") });
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  return (
    <Sheet
      forceRemoveScrollEnabled={true}
      modal={false}
      open={open}
      onOpenChange={setOpen}
      dismissOnSnapToBottom
      snapPointsMode={"fit"}
      zIndex={999_999}
      animation={"manual"}
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadow6"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame
        padding="$4"
        gap="$2"
        backgroundColor={DefaultColor.primary_bg}
      >
        <YStack>
          <TouchableOpacity
            onPress={async () => {
              if (data?.LINK_ZALO_SUPPORT) {
                await openExternalLink(data?.LINK_ZALO_SUPPORT);
              }
            }}
          >
            <XStack gap={"$2"} alignItems={"center"}>
              <Image
                source={require("@/assets/images/logo/zalo.png")}
                objectFit="cover"
                width={45}
                height={45}
              />
              <YStack gap={"$2"}>
                <Typo
                  fontSize={DefaultSize.md}
                  weight={"700"}
                  color={DefaultColor.primary_color}
                >
                  {t("tab.page.account.zalo_support")}
                </Typo>
                <Typo
                  fontSize={DefaultSize.base}
                  weight={"500"}
                  color={DefaultColor.slate[400]}
                >
                  {t("tab.page.account.zalo_support_desc")}
                </Typo>
              </YStack>
            </XStack>
          </TouchableOpacity>
          <Separator marginVertical={15} />
          <TouchableOpacity
            onPress={async () => {
              if (data?.LINK_FACEBOOK_SUPPORT) {
                await openExternalLink(data?.LINK_FACEBOOK_SUPPORT);
              }
            }}
          >
            <XStack gap={"$2"} alignItems={"center"}>
              <Image
                source={require("@/assets/images/logo/facebook.png")}
                objectFit="cover"
                width={45}
                height={45}
              />
              <YStack gap={"$2"}>
                <Typo
                  fontSize={DefaultSize.md}
                  weight={"700"}
                  color={DefaultColor.primary_color}
                >
                  {t("tab.page.account.facebook_support")}
                </Typo>
                <Typo
                  fontSize={DefaultSize.base}
                  weight={"500"}
                  color={DefaultColor.slate[400]}
                >
                  {t("tab.page.account.facebook_support_desc")}
                </Typo>
              </YStack>
            </XStack>
          </TouchableOpacity>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  lang_btn: {
    borderRadius: 7,
    borderWidth: 2,
  },
  logo_lang_img: {
    width: 50,
    height: 33,
    borderRadius: 5,
  },

  btn_icon_heading: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
  },
});
