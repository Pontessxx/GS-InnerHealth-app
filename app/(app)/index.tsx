// app/(app)/index.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/sign-in");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo 🚀</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: "600" },
  button: { backgroundColor: "#dc3545", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" }
});
