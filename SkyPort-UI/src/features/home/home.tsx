import {Text, View, StyleSheet, Pressable, ScrollView, FlatList} from 'react-native';
import { useTheme } from '../../context/themeProvider.context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppCard from '../../components/AppCard';
import { useAuth } from '../../context/authProvider.context';
import { useUser } from '../../context/user.context';

const Home = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useUser();
  

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.headingPrimary }]}>Sky-Port</Text>
          <Pressable 
            onPress={() => router.push('/profile')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
            <Text style={[styles.username, { color: colors.headingPrimary }]}>{user?.username || 'User'}</Text>
            <Ionicons 
              name="person-circle-outline" 
              size={32} 
              color={colors.textPrimary} 
              />
          </Pressable>
      </View>
      <Text style={[styles.info, { color: colors.textSecondary }]}>Your Activities</Text>
      <View style={styles.content}>
        <AppCard title="Your Files" to="/files" />
        <AppCard title="Your DashBoard" to="/dashboard" />
        <AppCard title="Shared Files" to="/sharedFiles" />
        <AppCard title="Your Friends" to="/friends" />
        <AppCard title="Start a Chat" to="/chats" />
      </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 20,
    marginLeft: 20,
  },
});

export default Home;