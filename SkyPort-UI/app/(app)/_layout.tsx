import { Stack } from "expo-router";

const AppLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" options={{ title: "Home" }} />
            <Stack.Screen name="profile" options={{ title: "Profile" }} />
            <Stack.Screen name="files" options={{ title: "Files" }} />
            <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
            <Stack.Screen name="sharedFiles" options={{ title: "Shared Files" }} />
            <Stack.Screen name="chats" options={{ title: "Chats" }} />
            <Stack.Screen name="friends" options={{ title: "Friends" }} />
        </Stack>
    );
};

export default AppLayout;