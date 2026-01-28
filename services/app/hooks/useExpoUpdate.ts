// hooks/useExpoUpdate.ts
import { Alert } from "react-native";
import * as Updates from "expo-updates";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const useExpoUpdate = () => {
  const { t } = useTranslation();
  const checkUpdate = async () => {
    try {
      if (__DEV__) {
        return;
      }

      const update = await Updates.checkForUpdateAsync();

      if (!update.isAvailable) {
        return;
      }

      Alert.alert(t("common.update.title"), t("common.update.message"), [
        { text: t("common.update.cancel"), style: "cancel" },
        {
          text: t("common.update.confirm"),
          onPress: async () => {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          },
        },
      ]);
    } catch (error) {
      console.log("Lỗi kiểm tra cập nhật:", error);
    }
  };

  return {
    checkUpdate,
  };
};
