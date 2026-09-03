import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  danger: string;
  statusBarStyle: "light" | "dark";
}

export const lightColors: ThemeColors = {
  bg: "#F3F4F6",          // Світло-сіре тло
  surface: "#FFFFFF",     // Білі картки
  text: "#111827",        // Темний текст
  textMuted: "#6B7280",   // Сірий текст для підписів
  border: "#E5E7EB",      // Світлі межі
  primary: "#3B82F6",     // Синій акцент
  success: "#10B981",     // Зелений для виконаних завдань
  danger: "#EF4444",      // Червоний для видалення
  statusBarStyle: "dark", // Темні іконки статус-бару
};

export const darkColors: ThemeColors = {
  bg: "#111827",          // Темне тло
  surface: "#1F2937",     // Темні картки
  text: "#F9FAFB",        // Світлий текст
  textMuted: "#9CA3AF",   // Приглушений світлий текст
  border: "#374151",      // Темні межі
  primary: "#60A5FA",     // Світло-синій акцент
  success: "#34D399",     // Світло-зелений
  danger: "#F87171",      // Світло-червоний
  statusBarStyle: "light",// Світлі іконки статус-бару
};

interface ThemeContextType {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = "@todo_theme_mode";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error("Помилка завантаження теми з AsyncStorage:", error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const nextMode = !isDarkMode;
      setIsDarkMode(nextMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(nextMode));
    } catch (error) {
      console.error("Помилка збереження теми:", error);
    }
  };

  const currentColors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        colors: currentColors,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};