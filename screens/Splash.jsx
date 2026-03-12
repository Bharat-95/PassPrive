import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Image, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import supabase from "../supabase";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const ONBOARDING_BG = require('../assets/boarding-optimized.jpg');
const ONBOARDING_LOGO = require('../assets/passprrive.png');

export default function SplashScreen() {
  const navigation = useNavigation();
  const [authResolved, setAuthResolved] = useState(false);
  const [onboardingBgReady, setOnboardingBgReady] = useState(false);
  const [onboardingLogoReady, setOnboardingLogoReady] = useState(false);
  const [onboardingBgPrefetched, setOnboardingBgPrefetched] = useState(false);
  const [assetsSettled, setAssetsSettled] = useState(false);
  const [onboardingMinDelayDone, setOnboardingMinDelayDone] = useState(false);
  const [nextRouteName, setNextRouteName] = useState("Onboarding");
  const hasNavigatedRef = useRef(false);

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

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();

    const navigateFromSplash = async () => {
      const [isLogged, sessionResult] = await Promise.all([
        AsyncStorage.getItem("isLoggedIn"),
        supabase.auth.getSession(),
      ]);
      const { data: sessionData } = sessionResult;
      const hasSession = !!sessionData?.session?.user;
      const shouldGoHome = isLogged === "true" && hasSession;

      if (!shouldGoHome) {
        await AsyncStorage.setItem("isLoggedIn", "false");
      }

      setNextRouteName(shouldGoHome ? "Home" : "Onboarding");
      setAuthResolved(true);
    };

    navigateFromSplash();
  }, [fadeAnim, navigation, scaleAnim, shimmerAnim, taglineFade]);

  useEffect(() => {
    const uri = Image.resolveAssetSource(ONBOARDING_BG)?.uri;
    if (!uri) {
      setOnboardingBgPrefetched(true);
      return;
    }
    Image.prefetch(uri)
      .then(() => setOnboardingBgPrefetched(true))
      .catch(() => setOnboardingBgPrefetched(true));
  }, []);

  useEffect(() => {
    if (!onboardingBgReady || !onboardingLogoReady || !onboardingBgPrefetched) {
      setAssetsSettled(false);
      return;
    }
    const timer = setTimeout(() => {
      setAssetsSettled(true);
    }, 180);
    return () => clearTimeout(timer);
  }, [onboardingBgReady, onboardingLogoReady, onboardingBgPrefetched]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOnboardingMinDelayDone(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasNavigatedRef.current) {
      return;
    }
    if (!authResolved) {
      return;
    }
    if (nextRouteName === "Onboarding" && !assetsSettled) {
      return;
    }
    if (nextRouteName === "Onboarding" && !onboardingMinDelayDone) {
      return;
    }

    hasNavigatedRef.current = true;
    navigation.reset({
      index: 0,
      routes: [{ name: nextRouteName }],
    });
  }, [authResolved, nextRouteName, assetsSettled, onboardingMinDelayDone, navigation]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#5800AB" barStyle="light-content" />
      <Animated.View
        pointerEvents="none"
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
            source={ONBOARDING_LOGO}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

      
      </View>

      {/* Bottom branding */}
      <Animated.View style={[styles.bottomBranding, { opacity: taglineFade }]}>
        <Text style={styles.poweredBy}>Experience Mauritius Like Never Before</Text>
      </Animated.View>

      {/* Hidden warm-up image to guarantee onboarding hero is loaded before navigation */}
      <Image
        source={ONBOARDING_BG}
        defaultSource={ONBOARDING_BG}
        fadeDuration={0}
        onLoadEnd={() => setOnboardingBgReady(true)}
        style={styles.hiddenPreloadImage}
      />
      <Image
        source={ONBOARDING_LOGO}
        defaultSource={ONBOARDING_LOGO}
        fadeDuration={0}
        onLoadEnd={() => setOnboardingLogoReady(true)}
        style={styles.hiddenPreloadImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5800AB",
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: -SCREEN_WIDTH * 0.5,
    width: SCREEN_WIDTH * 0.5,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ skewX: '-20deg' }],
  },
  logo: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.12,
    marginBottom: SCREEN_HEIGHT * 0.02,
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
  hiddenPreloadImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
});
