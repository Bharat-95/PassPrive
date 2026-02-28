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

/* ---------------- NEW CATEGORY TILES ---------------- */
const DAY_TILES = [
  { key: "Sky High Sips", count: "Dinner and drinks with a view?" },
  { key: "Must Visit Cafes", count: "Catch the coolest cafes in town"},
  { key: "Party Hotspots", count: "Find the party tonight" },
  { key: "Luxury Gems", count: "Find the best of hotel dining " },
  { key: "New in District", count: "Discover your city's newest spots" },
  { key: "Offers You'll Love", count: "The best offers at top restaurants" },
];

/* ---------------- CATEGORY DATA (4 ITEMS EACH) ---------------- */
const EVENTS = {
  "Sky High Sips": [
    {
      id: 1,
      time: "Tonight, 8:30 PM",
      title: "Sky Lounge Sundowner",
      venue: "AltAir Rooftop, Hyderabad",
      offer: "Free Welcome Drink",
      image: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg",
    },
    {
      id: 2,
      time: "Today, 9:00 PM",
      title: "Jazz & Gin Night",
      venue: "Air Live Rooftop",
      offer: "Buy 1 Get 1 Gin",
      image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
    },
    {
      id: 3,
      time: "Tonight, 7:00 PM",
      title: "Sunset Cocktails",
      venue: "The Moonshine Project",
      offer: "Flat 10% Off",
      image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg",
    },
    {
      id: 4,
      time: "Tonight, 10:00 PM",
      title: "DJ Night – Rooftop Edition",
      venue: "Aqua Spirit Lounge",
      offer: "Free Entry",
      image: "https://images.pexels.com/photos/2903161/pexels-photo-2903161.jpeg",
    },
  ],

  "Must Visit Cafes": [
    {
      id: 5,
      time: "Open Now",
      title: "The Coffee House Experience",
      venue: "Roastery Coffee House",
      offer: "Free Cookie",
      image: "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg",
    },
    {
      id: 6,
      time: "Open Now",
      title: "Pastel Vibes Only",
      venue: "Autumn Leaf Cafe",
      offer: "20% OFF",
      image: "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg",
    },
    {
      id: 7,
      time: "Open Now",
      title: "Pink Bloom Cafe",
      venue: "Humble Bunch Cafe",
      offer: "Free Dessert",
      image: "https://images.pexels.com/photos/374147/pexels-photo-374147.jpeg",
    },
    {
      id: 8,
      time: "Open Now",
      title: "Work & Chill Cafe",
      venue: "The Coffee Cup",
      offer: "Flat 15% OFF",
      image: "https://images.pexels.com/photos/245535/pexels-photo-245535.jpeg",
    },
  ],

  "Party Hotspots": [
    {
      id: 9,
      time: "Tonight, 9 PM",
      title: "Euphoria Night",
      venue: "Amnesia Lounge Bar",
      offer: "Free Shots",
      image: "https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg",
    },
    {
      id: 10,
      time: "Tonight, 10 PM",
      title: "DJ Nova Live",
      venue: "Prism Club",
      offer: "Couple Entry 999",
      image: "https://images.pexels.com/photos/274744/pexels-photo-274744.jpeg",
    },
    {
      id: 11,
      time: "Tonight, 8 PM",
      title: "Hip Hop Night",
      venue: "10 Downing Street",
      offer: "Buy 2 Get 1",
      image: "https://images.pexels.com/photos/3377875/pexels-photo-3377875.jpeg",
    },
    {
      id: 12,
      time: "Tonight, 9 PM",
      title: "Bollywood Blast",
      venue: "Tabula Rasa",
      offer: "Free Entry",
      image: "https://images.pexels.com/photos/1304473/pexels-photo-1304473.jpeg",
    },
  ],

  "Luxury Gems": [
    {
      id: 13,
      time: "Open Now",
      title: "5-Star Rooftop Dining",
      venue: "Zytius by Marriott",
      offer: "Flat 20% OFF",
      image: "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg",
    },
    {
      id: 14,
      time: "Open Now",
      title: "Royal Steakhouse",
      venue: "The Park Hotel",
      offer: "Free Wine",
      image: "https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg",
    },
    {
      id: 15,
      time: "Open Now",
      title: "Sky Darling Fine Dine",
      venue: "Novotel Hyderabad",
      offer: "Chef’s Special 10% OFF",
      image: "https://images.pexels.com/photos/255501/pexels-photo-255501.jpeg",
    },
    {
      id: 16,
      time: "Open Now",
      title: "Premium Wine Tasting",
      venue: "Hyatt Galleria",
      offer: "Free Tasting",
      image: "https://images.pexels.com/photos/140785/pexels-photo-140785.jpeg",
    },
  ],

  "New in District": [
    {
      id: 17,
      time: "New",
      title: "Tokyo Town Sushi Bar",
      venue: "Kondapur",
      offer: "15% OFF Today",
      image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg",
    },
    {
      id: 18,
      time: "New",
      title: "The Waffle Fusion Hub",
      venue: "Jubilee Hills",
      offer: "Free Mini Waffle",
      image: "https://images.pexels.com/photos/3026806/pexels-photo-3026806.jpeg",
    },
    {
      id: 19,
      time: "New",
      title: "Vintage European Deli",
      venue: "Kukatpally",
      offer: "Flat 10% OFF",
      image: "https://images.pexels.com/photos/3026809/pexels-photo-3026809.jpeg",
    },
    {
      id: 20,
      time: "New",
      title: "Boba Pop & Tea",
      venue: "Gachibowli",
      offer: "Free Pearl Upgrade",
      image: "https://images.pexels.com/photos/6205508/pexels-photo-6205508.jpeg",
    },
  ],

  "Offers You'll Love": [
    {
      id: 21,
      time: "Limited Time",
      title: "Flat 50% OFF Meals",
      venue: "Urban Eatery",
      offer: "50% OFF",
      image: "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg",
    },
    {
      id: 22,
      time: "Exclusive",
      title: "1+1 on Main Course",
      venue: "Chili's American Grill",
      offer: "Buy 1 Get 1",
      image: "https://images.pexels.com/photos/704969/pexels-photo-704969.jpeg",
    },
    {
      id: 23,
      time: "Today Only",
      title: "Unlimited BBQ Buffet",
      venue: "Barbeque Nation",
      offer: "₹599 Only",
      image: "https://images.pexels.com/photos/3577561/pexels-photo-3577561.jpeg",
    },
    {
      id: 24,
      time: "Limited Time",
      title: "20% OFF on Bill",
      venue: "Mainland China",
      offer: "20% OFF",
      image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
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

            {/* Event Rows */}
            <View style={{ marginTop: 12 }}>
              {EVENTS[day.key].map((item) => (
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
                        style={[
                          styles.offerText,
                          { color: "#4B23FF" },
                        ]}
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
const cardWidth = width * 0.80;

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

  eventTime: {
    fontSize: 12.5,
    fontWeight: "700",
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

