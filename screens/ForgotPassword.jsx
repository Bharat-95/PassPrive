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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ForgotPassword() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReceiveLink = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      // Add your forgot password logic here
      console.log('Sending reset link to:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Password reset link sent to your email!');
      // Navigate to reset password screen or back to login
      // navigation.navigate('ResetPassword');
    } catch (error) {
      alert('Error sending reset link. Please try again.');
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
        <Text style={styles.tagline}>Your Pass to the Island's Best.</Text>
      </LinearGradient>

      {/* Form section */}
      <View style={styles.formSection}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          No worries, enter your email to receive a link to set a new password.
        </Text>

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