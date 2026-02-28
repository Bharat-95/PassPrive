import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import { ThemeContext } from "../App";

const { width } = Dimensions.get("window");

export default function ReviewsSection({ restaurant, navigation }) {
  if (!restaurant?.reviews) return null;

  const previewReviews = restaurant.reviews.slice(0, 9);
  const { colors } = useContext(ThemeContext);

  const getInitial = (name = "") => name.charAt(0).toUpperCase();

  // Small helpers (colors only, no layout/UI changes)
  const isDark = colors.background === "#0D0D0D";
  const surface = colors.background;
  const cardBg = colors.card;
  const border = colors.border;
  const text = colors.text;
  const subtitle = colors.subtitle;

  // preserve the same feel but readable in dark mode
  const mutedText = subtitle; // replaces #777/#555/#444 usage
  const placeholderBg = isDark ? "#2A2A2A" : "#EEE";
  const placeholderText = isDark ? "#B3B3B3" : "#555";
  const totalRatingsBg = isDark ? "#222222" : "#F5F5F5";
  const underlineText = isDark ? "#B3B3B3" : "#444";

  return (
    <View style={styles.container}>
      {/* ---------- Header ---------- */}
      <View style={styles.row}>
        <Text style={[styles.title, { color: text }]}>Reviews</Text>

        <Pressable onPress={() => navigation.navigate("AllReviews", { restaurant })}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      {/* ---------- Rating Summary ---------- */}
      <View style={styles.summaryRow}>
        {/* LEFT CARD */}
        <View style={styles.ratingCard}>
          <View style={styles.greenBox}>
            <Text style={styles.greenRating}>{restaurant.rating}</Text>
            <Text style={styles.star}>★</Text>
          </View>

          <Text
            style={[
              styles.totalRatings,
              { backgroundColor: totalRatingsBg, color: mutedText },
            ]}
          >
            {restaurant.totalRatings} ratings
          </Text>
        </View>

        {/* CATEGORY RATINGS */}
        <View style={styles.categoryCol}>
          <Text style={[styles.categoryRating, { color: text }]}>
            {restaurant.foodRating}
          </Text>
          <Text style={[styles.categoryName, { color: subtitle }]}>Food</Text>
        </View>

        <View style={styles.categoryCol}>
          <Text style={[styles.categoryRating, { color: text }]}>
            {restaurant.beveragesRating ?? 4.3}
          </Text>
          <Text style={[styles.categoryName, { color: subtitle }]}>Beverages</Text>
        </View>

        <View style={styles.categoryCol}>
          <Text style={[styles.categoryRating, { color: text }]}>
            {restaurant.serviceRating}
          </Text>
          <Text style={[styles.categoryName, { color: subtitle }]}>Service</Text>
        </View>

        <View style={styles.categoryCol}>
          <Text style={[styles.categoryRating, { color: text }]}>
            {restaurant.ambienceRating}
          </Text>
          <Text style={[styles.categoryName, { color: subtitle }]}>Ambience</Text>
        </View>
      </View>

      {/* ---------- HORIZONTAL REVIEW CARDS ---------- */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, paddingRight: 14 }}
        style={{ marginTop: 10, marginBottom: 20 }}
      >
        {previewReviews.map((rev, i) => (
          <View
            key={i}
            style={[
              styles.reviewCard,
              {
                backgroundColor: cardBg,
                borderColor: border,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.reviewHeader}>
              {/* Avatar or Placeholder */}
              {rev.avatar ? (
                <Image source={{ uri: rev.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.placeholderAvatar, { backgroundColor: placeholderBg }]}>
                  <Text style={[styles.placeholderText, { color: placeholderText }]}>
                    {getInitial(rev.username)}
                  </Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={[styles.username, { color: text }]} numberOfLines={1}>
                  {rev.username}
                </Text>
                <Text style={[styles.daysAgo, { color: subtitle }]}>
                  {rev.daysAgo} days ago
                </Text>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>{rev.rating}</Text>
                <Text style={styles.badgeStar}>★</Text>
              </View>
            </View>

            {/* Review text */}
            <Text style={[styles.reviewText, { color: mutedText }]} numberOfLines={4}>
              {rev.text}
            </Text>

            <Text style={[styles.readMore, { color: underlineText }]}>Read more</Text>
          </View>
        ))}
      </ScrollView>

      {/* ---------- BEEN HERE? SECTION ---------- */}
      <View
        style={[
          styles.beenHereCard,
          {
            borderColor: border,
            backgroundColor: surface, // keeps same look, but matches theme
          },
        ]}
      >
        <Text style={[styles.beenHereText, { color: text }]}>
          Been here? Tell us how it was.
        </Text>

        <View style={styles.starsRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Text key={i} style={[styles.starOutline, { color: text }]}>
              ☆
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

/* ------------------ STYLES ------------------ */

const CARD_WIDTH = width * 0.80;

const styles = StyleSheet.create({
  container: { marginTop: 25 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 20, fontWeight: "700" },

  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6A52FF",
    textDecorationLine: "underline",
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 15,
    justifyContent: "space-between",
  },

  ratingCard: { width: 80, alignItems: "center" },

  greenBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3AB757",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  greenRating: { color: "#fff", fontWeight: "700", fontSize: 16 },
  star: { color: "#fff", marginLeft: 4, fontWeight: "700" },

  totalRatings: {
    backgroundColor: "#F5F5F5",
    width: "100%",
    textAlign: "center",
    paddingVertical: 5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    fontSize: 12,
    fontWeight: "600",
  },

  categoryCol: { alignItems: "center", width: 70 },
  categoryRating: { fontSize: 18, fontWeight: "700" },
  categoryName: { fontSize: 13, marginTop: 2 },

  /* Review Card */
  reviewCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    minHeight: 180,
  },

  reviewHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 12 },

  /* Placeholder Avatar */
  placeholderAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#555",
  },

  username: { fontSize: 16, fontWeight: "600" },
  daysAgo: { fontSize: 12, color: "#777" },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3AB757",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: "auto",
  },

  badgeText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  badgeStar: { color: "#fff", marginLeft: 3 },

  reviewText: { fontSize: 14, color: "#444", marginBottom: 6 },

  readMore: {
    fontSize: 14,
    color: "#444",
    textDecorationLine: "underline",
  },

  /* BEEN HERE SECTION */
  beenHereCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 18,
    borderRadius: 16,
  },

  beenHereText: { fontSize: 16, fontWeight: "600", marginBottom: 12 },

  starsRow: { flexDirection: "row", gap: 12 },

  starOutline: { fontSize: 30 },
});
