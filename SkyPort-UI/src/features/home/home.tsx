import {Text, View, StyleSheet, Pressable, ScrollView, FlatList} from 'react-native';
import { useTheme } from '../../context/themeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';


const Home = () => {
  const { colors } = useTheme();
  const router = useRouter();
  

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.headingPrimary }]}>Sky-Port</Text>

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
      </View>
      <Pressable
        onPress={() => router.push('/files')}
      >
        <Text style={[styles.info, { color: colors.textPrimary }]}>Your Shared Files</Text>
      </Pressable>

      
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
    justifyContent: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    fontWeight: 'bold',
    top: 55,
    left: 20,
    position: 'absolute',
  },
  profileIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  info: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 95,
    marginLeft: 20,
  },
});

export default Home;