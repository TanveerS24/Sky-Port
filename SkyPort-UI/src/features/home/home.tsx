import {Text, View, StyleSheet, Pressable} from 'react-native';
import { useTheme } from '../../context/themeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Home = () => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
        <Pressable 
          style={styles.profileIcon} 
          onPress={() => router.push('/profile')}
        >
          <Ionicons 
            name="person-circle-outline" 
            size={32} 
            color={colors.textPrimary} 
          />
        </Pressable>
        <Text style={[styles.title, { color: colors.headingPrimary }]}>Home Screen</Text>
        <Text style={[styles.subtitle, { color: colors.textPrimary }]}>Welcome to Sky Port!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  profileIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
});

export default Home;