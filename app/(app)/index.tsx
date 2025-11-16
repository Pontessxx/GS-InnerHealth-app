// app/(app)/index.tsx

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
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
  const { theme } = useTheme();
  const currentTheme = theme === "light" ? LightTheme : DarkTheme;

  // ------------------------------
  // Estados do form
  // ------------------------------
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

  // ============================================================
  // 🔥 Checar se existe userId salvo
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

    // Tenta pegar da API
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
  // 🔥 Carregar dados do dashboard
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
        water: waterRes?.total ?? 0,
        sleep: sleepRes?.total ?? 0,
        meditation: meditationRes?.total ?? 0,
        activity: activityRes?.total ?? 0,
        sunlight: sunlightRes?.total ?? 0,
        tasks: tasksRes?.length ?? 0,
      });
    } catch (error) {
      console.log("Erro ao carregar dashboard:", error);
    }
  }

  // ============================================================
  // 🔥 Salvar perfil
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
      const userId = result.id;

      await AsyncStorage.setItem("userId", String(userId));
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
  // LOADING SCREEN
  // ============================================================
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: currentTheme.background }]}>
        <ActivityIndicator size="large" color={currentTheme.primary} />
      </View>
    );
  }

  // ============================================================
  // SEM PERFIL → mostrar formulário
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
            <Text
              style={[
                styles.saveButtonText,
                { color: currentTheme.buttonText },
              ]}
            >
              {saving ? "Salvando..." : "Salvar Perfil"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ============================================================
  // COM PERFIL → mostrar dashboard
  // ============================================================
  return (
    <ScrollView
      style={{ backgroundColor: currentTheme.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.header, { color: currentTheme.text }]}>
        Seu Bem-Estar Hoje
      </Text>

      <View style={styles.grid}>
        <Card title="Água" value={`${today.water} ml`} color="#4FC3F7" theme={currentTheme} />
        <Card title="Sono" value={`${today.sleep} h`} color="#9575CD" theme={currentTheme} />
        <Card title="Meditação" value={`${today.meditation} min`} color="#FFB74D" theme={currentTheme} />
        <Card title="Atividade" value={`${today.activity} min`} color="#81C784" theme={currentTheme} />
        <Card title="Luz Solar" value={`${today.sunlight} min`} color="#FFF176" theme={currentTheme} />
        <Card title="Tarefas" value={`${today.tasks}`} color="#E57373" theme={currentTheme} />
      </View>
    </ScrollView>
  );

  // ============================================================
  // Componentes Reutilizáveis
  // ============================================================
  function renderInput(label: string, field: keyof typeof form) {
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
            {
              color: currentTheme.text,
              borderColor: currentTheme.border,
            },
          ]}
        />
      </View>
    );
  }
}

// ============================================================
// Card componente
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
// Estilos
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
});
