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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

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
    if (!newPassword || !confirmPassword) {
      alert('Please fill in both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      // Add your password reset logic here
      console.log('Resetting password:', newPassword);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Password reset successful!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      alert('Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Purple gradient brand section */}
      <LinearGradient
        colors={['#8F3AFF', '#8F3AFF', '#5800AB']}
        style={[styles.brandSection, { paddingTop: insets.top + SCREEN_HEIGHT * 0.05 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Image
          source={require('../assets/passprrive.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </LinearGradient>

      {/* Form section */}
      <View style={styles.formSection}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Please ensure both the passwords match.
        </Text>

        {/* New Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 50 }]}
            placeholder="Create New Password"
            placeholderTextColor="#999999"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
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

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 50 }]}
            placeholder="Re-enter New Password"
            placeholderTextColor="#999999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
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

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmText}>Confirm</Text>
          )}
        </TouchableOpacity>

        {/* Spacer to push everything up */}
        <View style={styles.spacer} />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8F3AFF',
  },
  brandSection: {
    paddingVertical: SCREEN_HEIGHT * 0.04,
    paddingBottom: SCREEN_HEIGHT * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: SCREEN_WIDTH * 0.55,
    height: SCREEN_HEIGHT * 0.08,
    marginBottom: SCREEN_HEIGHT * 0.008,
  },
  tagline: {
    fontSize: SCREEN_WIDTH * 0.035,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SCREEN_WIDTH * 0.07,
    paddingTop: SCREEN_HEIGHT * 0.036,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: '600',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  subtitle: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: '#666666',
    textAlign: 'center',
    lineHeight: SCREEN_WIDTH * 0.054,
    marginBottom: SCREEN_HEIGHT * 0.04,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: SCREEN_HEIGHT * 0.018,
  },
  input: {
    backgroundColor: '#EDEDED',
    borderRadius: 8,
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
    top: SCREEN_HEIGHT * 0.018,
    padding: 4,
  },
  confirmBtn: {
    backgroundColor: '#2D2D2D',
    borderRadius: 35,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: SCREEN_WIDTH * 0.042,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
});