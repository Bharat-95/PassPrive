import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const QUICK_FILTERS = [
  "30% Off & Above",
  "Near Me",
  "Top Rated",
  "Available Today",
  "Available Tomorrow",
  "Rated 4.5+",
  "50% Off",
  "Open Now",
  "Pure Veg",
  "Pet Friendly",
  "Outdoor Seating",
  "Serves Alcohol",
  "Cafe",
  "Fine Dining",
  "Open Late",
];

export default function QuickFilters({ onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {QUICK_FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={styles.chip}
          onPress={() => onSelect(filter)}
        >
          <Text style={styles.chipText}>{filter}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    marginRight: 10,
  },
  chipText: {
    color: "#fff",
    fontSize: 12.5,
    fontWeight: "600",
  },
});
