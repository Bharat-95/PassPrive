import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
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
import { ThemeContext } from '../App';

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

export default function Login() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark';
  const brandGradient = ['#5800AB', '#8F3AFF', '#8F3AFF'];
  const formTitleColor = isDark ? '#FFFFFF' : '#1E1E1E';
  const secondaryTextColor = isDark ? '#CFCFCF' : '#666666';
  const linkTextColor = isDark ? '#FFFFFF' : '#000000';
  const inputTextColor = isDark ? '#FFFFFF' : '#2D2D2D';
  const inputBgColor = isDark ? '#2D2D2D' : '#EDEDED';
  const inputBorderColor = isDark ? '#4A4A4A' : '#D0D0D0';
  const placeholderColor = isDark ? '#B8B8B8' : '#999999';
  const googleBtnBg = isDark ? '#2D2D2D' : '#FFFFFF';
  const primaryBtnBg = isDark ? '#F1F1F1' : '#2D2D2D';
  const primaryBtnText = isDark ? '#111111' : '#FFFFFF';
  const formSurfaceColor = isDark ? '#2A2A2A' : '#FFFFFF';
  const [keyboardOpen, setKeyboardOpen] = useState(false);

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

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardOpen(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardOpen(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
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
      <View style={[styles.imageLoaderWrap, { backgroundColor: formSurfaceColor }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <>
      <KeyboardAwareScrollView
        style={[styles.container, { backgroundColor: formSurfaceColor }]}
        contentContainerStyle={[styles.scrollContent, { backgroundColor: formSurfaceColor }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        scrollEnabled={keyboardOpen}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        enableAutomaticScroll
        enableOnAndroid
        resetScrollToCoords={{ x: 0, y: 0 }}
        extraScrollHeight={24}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.contentWrap}>
      {/* Purple gradient brand section */}
      <LinearGradient
        colors={brandGradient}
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
      <View style={styles.formCardWrap}>
      <View
        style={[
          styles.formSection,
          {
            backgroundColor: formSurfaceColor,
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E8E8E8',
            paddingBottom: Math.max(LOGIN_ROW_PADDING_BOTTOM, (insets?.bottom || 0) + 12),
          },
        ]}
      >
        <Text style={[styles.title, { color: formTitleColor }]}>Account Login</Text>
        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
          Welcome Back! Please login to your account
        </Text>

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

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                paddingRight: 50,
                color: inputTextColor,
                backgroundColor: inputBgColor,
                borderColor: inputBorderColor,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={placeholderColor}
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
          <Text style={[styles.forgotPasswordText, { color: secondaryTextColor }]}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: primaryBtnBg }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={primaryBtnText} />
          ) : (
            <Text style={[styles.loginText, { color: primaryBtnText }]}>Log In</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={[styles.orText, { color: secondaryTextColor }]}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* Google Login Button */}
        <TouchableOpacity
          style={[
            styles.googleBtn,
            {
              backgroundColor: googleBtnBg,
              borderColor: isDark ? '#4A4A4A' : '#D0D0D0',
            },
          ]}
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
              <Text style={[styles.googleText, { color: isDark ? '#FFFFFF' : '#444444' }]}>Log In with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Signup Link */}
        <View style={styles.signupRow}>
          <Text style={[styles.signupPrompt, { color: secondaryTextColor }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.signupLink, { color: linkTextColor }]}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
      </View>
      </TouchableWithoutFeedback>
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: SCREEN_HEIGHT,
  },
  contentWrap: {
    flex: 1,
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
    overflow: 'hidden',
    borderWidth: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.07,
    paddingTop: FORM_TOP_PADDING,
    marginTop: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 3,
  },
  formCardWrap: {
    marginTop: -34,
    zIndex: 3,
    backgroundColor: 'transparent',
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
    paddingVertical: CTA_PADDING_VERTICAL,
    alignItems: 'center',
    marginBottom: CTA_MARGIN_BOTTOM,
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
    paddingBottom: LOGIN_ROW_PADDING_BOTTOM,
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
