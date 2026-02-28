import React, { useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Animated } from 'react-native';
import { Home } from 'lucide-react-native';
import { ThemeContext } from '../../App';
import { useNavigation } from '@react-navigation/native';

/* STATIC CATEGORIES */
const categories = [
  { key: 'dining', title: 'Dining', icon: require('../../assets/Dining.png') },
  { key: 'stores', title: 'Stores', icon: require('../../assets/Stores.png') },
  { key: 'events', title: 'Events', icon: require('../../assets/Events.png') },
];




/* CARD */
const CategoryCard = React.memo(({ title, icon, colors, small, collapsed, onPress }) => (

  
  <Pressable
  onPress={onPress}   
    style={({ pressed }) => [
      small ? styles.smallCard : styles.bigCard,
      { 
        backgroundColor: collapsed && small 
          ? `${colors.card}` 
          : colors.card 
      },
      pressed && { transform: [{ scale: 0.96 }] },
    ]}
  >
    <Image
      source={icon}
      style={small ? styles.smallIcon : styles.bigIcon}
      resizeMode="contain"
    />
    <Text
      style={[
        small ? styles.smallLabel : styles.bigLabel,
        { color: colors.text },
      ]}
    >
      {title}
    </Text>
  </Pressable>
));

export default function HomeCategories({ collapsed }) {
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation();

  /* 🔥 Animations for SMALL collapsed row */
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  /* 🔥 NEW: Animations for BIG grid */
  const bigOpacity = useRef(new Animated.Value(1)).current;
  const bigSlide = useRef(new Animated.Value(0)).current;


  const goToScreen = (key) => {
    if (key === "dining") navigation.navigate("DineinHome");
    if (key === "stores") navigation.navigate("Stores");
    if (key === "events") navigation.navigate("Events");
  };

  useEffect(() => {
    if (collapsed) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),

        /* Big grid fade out */
        Animated.timing(bigOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(bigSlide, {
          toValue: -10,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // EXPANDED MODE — big row visible, small row hidden
      Animated.parallel([
        /* Small row goes away */
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),

        /* Big grid fade in */
        Animated.timing(bigOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bigSlide, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [collapsed]);

  return (
    <View>

      {/* 🔥 ANIMATED BIG GRID */}
      <Animated.View
        style={[
          styles.gridContainer,
          {
            height: collapsed ? 0 : 'auto',
            overflow: 'hidden',
            opacity: bigOpacity,
            transform: [{ translateY: bigSlide }],
          },
        ]}
      >
       
      </Animated.View>

      {/* 🔥 ANIMATED SMALL COLLAPSED ROW WITH HOME BUTTON */}
      <Animated.View
        style={[
          styles.smallRowContainer,
          {
            height: collapsed ? 60 : 0,
            overflow: 'hidden',
            opacity: opacityAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.smallRow}>
          {/* Gold Home Button */}
          <Pressable
            style={({ pressed }) => [
              styles.homeButton,
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
            onPress={() => {
              // Navigate to Home - you can add navigation here
              console.log('Navigate to Home');
            }}
          >
            <Home color="#ffffff" size={20} />
          </Pressable>

          {/* Category Cards */}
          <View style={styles.categoriesRow}>
            {categories.map(c => (
              <CategoryCard 
                key={c.key} 
                title={c.title} 
                icon={c.icon} 
                colors={colors} 
                onPress={() => goToScreen(c.key)}
              />
            ))}
          </View>
        </View>
      </Animated.View>

    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  /* BIG GRID */
  gridContainer: {
    marginHorizontal: 12,
    marginTop: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bigCard: {
    width: '31%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  bigIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  bigLabel: {
    fontSize: 13,
    fontWeight: '600',
  },

  /* SMALL COLLAPSED ROW */
  smallRowContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  smallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  homeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#C59D5F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C59D5F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  categoriesRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  smallCard: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  smallIcon: {
    width: 20,
    height: 20,
  },

  smallLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
});