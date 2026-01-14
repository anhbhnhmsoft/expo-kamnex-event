import { useQueryDetailScheduler } from "@/services/schedules/hooks/use-query-schedule";
import { router, useLocalSearchParams } from "expo-router";
import LayoutScrollApp from "@/components/libs/LayoutScrollApp";
import Typo from "@/components/libs/Typo";
import LoadingList from "@/components/libs/LoadingList";
import {
  Button,
  Card,
  useWindowDimensions,
  View,
  YStack,
  Sheet,
} from "tamagui";
import { DefaultSize } from "@/components/ui/defaultStyle";
import DefaultColor from "@/components/ui/defaultColor";
import { useEffect, useState } from "react";
import { useAppStore } from "@/services/app/stores/useAppStore";
import RenderHtml from "react-native-render-html";
import { useTranslation } from "react-i18next";
import Empty from "@/components/libs/Empty";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import { useMutateRegisterDocument } from "@/services/event/hooks/use-mutate-event";
import { useStoreTransactionDocument } from "@/services/event/stores/useStoreTransactionDocument";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import useAuthStore from "@/services/auth/stores/useAuthStore";
import { checkIOS, checkMembershipConfig } from "@/utils/helper";
import { _ConfigMembership } from "@/services/membership/const";

export default function DetailScheduleScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { schedule, loading } = useQueryDetailScheduler(id);
  const { width } = useWindowDimensions();
  const setLoading = useAppStore((s) => s.setLoading);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const handleError = useToastErrorHandler();
  const user = useAuthStore((s) => s.user);
  const registerDocumentMutation = useMutateRegisterDocument();
  const setTrans = useStoreTransactionDocument((s) => s.setTrans);
  const isIos = checkIOS();
  useEffect(() => {
    setLoading(loading);
  }, [loading]);
  const checkMember = checkMembershipConfig(
    user,
    _ConfigMembership.ALLOW_DOCUMENTARY
  );
  const check = isIos ? checkMember && isIos : true;
  return (
    <LayoutScrollApp paddedTop={false}>
      {schedule ? (
        <YStack gap={"$4"} flex={1}>
          <Typo
            weight={"700"}
            textAlign={"center"}
            color={DefaultColor.primary_color}
            fontSize={DefaultSize["3xl"]}
          >
            {schedule.title}
          </Typo>
          <Typo
            weight={"700"}
            textAlign={"center"}
            color={DefaultColor.slate[500]}
            fontSize={DefaultSize.md}
          >
            {schedule.start_time} - {schedule.end_time}
          </Typo>
          <RenderHtml
            source={{ html: schedule.description }}
            contentWidth={width}
          />
          {/*Tài liệu*/}
          <YStack marginTop={10} gap={"$4"}>
            <Typo
              weight={"700"}
              color={DefaultColor.primary_color}
              fontSize={DefaultSize["xl"]}
            >
              {t("common.document")}
            </Typo>
            {check ? (
              <View>
                {schedule.documents &&
                Array.isArray(schedule.documents) &&
                schedule.documents.length > 0 ? (
                  schedule.documents.map((document) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (document.allowDocument) {
                          router.push(
                            `/(app)/(event)/detail-document?id=${document.id}`
                          );
                        } else {
                          setSelectedDocumentId(document.id);
                          setShowModal(true);
                        }
                      }}
                      key={document.id}
                      style={{ marginBottom: 8 }}
                      activeOpacity={0.7}
                    >
                      <Card
                        backgroundColor={DefaultColor.slate[100]}
                        padded
                        flexDirection={"row"}
                        alignItems={"center"}
                        gap={"$3"}
                      >
                        <FontAwesome
                          name="file-text-o"
                          size={24}
                          color="black"
                        />
                        <YStack>
                          <View flex={1}>
                            <Typo
                              weight={"700"}
                              fontSize={DefaultSize.base}
                              numberOfLines={2}
                              ellipsizeMode="tail"
                            >
                              {document.title}
                            </Typo>
                            {!document.allowDocument && (
                              <>
                                <Typo>
                                  {t("common.price")}:{" "}
                                  {Number(document.price).toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  VND
                                </Typo>
                              </>
                            )}
                          </View>
                        </YStack>
                      </Card>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Empty />
                )}
              </View>
            ) : (
              <View>
                <YStack gap="$4" alignItems="center">
                  <View
                    width={50}
                    height={50}
                    borderRadius={25}
                    backgroundColor={DefaultColor.primary_color}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FontAwesome
                      name="lock"
                      size={24}
                      color={DefaultColor.white}
                    />
                  </View>

                  <Typo
                    weight="700"
                    fontSize={DefaultSize.xl}
                    textAlign="center"
                  >
                    {t("event.page.detail.membership_feature_title")}
                  </Typo>
                  <Typo
                    weight="600"
                    fontSize={DefaultSize.base}
                    textAlign="center"
                  >
                    {t(
                      "event.page.detail.register_membership_to_document_desc"
                    )}
                  </Typo>
                </YStack>
              </View>
            )}
          </YStack>
        </YStack>
      ) : (
        <YStack gap={"$2"}>
          <LoadingList />
          <LoadingList />
        </YStack>
      )}

      <Sheet
        modal
        open={showModal}
        onOpenChange={setShowModal}
        snapPointsMode={"fit"}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay
          backgroundColor="rgba(0,0,0,0.5)"
          onPress={() => setShowModal(false)}
        />
        <Sheet.Handle />
        <Sheet.Frame
          padding="$6"
          gap="$4"
          backgroundColor={DefaultColor.white}
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
        >
          <YStack gap="$4" alignItems="center">
            <View
              width={50}
              height={50}
              borderRadius={25}
              backgroundColor={DefaultColor.primary_color}
              alignItems="center"
              justifyContent="center"
            >
              <FontAwesome name="lock" size={24} color={DefaultColor.white} />
            </View>

            <YStack gap="$2" alignItems="center">
              <Typo
                weight="700"
                fontSize={DefaultSize.xl}
                textAlign="center"
                color={DefaultColor.primary_color}
              >
                {t("event.page.detail.register_membership_to_document")}
              </Typo>
              <Typo
                fontSize={DefaultSize.base}
                textAlign="center"
                color={DefaultColor.slate[600]}
              >
                {t(
                  "event.page.detail.please_register_membership_or_buy_document_to_access"
                )}
              </Typo>
            </YStack>

            <YStack gap="$3" width="100%">
              <Button
                size="$4"
                paddingHorizontal={DefaultSize["5xl"]}
                paddingVertical={DefaultSize.sm}
                borderRadius={DefaultSize["4xl"]}
                color={DefaultColor.white}
                theme="blue"
                backgroundColor={DefaultColor.primary_color}
                onPress={() => {
                  setShowModal(false);
                  router.push("/(app)/(account)/membership/register-list");
                }}
              >
                <Typo
                  color={DefaultColor.white}
                  fontSize={DefaultSize.base}
                  weight="700"
                >
                  {t("common.register_now")}
                </Typo>
              </Button>

              <Button
                size="$3"
                paddingHorizontal={DefaultSize["5xl"]}
                paddingVertical={0}
                borderRadius={DefaultSize["4xl"]}
                color={DefaultColor.black}
                theme="blue"
                backgroundColor={DefaultColor.white}
                borderWidth={1}
                borderColor={DefaultColor.black}
                onPress={async () => {
                  if (selectedDocumentId) {
                    setLoading(true);
                    registerDocumentMutation.mutate(
                      {
                        document_id: selectedDocumentId,
                      },
                      {
                        onSuccess: (response) => {
                          setTrans(response.data);
                          setShowModal(false);
                          setLoading(false);
                          router.push("/(app)/(event)/check-document-payment");
                        },
                        onError: (error) => {
                          setShowModal(false);
                          handleError(error);
                          setLoading(false);
                        },
                      }
                    );
                  }
                }}
                disabled={registerDocumentMutation.isPending}
              >
                <Typo color={DefaultColor.black} fontSize={DefaultSize.base}>
                  {t("common.buy_document")}
                </Typo>
              </Button>

              <Button
                size="$4"
                paddingHorizontal={DefaultSize["5xl"]}
                paddingVertical={DefaultSize.sm}
                borderRadius={DefaultSize["4xl"]}
                color={DefaultColor.slate[600]}
                theme="blue"
                backgroundColor={DefaultColor.slate[200]}
                onPress={() => setShowModal(false)}
              >
                <Typo
                  color={DefaultColor.slate[600]}
                  fontSize={DefaultSize.base}
                >
                  {t("common.cancel")}
                </Typo>
              </Button>
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </LayoutScrollApp>
  );
}
