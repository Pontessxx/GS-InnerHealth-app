import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "@/context/ThemeContext";
import { LightTheme, DarkTheme } from "@/constants/Theme";

import {
  WaterAPI,
  SleepAPI,
  MeditationAPI,
  PhysicalActivityAPI,
  SunlightAPI,
  TaskAPI,
  UserProfileAPI,
} from "@/services/innerHealthApi";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const router = useRouter();

  const { theme } = useTheme();
  const currentTheme = theme === "light" ? LightTheme : DarkTheme;

  const [form, setForm] = useState({
    weight: "",
    height: "",
    age: "",
    sleepQuality: "",
    sleepHours: "",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  const [today, setToday] = useState({
    water: 0,
    sleep: 0,
    meditation: 0,
    activity: 0,
    sunlight: 0,
    tasks: 0,
  });

  const [tasksToday, setTasksToday] = useState([]);

  // ============================================================
  // Checar perfil
  // ============================================================
  useEffect(() => {
    checkProfile();
  }, []);

  async function checkProfile() {
    const storedId = await AsyncStorage.getItem("userId");

    if (storedId) {
      setHasProfile(true);
      await loadDashboard();
      setLoading(false);
      return;
    }

    try {
      const data = await UserProfileAPI.get();
      if (data?.id) {
        await AsyncStorage.setItem("userId", String(data.id));
        setHasProfile(true);
        await loadDashboard();
      }
    } catch (_) {
      setHasProfile(false);
    }

    setLoading(false);
  }

  // ============================================================
  // Atualizar dashboard sempre que voltar para Home
  // ============================================================
  useFocusEffect(
    useCallback(() => {
      if (hasProfile) {
        loadDashboard();
      }
    }, [hasProfile])
  );

  // ============================================================
  // Carregar dashboard
  // ============================================================
  async function loadDashboard() {
    try {
      const [
        waterRes,
        sleepRes,
        meditationRes,
        activityRes,
        sunlightRes,
        tasksRes,
      ] = await Promise.all([
        WaterAPI.getToday(),
        SleepAPI.getToday(),
        MeditationAPI.getToday(),
        PhysicalActivityAPI.getToday(),
        SunlightAPI.getToday(),
        TaskAPI.getToday(),
      ]);

      setToday({
        water: waterRes?.totalMl ?? 0,     // 🔥 CORRIGIDO
        sleep: sleepRes?.record?.hours ?? 0,
        meditation: meditationRes?.total ?? 0,
        activity: activityRes?.total ?? 0,
        sunlight: sunlightRes?.total ?? 0,
        tasks: tasksRes?.length ?? 0,
      });

      setTasksToday(tasksRes ?? []);
    } catch (error) {
      console.log("Erro ao carregar dashboard:", error);
    }
  }

  // ============================================================
  // Salvar perfil
  // ============================================================
  const handleSave = async () => {
    setSaving(true);

    const payload = {
      weight: Number(form.weight),
      height: Number(form.height),
      age: Number(form.age),
      sleepQuality: Number(form.sleepQuality),
      sleepHours: Number(form.sleepHours),
    };

    try {
      const result = await UserProfileAPI.update(payload);

      await AsyncStorage.setItem("userId", String(result.id));
      setHasProfile(true);

      Toast.show({
        type: "success",
        text1: "Perfil salvo!",
        text2: "Seu dashboard está pronto 🎉",
      });

      await loadDashboard();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Falha ao salvar o perfil",
      });
    }

    setSaving(false);
  };

  // ============================================================
  // Excluir tarefa
  // ============================================================
  async function handleDeleteTask(id) {
    try {
      await TaskAPI.remove(id);

      setTasksToday((prev) => prev.filter((t) => t.id !== id));

      Toast.show({
        type: "success",
        text1: "Tarefa excluída!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao excluir a tarefa",
      });
    }
  }

  // ============================================================
  // Loading
  // ============================================================
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: currentTheme.background }]}>
        <ActivityIndicator size="large" color={currentTheme.primary} />
      </View>
    );
  }

  // ============================================================
  // Tela de Perfil → primeira vez
  // ============================================================
  if (!hasProfile) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: currentTheme.background },
        ]}
      >
        <Text style={[styles.title, { color: currentTheme.text }]}>
          Seu Perfil de Saúde
        </Text>

        <Text style={[styles.subtitle, { color: currentTheme.subtext }]}>
          Complete seus dados iniciais:
        </Text>

        <View style={[styles.card, { backgroundColor: currentTheme.card }]}>
          {renderInput("Peso (kg)", "weight")}
          {renderInput("Altura (cm)", "height")}
          {renderInput("Idade", "age")}
          {renderInput("Qualidade do Sono (%)", "sleepQuality")}
          {renderInput("Horas de Sono", "sleepHours")}

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: currentTheme.primary }]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={[styles.saveButtonText, { color: currentTheme.buttonText }]}>
              {saving ? "Salvando..." : "Salvar Perfil"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ============================================================
  // Tela Home (Dashboard)
  // ============================================================
  return (
    <ScrollView
      style={{ backgroundColor: currentTheme.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.header, { color: currentTheme.text }]}>
        Seu Bem-Estar Hoje
      </Text>

      {/* GRID */}
      <View style={styles.grid}>
        <TouchableOpacity onPress={() => router.push("/water")} style={{ width: "48%" }}>
          <Card title="Água" value={`${today.water} ml`} color="#4FC3F7" theme={currentTheme} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/sleep")} style={{ width: "48%" }}>
          <Card title="Sono" value={`${today.sleep} h`} color="#9575CD" theme={currentTheme} />
        </TouchableOpacity>

        <Card title="Meditação" value={`${today.meditation} min`} color="#FFB74D" theme={currentTheme} />
        <Card title="Atividade" value={`${today.activity} min`} color="#81C784" theme={currentTheme} />
        <Card title="Luz Solar" value={`${today.sunlight} min`} color="#FFF176" theme={currentTheme} />

        <TouchableOpacity onPress={() => router.push("/tasks")} style={{ width: "48%" }}>
          <Card title="Tarefas" value={`${today.tasks}`} color="#E57373" theme={currentTheme} />
        </TouchableOpacity>
      </View>

      {/* LISTA DE TAREFAS */}
      <Text style={[styles.subheader, { color: currentTheme.text }]}>Tarefas de Hoje</Text>

      {tasksToday.length === 0 ? (
        <Text style={{ color: currentTheme.subtext }}>Nenhuma tarefa para hoje.</Text>
      ) : (
        tasksToday.map((t) => (
          <View key={t.id} style={[styles.taskItem, { backgroundColor: currentTheme.card }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={[styles.taskTitle, { color: currentTheme.text }]}>{t.title}</Text>
                <Text style={[styles.taskDesc, { color: currentTheme.text }]}>{t.description}</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                {t.isComplete ? (
                  <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                ) : (
                  <Ionicons name="time-outline" size={24} color="#F1F436FF" />
                )}

                <TouchableOpacity onPress={() => handleDeleteTask(t.id)}>
                  <Ionicons name="trash-outline" size={24} color="#E53935" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}

    </ScrollView>
  );

  // ============================================================
  // RENDER INPUT
  // ============================================================
  function renderInput(label, field) {
    return (
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: currentTheme.text }]}>{label}</Text>

        <TextInput
          placeholderTextColor={currentTheme.placeholder}
          keyboardType="numeric"
          value={form[field]}
          onChangeText={(v) => setForm({ ...form, [field]: v })}
          style={[
            styles.input,
            { color: currentTheme.text, borderColor: currentTheme.border },
          ]}
        />
      </View>
    );
  }
}

// ============================================================
// CARD COMPONENT
// ============================================================
function Card({ title, value, color, theme }) {
  return (
    <View style={[styles.cardItem, { backgroundColor: theme.card }]}>
      <View style={[styles.colorStripe, { backgroundColor: color }]} />
      <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.cardValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 20,
  },

  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  subheader: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 30,
    marginBottom: 10,
  },

  card: {
    padding: 22,
    borderRadius: 18,
    elevation: 4,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 15,
    marginBottom: 6,
  },

  input: {
    height: 48,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },

  saveButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardItem: {
    width: "48%",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    elevation: 3,
  },

  colorStripe: {
    height: 6,
    borderRadius: 4,
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
  },

  cardValue: {
    fontSize: 20,
    fontWeight: "700",
  },

  taskItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  taskDesc: {
    fontSize: 14,
    opacity: 0.7,
  },
});
