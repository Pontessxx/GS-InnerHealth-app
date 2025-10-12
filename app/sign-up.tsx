// app/sign-up.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("Sucesso", "Conta criada!");
      router.replace("/sign-in");
    } catch (err: any) {
      Alert.alert("Erro ao cadastrar", err?.code === "auth/email-already-in-use"
        ? "E-mail já cadastrado."
        : err?.message ?? "Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha (mín. 6)" secureTextEntry
        value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/sign-in")}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
  button: { backgroundColor: "#28a745", padding: 12, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { color: "#007bff", marginTop: 15 }
});
