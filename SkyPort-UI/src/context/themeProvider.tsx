import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeName = "dark" | "light";

type Theme = {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  headingPrimary: string;
  btnPrimaryBg: string;
  btnPrimaryText: string;
  btnPrimaryHover: string;
  btnSecondaryBg: string;
  btnSecondaryText: string;
  borderDefault: string;
  borderMuted: string;
  success: string;
  warning: string;
  error: string;
  info: string;
};

const themes: Record<ThemeName, Theme> = {
  dark: {
    bgPrimary: "#0B1F3B",
    bgSecondary: "#122B4D",
    bgTertiary: "#1A3A66",
    textPrimary: "#FFFFFF",
    textSecondary: "#D6E0F0",
    textMuted: "#9FB3D1",
    textInverse: "#0B1F3B",
    headingPrimary: "#FFFFFF",
    btnPrimaryBg: "#3B82F6",
    btnPrimaryText: "#FFFFFF",
    btnPrimaryHover: "#2563EB",
    btnSecondaryBg: "#163A6B",
    btnSecondaryText: "#FFFFFF",
    borderDefault: "#1E3F6E",
    borderMuted: "#142F52",
    success: "#3FCF8E",
    warning: "#F5A524",
    error: "#E5484D",
    info: "#5B8CFF",
  },
  light: {
    bgPrimary: "#EEF4FF",
    bgSecondary: "#E1ECFF",
    bgTertiary: "#D6E4FF",
    textPrimary: "#0B1F3B",
    textSecondary: "#2C3E5E",
    textMuted: "#6B7C99",
    textInverse: "#FFFFFF",
    headingPrimary: "#0B1F3B",
    btnPrimaryBg: "#3B82F6",
    btnPrimaryText: "#FFFFFF",
    btnPrimaryHover: "#2563EB",
    btnSecondaryBg: "#0B1F3B",
    btnSecondaryText: "#FFFFFF",
    borderDefault: "#CBD8F0",
    borderMuted: "#DDE6F7",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#DC2626",
    info: "#2563EB",
  },
};

type ThemeContextType = {
  theme: ThemeName;
  colors: Theme;
  toggleTheme: () => void;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeName>(systemColorScheme === "dark" ? "dark" : "light");

  useEffect(() => {
    // Load saved theme preference
    AsyncStorage.getItem("theme").then((savedTheme) => {
      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeState(savedTheme);
      }
    });
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    AsyncStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors: themes[theme], toggleTheme, setTheme }}>
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
