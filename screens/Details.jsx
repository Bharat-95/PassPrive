import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import supabase from '../supabase';
import { ThemeContext } from '../App';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const showError = message => Alert.alert('Profile', message);

export default function Details() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { mode, colors } = useContext(ThemeContext);
  const isDark = mode === 'dark';
  const brandGradient = ['#5800AB', '#8F3AFF', '#8F3AFF'];
  const secondaryTextColor = isDark ? '#CFCFCF' : '#666666';
  const inputTextColor = isDark ? '#FFFFFF' : '#2D2D2D';
  const inputBgColor = isDark ? '#2D2D2D' : '#EDEDED';
  const inputBorderColor = isDark ? '#4A4A4A' : '#D0D0D0';
  const placeholderColor = isDark ? '#B8B8B8' : '#999999';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [defaultAddress, setDefaultAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userId, setUserId] = useState(null);

  const resolveCurrentUserId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id) return user.id;

    const rawStoredUser = await AsyncStorage.getItem('auth_user');
    const storedUser = rawStoredUser ? JSON.parse(rawStoredUser) : null;
    return storedUser?.id || null;
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const resolvedUserId = await resolveCurrentUserId();
        if (!resolvedUserId) {
          showError('User not found.');
          setLoadingProfile(false);
          return;
        }

        setUserId(resolvedUserId);

        const { data } = await supabase
          .from('users')
          .select('full_name, phone, default_address, default_lat, default_lng')
          .eq('id', resolvedUserId)
          .single();

        if (data?.full_name) setFullName(data.full_name);
        if (data?.phone) setPhone(data.phone);
        if (data?.default_address) {
          setDefaultAddress(data.default_address);
        } else {
          const savedLocation = await AsyncStorage.getItem('user_location');
          if (savedLocation) setDefaultAddress(savedLocation);
        }
      } catch (error) {
        console.log('Load profile error:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!fullName.trim() || !phone.trim()) {
      showError('Please fill all fields.');
      return;
    }

    try {
      setLoading(true);

      const resolvedUserId = userId || (await resolveCurrentUserId());
      if (!resolvedUserId) {
        showError('User not found.');
        return;
      }

      const savedLocation = await AsyncStorage.getItem('user_location');
      const rawCoords = await AsyncStorage.getItem('user_location_coords');
      const parsedCoords = rawCoords ? JSON.parse(rawCoords) : null;
      const finalAddress = defaultAddress || savedLocation || null;
      const finalLat =
        parsedCoords && typeof parsedCoords.latitude === 'number'
          ? parsedCoords.latitude
          : null;
      const finalLng =
        parsedCoords && typeof parsedCoords.longitude === 'number'
          ? parsedCoords.longitude
          : null;

      // send to backend API
      const response = await fetch('https://nxxacdlmcc.execute-api.ap-south-1.amazonaws.com/api/user/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: resolvedUserId,
          full_name: fullName,
          phone: phone,
          default_address: finalAddress,
          default_lat: finalLat,
          default_lng: finalLng,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        showError(result.message || 'Something went wrong.');
        return;
      }

      // keep users table in sync even if backend ignores new fields
      await supabase
        .from('users')
        .update({
          full_name: fullName,
          phone,
          default_address: finalAddress,
          default_lat: finalLat,
          default_lng: finalLng,
          updated_at: new Date().toISOString(),
        })
        .eq('id', resolvedUserId);

      // navigate home
      navigation.replace('Home');
    } catch (e) {
      console.log('Details error:', e);
      showError('Failed to save details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={[styles.container, { backgroundColor: '#8F3AFF' }]}
      contentContainerStyle={[styles.scrollContent, { backgroundColor: '#8F3AFF' }]}
      showsVerticalScrollIndicator={false}
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
    >
      <LinearGradient
        colors={brandGradient}
        style={styles.brandSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <TouchableOpacity
          style={[styles.skipButton, { top: Math.max((insets?.top || 0) - 6, 0) }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.heroTextWrap}>
          <Text style={styles.header}>Add Details</Text>
          <Text style={styles.subHeader}>
            Add your details to finish account setup and continue.
          </Text>
        </View>
      </LinearGradient>

      <View style={[styles.formSection, { backgroundColor: isDark ? colors.card : '#FFFFFF' }]}>
        {loadingProfile ? (
          <ActivityIndicator size="large" color="#8F3AFF" style={styles.profileLoader} />
        ) : null}

        <View style={styles.inputBox}>
          <Text style={[styles.label, { color: secondaryTextColor }]}>Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor={placeholderColor}
            value={fullName}
            onChangeText={setFullName}
            style={[
              styles.input,
              { color: inputTextColor, backgroundColor: inputBgColor, borderColor: inputBorderColor },
            ]}
            editable={!loadingProfile}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={[styles.label, { color: secondaryTextColor }]}>Phone Number</Text>
          <TextInput
            placeholder="Enter your phone number"
            placeholderTextColor={placeholderColor}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={[
              styles.input,
              { color: inputTextColor, backgroundColor: inputBgColor, borderColor: inputBorderColor },
            ]}
            editable={!loadingProfile}
          />
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={loading || loadingProfile}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveText}>Save & Continue</Text>
          )}
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
    width: '100%',
    alignSelf: 'stretch',
    height: SCREEN_HEIGHT * 0.27,
    paddingTop: 0,
    paddingBottom: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.07,
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
  header: {
    color: '#FFFFFF',
    fontSize: SCREEN_WIDTH * 0.076,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.012,
    textShadowColor: 'rgba(0,0,0,0.22)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subHeader: {
    color: '#F8F1FF',
    fontSize: SCREEN_WIDTH * 0.037,
    textAlign: 'center',
    lineHeight: SCREEN_WIDTH * 0.055,
    width: '100%',
    paddingHorizontal: SCREEN_WIDTH * 0.02,
  },
  formSection: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: SCREEN_WIDTH * 0.07,
    paddingTop: SCREEN_HEIGHT * 0.04,
    marginTop: -1,
  },
  profileLoader: {
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  inputBox: {
    marginBottom: SCREEN_HEIGHT * 0.016,
  },
  label: {
    color: '#666666',
    marginBottom: 8,
    fontSize: SCREEN_WIDTH * 0.036,
    fontWeight: '500',
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
  saveBtn: {
    backgroundColor: '#2D2D2D',
    borderRadius: 35,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: SCREEN_WIDTH * 0.042,
    fontWeight: '600',
  },
});
