import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../src/context/authProvider.context";
import { UserProvider, useUser } from "../src/context/user.context";
import { ThemeProvider } from "../src/context/themeProvider.context";
import { View, ActivityIndicator, StyleSheet } from "react-native";

function RootLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isLoading: userLoading, usertype } = useUser();

  if (isLoading || userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)" />
      ) : usertype === "admin" ? (
        <Stack.Screen name="(admin)" />
      ) : (
        <Stack.Screen name="(app)" />
      )}
    </Stack>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <RootLayout />
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});