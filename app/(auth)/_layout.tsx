import { SafeAreaProvider } from "react-native-safe-area-context";
import FocusAwareStatusBar from "@/components/libs/FocusAwareStatusBar";
import { Stack } from "expo-router";
import DefaultColor from "@/components/ui/defaultColor";

export default function AuthLayout() {
  return (
    <SafeAreaProvider>
      <FocusAwareStatusBar hidden />
      <Stack
        initialRouteName="index"
        screenOptions={{
          contentStyle: { backgroundColor: DefaultColor.primary_bg },
          animation: "fade",
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="verify-otp" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </SafeAreaProvider>
  );
}
