// app/_layout.tsx
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { View, ActivityIndicator } from "react-native";
import { LightTheme, DarkTheme } from "@/constants/Theme";

function LayoutContent() {
  const { isLoading, theme } = useTheme();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme === "dark" ? DarkTheme.background : LightTheme.background
        }}
      >
        <ActivityIndicator size="large" color={theme === "dark" ? DarkTheme.primary : LightTheme.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme === "dark" ? DarkTheme.background : LightTheme.background, // 🔥 evita flash branco
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: {
            backgroundColor: theme === "dark" ? DarkTheme.background : LightTheme.background, // 🔥 garante transição suave
          },
        }}
      />
      <Toast />
    </View>
  );
}


export default function RootLayout() {
  return (
    <ThemeProvider>
      <LayoutContent />
    </ThemeProvider>
  );
}
