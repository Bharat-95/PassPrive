import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AuthLoadingSkeleton() {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={styles.brandSection}>
        <Animated.View style={[styles.block, styles.skipPill, { opacity: pulse }]} />
        <Animated.View style={[styles.block, styles.logo, { opacity: pulse }]} />
      </View>

      <View style={styles.formSection}>
        <Animated.View style={[styles.line, styles.title, { opacity: pulse }]} />
        <Animated.View style={[styles.line, styles.subtitle, { opacity: pulse }]} />
        <Animated.View style={[styles.input, { opacity: pulse }]} />
        <Animated.View style={[styles.input, { opacity: pulse }]} />
        <Animated.View style={[styles.line, styles.forgot, { opacity: pulse }]} />
        <Animated.View style={[styles.buttonDark, { opacity: pulse }]} />
        <Animated.View style={[styles.divider, { opacity: pulse }]} />
        <Animated.View style={[styles.buttonLight, { opacity: pulse }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#8F3AFF',
    zIndex: 1000,
  },
  block: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 10,
  },
  brandSection: {
    height: SCREEN_HEIGHT * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipPill: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.06,
    right: SCREEN_WIDTH * 0.05,
    width: 64,
    height: 28,
    borderRadius: 16,
  },
  logo: {
    width: SCREEN_WIDTH * 0.56,
    height: SCREEN_HEIGHT * 0.08,
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: SCREEN_WIDTH * 0.07,
    paddingTop: SCREEN_HEIGHT * 0.036,
  },
  line: {
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
  },
  title: {
    width: '62%',
    height: 30,
    marginBottom: SCREEN_HEIGHT * 0.015,
    alignSelf: 'center',
  },
  subtitle: {
    width: '84%',
    height: 16,
    marginBottom: SCREEN_HEIGHT * 0.038,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    height: 52,
    marginBottom: SCREEN_HEIGHT * 0.013,
    borderRadius: 8,
  },
  forgot: {
    width: '36%',
    height: 14,
    alignSelf: 'flex-end',
    marginTop: SCREEN_HEIGHT * 0.006,
    marginBottom: SCREEN_HEIGHT * 0.024,
  },
  buttonDark: {
    width: '100%',
    height: 54,
    borderRadius: 35,
    backgroundColor: '#2D2D2D',
    marginBottom: SCREEN_HEIGHT * 0.024,
  },
  divider: {
    width: '100%',
    height: 12,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  buttonLight: {
    width: '100%',
    height: 54,
    backgroundColor: '#F1F1F1',
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 30,
  },
});
