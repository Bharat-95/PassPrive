import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Section({ title }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 22, marginBottom: 12 },
  title: { color: "#F5F5F5", fontSize: 20, fontWeight: "700" },
});
