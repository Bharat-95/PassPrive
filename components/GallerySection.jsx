import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../App";

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width) / 3;

export default function GallerySection({ restaurant, navigation }) {
  if (!restaurant?.images) return null;

  const foodImages = restaurant.images.food || [];
  const ambienceImages = restaurant.images.ambience || [];

  const previewImages = [...foodImages.slice(0, 2), ...ambienceImages.slice(0, 1)];

  const allImages = [...foodImages, ...ambienceImages];
  const {colors} = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.row}>
        <Text style={[styles.title, { color: colors.text }]}>Gallery</Text>

        <Pressable
          onPress={() =>
            navigation.navigate("FullImageView", {
              images: allImages,
              name: restaurant.name,
              costForTwo: restaurant.costForTwo,
              startIndex: 0,
            })
          }
        >
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      {/* ---------- IMAGE GRID SCROLLER ---------- */}
      <FlatList
        data={previewImages}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("FullImageView", {
                images: allImages,
                name: restaurant.name,
                costForTwo: restaurant.costForTwo,
                startIndex: index,
              })
            }
          >
            <Image source={{ uri: item }} style={styles.image} />
          </Pressable>
        )}
      />
    </View>
  );
}

/* ------------------- STYLES ------------------- */
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6A52FF", // Light purple like screenshot
    textDecorationLine: "underline",
  },

  image: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 16,
    resizeMode: "cover",
  },
});
