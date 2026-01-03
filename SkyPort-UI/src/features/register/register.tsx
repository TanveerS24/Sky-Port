import {View, Text, StyleSheet, Platform, Pressable, ActivityIndicator, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useTheme } from '../../context/themeProvider';
import { useAuth } from '../../context/authProvider';

import AppButton from "../../components/AppButton"
import InputField from '../../components/InputField';
import SubmitButton from '../../components/SubmitButton';


const Register = () => {
    const { colors, theme, toggleTheme } = useTheme();
    const { register, isLoading } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await register(username, email, password);
            Alert.alert('Success', 'Registration successful! Please login.');
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
            <SafeAreaView style={styles.container}>
                <Text style={[styles.text, { color: colors.headingPrimary }]}>
                    Create Account
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
                    Enter Email
                </Text>
                <InputField 
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    keyboardType="email-address"
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
                        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Creating account...</Text>
                    </View>
                )}
                {!isLoading && (
                    <SubmitButton 
                        onPress={handleRegister} 
                        title="Register" 
                        disabled={username === '' || email === '' || password === '' || isLoading} 
                    />
                )}
                <AppButton title="Already have an account? Login" to="/(auth)/login" replace />
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

export default Register;
