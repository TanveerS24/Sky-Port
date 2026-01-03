import {Text, View, StyleSheet, Pressable, Alert} from 'react-native';
import { useAuth } from '../../context/authProvider';
import { useTheme } from '../../context/themeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SubmitButton from '../../components/SubmitButton';


const Profile = () => {
  const { logout } = useAuth();
  const { colors, theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <Pressable 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color={colors.textPrimary} 
        />
      </Pressable>

      <Text style={[styles.title, { color: colors.headingPrimary }]}>Profile</Text>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.bgSecondary }]}>
          <View style={styles.cardRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Theme</Text>
            <Pressable style={styles.themeToggle} onPress={toggleTheme}>
              <Ionicons 
                name={theme === 'dark' ? 'sunny' : 'moon'} 
                size={24} 
                color={colors.textSecondary} 
              />
              <Text style={[styles.themeText, { color: colors.textSecondary }]}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </Pressable>
          </View>
        </View>

        <SubmitButton title="Logout" onPress={handleLogout} />
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Built with ♥ by SkyPort Team
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeText: {
    fontSize: 14,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,

  },
});

export default Profile;