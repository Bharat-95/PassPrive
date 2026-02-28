import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ThemeContext } from "../../App";
import { Bookmark, BookmarkCheck } from "lucide-react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.82;
const CARD_HEIGHT = 360;

// ⭐ Dummy Data
const LIMELIGHT = [
  {
    id: 1,
    name: "Bourbon & Breeze Rooftop Bar & Kitchen",
    rating: 4.2,
    distance: "18.2 km",
    cost: "₹1600 for two",
    offer: "Flat 55% OFF",
    image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
  },
  {
    id: 2,
    name: "The Sanctuary Bistro & Kitchen",
    rating: 4.5,
    distance: "21.0 km",
    cost: "₹1900 for two",
    offer: "Flat 35% OFF",
    image: "https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg",
  },
  {
    id: 3,
    name: "SkyGarden Terrace Lounge",
    rating: 4.3,
    distance: "12.4 km",
    cost: "₹2200 for two",
    offer: "Flat 40% OFF",
    image: "https://images.pexels.com/photos/245535/pexels-photo-245535.jpeg",
  },
  {
    id: 4,
    name: "Café Moonlight – All Day Dining",
    rating: 4.1,
    distance: "9.8 km",
    cost: "₹900 for two",
    offer: "Flat 20% OFF",
    image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg",
  },
  {
    id: 5,
    name: "La Fiesta Urban Kitchen",
    rating: 4.6,
    distance: "15.2 km",
    cost: "₹1400 for two",
    offer: "Flat 50% OFF",
    image: "https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg",
  },
  {
    id: 6,
    name: "Masala Trails Authentic Indian Diner",
    rating: 4.4,
    distance: "17.6 km",
    cost: "₹1200 for two",
    offer: "Flat 30% OFF",
    image: "https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg",
  },
  {
    id: 7,
    name: "Saffron & Oak – Multi-Cuisine House",
    rating: 4.7,
    distance: "13.4 km",
    cost: "₹1800 for two",
    offer: "Flat 45% OFF",
    image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
  },
];


export default function InTheLimelight() {
  const { colors } = useContext(ThemeContext);
  const [saved, setSaved] = useState({});

  const toggleSave = (id) => {
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={{ marginTop: 30 }}>
      {/* Heading */}
      <View style={styles.headingContainer}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", colors.subtitle + "30"]}
          style={styles.line}
        />
        <Text style={[styles.heading, { color: colors.text }]}>
          IN THE LIMELIGHT
        </Text>
        <LinearGradient
          colors={[colors.subtitle + "30", "rgba(0,0,0,0)"]}
          style={styles.line}
        />
      </View>

      {/* Scrollable Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 10 }}
      >
        {LIMELIGHT.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Image Section */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} />

              {/* Offer Tag */}
              <View style={styles.offerTag}>
                <Text style={styles.offerText}>{item.offer}</Text>
              </View>

              {/* Bookmark */}
              <TouchableOpacity
                style={[
                  styles.bookmarkBtn,
                  { backgroundColor: colors.card + "AA" },
                ]}
                onPress={() => toggleSave(item.id)}
              >
                {saved[item.id] ? (
                  <BookmarkCheck size={24} color={colors.text} />
                ) : (
                  <Bookmark size={24} color={colors.text} />
                )}
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.infoBox}>
              <Text style={[styles.name, { color: colors.text }]}>
                {item.name}
              </Text>

              <View style={styles.metaRow}>
                <Text style={styles.rating}>{item.rating} ⭐</Text>
                <Text style={[styles.meta, { color: colors.subtitle }]}>
                  • {item.distance}
                </Text>
                <Text style={[styles.meta, { color: colors.subtitle }]}>
                  • {item.cost}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  line: { flex: 1, height: 1, marginHorizontal: 12 },
  heading: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.4,
  },

  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 16,
    overflow: "hidden",
  },

  imageContainer: {
    width: "100%",
    height: CARD_HEIGHT * 0.55,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  offerTag: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#4B23FF",
    borderRadius: 6,
  },
  offerText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  bookmarkBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 10,
  },

  infoBox: {
    padding: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  rating: {
    color: "#4CAF50",
    fontWeight: "700",
  },

  meta: {
    fontSize: 13,
    marginLeft: 6,
  },
});
