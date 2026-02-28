import React, { useEffect, useRef, useContext } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../App"; // ⬅️ import theme context

export default function SplashScreen() {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext); // ⬅️ theme colors

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate brand text
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const checkLogin = async () => {
      const isLogged = await AsyncStorage.getItem("isLoggedIn");

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: isLogged === "true" ? "Home" : "Login" }],
        });
      }, 1500);
    };

    checkLogin();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.Text
        style={[
          styles.brand,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        PassPrivé
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // ⭐ DO NOT change the text color
  brand: {
    color: "#C59D5F", 
    fontSize: 28,
    fontWeight: "700",
  },
});
