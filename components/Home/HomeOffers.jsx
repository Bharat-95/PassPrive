import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  useWindowDimensions,
  Platform,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import Video from "react-native-video";
import LinearGradient from "react-native-linear-gradient";

let cachedOffers = null;
let offersRequestPromise = null;

export default function HomeOffers({ onLoadingChange, onOffersCountChange }) {
  const { width: windowWidth } = useWindowDimensions();
  const screenWidth = Dimensions.get("screen").width;
  const bannerWidth =
    Platform.OS === "android"
      ? Math.ceil(screenWidth)
      : Math.ceil(windowWidth);
  const bannerRadius = Platform.OS === "android" ? 0 : 18;
  const [offers, setOffers] = useState([]);
  const [isBannerReady, setIsBannerReady] = useState(false);
  const hasReportedVisibleRef = useRef(false);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const onOffersCountChangeRef = useRef(onOffersCountChange);
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const shimmerLoopRef = useRef(null);

  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange;
  }, [onLoadingChange]);

  useEffect(() => {
    onOffersCountChangeRef.current = onOffersCountChange;
  }, [onOffersCountChange]);

  useEffect(() => {
    hasReportedVisibleRef.current = false;
    setIsBannerReady(false);
    if (Array.isArray(cachedOffers)) {
      setOffers(cachedOffers);
      onOffersCountChangeRef.current?.(cachedOffers.length);
      onLoadingChangeRef.current?.(false);
      if (!cachedOffers.length) {
        setIsBannerReady(true);
      }
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
          setIsBannerReady(true);
          onLoadingChangeRef.current?.(false);
        }
      } catch (err) {
        console.log("Offer Fetch Error:", err);
        setIsBannerReady(true);
        onOffersCountChangeRef.current?.(0);
        onLoadingChangeRef.current?.(false);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    if (isBannerReady) {
      shimmerLoopRef.current?.stop?.();
      shimmerAnim.setValue(0);
      return;
    }

    shimmerLoopRef.current = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    shimmerLoopRef.current.start();

    return () => {
      shimmerLoopRef.current?.stop?.();
    };
  }, [isBannerReady, shimmerAnim]);

  const markBannerVisible = useCallback(() => {
    if (hasReportedVisibleRef.current) return;
    hasReportedVisibleRef.current = true;
    setIsBannerReady(true);
    onLoadingChangeRef.current?.(false);
  }, []);

  return (
    <View style={styles.container}>
      {!isBannerReady && (
        <View
          pointerEvents="none"
          style={[styles.skeleton, { width: bannerWidth, borderRadius: bannerRadius }]}
        >
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                transform: [
                  {
                    translateX: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-bannerWidth, bannerWidth],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.35)", "rgba(255,255,255,0)"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </View>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyboardShouldPersistTaps="handled"
        style={[styles.carousel, { width: bannerWidth }]}
        contentContainerStyle={styles.carouselContent}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
        contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
        scrollIndicatorInsets={{ top: 0, left: 0, bottom: 0, right: 0 }}
        bounces={false}
      >
        {offers.map((item, idx) => (
          <View
            key={idx}
            style={[styles.card, { width: bannerWidth, borderRadius: bannerRadius }]}
          >
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
                resizeMode="cover"
                onLoad={markBannerVisible}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    marginTop: 0,
    paddingTop: 0,
    width: "100%",
    alignSelf: "stretch",
    overflow: "hidden",
  },
  carousel: {
    width: "100%",
    height: "100%",
    marginTop: 0,
    paddingTop: 0,
  },
  carouselContent: {
    marginTop: 0,
    paddingTop: 0,
  },

  card: {
    height: 250,
    overflow: "hidden",
    backgroundColor: "transparent",
  },

  media: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    marginTop: 0,
  },
  skeleton: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 250,
    backgroundColor: "#D8D2DC",
    overflow: "hidden",
    zIndex: 2,
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 140,
    height: "100%",
  },
});
