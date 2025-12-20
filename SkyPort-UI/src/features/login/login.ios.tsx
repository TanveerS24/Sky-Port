import {View, Text, StyleSheet, TextInput} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import AppButton from "../../components/AppButton"
import InputField from '../../components/InputField';
import SubmitButton from '../../components/SubmitButton';


const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
        <LinearGradient colors={['#80F9F9FF', '#8A9E0AFF']} style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.text}>
                    Welcome Back
                </Text>
                <Text style={styles.details}>
                    Enter Username
                </Text>
                <InputField 
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                />
                <Text style={styles.details}>
                    Enter Password
                </Text>
                <InputField
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                />
                <SubmitButton onPress={() => console.log({username, password})} title="Login" disabled={username === '' || password === ''} />
                <AppButton title="New Here? Register now" to="/(auth)/register" replace />
            </SafeAreaView>
        </LinearGradient>
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
        color: '#1A1412FF',
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
        color: '#3A2F2B',
    }
});

export default Login;
