import {Text, StyleSheet, View, Pressable, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AppButton from "../../components/AppButton"
import InputField from '../../components/InputField';
import SubmitButton from '../../components/SubmitButton';

import { useAuth } from '../../context/authProvider';
import { useTheme } from '../../context/themeProvider';

const Login = () => {
    const { login } = useAuth();
    const { colors, theme, toggleTheme } = useTheme();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        console.log({username, password});
        // Simulate API call
        setTimeout(() => {
            login();
            setIsLoading(false);
            router.replace('/(app)/home');
        }, 1000);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
            <SafeAreaView style={styles.container}>
                <Pressable style={styles.themeToggle} onPress={toggleTheme}>
                    <Ionicons name={theme === 'dark' ? 'sunny' : 'moon'} size={24} color={colors.textPrimary} />
                </Pressable>
                <Text style={[styles.text, { color: colors.headingPrimary }]}>
                    Welcome Back
                </Text>
                <Text style={[styles.details, { color: colors.textSecondary }]}>
                    Enter Username
                </Text>
                <InputField 
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                />
                <Text style={[styles.details, { color: colors.textSecondary }]}>
                    Enter Password
                </Text>
                <InputField
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                />
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.btnPrimaryBg} />
                        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Logging in...</Text>
                    </View>
                )}
                <SubmitButton 
                    onPress={handleLogin} 
                    title="Login" 
                    disabled={username === '' || password === '' || isLoading} 
                />
                <AppButton title="New Here? Register now" to="/(auth)/register" replace />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    details: {
        alignSelf: 'flex-start',
        marginBottom: 5,
        paddingTop: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    themeToggle: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    loadingContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
    }
});

export default Login;
