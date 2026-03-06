import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../supabase';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ResetPassword() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    const trimmedPassword = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedPassword || !trimmedConfirm) {
      Alert.alert('Missing Details', 'Please fill in both password fields.');
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    if (trimmedPassword.length < 8) {
      Alert.alert(
        'Weak Password',
        'Use at least 8 characters for better security.',
      );
      return;
    }

    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasRecoverySession = !!sessionData?.session?.user;

      if (!hasRecoverySession) {
        Alert.alert(
          'Invalid Reset Session',
          'Open the latest reset link from your email and try again.',
        );
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: trimmedPassword,
      });

      if (error) {
        Alert.alert('Reset Failed', error.message || 'Unable to reset password.');
        return;
      }

      await supabase.auth.signOut();
      await AsyncStorage.multiRemove(['isLoggedIn', 'auth_user']);

      Alert.alert('Password Updated', 'Your password has been reset successfully.', [
        {
          text: 'Go to Login',
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            }),
        },
      ]);
    } catch {
      Alert.alert('Reset Failed', 'Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
    >
      <LinearGradient
        colors={['#5800AB', '#8F3AFF', '#8F3AFF']}
        style={[styles.brandSection, { paddingTop: (insets?.top || 0) + SCREEN_HEIGHT * 0.03 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Image
          source={require('../assets/passprrive.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </LinearGradient>

      <View style={styles.formSection}>
        <Text style={styles.title}>Set New Password</Text>
        <Text style={styles.subtitle}>
          Enter a strong new password to secure your account.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 50 }]}
            placeholder="New Password"
            placeholderTextColor="#999999"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? (
              <Eye size={20} color="#999999" />
            ) : (
              <EyeOff size={20} color="#999999" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 50 }]}
            placeholder="Confirm New Password"
            placeholderTextColor="#999999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <Eye size={20} color="#999999" />
            ) : (
              <EyeOff size={20} color="#999999" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, loading && styles.disabledBtn]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmText}>Update Password</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backToLogin}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8F3AFF',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#8F3AFF',
  },
  brandSection: {
    minHeight: SCREEN_HEIGHT * 0.22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SCREEN_HEIGHT * 0.03,
  },
  logo: {
    width: SCREEN_WIDTH * 0.56,
    height: SCREEN_HEIGHT * 0.08,
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: SCREEN_WIDTH * 0.07,
    paddingTop: SCREEN_HEIGHT * 0.036,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.075,
    fontWeight: '700',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.012,
  },
  subtitle: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: '#666666',
    textAlign: 'center',
    lineHeight: SCREEN_WIDTH * 0.054,
    marginBottom: SCREEN_HEIGHT * 0.035,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  input: {
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_HEIGHT * 0.018,
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#2D2D2D',
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  eyeIcon: {
    position: 'absolute',
    right: SCREEN_WIDTH * 0.04,
    top: SCREEN_HEIGHT * 0.017,
    padding: 4,
  },
  confirmBtn: {
    backgroundColor: '#2D2D2D',
    borderRadius: 35,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.014,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: SCREEN_WIDTH * 0.042,
    fontWeight: '600',
  },
  backToLogin: {
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.022,
  },
  backToLoginText: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: '#6F6F6F',
    fontWeight: '600',
  },
});
