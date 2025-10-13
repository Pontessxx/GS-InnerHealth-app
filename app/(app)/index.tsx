// app/(app)/index.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { LightTheme, DarkTheme } from "@/constants/Theme";

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = theme === "light" ? LightTheme : DarkTheme;

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/sign-in");
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.title, { color: currentTheme.text }]}>Bem-vindo 🚀</Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: currentTheme.buttonExitBackground},
        ]}
        onPress={handleLogout}
      >
        <Text style={[styles.buttonText, { color: currentTheme.buttonText }]}>
          Sair
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
