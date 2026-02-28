// components/Home/HomeContent.jsx
import React, { useState, useCallback } from "react";
import HomeOffers from "./HomeOffers";
import SpotLight from "./SpotLight";
import StoreCategory from "../Home/StoreSearchBar";
import Trending from "./NowTrending";
import FoodieFrontView from "./FoodieFrontrow";
import EventSection from "./EventSection";

export default function HomeContent({ onLoadingChange }) {
  const [loadingStates, setLoadingStates] = useState({
    offers: false,
    spotlight: false,
    store: false,
    trending: false,
    foodie: false,
    events: false,
  });

  const updateLoading = useCallback((section, value) => {
    setLoadingStates(prev => {
      const updated = { ...prev, [section]: value };

      // Send TRUE if ANY section is loading
      const aggregated = Object.values(updated).some(v => v === true);
      onLoadingChange?.(aggregated);

      return updated;
    });
  }, []);

  return (
    <>
      <HomeOffers onLoadingChange={(v) => updateLoading("offers", v)} />
      <SpotLight onLoadingChange={(v) => updateLoading("spotlight", v)} />
      <StoreCategory onLoadingChange={(v) => updateLoading("store", v)} />
      <Trending onLoadingChange={(v) => updateLoading("trending", v)} />
      <FoodieFrontView onLoadingChange={(v) => updateLoading("foodie", v)} />
      <EventSection onLoadingChange={(v) => updateLoading("events", v)} />
    </>
  );
}
