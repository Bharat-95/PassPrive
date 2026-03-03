import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineFade, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Shimmer effect
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    const checkLogin = async () => {
      const isLogged = await AsyncStorage.getItem("isLoggedIn");

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: isLogged === "true" ? "Home" : "Onboarding" }],
        });
      }, 2000);
    };

    checkLogin();
  }, []);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <LinearGradient
      colors={['#5800AB', '#8F3AFF', '#9F3AFF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Shimmer overlay effect */}
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslate }],
          },
        ]}
      />

      {/* Logo and branding */}
      <View style={styles.content}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Image
            source={require('../assets/passprrive.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

      
      </View>

      {/* Bottom branding */}
      <Animated.View style={[styles.bottomBranding, { opacity: taglineFade }]}>
        <Text style={styles.poweredBy}>Experience Mauritius Like Never Before</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ skewX: '-20deg' }],
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.12,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: SCREEN_WIDTH * 0.042,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  bottomBranding: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.08,
    alignItems: 'center',
  },
  poweredBy: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '400',
    letterSpacing: 1,
  },
});
