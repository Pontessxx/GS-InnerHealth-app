// app/water/index.tsx

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

import { WaterAPI } from "@/services/innerHealthApi";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

export default function AguaScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = theme === "light" ? LightTheme : DarkTheme;

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadWater();
  }, []);

  // ============================================================
  // GET /water/today  -> pega totalMl do backend
  // ============================================================
  async function loadWater() {
    try {
      const res = await WaterAPI.getToday();

      // BACKEND RETORNA totalMl
      setTotal(res?.totalMl ?? 0);

    } catch (err) {
      console.log("Erro ao carregar água:", err);
    }

    setLoading(false);
  }

  // ============================================================
  // POST /water  -> adiciona água usando { amountMl }
  // ============================================================
  async function addWater(amount: number) {
    try {
      await WaterAPI.create(amount);

      Toast.show({
        type: "success",
        text1: `${amount} ml adicionados!`,
      });

      await loadWater();
    } catch (_) {
      Toast.show({
        type: "error",
        text1: "Erro ao registrar água",
      });
    }
  }

  // Quantidade personalizada
  async function addCustom() {
    if (!input.trim() || isNaN(Number(input))) {
      Toast.show({
        type: "info",
        text1: "Digite um valor válido",
      });
      return;
    }

    await addWater(Number(input));
    setInput("");
  }

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: currentTheme.background },
        ]}
      >
        <ActivityIndicator size="large" color={currentTheme.primary} />
      </View>
    );
  }

  // ============================================================
  // UI
  // ============================================================
  return (
    <ScrollView
      style={{ backgroundColor: currentTheme.background }}
      contentContainerStyle={styles.container}
    >
      {/* VOLTAR */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Ionicons
          name="arrow-back"
          size={26}
          color={currentTheme.text}
          style={{ marginRight: 6 }}
        />
        <Text style={{ fontSize: 16, color: currentTheme.text }}>
          Voltar
        </Text>
      </TouchableOpacity>

      {/* HEADER */}
      <Text style={[styles.header, { color: currentTheme.text }]}>
        <Ionicons
          name="water-outline"
          size={26}
          color={currentTheme.primary}
        />{" "}
        Água
      </Text>

      {/* CARD TOTAL */}
      <View style={[styles.card, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>
          Total ingerido hoje:
        </Text>

        <Text style={[styles.cardValue, { color: currentTheme.primary }]}>
          {total} ml
        </Text>
      </View>

      {/* BOTÕES RÁPIDOS */}
      <Text style={[styles.subheader, { color: currentTheme.text }]}>
        Adicionar rapidamente
      </Text>

      <View style={styles.quickRow}>
        {[250, 500, 1000].map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.quickButton,
              { backgroundColor: currentTheme.primary },
            ]}
            onPress={() => addWater(amount)}
          >
            <Text
              style={{
                color: currentTheme.buttonText,
                fontWeight: "600",
              }}
            >
              {amount} ml
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CUSTOM INPUT */}
      <Text style={[styles.subheader, { color: currentTheme.text }]}>
        Adicionar quantidade personalizada
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="ml"
          keyboardType="numeric"
          placeholderTextColor={currentTheme.placeholder}
          style={[
            styles.input,
            {
              borderColor: currentTheme.border,
              color: currentTheme.text,
            },
          ]}
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: currentTheme.primary },
          ]}
          onPress={addCustom}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={currentTheme.buttonText}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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

  saveButton: { padding: 12, borderRadius: 10 },
});
