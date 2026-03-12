import React, { useContext, useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  Easing,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Home } from "lucide-react-native";
import { ThemeContext } from "../../App";

const DINING_ICON = require("../../assets/Dining.png");
const STORES_ICON = require("../../assets/Stores.png");

let categoryIconsPrefetched = false;

/* STATIC CATEGORIES */
const categories = [
  { key: "dining", title: "Dining", icon: DINING_ICON },
  { key: "stores", title: "Stores", icon: STORES_ICON },
  // { key: "sports", title: "Sports", icon: require("../../assets/Sports.png") },
];

/* CARD */
const CategoryCard = React.memo(
  ({
    title,
    icon,
    colors,
    small,
    collapsed,
    onPress,
    isActive,
    elevated,
    forceWhiteSurface = false,
    isDarkTheme = false,
  }) => {
    const activeBorder = "#C59D5F";
    const inactiveBorder = isDarkTheme ? "#4A4450" : "#D0CDD2";
    const gradientColors = isDarkTheme
      ? ["#E6E0E9", "#1D1B20"]
      : ["#FFFBFF", "#E6E0E9"];

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          small ? styles.smallCard : styles.bigCard,
          {
            backgroundColor: isDarkTheme ? "#1D1B20" : "#FFFBFF",
            borderWidth: small ? 0 : isActive ? 1 : 1,
            borderColor: small ? "transparent" : isActive ? activeBorder : inactiveBorder,
            shadowColor: "#000",
            shadowOpacity: isActive ? 0.34 : 0.22,
            shadowRadius: isActive ? 14 : 10,
            shadowOffset: { width: 0, height: isActive ? 8 : 6 },
            elevation: isActive ? 10 : 7,
          },
          pressed && { transform: [{ scale: 0.96 }] },
        ]}
      >
        <LinearGradient
          pointerEvents="none"
          colors={gradientColors}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[StyleSheet.absoluteFillObject, styles.cardGradientRadius]}
        />
        <Image
          source={icon}
          style={small ? styles.smallIcon : styles.bigIcon}
          resizeMode="contain"
          fadeDuration={0}
          resizeMethod={Platform.OS === "android" ? "resize" : "auto"}
        />

        <Text
          style={[
            small ? styles.smallLabel : styles.bigLabel,
            { color: small ? "#000000" : isDarkTheme ? "#FFFFFF" : "#000000" },
          ]}
        >
          {title}
        </Text>
      </Pressable>
    );
  }
);

export default function HomeCategories({
  collapsed,
  selected,
  onSelect,
  variant = "auto",
  elevated = false,
  forceWhiteSurface = false,
}) {
  const { colors } = useContext(ThemeContext);

  const collapseAnim = useRef(new Animated.Value(collapsed ? 1 : 0)).current;
  const [bigContentHeight, setBigContentHeight] = useState(175);
  const [smallContentHeight, setSmallContentHeight] = useState(60);

  const homeButtonColors = {
    home: "#C59D5F",
    dining: "#4B23FF",
    stores: "#00C47A",
    sports: "#FF3D3D",
  };

  const homeBg = homeButtonColors[selected] || "#C59D5F";

  useEffect(() => {
    if (categoryIconsPrefetched) return;
    categoryIconsPrefetched = true;

    const uris = [DINING_ICON, STORES_ICON]
      .map(asset => Image.resolveAssetSource(asset)?.uri)
      .filter(Boolean);

    uris.forEach(uri => {
      Image.prefetch(uri);
    });
  }, []);

  useEffect(() => {
    Animated.timing(collapseAnim, {
      toValue: collapsed ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [collapsed, collapseAnim]);

  if (variant === "inline") {
    return (
      <View style={styles.gridContainerStatic}>
        <View style={styles.row}>
          {categories.map((c) => (
            <CategoryCard
              key={c.key}
              title={c.title}
              icon={c.icon}
              colors={colors}
              small={false}
              collapsed={false}
              isActive={selected === c.key}
              isDarkTheme={colors.background === "#0D0D0D"}
              onPress={() => onSelect(c.key)}
            />
          ))}
        </View>
      </View>
    );
  }

  if (variant === "sticky") {
    return (
      <View style={styles.smallRowContainerSticky}>
        <View style={styles.smallRow}>
          <Pressable
            onPress={() => onSelect("home")}
            style={[
              styles.homeButton,
              { backgroundColor: homeBg },
              elevated ? styles.elevatedHomeButton : null,
            ]}
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
                collapsed={true}
                isActive={selected === c.key}
                elevated={elevated}
                forceWhiteSurface={forceWhiteSurface}
                isDarkTheme={colors.background === "#0D0D0D"}
                onPress={() => onSelect(c.key)}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }

  const bigHeight = collapseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [bigContentHeight, 0],
  });
  const bigOpacity = collapseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const bigTranslateY = collapseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const bigMarginTop = collapseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 0],
  });

  const smallHeight = collapseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, smallContentHeight],
  });
  const smallOpacity = collapseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const smallTranslateY = collapseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <View>
      {/* BIG CATEGORY ROW */}
      <Animated.View
        style={[
          styles.gridContainer,
          {
            height: bigHeight,
            opacity: bigOpacity,
            marginTop: bigMarginTop,
            transform: [{ translateY: bigTranslateY }],
            overflow: "hidden",
          },
        ]}
      >
        <View
          style={styles.row}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && Math.abs(h - bigContentHeight) > 1) {
              setBigContentHeight(h);
            }
          }}
        >
          {categories.map((c) => (
            <CategoryCard
              key={c.key}
              title={c.title}
              icon={c.icon}
              colors={colors}
              small={false}
              collapsed={collapsed}
              isActive={selected === c.key}
              isDarkTheme={colors.background === "#0D0D0D"}
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
            opacity: smallOpacity,
            transform: [{ translateY: smallTranslateY }],
            height: smallHeight,
            overflow: "hidden",
          },
        ]}
      >
        <View
          style={styles.smallRow}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && Math.abs(h - smallContentHeight) > 1) {
              setSmallContentHeight(h);
            }
          }}
        >
          <Pressable
            onPress={() => onSelect("home")}
            style={[
              styles.homeButton,
              { backgroundColor: homeBg },
              elevated ? styles.elevatedHomeButton : null,
            ]}
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
                elevated={elevated}
                forceWhiteSurface={forceWhiteSurface}
                isDarkTheme={colors.background === "#0D0D0D"}
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
  gridContainerStatic: {
    marginHorizontal: 12,
    marginTop: 36,
  },
  smallRowContainerStatic: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  smallRowContainerSticky: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  gridContainer: {
    marginHorizontal: 12,
    marginTop: 10,
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
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bigIcon: {
    width: Platform.OS === "android" ? 156 : 173,
    height: Platform.OS === "android" ? 114 : 126,
    marginBottom: 2,
  },
  bigLabel: {
    fontSize: 14,
    ...(Platform.OS === "android"
      ? { fontFamily: "sans-serif-medium", fontWeight: "500" }
      : { fontFamily: "Inter", fontWeight: "600" }),
  },

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
  elevatedHomeButton: {
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
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
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  cardGradientRadius: {
    borderRadius: 16,
  },

  smallIcon: { width: 20, height: 20 },
  smallLabel: { fontSize: 12, fontWeight: "500" },
});
