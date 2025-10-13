import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useTheme } from "@/context/ThemeContext";
import { LightTheme, DarkTheme } from "@/constants/Theme";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === "light" ? LightTheme : DarkTheme;

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Toast.show({
        type: "success",
        text1: "Conta criada com sucesso!",
        text2: "Você já pode fazer login 😊",
      });
      setTimeout(() => router.replace("/sign-in"), 1500);
    } catch (err: any) {
      const message =
        err?.code === "auth/email-already-in-use"
          ? "E-mail já cadastrado."
          : err?.message ?? "Tente novamente.";

      Toast.show({
        type: "error",
        text1: "Erro ao cadastrar",
        text2: message,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* Botão de alternar tema (opcional, igual ao Sign-In) */}
      <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
        <Text style={[styles.themeText, { color: currentTheme.text }]}>
          {theme === "light" ? "🌙" : "☀️"}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: currentTheme.text }]}>Criar conta</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentTheme.inputBackground,
            borderColor: currentTheme.inputBorder,
            color: currentTheme.text,
          },
        ]}
        placeholder="E-mail"
        placeholderTextColor={currentTheme.placeholder}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentTheme.inputBackground,
            borderColor: currentTheme.inputBorder,
            color: currentTheme.text,
          },
        ]}
        placeholder="Senha (mín. 6 caracteres)"
        placeholderTextColor={currentTheme.placeholder}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: currentTheme.buttonBackground },
        ]}
        onPress={handleSignUp}
      >
        <Text style={[styles.buttonText, { color: currentTheme.buttonText }]}>
          Cadastrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/sign-in")} style={styles.bottomLinkContainer}>
        <Text style={[styles.link, { color: currentTheme.link }]}>
          Já tem conta? Entrar
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
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 18,
    fontSize: 15,
  },
  bottomLinkContainer: {
    position: "absolute",
    bottom: 200, // distância da borda inferior
    left: 0,
    right: 0,
    alignItems: "center",
  },
  themeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
  },
  themeText: {
    fontSize: 22,
  },
});
