// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { View, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { LightTheme, DarkTheme } from "@/constants/Theme";

function AuthLayoutContent() {
  const { isLoading, theme } = useTheme();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            theme === "dark"
              ? DarkTheme.background
              : LightTheme.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={
            theme === "dark"
              ? DarkTheme.primary
              : LightTheme.primary
          }
        />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      />
      <Toast />
    </>
  );
}

export default function AuthLayout() {
  return (
    <ThemeProvider>
      <AuthLayoutContent />
    </ThemeProvider>
  );
}
