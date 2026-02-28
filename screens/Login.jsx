import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Login() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  // ---------------------------
  // Initialize Google Sign In
  // ---------------------------
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '292641565230-p3jb8hd592mepn83td74ip7fvf6jtm0s.apps.googleusercontent.com',
      iosClientId:
        '292641565230-b8dkp2337t2ree5os8cctaf1cjj6bv79.apps.googleusercontent.com',
    });
  }, []);

  // ----------------------------------------------------------
  // CHECK & INSERT USER IN SUPABASE USERS TABLE
  // ----------------------------------------------------------
  const checkUserInTable = async (user) => {
    try {
      // Check if already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingUser) {
        navigation.replace('Home');
        return;
      }

      // Insert new user
      await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        created_at: new Date(),
      });

      navigation.replace('Details');
    } catch (err) {
      console.log('User insert error:', err);
    }
  };

  // ----------------------------------------------------------
  // GOOGLE LOGIN
  // ----------------------------------------------------------
  const handleGoogleSignIn = async () => {
    try {
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
    if (!email || !pass) return;
    setLoading(true);

    let result = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (result.error) {
      result = await supabase.auth.signUp({
        email,
        password: pass,
      });

      if (result.error) {
        alert(result.error.message);
        setLoading(false);
        return;
      }
    }

    await checkUserInTable(result.data.user);
    setLoading(false);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1, backgroundColor: '#0D0D0D' }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <View style={styles.bg}>
        <TouchableOpacity
          style={[styles.skipButton, { top: insets.top + 12 }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.mainContainer}>
          <View style={styles.hero}>
            <Image
              source={require('../assets/Login.jpg')}
              style={styles.heroImage}
            />
            <View style={styles.heroOverlay} />
            <Text style={styles.brand}>PassPrivé</Text>
            <Text style={styles.tagline}>Luxury • Comfort • Dining</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Log in or sign up</Text>

            <View style={styles.inputBox}>
              <Mail size={20} color="#B3B3B3" />
              <TextInput
                placeholder="Email address"
                placeholderTextColor="#777"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputBox}>
              <Lock size={20} color="#B3B3B3" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#777"
                secureTextEntry={secure}
                style={styles.input}
                value={pass}
                onChangeText={setPass}
              />
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                {secure ? (
                  <EyeOff size={20} color="#777" />
                ) : (
                  <Eye size={20} color="#777" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Continue</Text>}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.or}>or continue with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleGoogleSignIn}>
                {socialLoading ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <Image source={require('../assets/google.png')} style={styles.socialIcon} />
                )}
                <Text style={styles.google}>Login or Signup With Google</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.agree}>
              By continuing, you agree to our <Text style={styles.link}>Terms</Text> &{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0D0D0D' },
  mainContainer: { flex: 1, justifyContent: 'flex-end' },
  skipButton: {
    position: 'absolute',
    right: 20,
    zIndex: 50,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
  },
  skipText: { color: '#fff', fontSize: 13 },
  hero: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', zIndex: 2 },
  heroImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  brand: { color: '#fff', fontSize: 32, fontWeight: '700' },
  tagline: { color: '#B3B3B3', marginTop: 4, fontSize: 14, marginBottom: 24 },
  card: {
    flex: 0,
    height: SCREEN_HEIGHT * 0.6,
    backgroundColor: '#0D0D0D',
    padding: 22,
    marginTop: -60,
    paddingTop: 40,
  },
  title: { fontSize: 20, fontWeight: '600', color: '#fff', marginBottom: 10, marginTop: 40 },
  inputBox: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  input: { flex: 1, marginLeft: 10, color: '#fff' },
  loginBtn: {
    backgroundColor: '#C59D5F',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  line: { flex: 1, height: 1, backgroundColor: '#2A2A2A' },
  or: { color: '#777', marginHorizontal: 12 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 25 },
  iconBtn: {
    backgroundColor: 'white',
    padding: 13,
    width: '98%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15,
  },
  socialIcon: { width: 26, height: 26 },
  agree: { color: '#777', textAlign: 'center', marginTop: 10, lineHeight: 20, fontSize: 12 },
  link: { color: '#DA3224', textDecorationLine: 'underline' },
  google: { fontWeight: '600' },
});
