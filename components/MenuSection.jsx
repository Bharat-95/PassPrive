import React from "react";
import { View, Text, StyleSheet, Image, Pressable, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { ThemeContext } from "../App"; 

export default function MenuSection({ menu = [], restaurant = {} }) {
  const navigation = useNavigation();
    const { colors } = useContext(ThemeContext);

  return (
    <View style={styles.wrapper}>
      {/* ------------------ TITLE ------------------ */}
      <Text style={[styles.heading, { color: colors.text }]}>Menu</Text>
      <Text style={[styles.updated,{color:colors.subtitle}]}>Updated 12 days ago</Text>

      {/* ------------------ HIGHLIGHTS ------------------ */}
      {restaurant.highlights && restaurant.highlights?.length > 0 && (
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.subtitle }]}>HIGHLIGHTS</Text>
          {restaurant.highlights.map((item, i) => (
            <Text key={i} style={[styles.highlightText, { color: colors.paragraph }]}>
              ✨ {item}
            </Text>
          ))}
        </View>
      )}

      {/* ------------------ CUISINES ------------------ */}
      <View style={styles.sectionBlock}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>CUISINES</Text>

        <Text style={[styles.cuisineText, { color: colors.paragraph }]}>
          🍽️ {restaurant?.cuisines?.length ? restaurant.cuisines.join(", ") : "—"}
        </Text>
      </View>

      {/* ------------------ MENU CATEGORY CARDS ------------------ */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={menu}
        keyExtractor={(item) => item.category}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.menuCard}
            onPress={() =>
              navigation.navigate("MenuPagesScreen", {
                category: item.category,
                pages: item.pages,
                restaurantName: restaurant.name,
              })
            }
          >
            <Image source={{ uri: item.pages[0] }} style={styles.thumb} />

            <Text style={[styles.catName, { color: colors.text }]}>{item.category}</Text>
            <Text style={[styles.pages, { color: colors.subtitle }]}>{item.pages.length} pages</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },

  updated: {
    fontSize: 13,
    marginBottom: 18,
  },

  /* -------------------- HIGHLIGHTS & CUISINES -------------------- */
  sectionBlock: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },

  highlightText: {
    fontSize: 15,
    lineHeight: 22,
  },

  cuisineText: {
    fontSize: 15,
    marginTop: 4,
  },

  /* -------------------- MENU CARD -------------------- */
  menuCard: {
    width: 160,
    marginRight: 18,
  },

  thumb: {
    width: "100%",
    height: 180,
    borderRadius: 14,
  },

  catName: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
  },

  pages: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
});
