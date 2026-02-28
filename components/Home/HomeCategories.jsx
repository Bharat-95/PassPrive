import React, { useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
} from "react-native";
import { Home } from "lucide-react-native";
import { ThemeContext } from "../../App";

/* STATIC CATEGORIES */
const categories = [
  { key: "dining", title: "Dining", icon: require("../../assets/Dining.png") },
  { key: "stores", title: "Stores", icon: require("../../assets/Stores.png") },
  // { key: "sports", title: "Sports", icon: require("../../assets/Sports.png") },
];

/* CARD */
const CategoryCard = React.memo(
  ({ title, icon, colors, small, collapsed, onPress, isActive }) => {
    const activeBorder = "#C59D5F";
    const activeBg = "rgba(197, 157, 95, 0.18)";

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          small ? styles.smallCard : styles.bigCard,
          {
            backgroundColor: isActive ? activeBg : colors.card,
            borderWidth: isActive ? 1 : 0,
            borderColor: isActive ? activeBorder : "transparent",

            shadowColor: isActive ? activeBorder : "transparent",
            shadowOpacity: isActive ? 0.35 : 0,
            shadowRadius: isActive ? 10 : 0,
            shadowOffset: { width: 0, height: 6 },
            elevation: isActive ? 6 : 0,
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
    );
  }
);

export default function HomeCategories({ collapsed, selected, onSelect }) {
  const { colors } = useContext(ThemeContext);

  const slideAnim = useRef(new Animated.Value(-20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const bigOpacity = useRef(new Animated.Value(1)).current;
  const bigSlide = useRef(new Animated.Value(0)).current;

  const homeButtonColors = {
    home: "#C59D5F",
    dining: "#4B23FF",
    stores: "#00C47A",
    sports: "#FF3D3D",
  };

  const homeBg = homeButtonColors[selected] || "#C59D5F";

  useEffect(() => {
    if (collapsed) {
      Animated.parallel([
        Animated.timing(bigOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(bigSlide, {
          toValue: -10,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(bigOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(bigSlide, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [collapsed, bigOpacity, bigSlide, slideAnim, opacityAnim]);

  return (
    <View>
      {/* BIG CATEGORY ROW */}
      <Animated.View
        style={[
          styles.gridContainer,
          {
            opacity: bigOpacity,
            transform: [{ translateY: bigSlide }],
            height: collapsed ? 0 : "auto",
            overflow: "hidden",
          },
        ]}
      >
        <View style={styles.row}>
          {categories.map((c) => (
            <CategoryCard
              key={c.key}
              title={c.title}
              icon={c.icon}
              colors={colors}
              small={false}
              collapsed={collapsed}
              isActive={selected === c.key}
              onPress={() => onSelect(c.key)}
            />
          ))}
        </View>
      </Animated.View>

      {/* SMALL CATEGORY ROW */}
      <Animated.View
        style={[
          styles.smallRowContainer,
          {
            opacity: opacityAnim,
            transform: [{ translateY: slideAnim }],
            height: collapsed ? 60 : 0,
            overflow: "hidden",
          },
        ]}
      >
        <View style={styles.smallRow}>
          <Pressable
            onPress={() => onSelect("home")}
            style={[styles.homeButton, { backgroundColor: homeBg }]}
          >
            <Home color="#FFF" size={20} />
          </Pressable>

          <View style={styles.categoriesRow}>
            {categories.map((c) => (
              <CategoryCard
                key={c.key}
                title={c.title}
                icon={c.icon}
                colors={colors}
                small={true}
                collapsed={collapsed}
                isActive={selected === c.key}
                onPress={() => onSelect(c.key)}
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
  gridContainer: {
    marginHorizontal: 12,
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  // Made bigger height and width for 2 cards
  bigCard: {
    width: "48.5%",
    minHeight: 135,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bigIcon: { width: 54, height: 54, marginBottom: 10 },
  bigLabel: { fontSize: 15, fontWeight: "700" },

  smallRowContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  smallRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  homeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  categoriesRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  smallCard: {
    width: "48.5%",
    paddingVertical: 8,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },

  smallIcon: { width: 20, height: 20 },
  smallLabel: { fontSize: 12, fontWeight: "500" },
});
