import {Text, View, StyleSheet, Pressable, Alert, TextInput} from 'react-native';
import { useAuth } from '../../context/authProvider';
import { useTheme } from '../../context/themeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SubmitButton from '../../components/SubmitButton';
import { useState, useEffect } from 'react';


const Profile = () => {
  const { logout, user, updateUser } = useAuth();
  const { colors, theme, toggleTheme } = useTheme();
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  useEffect(() => {
    setHasChanges(username !== user?.username && username.trim() !== '');
  }, [username, user?.username]);

  const handleEditUsername = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setUsername(user?.username || '');
  };

  const handleSaveChanges = async () => {
    if (!hasChanges || !username.trim()) return;

    try {
      setIsSaving(true);
      await updateUser({ username: username.trim() });
      Alert.alert('Success', 'Username updated successfully!');
      setIsEditMode(false);
    } catch (error: any) {
      Alert.alert('Update Failed', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  const handleChangePassword = () => {
    // Non-functional for now
    Alert.alert('Change Password', 'This feature is coming soon!');
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
        {/* User Information Card */}
        <View style={[styles.card, { backgroundColor: colors.bgSecondary }]}>
          <View style={styles.infoSection}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Username</Text>
            {isEditMode ? (
              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.textMuted }]}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor={colors.textMuted}
                autoFocus
              />
            ) : (
              <View style={styles.usernameRow}>
                <Text style={[styles.infoText, { color: colors.textPrimary }]}>
                  {user?.username || 'Loading...'}
                </Text>
                <Pressable onPress={handleEditUsername} style={styles.editButton}>
                  <Ionicons name="pencil" size={20} color={colors.textPrimary} />
                </Pressable>
              </View>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.textMuted }]} />

          <View style={styles.infoSection}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>
              {user?.email || 'Loading...'}
            </Text>
          </View>
        </View>

        {/* Save/Cancel Buttons - Only show in edit mode */}
        {isEditMode && (
          <View style={styles.editButtonsContainer}>
            <Pressable 
              style={[styles.cancelButton, { backgroundColor: colors.bgSecondary }]} 
              onPress={handleCancelEdit}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textPrimary }]}>
                Cancel
              </Text>
            </Pressable>

            <Pressable 
              style={[
                styles.saveButtonSmall, 
                { backgroundColor: colors.bgSecondary },
                (!hasChanges || isSaving) && styles.disabledButton
              ]} 
              onPress={handleSaveChanges}
              disabled={!hasChanges || isSaving}
            >
              <Text style={[
                styles.saveButtonText, 
                { color: hasChanges && !isSaving ? colors.textPrimary : colors.textMuted }
              ]}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Change Password Button */}
        <Pressable 
          style={[styles.changePasswordButton, { backgroundColor: colors.bgSecondary }]} 
          onPress={handleChangePassword}
        >
          <Ionicons name="lock-closed-outline" size={20} color={colors.textPrimary} />
          <Text style={[styles.changePasswordText, { color: colors.textPrimary }]}>
            Change Password
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>

        {/* Theme Toggle Card */}
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
  infoSection: {
    marginVertical: 8,
  },
  usernameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  editButton: {
    padding: 4,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  divider: {
    height: 1,
    opacity: 0.2,
    marginVertical: 12,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonSmall: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  changePasswordText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
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
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,

  },
});

export default Profile;