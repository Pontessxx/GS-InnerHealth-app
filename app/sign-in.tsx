import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useRouter } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useTheme } from "@/context/ThemeContext";
import { LightTheme, DarkTheme } from "@/constants/Theme";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === "light" ? LightTheme : DarkTheme;

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: "info",
        text1: "Campos obrigatórios",
        text2: "Preencha o e-mail e a senha para continuar.",
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      Toast.show({
        type: "success",
        text1: "Login realizado!",
        text2: "Bem-vindo de volta 👋",
      });
      router.replace("/(app)");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro ao entrar",
        text2: err?.message ?? "Tente novamente.",
      });
    }
  };

  const isFormComplete = email.trim().length > 0 && password.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* Botão de alternar tema */}
      <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
        <Text style={[styles.themeText, { color: currentTheme.text }]}>
          {theme === "light" ? "🌙" : "☀️"}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: currentTheme.text }]}>Entrar</Text>

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
        placeholder="Senha"
        placeholderTextColor={currentTheme.placeholder}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isFormComplete
              ? currentTheme.buttonBackground
              : "#7F7E7D",
          },
        ]}
        onPress={handleSignIn}
        activeOpacity={isFormComplete ? 0.8 : 1}
      >
        <Text style={[styles.buttonText, { color: currentTheme.buttonText }]}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/sign-up")}>
        <Text style={[styles.link, { color: currentTheme.link }]}>
          Não tem conta? Cadastre-se
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
