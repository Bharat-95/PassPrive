import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ThemeContext } from "../../App";

const { width } = Dimensions.get("window");

/* ---- IMAGES ---- */
const OFFERS = [
  { id: 1, image: require("../../assets/DineIn/Discount1.png") },
  { id: 2, image: require("../../assets/DineIn/Discount2.png") },
  { id: 3, image: require("../../assets/DineIn/Discount3.png") },
];

export default function OffersForYou() {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={{ marginTop: 30 }}>
      {/* ---- Heading ---- */}
      <View style={styles.headingContainer}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", colors.subtitle + "30"]}
          style={styles.line}
        />
        <Text style={[styles.heading, { color: colors.text }]}>
          Offers for You
        </Text>
        <LinearGradient
          colors={[colors.subtitle + "30", "rgba(0,0,0,0)"]}
          style={styles.line}
        />
      </View>

      {/* ---- Horizontal Scroll ---- */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollWrapper}
      >
        {OFFERS.map((offer) => (
          <Image
            key={offer.id}
            source={offer.image}
            style={styles.offerImage}
          />
        ))}
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
    marginBottom: 15,
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

  scrollWrapper: {
    paddingLeft: 16,
    paddingRight: 10,
  },

  offerImage: {
    width: width * 0.9 ,
    height: 160,
    borderRadius: 18,
    marginRight: 16,
    resizeMode: "stretch",
  },
});
