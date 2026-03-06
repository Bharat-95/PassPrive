import React, { useState, useEffect } from 'react';
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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';
import supabase from '../supabase';
import {
  GOOGLE_ICON_IMAGE,
  PASSPRIVE_LOGO_IMAGE,
  isAuthAssetsReady,
  preloadAuthAssets,
} from '../components/authAssets';
import { markLastLogin } from '../services/userActivity';
import AuthLoadingSkeleton from '../components/AuthLoadingSkeleton';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SHORT_SCREEN = SCREEN_HEIGHT <= 760;
const BRAND_SECTION_HEIGHT = IS_SHORT_SCREEN ? SCREEN_HEIGHT * 0.19 : SCREEN_HEIGHT * 0.25;
const FORM_TOP_PADDING = IS_SHORT_SCREEN ? SCREEN_HEIGHT * 0.024 : SCREEN_HEIGHT * 0.036;
const SUBTITLE_MARGIN_BOTTOM = IS_SHORT_SCREEN ? SCREEN_HEIGHT * 0.024 : SCREEN_HEIGHT * 0.04;
const INPUT_MARGIN_BOTTOM = IS_SHORT_SCREEN ? SCREEN_HEIGHT * 0.009 : SCREEN_HEIGHT * 0.013;
const INPUT_PADDING_VERTICAL = IS_SHORT_SCREEN ? SCREEN_HEIGHT * 0.014 : SCREEN_HEIGHT * 0.018;
const CTA_PADDING_VERTICAL = IS_SHORT_SCREEN ? SCREEN_HEIGHT * 0.016 : SCREEN_HEIGHT * 0.02;
const CTA_MARGIN_BOTTOM = IS_SHORT_SCREEN ? SCREEN_HEIGHT * 0.018 : SCREEN_HEIGHT * 0.028;
const LOGIN_ROW_PADDING_BOTTOM = IS_SHORT_SCREEN ? SCREEN_HEIGHT * 0.024 : SCREEN_HEIGHT * 0.04;
const GOOGLE_SIGNUP_FALLBACK_ERROR = 'Unable to continue with Google. Please try again.';
const showError = message => Alert.alert('Signup Error', message);
const showInfo = message => Alert.alert('Notice', message);

const sanitizeGoogleSignupMessage = err => {
  const code = String(err?.code || '');
  const message = String(err?.message || '').toLowerCase();

  if (code === 'SIGN_IN_CANCELLED' || code === '12501' || message.includes('cancel')) {
    return 'Google sign-in was cancelled.';
  }

  if (message.includes('play services')) {
    return 'Google Play Services is unavailable. Please update and try again.';
  }

  if (message.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (message.includes('id_token') || message.includes('id token')) {
    return 'Unable to verify your Google account. Please try again.';
  }

  if (message.includes('invalid') || message.includes('credential')) {
    return 'Google authentication failed. Please try again.';
  }

  return GOOGLE_SIGNUP_FALLBACK_ERROR;
};

export default function Signup() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [imagesReady, setImagesReady] = useState(isAuthAssetsReady());

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
    });

    preloadAuthAssets().finally(() => setImagesReady(true));
  }, []);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [transitionLoading, setTransitionLoading] = useState(false);

  const syncUserProfile = async (user, fallbackName = '') => {
    if (!user?.id) return false;
    const now = new Date().toISOString();

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingUser) {
      await supabase
        .from('users')
        .update({ last_login: now, last_opened: now, updated_at: now })
        .eq('id', user.id);
      return true;
    }

    const { error } = await supabase.from('users').insert({
      id: user.id,
      email: user.email,
      full_name: fallbackName || user.user_metadata?.full_name || '',
      created_at: new Date(),
      last_login: now,
      last_opened: now,
    });

    return !error;
  };

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      showInfo('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName || null },
        },
      });

      if (error) {
        showError(error.message || 'Signup failed.');
        setLoading(false);
        return;
      }

      const user = data?.user || data?.session?.user;
      if (user) {
        await syncUserProfile(user, fullName);
        await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      }

      await AsyncStorage.setItem('isLoggedIn', 'true');
      await markLastLogin();
      setTransitionLoading(true);
      navigation.replace('Details');
    } catch (err) {
      showError('Signup failed. Please try again.');
      setTransitionLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setSocialLoading(true);
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken || (userInfo.data && userInfo.data.idToken);

      if (!idToken) {
        showError('Unable to verify your Google account. Please try again.');
        return;
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        showError(sanitizeGoogleSignupMessage(error));
        return;
      }

      await AsyncStorage.setItem('isLoggedIn', 'true');
      if (data?.user) {
        await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
      }
      await syncUserProfile(data?.user);
      await markLastLogin();

      setTransitionLoading(true);
      navigation.replace('Details');
    } catch (err) {
      showError(sanitizeGoogleSignupMessage(err));
      setTransitionLoading(false);
    } finally {
      setSocialLoading(false);
    }
  };

  if (!imagesReady) {
    return (
      <View style={styles.imageLoaderWrap}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
      {/* Purple gradient brand section */}
      <LinearGradient
        colors={['#5800AB', '#8F3AFF', '#8F3AFF']}
        style={[styles.brandSection, { height: BRAND_SECTION_HEIGHT }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Skip Button */}
        <TouchableOpacity 
          style={[styles.skipButton, { top: Math.max((insets?.top || 0) - 6, 0) }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        
        <Image
          source={PASSPRIVE_LOGO_IMAGE}
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
                source={GOOGLE_ICON_IMAGE}
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
      {loading || socialLoading || transitionLoading ? <AuthLoadingSkeleton /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  imageLoaderWrap: {
    flex: 1,
    backgroundColor: '#8F3AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#8F3AFF',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#8F3AFF',
  },
  brandSection: {
    paddingTop: 0,
    paddingBottom: SCREEN_HEIGHT * 0.015,
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
    width: SCREEN_WIDTH * 0.56,
    height: SCREEN_HEIGHT * 0.08,
    marginBottom: SCREEN_HEIGHT * 0.004,
  },
  tagline: {
    fontSize: SCREEN_WIDTH * 0.035,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: SCREEN_WIDTH * 0.07,
    paddingTop: FORM_TOP_PADDING,
    marginTop: -1,
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
    marginBottom: SUBTITLE_MARGIN_BOTTOM,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: INPUT_MARGIN_BOTTOM,
  },
  input: {
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: INPUT_PADDING_VERTICAL,
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
    paddingVertical: CTA_PADDING_VERTICAL,
    alignItems: 'center',
    marginBottom: CTA_MARGIN_BOTTOM,
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
    paddingBottom: LOGIN_ROW_PADDING_BOTTOM,
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
