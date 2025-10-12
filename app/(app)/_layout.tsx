// app/(app)/_layout.tsx
import { Stack, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
