import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import Video from "react-native-video";

const screenWidth = Dimensions.get("window").width;

export default function HomeOffers({ onLoadingChange }) {
  const [offers, setOffers] = useState([]);

  const dropAnim = useRef(new Animated.Value(-300)).current;  

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      // 🔥 Notify parent: loading started
      onLoadingChange?.(true);

      const res = await fetch(`https://nxxacdlmcc.execute-api.ap-south-1.amazonaws.com/api/homeherooffers`);
      const data = await res.json();
      setOffers(data.offers || []);

      // 🔥 Drop animation
      Animated.timing(dropAnim, {
        toValue: 0,
        duration: 650,
        delay: 150,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();

    } catch (err) {
      console.log("Offer Fetch Error:", err);
    } finally {
      // 🔥 Notify parent: loading done
      onLoadingChange?.(false);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: dropAnim }] },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      >
        {offers.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.card}>
            {item.type === "video" ? (
              <Video
                source={{ uri: item.media_url }}
                style={styles.media}
                resizeMode="cover"
                repeat
                paused={false}
                muted
              />
            ) : (
              <Image
                source={{ uri: item.media_url }}
                style={styles.media}
                resizeMode="stretch"
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {},

  card: {
    width: screenWidth,
    height: 250,
    overflow: "hidden",
  },

  media: {
    width: "100%",
    height: "100%",
  },
});
