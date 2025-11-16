import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { LightTheme, DarkTheme } from "@/constants/Theme";

import { auth } from "../../utils/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { UserProfileAPI } from "@/services/innerHealthApi"; // 👈 sua API Azure

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = theme === "light" ? LightTheme : DarkTheme;

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const [profile, setProfile] = useState({
    weight: null,
    height: null,
    age: null,
    photoUrl: null,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      // Firebase email
      const user = auth.currentUser;
      if (user) setUserEmail(user.email);

      // API Azure → perfil real
      const data = await UserProfileAPI.get();
      setProfile({
        weight: data.weight,
        height: data.height,
        age: data.age,
        photoUrl: data.photoUrl ?? null,
      });

    } catch (err) {
      console.log("Erro ao carregar perfil:", err);
    }

    setLoading(false);
  }

  function handleLogout() {
    signOut(auth)
      .then(() => router.replace("/sign-in"))
      .catch(() => alert("Erro ao sair da conta."));
  }

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
      {/* Voltar */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <Ionicons
          name="arrow-back"
          size={26}
          color={currentTheme.text}
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: currentTheme.text, fontSize: 16 }}>Voltar</Text>
      </TouchableOpacity>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              profile.photoUrl ??
              "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }}
          style={styles.avatar}
        />

        <Text style={[styles.email, { color: currentTheme.text }]}>
          {userEmail}
        </Text>
      </View>

      {/* Card de Informações */}
      <View style={[styles.card, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.cardTitle, { color: currentTheme.text }]}>
          Seus dados
        </Text>

        <Text style={[styles.infoItem, { color: currentTheme.text }]}>
          Peso: {profile.weight ?? "—"} kg
        </Text>
        <Text style={[styles.infoItem, { color: currentTheme.text }]}>
          Altura: {profile.height ?? "—"} cm
        </Text>
        <Text style={[styles.infoItem, { color: currentTheme.text }]}>
          Idade: {profile.age ?? "—"}
        </Text>

        {/* Tela de editar perfil — se quiser habilitar */}
        {/* 
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: currentTheme.primary }]}
          onPress={() => router.push("/profile/edit")}
        >
          <Ionicons name="create-outline" size={22} color={currentTheme.buttonText} />
          <Text style={[styles.editButtonText, { color: currentTheme.buttonText }]}>
            Editar Perfil
          </Text>
        </TouchableOpacity>
        */}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#E53935" />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    padding: 20,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    marginBottom: 12,
  },

  email: {
    fontSize: 16,
    fontWeight: "600",
  },

  card: {
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    marginBottom: 25,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  infoItem: {
    fontSize: 16,
    marginBottom: 6,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },

  logoutText: {
    fontSize: 16,
    color: "#E53935",
    fontWeight: "600",
  },
});
