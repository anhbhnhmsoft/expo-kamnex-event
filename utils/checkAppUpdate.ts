// utils/checkAppUpdate.ts
import * as Updates from "expo-updates";
import { Alert } from "react-native";

export const checkForAppUpdate = async () => {
  try {
    if (__DEV__) return;
    // Kiểm tra có update OTA không
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      // Tải update về
      await Updates.fetchUpdateAsync();

      // Reload app để áp dụng update
      await Updates.reloadAsync();
    }
  } catch (error) {
    Alert.alert(
      "Lỗi kiểm tra cập nhật",
      "Không thể kiểm tra cập nhật ứng dụng.",
    );
  }
};
