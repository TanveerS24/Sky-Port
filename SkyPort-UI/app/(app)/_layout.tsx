import { Stack } from "expo-router";

const AppLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" options={{ title: "Home" }} />
            <Stack.Screen name="profile" options={{ title: "Profile" }} />
        </Stack>
    );
};

export default AppLayout;