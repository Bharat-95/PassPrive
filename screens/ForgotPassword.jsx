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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import supabase from '../supabase';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ForgotPassword() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReceiveLink = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        {
          redirectTo: 'passprive://reset-password',
        },
      );

      if (error) {
        Alert.alert('Reset Failed', error.message || 'Unable to send reset email.');
        return;
      }

      Alert.alert(
        'Reset Link Sent',
        'If this email is registered, you will receive a password reset link shortly.',
      );
    } catch {
      Alert.alert('Reset Failed', 'Error sending reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    handleReceiveLink();
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
    >
      {/* Purple gradient brand section */}
      <LinearGradient
        colors={['#5800AB', '#8F3AFF', '#8F3AFF']}
        style={styles.brandSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <Image
          source={require('../assets/passprrive.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          No worries, enter your email to receive a link to set a new password.
        </Text>
      </LinearGradient>

      {/* Form section */}
      <View style={styles.formSection}>
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#999999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Receive Link Button */}
        <TouchableOpacity
          style={styles.receiveLinkBtn}
          onPress={handleReceiveLink}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.receiveLinkText}>Receive Link</Text>
          )}
        </TouchableOpacity>

        {/* Resend Link */}
        <View style={styles.resendRow}>
          <Text style={styles.resendPrompt}>Didn't receive the email? </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Sign up Link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupPrompt}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
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
    height: SCREEN_HEIGHT * 0.3,
    paddingTop: 0,
    paddingBottom: SCREEN_HEIGHT * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.018,
    right: SCREEN_WIDTH * 0.04,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: SCREEN_WIDTH * 0.038,
    paddingVertical: SCREEN_HEIGHT * 0.008,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '600',
  },
  logo: {
    width: SCREEN_WIDTH * 0.55,
    height: SCREEN_HEIGHT * 0.08,
    marginBottom: SCREEN_HEIGHT * 0.008,
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: SCREEN_WIDTH * 0.07,
    paddingTop: SCREEN_HEIGHT * 0.036,
    marginTop: -1,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.075,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: SCREEN_HEIGHT * 0.012,
    marginBottom: SCREEN_HEIGHT * 0.012,
  },
  subtitle: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: SCREEN_WIDTH * 0.054,
    marginBottom: SCREEN_HEIGHT * 0.04,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
  },
  inputContainer: {
    marginBottom: SCREEN_HEIGHT * 0.025,
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
  receiveLinkBtn: {
    backgroundColor: '#2D2D2D',
    borderRadius: 35,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  receiveLinkText: {
    color: '#FFFFFF',
    fontSize: SCREEN_WIDTH * 0.042,
    fontWeight: '600',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.04,
  },
  resendPrompt: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: '#666666',
  },
  resendLink: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: '#000000',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  spacer: {
    flex: 1,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SCREEN_HEIGHT * 0.04,
  },
  signupPrompt: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: '#666666',
  },
  signupLink: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: '#000000',
    fontWeight: '700',
  },
});
