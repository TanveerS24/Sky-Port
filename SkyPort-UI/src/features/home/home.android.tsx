import {Text, View, StyleSheet, Pressable} from 'react-native';
import { useAuth } from '../../context/authProvider';
import { useTheme } from '../../context/themeProvider';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  const { logout } = useAuth();
  const { colors, theme, toggleTheme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
        <Pressable style={styles.themeToggle} onPress={toggleTheme}>
          <Ionicons name={theme === 'dark' ? 'sunny' : 'moon'} size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.headingPrimary }]}>Home Screen - Android</Text>
        <Pressable style={[styles.button, { backgroundColor: colors.btnPrimaryBg }]} onPress={logout}>
          <Text style={[styles.buttonText, { color: colors.btnPrimaryText }]}>Logout</Text>
        </Pressable>
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
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
});

export default Home;