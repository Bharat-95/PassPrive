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

export default function Signup() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    // Add your signup logic here
    console.log('Signup:', { fullName, email, password });
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setSocialLoading(true);
    // Add your Google signup logic here
    console.log('Google signup');
    setSocialLoading(false);
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
        {/* Skip Button */}
        <TouchableOpacity 
          style={[styles.skipButton, { top: (insets?.top || 0) + 8 }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        
        <Image
          source={require('../assets/passprrive.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </LinearGradient>

      {/* Form section */}
      <View style={styles.formSection}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>
          We're so excited to have you onboard!{'\n'}Fill in your details below to get started.
        </Text>

        {/* Full Name Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            placeholderTextColor="#999999"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </View>

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

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 50 }]}
            placeholder="Create Password"
            placeholderTextColor="#999999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Eye size={20} color="#999999" />
            ) : (
              <EyeOff size={20} color="#999999" />
            )}
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signupText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* Google Sign Up Button */}
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={handleGoogleSignup}
          disabled={socialLoading}
        >
          {socialLoading ? (
            <ActivityIndicator color="#666666" />
          ) : (
            <>
              <Image
                source={require('../assets/google.png')}
                style={styles.googleIcon}
                resizeMode="contain"
              />
              <Text style={styles.googleText}>Sign Up with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
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
  skipButton: {
    position: 'absolute',
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
    marginBottom: SCREEN_HEIGHT * 0.013,
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
  signupBtn: {
    backgroundColor: '#2D2D2D',
    borderRadius: 35,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
    marginBottom: SCREEN_HEIGHT * 0.028,
  },
  signupText: {
    color: '#FFFFFF',
    fontSize: SCREEN_WIDTH * 0.042,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.023,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  orText: {
    marginHorizontal: SCREEN_WIDTH * 0.04,
    fontSize: SCREEN_WIDTH * 0.035,
    color: '#666666',
    fontWeight: '500',
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    paddingVertical: SCREEN_HEIGHT * 0.018,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  googleIcon: {
    width: SCREEN_WIDTH * 0.065,
    height: SCREEN_WIDTH * 0.065,
    marginRight: SCREEN_WIDTH * 0.025,
  },
  googleText: {
    color: '#444444',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '500',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SCREEN_HEIGHT * 0.04,
  },
  loginPrompt: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: '#666666',
  },
  loginLink: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: '#000000',
    fontWeight: '700',
  },
});