import {View, Text, Pressable, StyleSheet} from 'react-native';
import {router} from 'expo-router';

const toLogin = () => {
    router.replace('/(auth)/login');
}

const Register = () => {
    return (
        <View style={styles.container}>
            <Text>
                This is the Android register screen.
            </Text>
            <Pressable onPress={toLogin}>
                <Text>Back to Login</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
export default Register;
