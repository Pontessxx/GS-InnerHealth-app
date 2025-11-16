// app/tasks/index.tsx

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
import { TaskAPI } from "@/services/innerHealthApi";

import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function TasksScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = theme === "light" ? LightTheme : DarkTheme;

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // DATE
  const [taskDate, setTaskDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // ============================================================
  // Carregar tarefas
  // ============================================================
  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const res = await TaskAPI.getToday();
      setTasks(res ?? []);
    } catch (err) {
      console.log("Erro ao carregar tarefas:", err);
    }
    setLoading(false);
  }

  // ============================================================
  // Criar nova tarefa
  // ============================================================
  async function addTask() {
    if (!title.trim()) {
      Toast.show({ type: "info", text1: "Digite o título da tarefa" });
      return;
    }

    try {
      const formattedDate = taskDate.toISOString().split("T")[0];

      await TaskAPI.create(title, description, formattedDate);

      Toast.show({ type: "success", text1: "Tarefa adicionada!" });

      setTitle("");
      setDescription("");

      loadTasks();
    } catch (err) {
      console.log(err);
      Toast.show({ type: "error", text1: "Erro ao adicionar tarefa" });
    }
  }

  // ============================================================
  // Marcar como concluída
  // ============================================================
  async function toggleComplete(task) {
    try {
      await TaskAPI.update(task.id, {
        ...task,
        isComplete: !task.isComplete,
      });
      loadTasks();
    } catch (err) {
      Toast.show({ type: "error", text1: "Erro ao atualizar tarefa" });
    }
  }

  // ============================================================
  // Remover tarefa
  // ============================================================
  async function deleteTask(id) {
    try {
      await TaskAPI.remove(id);

      Toast.show({ type: "success", text1: "Tarefa excluída!" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      Toast.show({ type: "error", text1: "Erro ao excluir tarefa" });
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

  return (
    <ScrollView
      style={{ backgroundColor: currentTheme.background }}
      contentContainerStyle={styles.container}
    >
      {/* VOLTAR */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={26} color={currentTheme.text} />
        <Text style={[styles.backText, { color: currentTheme.text }]}>Voltar</Text>
      </TouchableOpacity>

      {/* TÍTULO */}
      <Text style={[styles.header, { color: currentTheme.text }]}>
        <Ionicons name="list-circle-outline" size={28} color="#E57373" /> Tarefas
      </Text>

      {/* FORM */}
      <View style={[styles.card, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.subheader, { color: currentTheme.text }]}>
          Nova tarefa
        </Text>

        <TextInput
          placeholder="Título"
          placeholderTextColor={currentTheme.placeholder}
          value={title}
          onChangeText={setTitle}
          style={[
            styles.input,
            { borderColor: currentTheme.border, color: currentTheme.text },
          ]}
        />

        <TextInput
          placeholder="Descrição"
          placeholderTextColor={currentTheme.placeholder}
          value={description}
          onChangeText={setDescription}
          style={[
            styles.input,
            {
              borderColor: currentTheme.border,
              color: currentTheme.text,
              height: 70,
            },
          ]}
          multiline
        />

        {/* SELETOR DE DATA */}
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={[
            styles.input,
            {
              justifyContent: "center",
              borderColor: currentTheme.border,
            },
          ]}
        >
          <Text style={{ color: currentTheme.text }}>
            📅 {taskDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={taskDate}
            mode="date"
            display="default"
            onChange={(event, selected) => {
              setShowPicker(false);
              if (selected) setTaskDate(selected);
            }}
          />
        )}

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: "#E57373" }]}
          onPress={addTask}
        >
          <Text style={{ color: currentTheme.buttonText, fontWeight: "700" }}>
            Adicionar
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <Text style={[styles.subheader, { color: currentTheme.text }]}>
        Tarefas de Hoje
      </Text>

      {tasks.length === 0 && (
        <Text style={{ color: currentTheme.subtext }}>
          Nenhuma tarefa registrada.
        </Text>
      )}

      {tasks.map((task) => (
        <View
          key={task.id}
          style={[styles.taskItem, { backgroundColor: currentTheme.card }]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.taskTitle,
                {
                  color: currentTheme.text,
                  textDecorationLine: task.isComplete ? "line-through" : "none",
                },
              ]}
            >
              {task.title}
            </Text>

            {task.description ? (
              <Text style={[styles.taskDesc, { color: currentTheme.subtext }]}>
                {task.description}
              </Text>
            ) : null}

            <Text style={{ color: currentTheme.subtext, marginTop: 6 }}>
              📅 {task.date}
            </Text>
          </View>

          <View style={styles.taskButtons}>
            <TouchableOpacity onPress={() => toggleComplete(task)}>
              <Ionicons
                name={task.isComplete ? "checkmark-circle" : "ellipse-outline"}
                size={26}
                color={task.isComplete ? "#4CAF50" : currentTheme.text}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteTask(task.id)}>
              <Ionicons name="trash-outline" size={26} color="#E53935" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { paddingVertical: 30, paddingHorizontal: 20 },

  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 6 },
  backText: { fontSize: 16 },

  header: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  subheader: { fontSize: 18, fontWeight: "600", marginBottom: 12 },

  card: { padding: 20, borderRadius: 16, elevation: 4, marginBottom: 30 },

  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 15,
  },

  addButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },

  taskItem: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
    flexDirection: "row",
  },

  taskTitle: { fontSize: 16, fontWeight: "600" },
  taskDesc: { fontSize: 14, marginTop: 4 },

  taskButtons: { flexDirection: "row", alignItems: "center", gap: 16 },
});
