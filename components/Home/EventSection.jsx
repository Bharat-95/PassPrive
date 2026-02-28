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

/* ---------------- DAY TILES ---------------- */
const DAY_TILES = [
  { key: "Today", count: 40 },
  { key: "Tomorrow", count: 5 },
  { key: "Next Week", count: 12 },
];

const EVENTS = {
  Today: [
    {
      id: 1,
      time: "Today, 9:30 PM",
      title: "Lights Out at SOCIAL – Qatar GP",
      venue: "Mindspace Social, Hitech City",
      image: "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg",
    },
    {
      id: 2,
      time: "Today, 9:00 PM",
      title: "Duet at The Goat",
      venue: "Jamming Goat 3.0, Hyderabad",
      image: "https://images.pexels.com/photos/167446/pexels-photo-167446.jpeg",
    },
    {
      id: 3,
      time: "Today, 9:00 PM",
      title: "Sufi Night – Aatish Performing Live",
      venue: "The Rabbit Hole Lounge Bar",
      image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
    },
  ],

  Tomorrow: [
    {
      id: 4,
      time: "Tomorrow, 7:30 PM",
      title: "All Stars Comedy Lineup",
      venue: "Comedy Club, Jubilee Hills",
      image: "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg",
    },
    {
      id: 5,
      time: "Tomorrow, 9:00 PM",
      title: "Music Fiesta – Live Band",
      venue: "Tabula Rasa, Hyderabad",
      image: "https://images.pexels.com/photos/1649387/pexels-photo-1649387.jpeg",
    },
  ],

  "Next Week": [
    {
      id: 6,
      time: "Next Week, 8:00 PM",
      title: "Dark Comedy Standup Night",
      venue: "The Comedy House, Hyderabad",
      image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
    },
    {
      id: 7,
      time: "Next Week, 6:00 PM",
      title: "Salsa Night Workshop",
      venue: "Dance City Studio, Hyderabad",
      image: "https://images.pexels.com/photos/3094230/pexels-photo-3094230.jpeg",
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
          HAPPENING AROUND YOU
        </Text>
        <LinearGradient
          colors={[colors.subtitle + "30", "rgba(0,0,0,0)"]}
          style={styles.lineGradientRight}
        />
      </View>

      {/* Scrollable Tiles */}
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
                <Text style={[styles.dayTitle, { color: colors.text }]}>
                  {day.key}
                </Text>
                <Text style={[styles.dayCount, { color: colors.subtitle }]}>
                  {day.count} events
                </Text>
              </View>

              <ChevronRight color={colors.text} size={20} />
            </View>

            {/* Event List */}
            <View style={{ marginTop: 12 }}>
              {EVENTS[day.key].map((item) => (
                <View key={item.id} style={styles.eventRow}>
                  
                  {/* ⭐ Add loading triggers here */}
                  <Image
                    source={{ uri: item.image }}
                    style={styles.eventImg}
                    onLoadStart={() => onLoadingChange?.(true)}
                    onLoadEnd={() => onLoadingChange?.(false)}
                  />

                  <View style={styles.eventContent}>
                    <Text style={[styles.eventTime, { color: colors.primary }]}>
                      {item.time}
                    </Text>

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
});
