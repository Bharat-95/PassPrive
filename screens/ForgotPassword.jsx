import React, { useState, useContext } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import supabase from '../supabase';
import { ThemeContext } from '../App';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ForgotPassword() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { mode, colors } = useContext(ThemeContext);
  const isDark = mode === 'dark';
  const brandGradient = ['#5800AB', '#8F3AFF', '#8F3AFF'];
  const secondaryTextColor = isDark ? '#CFCFCF' : '#666666';
  const linkTextColor = isDark ? '#FFFFFF' : '#000000';
  const inputTextColor = isDark ? '#FFFFFF' : '#2D2D2D';
  const inputBgColor = isDark ? '#2D2D2D' : '#EDEDED';
  const inputBorderColor = isDark ? '#4A4A4A' : '#D0D0D0';
  const placeholderColor = isDark ? '#B8B8B8' : '#999999';
  const formSurfaceColor = isDark ? colors.card : '#FFFFFF';

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Math.max((insets?.top || 0) + 10, 10)}
      style={[styles.container, { backgroundColor: formSurfaceColor }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: formSurfaceColor }}>
      {/* Purple gradient brand section */}
      <LinearGradient
        colors={brandGradient}
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
      <View style={[styles.formSection, { backgroundColor: formSurfaceColor }]}>
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { color: inputTextColor, backgroundColor: inputBgColor, borderColor: inputBorderColor },
            ]}
            placeholder="Enter Email"
            placeholderTextColor={placeholderColor}
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
          <Text style={[styles.resendPrompt, { color: secondaryTextColor }]}>Didn't receive the email? </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={[styles.resendLink, { color: linkTextColor }]}>Resend</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Sign up Link */}
        <View style={styles.signupRow}>
          <Text style={[styles.signupPrompt, { color: secondaryTextColor }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.signupLink, { color: linkTextColor }]}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
