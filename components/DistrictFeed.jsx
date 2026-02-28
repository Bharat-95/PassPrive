import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export default function DistrictFeed() {
  const feed = [
    { id: 1, type: "EVENT", title: "Music Night", img: "https://picsum.photos/400/300" },
    { id: 2, type: "STORE", title: "Fashion Sale", img: "https://picsum.photos/401/300" },
    { id: 3, type: "DINE-IN", title: "New Bistro", img: "https://picsum.photos/402/300" },
  ];

  return (
    <View style={{ paddingHorizontal: 22 }}>
      {feed.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.img }} style={styles.image} />
          <Text style={styles.tag}>{item.type}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 22 },
  image: { width: "100%", height: 180, borderRadius: 22 },
  tag: { color: "#DA3224", fontSize: 12, marginTop: 8 },
  title: { color: "#F5F5F5", fontSize: 20, fontWeight: "700", marginTop: 4 },
});
