import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export default function EventsList() {
  return (
    <View style={{ paddingHorizontal: 22, marginBottom: 30 }}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={{ marginBottom: 20 }}>
          <Image
            source={{ uri: `https://picsum.photos/300/40${item}` }}
            style={styles.poster}
          />
          <Text style={styles.title}>Event {item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  poster: {
    width: "100%",
    height: 240,
    borderRadius: 22,
  },
  title: {
    color: "#F5F5F5",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },
});
