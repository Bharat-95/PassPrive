import React from "react";
import { View } from "react-native";
import Shimmer from "../Shimmer";

export default function HomeSkeleton() {
  return (
    <View style={{ padding: 20 }}>

      {/* Hero Banner */}
      <Shimmer style={{ width: "100%", height: 250, borderRadius: 12 }} />

      <View style={{ height: 30 }} />

      {/* Spotlight Heading */}
      <Shimmer style={{ width: 180, height: 20, borderRadius: 6 }} />

      <View style={{ height: 20 }} />

      {/* Spotlight Cards */}
      <View style={{ flexDirection: "row" }}>
        {[1, 2, 3].map((i) => (
          <Shimmer
            key={i}
            style={{
              width: 260,
              height: 330,
              borderRadius: 12,
              marginRight: 16,
            }}
          />
        ))}
      </View>

      <View style={{ height: 30 }} />

      {/* Category Grid Skeleton */}
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Shimmer
            key={i}
            style={{
              width: "30%",
              height: 120,
              borderRadius: 14,
              marginBottom: 12,
            }}
          />
        ))}
      </View>
    </View>
  );
}
