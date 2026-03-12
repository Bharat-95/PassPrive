// components/Home/HomeContent.jsx
import React, { useState, useCallback } from "react";
import { View } from "react-native";
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
  onSpotlightLayout,
  onSpotlightRefresh,
  spotlightRefreshing = false,
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
  const handleFoodieLoading = useCallback(
    value => updateLoading("foodie", value),
    [updateLoading]
  );

  const showOffersBanner = !loadingStates.offers && offersCount > 0;

  return (
    <>
      {showOffersBanner ? (
        <View style={{ height: BANNER_HEIGHT, overflow: "hidden" }}>
          <HomeOffers
            onLoadingChange={v => updateLoading("offers", v)}
            onOffersCountChange={count => setOffersCount(count)}
          />
        </View>
      ) : (
        <HomeOffers
          onLoadingChange={v => updateLoading("offers", v)}
          onOffersCountChange={count => setOffersCount(count)}
        />
      )}
      {renderInlineCategories ? (
        <View
          onLayout={e => {
            const { y, height } = e.nativeEvent.layout;
            onInlineCategoriesLayout?.({ startY: y, endY: y + height });
          }}
        >
          {renderInlineCategories}
        </View>
      ) : null}
      <View
        onLayout={e => {
          const { y } = e.nativeEvent.layout;
          onSpotlightLayout?.(y);
        }}
      >
        {/* <SpotLight
          onLoadingChange={(v) => updateLoading("spotlight", v)}
          onRefresh={onSpotlightRefresh}
          refreshing={spotlightRefreshing}
        /> */}
      </View>
      {/* <StoreCategory onLoadingChange={(v) => updateLoading("store", v)} /> */}

       <FoodieFrontView onLoadingChange={handleFoodieLoading} />
      <Trending onLoadingChange={(v) => updateLoading("trending", v)} />
     
      <EventSection onLoadingChange={(v) => updateLoading("events", v)} />
    </>
  );
}
