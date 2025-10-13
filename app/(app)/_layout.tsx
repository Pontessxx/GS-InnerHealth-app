// app/(app)/_layout.tsx
import { Stack, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { LightTheme, DarkTheme } from "@/constants/Theme";

export default function AppLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/sign-in");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
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
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      />
      <Toast />
    </ThemeProvider>
  );
}
