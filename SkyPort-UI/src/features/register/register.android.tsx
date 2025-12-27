import {View, Text, StyleSheet, Platform, Pressable} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themeProvider';

import AppButton from "../../components/AppButton"
import InputField from '../../components/InputField';
import SubmitButton from '../../components/SubmitButton';


const Register = () => {
    const { colors, theme, toggleTheme } = useTheme();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        const devices = [Platform.OS];
        const registerData = {
            username,
            email,
            password,
            devices
        };
        console.log(registerData);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
            <SafeAreaView style={styles.container}>
                <Pressable style={styles.themeToggle} onPress={toggleTheme}>
                    <Ionicons name={theme === 'dark' ? 'sunny' : 'moon'} size={24} color={colors.textPrimary} />
                </Pressable>
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
                <SubmitButton 
                    onPress={handleRegister} 
                    title="Register" 
                    disabled={username === '' || email === '' || password === ''} 
                />
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
    }
});

export default Register;
