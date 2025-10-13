// constants/Theme.ts
import { Colors } from "./Colors";

export const LightTheme = {
  background: Colors.backgroundLight,
  text: Colors.textLight,
  inputBackground: "#FFFFFF",
  inputBorder: Colors.border,
  placeholder: Colors.placeholder,
  buttonBackground: Colors.success,
  buttonText: Colors.textDark,
  link: Colors.info,
  primary: Colors.primary,
};

export const DarkTheme = {
  background: Colors.backgroundDark,
  text: Colors.textDark,
  inputBackground: Colors.secondary,
  inputBorder: "#3A3A3A",
  placeholder: "#BBBBBB",
  buttonBackground: Colors.success,
  buttonText: Colors.textLight,
  link: Colors.primary,
  primary: Colors.primary,
};
