import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";

export default function QuickActions() {
  const items = ["Trending", "New Stores", "Top Restaurants", "Events", "Deals", "Flash Sale"];
  
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.wrapper}>
      {items.map((name, index) => (
        <View key={index} style={styles.chip}>
          <Text style={styles.chipText}>{name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingLeft: 22, marginBottom: 25 },
  chip: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  chipText: { color: "#B3B3B3", fontSize: 14 },
});
