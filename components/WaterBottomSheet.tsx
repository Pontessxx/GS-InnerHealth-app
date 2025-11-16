import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { WaterAPI } from "@/services/innerHealthApi";
import Toast from "react-native-toast-message";

export default function WaterBottomSheet({ sheetRef, theme, onAdded }) {
  const snapPoints = useMemo(() => ["45%", "80%"], []);
  const [weekData, setWeekData] = useState([]);
  const [input, setInput] = useState("");

  // 🔥 Carrega dados da semana
  useEffect(() => {
    loadWeek();
  }, []);

  async function loadWeek() {
    try {
      const data = await WaterAPI.getWeek();
      setWeekData(data.items || []);
    } catch (e) {
      console.log("Erro ao carregar semana:", e);
    }
  }

  // 🔥 Enviar água
  async function handleAdd() {
    const ml = Number(input);
    if (!ml || ml <= 0) {
      Toast.show({ type: "error", text1: "Informe um valor válido" });
      return;
    }

    try {
      await WaterAPI.create(ml);

      Toast.show({
        type: "success",
        text1: "Água registrada!",
        text2: `${ml}ml adicionados 💧`,
      });

      setInput("");

      // fecha e atualiza dashboard
      sheetRef.current?.close();
      onAdded();

    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao adicionar água",
      });
    }
  }

  return (
    <BottomSheet ref={sheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose={true}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Consumo de Água</Text>

        <Text style={[styles.label, { color: theme.subtext }]}>
          Adicionar água (ml)
        </Text>

        <TextInput
          placeholder="Ex: 250"
          placeholderTextColor={theme.placeholder}
          keyboardType="numeric"
          value={input}
          onChangeText={setInput}
          style={[
            styles.input,
            { borderColor: theme.border, color: theme.text },
          ]}
        />

        <TouchableOpacity
          onPress={handleAdd}
          style={[styles.button, { backgroundColor: theme.primary }]}
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>
            Adicionar
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 16,
  },
});
