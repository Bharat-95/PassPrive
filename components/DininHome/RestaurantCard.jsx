import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AutoScrollCarousel from "./AutoScrollCarousel";
import { Bookmark } from "lucide-react-native";
import { ThemeContext } from "../../App";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";




export default function RestaurantCard({ item, isActive, restaurants }) {
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation();
  

  return (
    <TouchableOpacity activeOpacity={0.9} style={[styles.card, { backgroundColor: colors.card }]} onPress={() => navigation.navigate("RestaurantDetails", { restaurant: item, restaurants: restaurants, })}>
      
      {/* Image Carousel */}
      <View style={styles.carouselWrapper}>
        <AutoScrollCarousel images={[...item.images.food, ...item.images.ambience]} isActive={isActive} />

        {/* Save Icon */}
        <TouchableOpacity style={styles.saveBtn}>
          <Bookmark color="#fff" size={20} />
        </TouchableOpacity>

        {/* Offer Ribbon */}
        {item.offer && (
          <View style={styles.offerTag}>
            <Text style={styles.offerText}>{item.offer}</Text>
          </View>
        )}
      </View>

      {/* Details Section */}
      <View style={styles.infoBox}>
        <View style={styles.rowBetween}>
          {/* Name */}
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>

          {/* Rating */}
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        {/* Cuisines */}
        <Text style={[styles.subtitle, { color: colors.subtitle }]} numberOfLines={1}>
          {item.cuisines.join(" • ")}
        </Text>

        {/* Cost / Distance */}
        <View style={styles.rowBetween}>
          <Text style={[styles.cost, { color: colors.subtitle }]}>
            ₹{item.costForTwo} for two
          </Text>
          <Text style={[styles.distance, { color: colors.subtitle }]}>
            {item.distance} km
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: "hidden",
  },

  carouselWrapper: {
    position: "relative",
  },

  saveBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 8,
    borderRadius: 30,
  },

  offerTag: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "#4B23FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  offerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  infoBox: {
    padding: 14,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    maxWidth: "75%",
  },

  ratingBox: {
    backgroundColor: "#4B23FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
  },

  cost: {
    marginTop: 6,
    fontSize: 13,
  },

  distance: {
    marginTop: 6,
    fontSize: 13,
  },
});
