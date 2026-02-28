import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ThemeContext } from "../../App";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.28;   // 🔥 Keep same size
const CARD_HEIGHT = 140;

// ⭐ NEW Store Categories (6 items)
const STORE_CATEGORIES = [
  { key: "beauty", title: "Beauty & Salon", image: require("../../assets/Stores/Beauty.png") },
  { key: "footwear", title: "Footwear", image: require("../../assets/Stores/Footwear.png") },
  { key: "apparel", title: "Apparel", image: require("../../assets/Stores/Apparel.png") },
  { key: "accessories", title: "Accessories", image: require("../../assets/Stores/Accessories.png") },
  { key: "jewellery", title: "Jewellery", image: require("../../assets/Stores/Jewellery.png") },
  { key: "home", title: "Home & Gifting", image: require("../../assets/Stores/HomeNGifting.png") },
];

// ⭐ Convert into 2 rows × 3 cards
const ROWS = [
  STORE_CATEGORIES.slice(0, 3),
  STORE_CATEGORIES.slice(3, 6),
];

export default function ShopByCategory({ onSelectCategory }) {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={{ marginTop: 30 }}>
      
      {/* Heading */}
      <View style={styles.headingContainer}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", colors.subtitle + "30"]}
          style={styles.line}
        />
        <Text style={[styles.heading, { color: colors.text }]}>
          SHOP BY CATEGORY
        </Text>
        <LinearGradient
          colors={[colors.subtitle + "30", "rgba(0,0,0,0)"]}
          style={styles.line}
        />
      </View>

      {/* ⭐ 2 Rows — 3 Cards Per Row */}
      <View style={styles.gridWrapper}>
        {ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item) => (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.9}
                onPress={() => onSelectCategory?.(item.key)}
                style={[
                  styles.card,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.label, { color: colors.text }]}>
                  {item.title}
                </Text>

                <Image source={item.image} style={styles.image} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  line: {
    flex: 1,
    height: 1,
    marginHorizontal: 12,
  },

  heading: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.4,
  },

  /* ⭐ Grid Layout */
  gridWrapper: {
    paddingHorizontal: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    borderWidth: 1,
    paddingTop: 12,
    paddingLeft: 10,
    overflow: "hidden",
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    width: "70%",
  },

  image: {
    width: 100,
    height: 100,
    position: "absolute",
    bottom: 5,
    right: 5,
    resizeMode: "contain",
  },
});
