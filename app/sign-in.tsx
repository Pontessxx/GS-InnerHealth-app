// app/sign-in.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // ✅ navegue para a Home dentro do grupo protegido:
      router.replace("/(app)");         // ou: router.replace("/(app)/index");
    } catch (err: any) {
      Alert.alert("Erro ao entrar", err?.message ?? "Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry
        value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/sign-up")}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
  button: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { color: "#007bff", marginTop: 15 }
});
