import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ThemeContext } from "../../App";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.26;
const CARD_HEIGHT = 140;

// ✅ Use require() for local images
const MOOD_CATEGORIES = [
  { key: "family", title: "Family dining", image: require("../../assets/DineIn/family.png") },
  { key: "buffet", title: "Buffet", image: require("../../assets/DineIn/buffet.png") },
  { key: "party", title: "Party vibes", image: require("../../assets/DineIn/party.png") },
  { key: "cozy", title: "Cozy cafes", image: require("../../assets/DineIn/Cozy.png") },
  { key: "premium", title: "Premium Dining", image: require("../../assets/DineIn/premium.png") },
  { key: "dineathotels", title: "Dine at Hotels", image: require("../../assets/DineIn/hotel.png") },
  { key: "romantic", title: "Romantic dining", image: require("../../assets/DineIn/Romantic.png") },
  { key: "drink-dine", title: "Drink & dine", image: require("../../assets/DineIn/drinkndine.png") },
  { key: "biryani", title: "Biryani", image: require("../../assets/DineIn/biryani.png") },
  { key: "deserts", title: "Deserts", image: require("../../assets/DineIn/deserts.png") },
  { key: "rooftops", title: "Rooftops", image: require("../../assets/DineIn/rooftop.png") },
  { key: "northindian", title: "North Indian", image: require("../../assets/DineIn/north.png") },
];

export default function InTheMoodFor({ onSelectMood }) {
  const { colors } = useContext(ThemeContext);

  // Make columns (2 cards per column)
  const columns = [];
  for (let i = 0; i < MOOD_CATEGORIES.length; i += 2) {
    columns.push(MOOD_CATEGORIES.slice(i, i + 2));
  }

  return (
    <View style={{ marginTop: 30 }}>
      
      {/* Heading */}
      <View style={styles.headingContainer}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", colors.subtitle + "30"]}
          style={styles.line}
        />
        <Text style={[styles.heading, { color: colors.text }]}>
          IN THE MOOD FOR
        </Text>
        <LinearGradient
          colors={[colors.subtitle + "30", "rgba(0,0,0,0)"]}
          style={styles.line}
        />
      </View>

      {/* ⭐ 2-ROW SCROLL */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
      >
        <View style={styles.rowWrapper}>
          {columns.map((col, index) => (
            <View key={index} style={styles.column}>
              {col.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.9}
                  onPress={() => onSelectMood?.(item.key)}
                  style={[
                    styles.card,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  {/* Text top-left */}
                  <Text style={[styles.label, { color: colors.text }]}>
                    {item.title}
                  </Text>

                  {/* Image bottom-right */}
                  <Image source={item.image} style={styles.image} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

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

  rowWrapper: {
    flexDirection: "row",
  },

  column: {
    marginRight: 18,
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 18,
    paddingTop: 12,
    paddingLeft: 10,
    overflow: "hidden",
  },

  /* Text stays top-left */
  label: {
    fontSize: 13,
    fontWeight: "700",
    width: "70%",
  },

  /* Image stays bottom-right */
  image: {
    width: 100,
    height: 100,
    position: "absolute",
    bottom: 5,
    right: 5,
    resizeMode: "contain",
  },
});
