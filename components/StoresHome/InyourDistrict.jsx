import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { ThemeContext } from "../../App";
import { ChevronRight } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

/* ---------------- FIXED CATEGORY TILES ---------------- */
const DAY_TILES = [
  {
    key: "Top Deals Near You",
    count: "Unmissable deals on top brands",
  },
  {
    key: "Trending Stores This Week",
    count: "The best of what's trending",
  },
];

/* ---------------- CATEGORY DATA ---------------- */
const STORES = {
  "Top Deals Near You": [
    {
      id: 1,
      title: "Lifestyle",
      venue: "Gachibowli, Hyderabad",
      offer: "Flat 10% OFF",
      image: "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg",
    },
    {
      id: 2,
      title: "Zara",
      venue: "Sarath City Mall",
      offer: "Buy 2 Get 1 Free",
      image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
    },
    {
      id: 3,
      title: "H&M",
      venue: "GVK One Mall",
      offer: "Flat 20% OFF",
      image: "https://images.pexels.com/photos/2851716/pexels-photo-2851716.jpeg",
    },
    {
      id: 4,
      title: "Decathlon",
      venue: "Forum Mall",
      offer: "Up to 30% OFF",
      image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
    },
  ],

  "Trending Stores This Week": [
    {
      id: 5,
      title: "Joyalukkas",
      venue: "Banjara Hills",
      offer: "1% OFF on Gold",
      image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg",
    },
    {
      id: 6,
      title: "Estele",
      venue: "Kukatpally",
      offer: "15% OFF",
      image: "https://images.pexels.com/photos/1915685/pexels-photo-1915685.jpeg",
    },
    {
      id: 7,
      title: "Bata",
      venue: "Madhapur",
      offer: "Flat 10% OFF",
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    },
    {
      id: 8,
      title: "Home Centre",
      venue: "Inorbit Mall",
      offer: "Up to 40% OFF",
      image: "https://images.pexels.com/photos/276224/pexels-photo-276224.jpeg",
    },
  ],
};

export default function EventSection({ onLoadingChange }) {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={{ marginTop: 30 }}>
      {/* Heading */}
      <View style={styles.headingContainer}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", colors.subtitle + "30"]}
          style={styles.lineGradientLeft}
        />
        <Text style={[styles.heading, { color: colors.text }]}>
          In Your PassPrive
        </Text>
        <LinearGradient
          colors={[colors.subtitle + "30", "rgba(0,0,0,0)"]}
          style={styles.lineGradientRight}
        />
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
      >
        {DAY_TILES.map((day) => (
          <View
            key={day.key}
            style={[
              styles.dayCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {/* Header */}
            <View style={styles.dayHeader}>
              <View style={styles.dayColumn}>
                <Text style={[styles.dayTitle, { color: "#4B23FF" }]}>
                  {day.key}
                </Text>
                <Text style={[styles.dayCount, { color: colors.subtitle }]}>
                  {day.count}
                </Text>
              </View>

              <ChevronRight color={colors.text} size={20} />
            </View>

            {/* Store Rows */}
            <View style={{ marginTop: 12 }}>
              {STORES[day.key]?.map((item) => (
                <View key={item.id} style={styles.eventRow}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.eventImg}
                    onLoadStart={() => onLoadingChange?.(true)}
                    onLoadEnd={() => onLoadingChange?.(false)}
                  />

                  <View style={styles.eventContent}>
                    <Text
                      style={[styles.eventTitle, { color: colors.text }]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={[styles.eventVenue, { color: colors.subtitle }]}
                      numberOfLines={1}
                    >
                      {item.venue}
                    </Text>

                    {item.offer && (
                      <Text
                        style={[styles.offerText, { color: "#4B23FF" }]}
                      >
                        {item.offer}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------------- Styles ---------------- */
const cardWidth = width * 0.8;

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    padding: 10,
    marginTop: 10,
  },

  lineGradientLeft: { flex: 1, height: 1, marginRight: 12 },
  lineGradientRight: { flex: 1, height: 1, marginLeft: 12 },

  heading: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  dayCard: {
    width: cardWidth,
    minHeight: 460,
    borderRadius: 15,
    borderWidth: 1,
    padding: 16,
    marginRight: 16,
  },

  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dayColumn: {
    flexDirection: "column",
  },

  dayTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  dayCount: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
  },

  eventRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },

  eventImg: {
    width: 62,
    height: 62,
    borderRadius: 12,
  },

  eventContent: {
    flex: 1,
    flexShrink: 1,
    maxWidth: "80%",
  },

  eventTitle: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "600",
  },

  eventVenue: {
    marginTop: 3,
    fontSize: 12,
  },

  offerText: {
    marginTop: 4,
    fontSize: 12.5,
    fontWeight: "700",
  },
});
