// components/Home/HomeContent.jsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Animated, View, Easing } from "react-native";
import HomeOffers from "./HomeOffers";
import SpotLight from "./SpotLight";
import StoreCategory from "../Home/StoreSearchBar";
import Trending from "./NowTrending";
import FoodieFrontView from "./FoodieFrontrow";
import EventSection from "./EventSection";

const BANNER_HEIGHT = 250;

export default function HomeContent({
  onLoadingChange,
  renderInlineCategories,
  onInlineCategoriesLayout,
}) {
  const [offersCount, setOffersCount] = useState(0);
  const [loadingStates, setLoadingStates] = useState({
    offers: true,
    spotlight: false,
    store: false,
    trending: false,
    foodie: false,
    events: false,
  });
  const bannerReveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(bannerReveal, {
      toValue: !loadingStates.offers && offersCount > 0 ? 1 : 0,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [loadingStates.offers, offersCount, bannerReveal]);

  const updateLoading = useCallback((section, value) => {
    setLoadingStates(prev => {
      if (prev[section] === value) {
        return prev;
      }

      const updated = { ...prev, [section]: value };

      // Send TRUE if ANY section is loading
      const aggregated = Object.values(updated).some(v => v === true);
      onLoadingChange?.(aggregated);

      return updated;
    });
  }, [onLoadingChange]);

  const animatedBannerHeight = bannerReveal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BANNER_HEIGHT],
  });
  const animatedBannerSpacing = bannerReveal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  return (
    <>
      <Animated.View
        style={{
          marginTop: animatedBannerSpacing,
          marginBottom: animatedBannerSpacing,
          height: animatedBannerHeight,
          opacity: bannerReveal,
          transform: [
            {
              translateY: bannerReveal.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 0],
              }),
            },
          ],
          overflow: "hidden",
        }}
      >
        <HomeOffers
          onLoadingChange={v => updateLoading("offers", v)}
          onOffersCountChange={count => setOffersCount(count)}
        />
      </Animated.View>
      {renderInlineCategories ? (
        <View
          onLayout={e => {
            const { y, height } = e.nativeEvent.layout;
            onInlineCategoriesLayout?.(y + height);
          }}
        >
          {renderInlineCategories}
        </View>
      ) : null}
      <SpotLight onLoadingChange={(v) => updateLoading("spotlight", v)} />
      <StoreCategory onLoadingChange={(v) => updateLoading("store", v)} />
      <Trending onLoadingChange={(v) => updateLoading("trending", v)} />
      <FoodieFrontView onLoadingChange={(v) => updateLoading("foodie", v)} />
      <EventSection onLoadingChange={(v) => updateLoading("events", v)} />
    </>
  );
}
