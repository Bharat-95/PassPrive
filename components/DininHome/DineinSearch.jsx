import React, { useEffect, useRef, useState, useContext } from "react";
import { View, TextInput, StyleSheet, Animated, Text, Platform } from "react-native";
import { Search } from "lucide-react-native";
import { ThemeContext } from "../../App";

const placeholders = [
  "Find restaurants near you",
  "Discover events happening today",
  "Explore stores around you",
];

export default function HomeSearchBar({ collapsed }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentIndex + 1;

      Animated.timing(translateY, {
        toValue: -20 * nextIndex,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (nextIndex === placeholders.length) {
          translateY.setValue(0);
          setCurrentIndex(0);
        } else {
          setCurrentIndex(nextIndex);
        }
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Animate glow when collapsed
  useEffect(() => {
    Animated.timing(glowOpacity, {
      toValue: collapsed ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [collapsed]);

  return (
    <View style={styles.wrapper}>
      {/* Violet Glow Effect - only visible when scrolled */}
      <Animated.View style={[styles.glowContainer, { opacity: glowOpacity }]}>
        <View style={styles.glow} />
      </Animated.View>

      {/* Search Bar - solid background, NO transparency */}
      <View style={styles.container(colors)}>
        <Search size={20} color={colors.subtitle} />

        <View style={styles.placeholderWrapper}>
          <Animated.View
            style={{
              transform: [{ translateY }],
            }}
          >
            {placeholders.map((text, idx) => (
              <Text key={idx} style={styles.placeholder(colors)}>
                {text}
              </Text>
            ))}

            {/* Duplicate first for infinite loop */}
            <Text style={styles.placeholder(colors)}>{placeholders[0]}</Text>
          </Animated.View>

          <TextInput style={styles.input} placeholder="" />
        </View>
      </View>
    </View>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    marginHorizontal: 16,
  },

  glowContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },

glow: {
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(255, 165, 0, 0.6)", // Orange-gold glow
  borderRadius: 14,
  ...Platform.select({
    ios: {
      shadowColor: "#FFA500", // Orange-gold
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 30,
    },
    android: {
      elevation: 0,
    },
  }),
},

  container: (colors) => ({
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 14,
    position: "relative",
    zIndex: 1,
  }),

  placeholderWrapper: {
    flex: 1,
    height: 20,
    overflow: "hidden",
    marginLeft: 10,
  },

  placeholder: (colors) => ({
    height: 20,
    color: colors.subtitle,
    fontSize: 15,
  }),

  input: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
};