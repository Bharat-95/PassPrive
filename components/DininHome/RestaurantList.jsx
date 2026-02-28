import React, { useRef, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { ThemeContext } from "../../App";
import LinearGradient from "react-native-linear-gradient";

import RestaurantCard from "./RestaurantCard";
import DineFilters from "./DineFilters";

const API_BASE = "https://nxxacdlmcc.execute-api.ap-south-1.amazonaws.com";

function getRestaurantStatus(openingHours) {
  try {
    const now = new Date();
    const dayTitle = now.toLocaleDateString("en-US", { weekday: "long" });
    const dayLower = dayTitle.toLowerCase();

    const today =
      openingHours?.[dayLower] ??
      openingHours?.[dayTitle] ??
      openingHours?.[dayTitle.toLowerCase()];

    if (!today) return { isOpen: false, opensAt: null };

    if (typeof today === "object" && today?.open && today?.close) {
      const toMinutes = (hhmm) => {
        const [h, m] = String(hhmm).split(":").map(Number);
        if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
        return h * 60 + m;
      };

      const startMin = toMinutes(today.open);
      const endMin = toMinutes(today.close);
      const currentMin = now.getHours() * 60 + now.getMinutes();

      if (startMin == null || endMin == null) return { isOpen: false, opensAt: null };

      let isOpen = false;
      if (endMin >= startMin) {
        isOpen = currentMin >= startMin && currentMin <= endMin;
      } else {
        isOpen = currentMin >= startMin || currentMin <= endMin;
      }

      return {
        isOpen,
        opensAt: isOpen ? null : today.open,
      };
    }

    if (typeof today === "string") {
      const [start, end] = today.split(" - ");
      const to24 = (t) => new Date(`1970-01-01 ${t}`).getTime();

      const startTime = to24(start);
      const endTime = to24(end);
      const current = to24(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })
      );

      const isOpen = current >= startTime && current <= endTime;
      return { isOpen, opensAt: isOpen ? null : start };
    }

    return { isOpen: false, opensAt: null };
  } catch (e) {
    return { isOpen: false, opensAt: null };
  }
}

function getOfferLabel(offerRaw) {
  if (!offerRaw) return "";

  const first = Array.isArray(offerRaw) ? offerRaw[0] : offerRaw;

  if (typeof first === "string") return first;

  if (typeof first === "object") {
    const title = first?.title || "";
    const discountType = first?.discountType || "";
    const discountValue = first?.discountValue;

    let discountText = "";
    if (discountValue !== undefined && discountValue !== null && discountValue !== "") {
      discountText =
        discountType === "PERCENT"
          ? `${discountValue}% OFF`
          : `Rs ${discountValue} OFF`;
    }

    if (title && discountText) return `${title} • ${discountText}`;
    if (title) return title;
    if (discountText) return discountText;
    if (first?.offerKind === "VISIT") return "Repeat rewards available";
  }

  return "";
}

function mapRestaurantFromBackend(r) {
  return {
    id: r.id,
    name: r.name,
    rating: r.rating ?? 0,
    foodRating: r.food_rating ?? null,
    serviceRating: r.service_rating ?? null,
    ambienceRating: r.ambience_rating ?? null,
    totalRatings: r.total_ratings ?? 0,

    reviews: Array.isArray(r.reviews) ? r.reviews : r.reviews ?? [],

    cuisines: Array.isArray(r.cuisines) ? r.cuisines : [],
    costForTwo: r.cost_for_two ?? null,
    distance: r.distance ?? null,

    offer: getOfferLabel(r.offer),
    rawOffer: r.offer ?? null,

    area: r.area ?? "",
    city: r.city ?? "",
    phone: r.phone ?? "",
    fullAddress: r.full_address ?? "",

    images: {
      food: Array.isArray(r.food_images) ? r.food_images : [],
      ambience: Array.isArray(r.ambience_images) ? r.ambience_images : [],
    },

    facilities: Array.isArray(r.facilities) ? r.facilities : [],
    openingHours: r.opening_hours ?? {},

    highlights: Array.isArray(r.highlights) ? r.highlights : [],
    worthVisit: Array.isArray(r.worth_visit) ? r.worth_visit : [],

    menu: Array.isArray(r.menu) ? r.menu : r.menu ?? [],

    coverImage: r.cover_image ?? null,
    slug: r.slug ?? null,
    latitude: r.latitude ?? null,
    longitude: r.longitude ?? null,

    bookingEnabled: r.booking_enabled ?? true,
    avgDurationMinutes: r.avg_duration_minutes ?? 90,
    maxBookingsPerSlot: r.max_bookings_per_slot ?? null,
    advanceBookingDays: r.advance_booking_days ?? 30,

    isActive: r.is_active ?? true,
    ownerUserId: r.owner_user_id ?? null,
    createdAt: r.created_at ?? null,
  };
}

export default function RestaurantList({
  restaurants: restaurantsProp,
  onOpenFilters,
  onApplyQuickFilter,
  onFilterPosition,
}) {
  const { colors } = useContext(ThemeContext);

  const [restaurants, setRestaurants] = useState(restaurantsProp || []);
  const [loading, setLoading] = useState(!restaurantsProp);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);
  const filterViewRef = useRef(null);

  const viewabilityConfig = { itemVisiblePercentThreshold: 60 };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) setActiveIndex(viewableItems[0].index);
  }).current;

  const fetchRestaurants = async () => {
  try {
    setErrorMsg("");

    const url = `${API_BASE}/api/restaurants?limit=100&offset=0`;
    const res = await fetch(url);

    const raw = await res.text();
    let json = null;
    try {
      json = raw ? JSON.parse(raw) : null;
    } catch {
      json = null;
    }

    if (!res.ok) {
      throw new Error(
        json?.error ||
          json?.message ||
          raw ||
          `Request failed (${res.status})`
      );
    }

    const items = Array.isArray(json?.items) ? json.items : [];
    const mapped = items.map(mapRestaurantFromBackend);
    setRestaurants(mapped);
  } catch (e) {
    setErrorMsg(e?.message || "Failed to fetch restaurants");
  }
};


  useEffect(() => {
    if (restaurantsProp) return;
    (async () => {
      setLoading(true);
      await fetchRestaurants();
      setLoading(false);
    })();
  }, [restaurantsProp]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRestaurants();
    setRefreshing(false);
  };

  const computedData = restaurants.map((r) => {
    const status = getRestaurantStatus(r.openingHours);
    return { ...r, ...status };
  });

  return (
    <View
      style={styles.wrapper}
      onLayout={() => {
        setTimeout(() => {
          filterViewRef.current?.measureInWindow((x, y) => {
            onFilterPosition?.(y);
          });
        }, 100);
      }}
    >
      <View style={styles.headingContainer}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", `${colors.subtitle}30`]}
          style={styles.lineGradientLeft}
        />
        <Text style={[styles.heading, { color: colors.text }]}>ALL RESTAURANTS</Text>
        <LinearGradient
          colors={[`${colors.subtitle}30`, "rgba(0,0,0,0)"]}
          style={styles.lineGradientRight}
        />
      </View>

      {loading ? (
        <View style={{ paddingTop: 40, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 10, color: colors.subtitle }}>Loading restaurants...</Text>
        </View>
      ) : errorMsg ? (
        <View style={{ paddingTop: 30 }}>
          <Text style={{ color: "tomato", textAlign: "center" }}>{errorMsg}</Text>
          <Text
            onPress={fetchRestaurants}
            style={{
              marginTop: 12,
              color: colors.text,
              textAlign: "center",
              textDecorationLine: "underline",
            }}
          >
            Tap to retry
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          data={computedData}
          keyExtractor={(item) => String(item.id)}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item, index }) => (
            <RestaurantCard
              item={item}
              isActive={index === activeIndex}
              restaurants={restaurants}
            />
          )}
          ListHeaderComponent={
            <View ref={filterViewRef}>
              <DineFilters
                onOpenFilters={onOpenFilters}
                onSelectQuick={onApplyQuickFilter}
              />
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.text}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    padding: 10,
    marginTop: 10,
  },
  lineGradientLeft: {
    flex: 1,
    height: 1,
    marginRight: 12,
  },
  lineGradientRight: {
    flex: 1,
    height: 1,
    marginLeft: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});
