import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function Shimmer({
  style,
  baseColor = "#1E1E1E",
  highlightColors = ["#2A2A2A", "#3A3A3A", "#2A2A2A"],
}) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View style={[styles.container, { backgroundColor: baseColor }, style]}>
      <Animated.View
        style={[
          {
            height: "100%",
            width: "100%",
            overflow: "hidden",
            position: "absolute",
          },
        ]}
      >
        <Animated.View
          style={{
            width: "60%",
            height: "100%",
            transform: [{ translateX }],
          }}
        >
          <LinearGradient
            colors={highlightColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    overflow: "hidden",
  },
});
