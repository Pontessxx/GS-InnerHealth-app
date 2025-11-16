import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { sendToAI } from "@/services/ai";
import { useTheme } from "@/context/ThemeContext";
import { LightTheme, DarkTheme } from "@/constants/Theme";

export default function ChatScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = theme === "light" ? LightTheme : DarkTheme;

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Olá! Sou seu assistente de bem-estar. Como posso ajudar hoje?" },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    const reply = await sendToAI(userMessage);

    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    setLoading(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      
      {/* Voltar */}
      <TouchableOpacity 
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={26} color={currentTheme.text} />
      </TouchableOpacity>

      <Text style={[styles.header, { color: currentTheme.text }]}>Assistente Inteligente</Text>

      {/* MENSAGENS */}
      <ScrollView contentContainerStyle={styles.chatBox}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.sender === "user"
                ? styles.userMessage
                : styles.botMessage,
            ]}
          >
            <Text
              style={{
                color:
                  msg.sender === "user"
                    ? "white"
                    : currentTheme.text,
              }}
            >
              {msg.text}
            </Text>
          </View>
        ))}

        {loading && (
          <ActivityIndicator
            size="small"
            color={currentTheme.primary}
            style={{ marginTop: 10 }}
          />
        )}
      </ScrollView>

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={currentTheme.placeholder}
          style={[
            styles.input,
            {
              backgroundColor: currentTheme.card,
              color: currentTheme.text,
              borderColor: currentTheme.border,
            },
          ]}
        />

        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: currentTheme.primary }]}
          onPress={handleSend}
        >
          <Ionicons name="send" size={20} color={currentTheme.buttonText} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backButton: { marginBottom: 10 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 15 },

  chatBox: { paddingBottom: 20 },

  message: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    maxWidth: "80%",
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4C7FFF",
  },

  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#dcdcdc30",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
    gap: 12,
  },

  input: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    fontSize: 15,
  },

  sendButton: {
    padding: 12,
    borderRadius: 10,
  },
});
