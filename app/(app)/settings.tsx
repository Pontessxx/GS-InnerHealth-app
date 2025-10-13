import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { LightTheme, DarkTheme } from "@/constants/Theme";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === "light" ? LightTheme : DarkTheme;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.background },
      ]}
    >
      <Text style={[styles.title, { color: currentTheme.text }]}>
        Configurações ⚙️
      </Text>

      <View
        style={[
          styles.optionContainer,
          { borderColor: currentTheme.border },
        ]}
      >
        <Text style={[styles.label, { color: currentTheme.text }]}>
          Modo Escuro
        </Text>

        <Switch
          trackColor={{
            false: currentTheme.switchTrackOff,
            true: currentTheme.switchTrackOn,
          }}
          thumbColor={
            theme === "dark"
              ? currentTheme.switchThumbOn
              : currentTheme.switchThumbOff
          }
          ios_backgroundColor={currentTheme.switchIOSBackground}
          onValueChange={toggleTheme}
          value={theme === "dark"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 40,
    textAlign: "center",
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
  },
});
