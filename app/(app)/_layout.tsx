// app/(app)/_layout.tsx
import { Tabs, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { LightTheme, DarkTheme } from "@/constants/Theme";
import { Ionicons } from "@expo/vector-icons";

function AppTabsContent() {
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
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor:
            theme === "dark"
              ? DarkTheme.primary
              : LightTheme.primary,
          tabBarStyle: {
            backgroundColor:
              theme === "dark"
                ? DarkTheme.card
                : LightTheme.card,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "index",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <Toast />
    </>
  );
}

export default function AppLayout() {
  return (
    <ThemeProvider>
      <AppTabsContent />
    </ThemeProvider>
  );
}
