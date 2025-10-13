// constants/Theme.ts
import { Colors } from "./Colors";

export const LightTheme = {
  // 🎨 Paleta principal
  background: Colors.backgroundLight,
  text: Colors.textLight,
  card: "#FFFFFF",
  border: Colors.border,

  // 🧱 Elementos de interface
  inputBackground: "#FFFFFF",
  inputBorder: Colors.border,
  placeholder: Colors.placeholder,

  // 🔘 Botões
  buttonBackground: Colors.success,
  buttonText: Colors.textDark,

  // 🔗 Links e destaques
  link: Colors.info,
  primary: Colors.primary,
};

export const DarkTheme = {
  // 🎨 Paleta principal
  background: Colors.backgroundDark,
  text: Colors.textDark,
  card: Colors.secondary,
  border: Colors.tertiary,

  // 🧱 Elementos de interface
  inputBackground: Colors.tertiary,
  inputBorder: Colors.tertiary,
  placeholder: "#BBBBBB",

  // 🔘 Botões
  buttonBackground: Colors.success,
  buttonText: Colors.textLight,

  // 🔗 Links e destaques
  link: Colors.primary,
  primary: Colors.primary,
};
