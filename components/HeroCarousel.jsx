import React from "react";
import { ScrollView, Image, StyleSheet, View, Text } from "react-native";

export default function HeroCarousel() {
  const items = [
    { id: 1, img: "https://picsum.photos/500/300", title: "Weekend Festival" },
    { id: 2, img: "https://picsum.photos/501/300", title: "Mega Store Sale" },
    { id: 3, img: "https://picsum.photos/502/300", title: "Top Restaurants" },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.wrapper}>
      {items.map((item) => (
        <View key={item.id} style={styles.banner}>
          <Image source={{ uri: item.img }} style={styles.image} />

          <View style={styles.overlay}>
            <Text style={styles.bannerText}>{item.title}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingLeft: 22, marginBottom: 25 },
  banner: { marginRight: 16, position: "relative" },
  
  image: {
    width: 300,
    height: 160,
    borderRadius: 22,
  },

  overlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
  },

  bannerText: {
    color: "#F5F5F5",
    fontSize: 20,
    fontWeight: "700",
  },
});
