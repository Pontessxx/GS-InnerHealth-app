// app/context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Carrega o tema salvo
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("@theme");
        if (savedTheme === "dark" || savedTheme === "light") {
          setTheme(savedTheme);
        }
      } catch (err) {
        console.error("Erro ao carregar tema:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  // 🔹 Alterna o tema e salva
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem("@theme", newTheme);
    } catch (err) {
      console.error("Erro ao salvar tema:", err);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  return context;
};
