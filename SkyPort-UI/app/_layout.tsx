import { Stack } from "expo-router";

const isAuthenticated = false; // Replace with actual authentication logic

export default function RootLayout() {
  if (!isAuthenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ title: "Auth" }} />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(app)" options={{ title: "Home" }} />
    </Stack>
  );
}
