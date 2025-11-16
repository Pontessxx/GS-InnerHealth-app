// app/sleep/index.tsx

import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { LightTheme, DarkTheme } from "@/constants/Theme";

import { SleepAPI } from "@/services/innerHealthApi";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

export default function SleepScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = theme === "light" ? LightTheme : DarkTheme;

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [inputHours, setInputHours] = useState("");
  const [inputQuality, setInputQuality] = useState("");

  // ===============================================
  // Carregar total de sono do dia
  // ===============================================
  useEffect(() => {
    loadSleep();
  }, []);

  async function loadSleep() {
    try {
      const res = await SleepAPI.getToday();

      // 🔥 BACKEND RETORNA: { record: { hours, quality } }
      setTotal(res?.record?.hours ?? 0);

    } catch (err) {
      console.log("Erro ao carregar sono:", err);
    }

    setLoading(false);
  }

  // ===============================================
  // Registrar sono rápido (qualidade padrão: 100)
  // ===============================================
  async function addSleep(hours: number) {
    try {
      await SleepAPI.create(hours, 100);

      Toast.show({
        type: "success",
        text1: `${hours} horas registradas!`,
      });

      await loadSleep();
    } catch (_) {
      Toast.show({
        type: "error",
        text1: "Erro ao registrar sono",
      });
    }
  }

  // ===============================================
  // Registrar personalizado
  // ===============================================
  async function addCustom() {
    if (!inputHours.trim() || isNaN(Number(inputHours))) {
      return Toast.show({ type: "info", text1: "Digite horas válidas" });
    }

    if (!inputQuality.trim() || isNaN(Number(inputQuality))) {
      return Toast.show({ type: "info", text1: "Digite qualidade (%) válida" });
    }

    try {
      await SleepAPI.create(Number(inputHours), Number(inputQuality));

      Toast.show({ type: "success", text1: "Sono registrado!" });

      setInputHours("");
      setInputQuality("");

      await loadSleep();

    } catch (_) {
      Toast.show({ type: "error", text1: "Erro ao registrar sono" });
    }
  }

  // ===============================================
  // Loading
  // ===============================================
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: currentTheme.background }]}>
        <ActivityIndicator size="large" color={currentTheme.primary} />
      </View>
    );
  }

  // ===============================================
  // UI
  // ===============================================
  return (
    <ScrollView
      style={{ backgroundColor: currentTheme.background }}
      contentContainerStyle={styles.container}
    >
      {/* VOLTAR */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <Ionicons name="arrow-back" size={26} color={currentTheme.text} style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 16, color: currentTheme.text }}>Voltar</Text>
      </TouchableOpacity>

      {/* HEADER */}
      <Text style={[styles.header, { color: currentTheme.text }]}>
        <Ionicons name="moon-outline" size={26} color={currentTheme.primary} /> Sono
      </Text>

      {/* CARD */}
      <View style={[styles.card, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>
          Total dormido hoje:
        </Text>
        <Text style={[styles.cardValue, { color: currentTheme.primary }]}>
          {total} h
        </Text>
      </View>

      {/* BOTÕES RÁPIDOS */}
      <Text style={[styles.subheader, { color: currentTheme.text }]}>
        Registrar rapidamente
      </Text>

      <View style={styles.quickRow}>
        {[4, 6, 8].map((h) => (
          <TouchableOpacity
            key={h}
            style={[styles.quickButton, { backgroundColor: currentTheme.primary }]}
            onPress={() => addSleep(h)}
          >
            <Text style={{ color: currentTheme.buttonText, fontWeight: "600" }}>
              {h} h
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* INPUT PERSONALIZADO */}
      <Text style={[styles.subheader, { color: currentTheme.text }]}>
        Registrar quantidade personalizada
      </Text>

      <TextInput
        value={inputHours}
        onChangeText={setInputHours}
        placeholder="Horas"
        keyboardType="numeric"
        placeholderTextColor={currentTheme.placeholder}
        style={[
          styles.input,
          { borderColor: currentTheme.border, color: currentTheme.text, marginBottom: 14 },
        ]}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={inputQuality}
          onChangeText={setInputQuality}
          placeholder="Qualidade (%)"
          keyboardType="numeric"
          placeholderTextColor={currentTheme.placeholder}
          style={[
            styles.input,
            { borderColor: currentTheme.border, color: currentTheme.text },
          ]}
        />

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: currentTheme.primary }]}
          onPress={addCustom}
        >
          <Ionicons name="add-circle-outline" size={24} color={currentTheme.buttonText} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ============================================================
// Estilos
// ============================================================
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  container: { paddingVertical: 30, paddingHorizontal: 20 },

  header: { fontSize: 26, fontWeight: "700", marginBottom: 20 },

  card: {
    padding: 22,
    borderRadius: 18,
    elevation: 4,
    marginBottom: 25,
  },

  cardTitle: { fontSize: 18, marginBottom: 6 },

  cardValue: { fontSize: 32, fontWeight: "700" },

  subheader: { fontSize: 18, fontWeight: "600", marginBottom: 12 },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  quickButton: {
    width: "32%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  input: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },

  saveButton: {
    padding: 12,
    borderRadius: 10,
  },
});
