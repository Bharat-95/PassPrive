import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ThemeContext } from "../../App";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.80;

const dummyTrending = [
  {
    id: 1,
    title: "Bestsellers of the Week",
    subtitle: "Hot picks to try today",
    image: "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg",
  },
  {
    id: 2,
    title: "Most Loved Desserts",
    subtitle: "Satisfy your sweet tooth",
    image: "https://images.pexels.com/photos/3026800/pexels-photo-3026800.jpeg",
  },
  {
    id: 3,
    title: "Street Food Mania",
    subtitle: "Flavours that never disappoint",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
  },
];

export default function NowTrending({ onLoadingChange }) {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={{ marginTop: 30 }}>
      
      {/* 🔥 SECTION TITLE */}
      <View style={styles.headingContainer}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", colors.subtitle + "30"]}
          style={styles.line}
        />
        <Text style={[styles.heading, { color: colors.text }]}>
          NOW TRENDING
        </Text>
        <LinearGradient
          colors={[colors.subtitle + "30", "rgba(0,0,0,0)"]}
          style={styles.line}
        />
      </View>

      {/* 🔥 TRENDING CARDS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16 }}
      >
        {dummyTrending.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            style={[styles.card, { backgroundColor: colors.card }]}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.image}

              // ⭐ Send loading state to parent
              onLoadStart={() => onLoadingChange?.(true)}
              onLoadEnd={() => onLoadingChange?.(false)}
            />

            <View style={styles.textBox}>
              <Text style={[styles.title, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.subtitle, { color: colors.subtitle }]}>
                {item.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ width: 16 }} />
      </ScrollView>
    </View>
  );
}

/* ----------------------------- STYLES ----------------------------- */

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  line: {
    flex: 1,
    height: 1,
    marginHorizontal: 10,
  },

  heading: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  card: {
    width: CARD_WIDTH,
    borderRadius: 14,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  image: {
    width: "100%",
    height: 340,
  },

  textBox: {
    padding: 14,
    paddingBottom: 18,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 12,
  },
});
