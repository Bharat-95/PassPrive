import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Animated, Text, Platform } from 'react-native';
import { Search } from 'lucide-react-native';
import { ThemeContext } from '../../App';

const placeholders = [
  'Find restaurants near you',
  'Discover events happening today',
  'Explore stores around you',
];

export default function HomeSearchBar({
  elevated = false,
  forceWhiteSurface = false,
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors } = useContext(ThemeContext);
  const isAndroid = Platform.OS === 'android';

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
  }, [currentIndex, translateY]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container(colors, elevated, isAndroid, forceWhiteSurface)}>
        <Search size={20} color={'#6E5E62'} />

        <View style={styles.placeholderWrapper}>
          <Animated.View pointerEvents="none" style={{ transform: [{ translateY }] }}>
            {placeholders.map((text, idx) => (
              <Text key={idx} style={styles.placeholder()}>
                {text}
              </Text>
            ))}
            <Text style={styles.placeholder()}>{placeholders[0]}</Text>
          </Animated.View>

          <TextInput style={styles.input} placeholder="" />
        </View>
      </View>
    </View>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    marginTop: 0,
  },

  container: (colors, elevated, isAndroid, forceWhiteSurface) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBFF',
    borderWidth: 1,
    borderColor: 'rgba(147, 122, 110, 0.35)',
    paddingHorizontal: 15,
    paddingVertical: isAndroid ? 11 : 14,
    borderRadius: 14,
    position: 'relative',
    zIndex: 1,
    shadowColor: '#000',
    shadowOpacity: !isAndroid && elevated ? 0.15 : 0,
    shadowRadius: !isAndroid && elevated ? 12 : 0,
    shadowOffset: { width: 0, height: !isAndroid && elevated ? 6 : 0 },
    elevation: isAndroid ? 0 : elevated ? 6 : 0,
  }),

  placeholderWrapper: {
    flex: 1,
    height: 20,
    overflow: 'hidden',
    marginLeft: 10,
  },

  placeholder: () => ({
    height: 20,
    color: '#6E5E62',
    fontSize: 15,
  }),

  input: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
};
