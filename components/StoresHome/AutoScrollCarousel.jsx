import React, { useRef, useEffect, useState } from "react";
import { View, Image, FlatList, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export default function AutoScrollCarousel({ images = [], isActive }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  // Create infinite loop by tripling the array
  const infiniteImages = images.length > 0 ? [...images, ...images, ...images] : [];
  const actualLength = images.length;

  /* -----------------------------------
      START AUTO SCROLL
  ----------------------------------- */
  const startAutoScroll = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;

        // When we reach the end of second set, jump to start of second set
        if (next >= actualLength * 2) {
          // Jump back instantly without animation
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: actualLength,
              animated: false,
            });
          }, 50);
          return actualLength;
        }

        flatListRef.current?.scrollToIndex({
          index: next,
          animated: true,
        });

        return next;
      });
    }, 2500);
  };

  /* -----------------------------------
      STOP AUTO SCROLL
  ----------------------------------- */
  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  /* -----------------------------------
      HANDLE ACTIVE / INACTIVE CHANGES
  ----------------------------------- */
  useEffect(() => {
    if (isActive && images.length > 0) {
      // Start from the middle set
      setCurrentIndex(actualLength);
      flatListRef.current?.scrollToIndex({ index: actualLength, animated: false });
      startAutoScroll();
    } else {
      stopAutoScroll();
      setCurrentIndex(actualLength);
    }

    return stopAutoScroll;
  }, [isActive, images.length]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={infiniteImages}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialScrollIndex={actualLength}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />

      {/* DOTS - only show for original images */}
      <View style={styles.dotsContainer}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              (currentIndex % actualLength) === i ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: 380,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width,
    height: 380,
    resizeMode: "cover",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 6 },
  activeDot: { backgroundColor: "white", opacity: 1 },
  inactiveDot: { backgroundColor: "white", opacity: 0.4 },
});