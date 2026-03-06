import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Video from "react-native-video";

const screenWidth = Dimensions.get("window").width;
let cachedOffers = null;
let offersRequestPromise = null;

export default function HomeOffers({ onLoadingChange, onOffersCountChange }) {
  const [offers, setOffers] = useState([]);
  const hasReportedVisibleRef = useRef(false);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const onOffersCountChangeRef = useRef(onOffersCountChange);

  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange;
  }, [onLoadingChange]);

  useEffect(() => {
    onOffersCountChangeRef.current = onOffersCountChange;
  }, [onOffersCountChange]);

  useEffect(() => {
    hasReportedVisibleRef.current = false;
    if (Array.isArray(cachedOffers)) {
      setOffers(cachedOffers);
      onOffersCountChangeRef.current?.(cachedOffers.length);
      onLoadingChangeRef.current?.(false);
      return;
    }

    const fetchOffers = async () => {
      try {
        onLoadingChangeRef.current?.(true);

        if (!offersRequestPromise) {
          offersRequestPromise = fetch(
            `https://nxxacdlmcc.execute-api.ap-south-1.amazonaws.com/api/homeherooffers`,
          )
            .then(res => res.json())
            .finally(() => {
              offersRequestPromise = null;
            });
        }

        const data = await offersRequestPromise;
        const nextOffers = data.offers || [];
        cachedOffers = nextOffers;
        setOffers(nextOffers);
        onOffersCountChangeRef.current?.(nextOffers.length);
        if (!nextOffers.length) {
          onLoadingChangeRef.current?.(false);
        }
      } catch (err) {
        console.log("Offer Fetch Error:", err);
        onOffersCountChangeRef.current?.(0);
        onLoadingChangeRef.current?.(false);
      }
    };

    fetchOffers();
  }, []);

  const markBannerVisible = useCallback(() => {
    if (hasReportedVisibleRef.current) return;
    hasReportedVisibleRef.current = true;
    onLoadingChangeRef.current?.(false);
  }, []);

  return (
    <View style={styles.container}>
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
                onLoad={markBannerVisible}
              />
            ) : (
              <Image
                source={{ uri: item.media_url }}
                style={styles.media}
                resizeMode="stretch"
                onLoad={markBannerVisible}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
