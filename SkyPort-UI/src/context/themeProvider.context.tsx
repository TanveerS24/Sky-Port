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
    bgPrimary: "#0B0C0F",      // near-black, not blue
    bgSecondary: "#12141A",    // elevated surfaces
    bgTertiary: "#1A1D24",    // cards / modals

    textPrimary: "#F5F7FA",    // clean white
    textSecondary: "#B5BAC5",  // soft gray
    textMuted: "#7B8190",      // muted neutral
    textInverse: "#8195B0",

    headingPrimary: "#FFFFFF",

    btnPrimaryBg: "#F97316",   // 🔥 ember orange
    btnPrimaryText: "#FFF7ED",
    btnPrimaryHover: "#EA580C",

    btnSecondaryBg: "#0F1115",        // blends with background
    btnSecondaryText: "#9CA3AF",      // calm gray

    borderDefault: "#23262F",
    borderMuted: "#1A1C22",

    success: "#22C55E",
    warning: "#FACC15",
    error: "#EF4444",
    info: "#A855F7",           // subtle neon violet
  },
  light: {
  /* Backgrounds */
  bgPrimary: "#F8FAFD",      // airy white with cool tint
  bgSecondary: "#B0EEEE",    // sky mist
  bgTertiary: "#E3ECF7",     // card surfaces

  /* Text */
  textPrimary: "#2657C8",    // near-black graphite
  textSecondary: "#1A395D ",  // cool gray
  textMuted: "#64748B",      // muted slate
  textInverse: "#FFFFFF",

  headingPrimary: "#1E459F",

  /* Primary Button — Sky Blue */
  btnPrimaryBg: "#38BDF8",   // premium sky blue
  btnPrimaryText: "#F0F9FF", // soft ice white
  btnPrimaryHover: "#0EA5E9",

  /* Secondary Button */
  btnSecondaryBg: "#E0F2FE", // light sky fill
  btnSecondaryText: "#075985",

  /* Borders */
  borderDefault: "#CBD5E1",
  borderMuted: "#E2E8F0",

  /* Status */
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#DC2626",
  info: "#0284C7",
}
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
