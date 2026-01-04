import {Text, View, StyleSheet, Pressable, Alert, TextInput, ActivityIndicator} from 'react-native';
import { useAuth } from '../../context/authProvider.context';
import { useTheme } from '../../context/themeProvider.context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SubmitButton from '../../components/SubmitButton';
import { useUser } from '../../context/user.context';
import { useState, useEffect, useRef } from 'react';


const Profile = () => {
  const { logout, verifiedStatus, sendOTP, verifyEmailOTP } = useAuth();
  const {user, updateUser} = useUser();
  const { colors, theme, toggleTheme } = useTheme();
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [verified, setVerified] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // OTP verification states
  const [showOTPSection, setShowOTPSection] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputs = useRef<Array<TextInput | null>>([]);
  
  // Timer effect for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
    if(user?.email) {
      verifiedStatus(user.email).then((status) => setVerified(status));
    }
  }, [user, verifiedStatus]);

  useEffect(() => {
    setHasChanges(username !== user?.username && username.trim() !== '');
  }, [username, user?.username]);

  // Auto-verify when all OTP fields are filled
  useEffect(() => {
    const otpComplete = otp.every(digit => digit !== '');
    if (otpComplete && !isVerifyingOTP && otpSent) {
      handleVerifyOTP();
    }
  }, [otp, otpSent, isVerifyingOTP]);

  const handleSendOTP = async () => {
    if (!user?.email || !sendOTP) return;
    
    try {
      setIsSendingOTP(true);
      await sendOTP(user.email);
      setOtpSent(true);
      setResendTimer(60);
      Alert.alert('Success', 'OTP sent to your email!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!user?.email || !verifyEmailOTP) return;
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;

    try {
      setIsVerifyingOTP(true);
      await verifyEmailOTP(user.email, otpCode);
      Alert.alert('Success', 'Email verified successfully!');
      setVerified(true);
      setShowOTPSection(false);
      setOtpSent(false);
      setOtp(['', '', '', '', '', '']);
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP');
      setIsVerifyingOTP(false);
    }
  };

  const handleOTPChange = (value: string, index: number) => {
    if (isNaN(Number(value)) && value !== '') return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleTryAgain = () => {
    setOtp(['', '', '', '', '', '']);
    setIsVerifyingOTP(false);
    otpInputs.current[0]?.focus();
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setIsVerifyingOTP(false);
    await handleSendOTP();
  };

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

        {!verified ? <Pressable
          style={[styles.verifyEmailCard, { backgroundColor: colors.bgSecondary }]}
          onPress={() => setShowOTPSection(!showOTPSection)}
        >
          <View style={styles.verifyEmailContent}>
            <Ionicons name="mail-outline" size={24} color={colors.textPrimary} />
            <View style={styles.verifyTextContainer}>
              <Text style={[styles.verifyTitle, { color: colors.textPrimary }]}>
                Verify your email
              </Text>
              <Text style={[styles.verifySubtitle, { color: colors.textSecondary }]}>
                Unlock more features by verifying your email
              </Text>
            </View>
            <Ionicons 
              name={showOTPSection ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={colors.textSecondary} 
            />
          </View>
        </Pressable> : (
          <View style={[styles.verifyEmailCard, { backgroundColor: colors.bgSecondary }]}>
            <View style={styles.verifyEmailContent}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <View style={styles.verifyTextContainer}>
                <Text style={[styles.verifyTitle, { color: colors.textPrimary }]}>
                  Account Verified
                </Text>
                <Text style={[styles.verifySubtitle, { color: colors.textSecondary }]}>
                  Enjoy all our services
                </Text>
              </View>
            </View>
          </View>
        )}
        

        {/* OTP Verification Section */}
        {!verified && showOTPSection && (
          <View style={[styles.otpCard, { backgroundColor: colors.bgSecondary }]}>
            {!otpSent ? (
              // Send OTP Button
              <View style={styles.otpInitialState}>
                <Text style={[styles.otpInstructions, { color: colors.textSecondary }]}>
                  Click the button below to receive a verification code via email
                </Text>
                <Pressable
                  style={[styles.sendOtpButton, { backgroundColor: colors.btnPrimaryBg }]}
                  onPress={handleSendOTP}
                  disabled={isSendingOTP}
                >
                  {isSendingOTP ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.sendOtpButtonText}>Send OTP</Text>
                  )}
                </Pressable>
              </View>
            ) : (
              // OTP Input Section
              <View style={styles.otpInputSection}>
                <Text style={[styles.otpInstructions, { color: colors.textSecondary }]}>
                  Enter the 6-digit code sent to {user?.email}
                </Text>
                
                <View style={styles.otpInputsContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => { otpInputs.current[index] = ref; }}
                      style={[
                        styles.otpInput,
                        { 
                          borderColor: colors.textMuted,
                          color: colors.textPrimary,
                          backgroundColor: colors.bgPrimary
                        }
                      ]}
                      value={digit}
                      onChangeText={(value) => handleOTPChange(value, index)}
                      onKeyPress={(e) => handleOTPKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                      editable={!isVerifyingOTP}
                    />
                  ))}
                </View>

                {isVerifyingOTP && (
                  <View style={styles.verifyingContainer}>
                    <ActivityIndicator size="small" color={colors.textPrimary} />
                    <Text style={[styles.verifyingText, { color: colors.textSecondary }]}>
                      Verifying...
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.otpActionsContainer}>
                  <Pressable
                    style={[
                      styles.otpActionButton,
                      { backgroundColor: colors.bgPrimary },
                      isVerifyingOTP && styles.disabledButton
                    ]}
                    onPress={handleTryAgain}
                    disabled={isVerifyingOTP}
                  >
                    <Text style={[styles.otpActionButtonText, { color: colors.textPrimary }]}>
                      Try Again
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.otpActionButton,
                      { backgroundColor: colors.bgPrimary },
                      (resendTimer > 0 || isVerifyingOTP) && styles.disabledButton
                    ]}
                    onPress={handleResendOTP}
                    disabled={resendTimer > 0 || isVerifyingOTP}
                  >
                    <Text style={[
                      styles.otpActionButtonText,
                      { color: resendTimer > 0 ? colors.textMuted : colors.textPrimary }
                    ]}>
                      {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Send OTP Again'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
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
  verifyEmailCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  verifyEmailContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verifyTextContainer: {
    flex: 1,
  },
  verifyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  verifySubtitle: {
    fontSize: 13,
  },
  otpCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  otpInitialState: {
    alignItems: 'center',
    gap: 20,
  },
  otpInstructions: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  sendOtpButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  sendOtpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  otpInputSection: {
    alignItems: 'center',
    gap: 20,
  },
  otpInputsContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderRadius: 10,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  verifyingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verifyingText: {
    fontSize: 14,
  },
  otpActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  otpActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  otpActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Profile;