import React, { useRef, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";

import Video from "react-native-video";
import LinearGradient from "react-native-linear-gradient";
import { Bookmark } from "lucide-react-native";
import { VolumeX, Volume2 } from "lucide-react-native";

import { ThemeContext } from "../../App";

const { width } = Dimensions.get("window");

const originalData = [
  {
    id: 1,
    type: "video",
    media: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Vivaha Bhojanambu pours nostalgia",
    subtitle: "Claim your table today",
    location: "Hitech City, Hyderabad",
  },
  {
    id: 2,
    type: "image",
    media: "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg",
    title: "Delicious Grill Fiesta",
    subtitle: "Reserve your seat",
    location: "Jubilee Hills",
  },
  {
    id: 3,
    type: "image",
    media: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
    title: "Soulful Desserts Await",
    subtitle: "Sweeten your day",
    location: "Banjara Hills",
  },
];

const CARD_WIDTH = width * 0.82;
const SPACING = 2;
const SIDE_SPACING = (width - CARD_WIDTH) / 2 - SPACING;

export default function FoodieFrontrow({ onLoadingChange }) {
  const { colors } = useContext(ThemeContext);

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(originalData.length * 2);

  /* ⭐ Loading triggers to parent */
  const handleLoadStart = () => onLoadingChange?.(true);
  const handleLoadEnd = () => onLoadingChange?.(false);

  const infiniteData = [
    ...originalData,
    ...originalData,
    ...originalData,
    ...originalData,
    ...originalData,
  ];

  const initialScrollIndex = originalData.length * 2;

  const getItemLayout = (_, index) => ({
    length: CARD_WIDTH + SPACING,
    offset: (CARD_WIDTH + SPACING) * index,
    index,
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / (CARD_WIDTH + SPACING));
        if (index !== activeIndex) setActiveIndex(index);
      },
    }
  );

  const onScrollEnd = (e) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING)
    );

    if (index <= originalData.length || index >= originalData.length * 3) {
      const targetIndex =
        (index % originalData.length) + originalData.length * 2;

      setActiveIndex(targetIndex);
      flatListRef.current?.scrollToIndex({
        index: targetIndex,
        animated: false,
      });
    }
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING),
    ];

    const scaleY = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: "clamp",
    });

    const isActive = index === activeIndex;

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          { transform: [{ scaleY }], opacity },
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* MEDIA SECTION */}
          <View style={styles.mediaContainer}>
            {item.type === "video" ? (
              <>
                <Video
                  source={{ uri: item.media }}
                  style={styles.media}
                  resizeMode="cover"
                  repeat
                  muted={muted}
                  paused={!isActive}

                  /* ⭐ Added loading senders */
                  onLoadStart={handleLoadStart}
                  onLoad={handleLoadEnd}
                />

                <TouchableOpacity
                  style={[
                    styles.muteBtn,
                    { backgroundColor: colors.background + "AA" },
                  ]}
                  onPress={() => setMuted(!muted)}
                >
                  {muted ? (
                    <VolumeX color={colors.text} size={22} />
                  ) : (
                    <Volume2 color={colors.text} size={22} />
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <Image
                source={{ uri: item.media }}
                style={styles.media}

                /* ⭐ Image Loading */
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
              />
            )}
          </View>

          {/* FOOTER */}
          <View style={[styles.footer, { backgroundColor: colors.card }]}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.card }]}
                onPress={() => console.log("Save restaurant")}
              >
                <Bookmark size={22} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.subtitle, { color: colors.subtitle }]}>
              {item.subtitle}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={{ marginTop: 30 }}>
      {/* Heading */}
      <View style={styles.headingContainer}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", colors.subtitle + "30"]}
          style={styles.lineGradientLeft}
        />
        <Text style={[styles.heading, { color: colors.text }]}>
          FOODIE FRONTROW
        </Text>
        <LinearGradient
          colors={[colors.subtitle + "30", "rgba(0,0,0,0)"]}
          style={styles.lineGradientRight}
        />
      </View>

      {/* Carousel */}
      <Animated.FlatList
        ref={flatListRef}
        data={infiniteData}
        horizontal
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SIDE_SPACING }}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialScrollIndex}
        onMomentumScrollEnd={onScrollEnd}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces
        alwaysBounceHorizontal
      />
    </View>
  );
}

/* ---------------------------------------- */
/*                 STYLES                   */
/* ---------------------------------------- */

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

  cardContainer: {
    width: CARD_WIDTH,
    marginRight: SPACING,
    height: 600,
    justifyContent: "center",
  },

  card: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),

    marginHorizontal: 10,
  },

  mediaContainer: {
    flex: 1,
    position: "relative",
  },

  media: {
    width: "100%",
    height: "100%",
  },

  muteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
    borderRadius: 20,
  },

  footer: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    marginRight: 10,
  },

  subtitle: {
    fontSize: 12,
    marginBottom: 6,
  },

  saveButton: {
    padding: 6,
    borderRadius: 8,
  },
});
