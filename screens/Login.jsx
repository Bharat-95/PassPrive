import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';
import LinearGradient from 'react-native-linear-gradient';
import {
  GOOGLE_ICON_IMAGE,
  PASSPRIVE_LOGO_IMAGE,
  isAuthAssetsReady,
  preloadAuthAssets,
} from '../components/authAssets';
import { markLastLogin } from '../services/userActivity';
import AuthLoadingSkeleton from '../components/AuthLoadingSkeleton';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Login() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [transitionLoading, setTransitionLoading] = useState(false);
  const [imagesReady, setImagesReady] = useState(isAuthAssetsReady());

  // ---------------------------
  // Initialize Google Sign In
  // ---------------------------
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
    });

    preloadAuthAssets().finally(() => setImagesReady(true));
  }, []);

  // ----------------------------------------------------------
  // CHECK & INSERT USER IN SUPABASE USERS TABLE
  // ----------------------------------------------------------
  const checkUserInTable = async (user) => {
    try {
      const now = new Date().toISOString();

      // Check if already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingUser) {
        await supabase
          .from('users')
          .update({ last_login: now, last_opened: now, updated_at: now })
          .eq('id', user.id);
        setTransitionLoading(true);
        navigation.replace('Home');
        return;
      }

      // Insert new user
      await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        created_at: new Date(),
        last_login: now,
        last_opened: now,
      });

      setTransitionLoading(true);
      navigation.replace('Details');
    } catch (err) {
      console.log('User insert error:', err);
      setTransitionLoading(false);
    }
  };

  // ----------------------------------------------------------
  // GOOGLE LOGIN
  // ----------------------------------------------------------
  const handleGoogleSignIn = async () => {
    try {
      if (!GOOGLE_WEB_CLIENT_ID) {
        throw new Error(
          'Missing GOOGLE_WEB_CLIENT_ID. Please set it in your .env file.',
        );
      }

      setSocialLoading(true);

      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data.idToken;

      if (!idToken) throw new Error('id_token missing');

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        alert(error.message);
        return;
      }

      await AsyncStorage.setItem('isLoggedIn', 'true');
      await markLastLogin();

      await checkUserInTable(data.user);
    } catch (err) {
      alert(err.message);
    } finally {
      setSocialLoading(false);
    }
  };

  // ----------------------------------------------------------
  // EMAIL LOGIN
  // ----------------------------------------------------------
  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    await AsyncStorage.setItem('isLoggedIn', 'true');
    await markLastLogin();
    await checkUserInTable(data.user);
    setLoading(false);
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
        style={styles.brandSection}
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
        <Text style={styles.title}>Account Login</Text>
        <Text style={styles.subtitle}>
          Welcome Back! Please login to your account
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

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 50 }]}
            placeholder="Password"
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

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginText}>Log In</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* Google Login Button */}
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={handleGoogleSignIn}
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
              <Text style={styles.googleText}>Log In with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Signup Link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupPrompt}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign up</Text>
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
    height: SCREEN_HEIGHT * 0.25,
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
    paddingTop: SCREEN_HEIGHT * 0.036,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: SCREEN_HEIGHT * 0.008,
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  forgotPasswordText: {
    fontSize: SCREEN_WIDTH * 0.036,
    color: '#999999',
  },
  loginBtn: {
    backgroundColor: '#2D2D2D',
    borderRadius: 35,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.028,
  },
  loginText: {
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
