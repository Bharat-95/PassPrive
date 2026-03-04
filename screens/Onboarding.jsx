import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Onboarding() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.mainContent}>
        {/* Logo and tagline section */}
        <View style={styles.logoSection}>
          <Image
            source={require('../assets/boarding.jpg')}
            style={styles.backgroundImage}
          />
          <View style={styles.overlay} />
          
          {/* Skip Button */}
          <TouchableOpacity 
            style={[styles.skipButton, { top: (insets?.top || 0) + 10 }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/passprrive.png')}
              style={styles.passPriveLogo}
              resizeMode="contain"
            />
          </View>
          
          {/* Purple gradient overlay on bottom */}
          <LinearGradient
            colors={['rgba(143, 58, 255, 0)', 'rgba(143, 58, 255, 0.7)', '#8F3AFF']}
            style={styles.bottomGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            {/* Purple section text - positioned at bottom of image */}
            <View style={styles.purpleSection}>
              <Text style={styles.purpleText}>
                Unlock exclusive deals, hidden gems, and the hottest attractions across Mauritius.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Action buttons */}
        <View style={[styles.actionSection, { paddingBottom: (insets?.bottom || 0) + 32 }]}>
          <TouchableOpacity
            style={styles.createAccountBtn}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.createAccountText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8F3AFF',
  },
  mainContent: {
    flex: 1,
  },
  logoSection: {
    flex: 1,
    position: 'relative',
    minHeight: SCREEN_HEIGHT * 0.65,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.24,
  },
  skipButton: {
    position: 'absolute',
    right: SCREEN_WIDTH * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.01,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '600',
  },
  logoContainer: {
    position: 'absolute',
    top: '12%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  passPriveLogo: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.1,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  tagline: {
    fontSize: SCREEN_WIDTH * 0.038,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '400',
  },
  purpleSection: {
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    paddingVertical: SCREEN_HEIGHT * 0.03,
    justifyContent: 'flex-end',
    flex: 1,
  },
  purpleText: {
    fontSize: SCREEN_WIDTH * 0.045,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: SCREEN_WIDTH * 0.065,
    fontWeight: '600',
  },
  actionSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SCREEN_WIDTH * 0.075,
    paddingTop: SCREEN_HEIGHT * 0.035,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 0,
  },
  createAccountBtn: {
    backgroundColor: '#2D2D2D',
    paddingVertical: SCREEN_HEIGHT * 0.02,
    borderRadius: 35,
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  createAccountText: {
    color: '#FFFFFF',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.035,
  },
  loginPrompt: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: '#737373',
    fontWeight: '400',
  },
  loginLink: {
    fontSize: SCREEN_WIDTH * 0.037,
    color: '#000000',
    fontWeight: '700',
  },
});
