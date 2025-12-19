import {View, Text, StyleSheet, TextInput} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

import AppButton from "../../components/AppButton"


const Login = () => {
    return (
        <LinearGradient colors={['#3D3C35FF', '#E7EBF2FF', '#34353AFF']} style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.text}>
                    This is the Android login screen
                </Text>
                <AppButton title="New Here? Register now" to="/(auth)/register" replace />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#302929FF',
        fontSize: 30,
    }
});

export default Login;
