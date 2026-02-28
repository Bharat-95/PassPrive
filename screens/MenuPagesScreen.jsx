import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, Pressable } from "react-native";
import { ThemeContext } from "../App";
import { useContext } from "react";

const { width } = Dimensions.get("window");

export default function MenuPagesScreen({ route, navigation }) {
  const { category, pages, restaurantName } = route.params;
  const { colors } = useContext(ThemeContext);
  const [index, setIndex] = useState(0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={[styles.backTxt, { color: colors.text }]}>←</Text>
      </Pressable>

      <Text style={[styles.title, { color: colors.text }]}>{restaurantName}</Text>
      <Text style={[styles.sub, { color: colors.subtitle }]}>{category}</Text>

      {/* Pager */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
      >
        {pages.map((img, i) => (
          <Image key={i} source={{ uri: img }} style={styles.menuImg} />
        ))}
      </ScrollView>

      {/* Pagination */}
      <View style={styles.pagination}>
        <Text style={[styles.pageText, { color: colors.text }]}>
          {"<"} {index + 1}/{pages.length} {">"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backBtn: { padding: 14 },
  backTxt: { fontSize: 22 },
  title: { fontSize: 20, fontWeight: "700", marginLeft: 16 },
  sub: { fontSize: 16, color: "#666", marginLeft: 16, marginBottom: 12 },
  menuImg: {
    width,
    height: 550,
    resizeMode: "contain",
  },
  pagination: {
    alignItems: "center",
    paddingVertical: 12,
  },
  pageText: {
    fontSize: 17,
    fontWeight: "600",
  },
});
