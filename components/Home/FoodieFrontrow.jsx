import React, { useRef, useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Video from "react-native-video";
import { Bookmark, BookmarkCheck, Plus, ChevronRight, X } from "lucide-react-native";
import { VolumeX, Volume2 } from "lucide-react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Stop } from "react-native-svg";

import { ThemeContext } from "../../App";
import supabase from "../../supabase";
import Shimmer from "../Shimmer";
import {
  createHotlist,
  getHotlistsState,
  getHotlistsForRestaurant,
  saveRestaurantToHotlist,
  toggleSavedRestaurant,
  toggleRestaurantInHotlist,
} from "../../services/savedRestaurants";

const { width } = Dimensions.get("window");

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";
const LIGHT_LEFT_LINE_IMAGE = require("../../assets/LiteLeftline.png");
const LIGHT_RIGHT_LINE_IMAGE = require("../../assets/LiteRightline.png");
const DARK_LEFT_LINE_IMAGE = require("../../assets/DarkLeftline.png");
const DARK_RIGHT_LINE_IMAGE = require("../../assets/DarkRightline.png");

const CARD_WIDTH = width * 0.82;
const SPACING = 2;
const SIDE_SPACING = (width - CARD_WIDTH) / 2 - SPACING;
const PENDING_SAVE_KEY = "pending_hotlist_save_restaurant";
const BOOKMARK_GRADIENT_START = "#48101A";
const BOOKMARK_GRADIENT_END = "#A35629";
const BOOKMARK_ACCENT = BOOKMARK_GRADIENT_END;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toNumberOrNull(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = degrees => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
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

function getRestaurantImage(row) {
  const images = [
    row?.cover_image,
    ...(Array.isArray(row?.ambience_images) ? row.ambience_images : []),
    ...(Array.isArray(row?.food_images) ? row.food_images : []),
  ].filter(Boolean);

  return images[0] || FALLBACK_IMAGE;
}

function getSubtitle(row) {
  const offerLabel = getOfferLabel(row?.offer);
  if (offerLabel) return offerLabel;

  const cuisines = Array.isArray(row?.cuisines) ? row.cuisines.filter(Boolean) : [];
  if (cuisines.length) return cuisines.slice(0, 3).join(" • ");

  const areaLine = [row?.area, row?.city].filter(Boolean).join(", ");
  if (areaLine) return areaLine;

  const rating = Number(row?.rating ?? 0);
  if (rating > 0) return `${rating.toFixed(1)} rated dining pick`;

  return "Reserve your table today";
}

function scoreRestaurant(row) {
  const rating = Number(row?.rating ?? 0);
  const totalRatings = Number(row?.total_ratings ?? 0);
  const distance = row?.distance == null ? 5 : Number(row.distance);
  const qualityScore = clamp(rating / 5, 0, 1);
  const confidenceScore = clamp(Math.log10(totalRatings + 1) / 2.5, 0, 1);
  const proximityScore = clamp(1 - distance / 10, 0, 1);

  return (
    proximityScore * 0.45 +
    qualityScore * 0.35 +
    confidenceScore * 0.2
  );
}

function mapRestaurantFromBackend(row) {
  return {
    id: row.id,
    name: row.name,
    rating: row.rating ?? 0,
    foodRating: row.food_rating ?? null,
    serviceRating: row.service_rating ?? null,
    ambienceRating: row.ambience_rating ?? null,
    totalRatings: row.total_ratings ?? 0,
    reviews: Array.isArray(row.reviews) ? row.reviews : row.reviews ?? [],
    cuisines: Array.isArray(row.cuisines) ? row.cuisines : [],
    costForTwo: row.cost_for_two ?? null,
    distance: row.computed_distance_km ?? row.distance ?? null,
    offer: getOfferLabel(row.offer),
    rawOffer: row.offer ?? null,
    area: row.area ?? "",
    city: row.city ?? "",
    phone: row.phone ?? "",
    fullAddress: row.full_address ?? "",
    images: {
      food: Array.isArray(row.food_images) ? row.food_images : [],
      ambience: Array.isArray(row.ambience_images) ? row.ambience_images : [],
    },
    facilities: Array.isArray(row.facilities) ? row.facilities : [],
    openingHours: row.opening_hours ?? {},
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    worthVisit: Array.isArray(row.worth_visit) ? row.worth_visit : [],
    menu: Array.isArray(row.menu) ? row.menu : row.menu ?? [],
    coverImage: row.cover_image ?? null,
    slug: row.slug ?? null,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    bookingEnabled: row.booking_enabled ?? true,
    avgDurationMinutes: row.avg_duration_minutes ?? 90,
    maxBookingsPerSlot: row.max_bookings_per_slot ?? null,
    advanceBookingDays: row.advance_booking_days ?? 30,
    isActive: row.is_active ?? true,
    ownerUserId: row.owner_user_id ?? null,
    createdAt: row.created_at ?? null,
  };
}

function mapRestaurantToFrontrow(row) {
  const resolvedDistance = toNumberOrNull(row?.computed_distance_km);
  const distanceLabel =
    resolvedDistance != null ? `${resolvedDistance.toFixed(1)} km away` : null;

  return {
    ...mapRestaurantFromBackend(row),
    type: "image",
    media: getRestaurantImage(row),
    title: row?.name || "Restaurant",
    subtitle: distanceLabel ? `${distanceLabel} • ${getSubtitle(row)}` : getSubtitle(row),
    location: [row?.area, row?.city].filter(Boolean).join(", "),
  };
}

function getDisplayHotlistName(list) {
  return list?.name || "";
}

function SavedBookmarkIcon({ size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <SvgLinearGradient id="bookmarkGradient" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={BOOKMARK_GRADIENT_START} />
          <Stop offset="1" stopColor={BOOKMARK_GRADIENT_END} />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
        fill="url(#bookmarkGradient)"
      />
    </Svg>
  );
}

async function resolveCurrentUserCoords() {
  const rawCoords = await AsyncStorage.getItem("user_location_coords");
  const parsedCoords = rawCoords ? JSON.parse(rawCoords) : null;

  if (
    parsedCoords &&
    typeof parsedCoords.latitude === "number" &&
    typeof parsedCoords.longitude === "number"
  ) {
    return {
      latitude: parsedCoords.latitude,
      longitude: parsedCoords.longitude,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const storedUserRaw = await AsyncStorage.getItem("auth_user");
  const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  const userId = user?.id || storedUser?.id;

  if (!userId) return null;

  const { data } = await supabase
    .from("users")
    .select("default_lat, default_lng")
    .eq("id", userId)
    .maybeSingle();

  const latitude = toNumberOrNull(data?.default_lat);
  const longitude = toNumberOrNull(data?.default_lng);

  if (latitude == null || longitude == null) return null;

  return { latitude, longitude };
}

async function isUserLoggedIn() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user?.id) {
    return true;
  }

  const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
  return isLoggedIn === "true";
}

async function setPendingSaveRestaurant(restaurant) {
  await AsyncStorage.setItem(PENDING_SAVE_KEY, JSON.stringify(restaurant));
}

async function getPendingSaveRestaurant() {
  const raw = await AsyncStorage.getItem(PENDING_SAVE_KEY);
  return raw ? JSON.parse(raw) : null;
}

async function clearPendingSaveRestaurant() {
  await AsyncStorage.removeItem(PENDING_SAVE_KEY);
}

async function resolveCurrentUserLocationMeta() {
  const coords = await resolveCurrentUserCoords();
  const savedLocation = await AsyncStorage.getItem("user_location");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const storedUserRaw = await AsyncStorage.getItem("auth_user");
  const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  const userId = user?.id || storedUser?.id;

  let defaultAddress = "";
  if (userId) {
    const { data } = await supabase
      .from("users")
      .select("default_address")
      .eq("id", userId)
      .maybeSingle();

    defaultAddress = data?.default_address || "";
  }

  const locationText = savedLocation || defaultAddress || "";
  const parts = locationText
    .split(",")
    .map(part => part.trim())
    .filter(Boolean);
  const city = parts.length ? parts[parts.length - 1].toLowerCase() : "";

  return {
    coords,
    city,
  };
}

export default function FoodieFrontrow({ onLoadingChange }) {
  const { colors, mode } = useContext(ThemeContext);
  const navigation = useNavigation();

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const loadingChangeRef = useRef(onLoadingChange);
  const [muted, setMuted] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [savedIds, setSavedIds] = useState({});
  const [hotlists, setHotlists] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantHotlists, setRestaurantHotlists] = useState([]);
  const [restaurantInAllSaves, setRestaurantInAllSaves] = useState(false);
  const [showHotlistSheet, setShowHotlistSheet] = useState(false);
  const [showCreateHotlist, setShowCreateHotlist] = useState(false);
  const [newHotlistName, setNewHotlistName] = useState("");
  const [saveToast, setSaveToast] = useState(null);
  const [queuedToast, setQueuedToast] = useState(null);
  const [pendingAllSavesToast, setPendingAllSavesToast] = useState(false);

  const isLightTheme = mode === "light";
  const leftHeadingLine = isLightTheme ? LIGHT_LEFT_LINE_IMAGE : DARK_LEFT_LINE_IMAGE;
  const rightHeadingLine = isLightTheme ? LIGHT_RIGHT_LINE_IMAGE : DARK_RIGHT_LINE_IMAGE;
  const titleColor = isLightTheme ? "#000000" : "#FFFBFF";
  const descriptionColor = isLightTheme ? "#605D64" : "#E6E0E9";
  const overlayColor = isLightTheme ? "rgba(17, 12, 20, 0.45)" : "rgba(0, 0, 0, 0.58)";
  const sheetBg = isLightTheme ? "#FFFBFE" : "#1E1A20";
  const sheetMuted = isLightTheme ? "#6E6A70" : "#CAC4D0";
  const closeButtonBg = isLightTheme ? "#F3F0F3" : "#2A2530";
  const createInputBg = isLightTheme ? "#FFFBFE" : "#2A2530";

  useEffect(() => {
    loadingChangeRef.current = onLoadingChange;
  }, [onLoadingChange]);

  useEffect(() => {
    if (!saveToast) return undefined;

    const timer = setTimeout(() => {
      setSaveToast(null);
    }, 2400);

    return () => clearTimeout(timer);
  }, [saveToast]);

  useEffect(() => {
    if (!queuedToast) return;
    if (showHotlistSheet || showCreateHotlist) return;

    const timer = setTimeout(() => {
      setSaveToast(queuedToast);
      setQueuedToast(null);
    }, 180);

    return () => clearTimeout(timer);
  }, [queuedToast, showCreateHotlist, showHotlistSheet]);

  const applyHotlistsState = useCallback(state => {
    const lists = Array.isArray(state?.lists) ? state.lists : [];
    const ungrouped = Array.isArray(state?.ungrouped) ? state.ungrouped : [];
    const nextSavedIds = {};
    ungrouped.forEach(item => {
      if (item?.id) {
        nextSavedIds[item.id] = true;
      }
    });
    lists.forEach(list => {
      list.items.forEach(item => {
        if (item?.id) {
          nextSavedIds[item.id] = true;
        }
      });
    });
    setHotlists(lists);
    setSavedIds(nextSavedIds);
    return lists;
  }, []);

  const refreshHotlistsState = useCallback(async () => {
    const state = await getHotlistsState();
    return applyHotlistsState(state);
  }, [applyHotlistsState]);

  const processPendingSave = useCallback(async () => {
    const loggedIn = await isUserLoggedIn();
    if (!loggedIn) return;

    const pendingRestaurant = await getPendingSaveRestaurant();
    if (!pendingRestaurant?.id) return;

    await clearPendingSaveRestaurant();

    const lists = await refreshHotlistsState();

    if (!lists.length) {
      const result = await toggleSavedRestaurant(pendingRestaurant);
      applyHotlistsState(result.state);
      setQueuedToast({
        type: result.saved ? "saved" : "removed",
        name: "",
      });
      return;
    }

    const targetList = lists[0];
    const nextState = await saveRestaurantToHotlist(targetList.id, pendingRestaurant);
    applyHotlistsState(nextState);
    setQueuedToast({
      type: "saved",
      name: getDisplayHotlistName(targetList),
    });
  }, [applyHotlistsState, refreshHotlistsState]);

  useEffect(() => {
    (async () => {
      await refreshHotlistsState();
      await processPendingSave();
    })();
  }, [processPendingSave, refreshHotlistsState]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await refreshHotlistsState();
        await processPendingSave();
      })();
    }, [processPendingSave, refreshHotlistsState])
  );

  const openHotlistSheet = useCallback(async restaurant => {
    const loggedIn = await isUserLoggedIn();
    if (!loggedIn) {
      await setPendingSaveRestaurant(restaurant);
      navigation.navigate("Login");
      return;
    }

    let lists = await refreshHotlistsState();
    let linkedResult = await getHotlistsForRestaurant(restaurant.id);

    if (!lists.length && !linkedResult.inAllSaves) {
      const result = await toggleSavedRestaurant(restaurant);
      applyHotlistsState(result.state);
      linkedResult = await getHotlistsForRestaurant(restaurant.id);
      lists = await refreshHotlistsState();
      if (result.saved) {
        setPendingAllSavesToast(true);
      }
    }

    setHotlists(lists);
    setSelectedRestaurant(restaurant);
    setRestaurantHotlists(linkedResult.hotlists);
    setRestaurantInAllSaves(linkedResult.inAllSaves);
    setShowHotlistSheet(true);
  }, [applyHotlistsState, navigation, refreshHotlistsState]);

  const handleHotlistToggle = useCallback(async listId => {
    if (!selectedRestaurant) return;

    const targetList = hotlists.find(list => list.id === listId) || null;

    const result = await toggleRestaurantInHotlist(listId, selectedRestaurant);
    const lists = await refreshHotlistsState();
    const linkedHotlists = lists.filter(list =>
      list.items.some(item => item?.id === selectedRestaurant.id)
    );
    setRestaurantHotlists(linkedHotlists);

    const displayName = getDisplayHotlistName(targetList);
    setQueuedToast({
      type: result.saved ? "saved" : "removed",
      name: displayName,
    });
    setShowHotlistSheet(false);
  }, [hotlists, refreshHotlistsState, selectedRestaurant]);

  const handleCreateHotlist = useCallback(async () => {
    const trimmedName = newHotlistName.trim();
    if (!trimmedName || !selectedRestaurant) return;

    const nextList = await createHotlist(trimmedName);
    await toggleRestaurantInHotlist(nextList.id, selectedRestaurant);
    const lists = await refreshHotlistsState();
    const linkedHotlists = lists.filter(list =>
      list.items.some(item => item?.id === selectedRestaurant.id)
    );
    setRestaurantHotlists(linkedHotlists);
    setShowCreateHotlist(false);
    setShowHotlistSheet(false);
    setNewHotlistName("");
    Keyboard.dismiss();
    setQueuedToast({
      type: "saved",
      name: trimmedName,
    });
  }, [newHotlistName, refreshHotlistsState, selectedRestaurant]);

  const handleDismissToAllSaves = useCallback(async () => {
    if (!selectedRestaurant) {
      setShowHotlistSheet(false);
      setShowCreateHotlist(false);
      return;
    }

    const alreadySaved = !!savedIds[selectedRestaurant.id];

    setShowHotlistSheet(false);
    setShowCreateHotlist(false);
    setNewHotlistName("");
    Keyboard.dismiss();

    if (pendingAllSavesToast) {
      setPendingAllSavesToast(false);
      setQueuedToast({
        type: "saved",
        name: "",
      });
      return;
    }

    if (alreadySaved) {
      return;
    }

    const result = await toggleSavedRestaurant(selectedRestaurant);
    applyHotlistsState(result.state);
    const linkedResult = await getHotlistsForRestaurant(selectedRestaurant.id);
    setRestaurantHotlists(linkedResult.hotlists);
    setRestaurantInAllSaves(linkedResult.inAllSaves);
    setQueuedToast({
      type: "saved",
      name: "",
    });
  }, [applyHotlistsState, savedIds, selectedRestaurant]);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    loadingChangeRef.current?.(true);

    const userLocationMeta = await resolveCurrentUserLocationMeta();
    const userCoords = userLocationMeta?.coords ?? null;
    const userCity = userLocationMeta?.city ?? "";

    const { data, error } = await supabase
      .from("restaurants")
      .select(`
        id,
        name,
        phone,
        area,
        city,
        full_address,
        cuisines,
        cost_for_two,
        distance,
        offer,
        rating,
        food_rating,
        service_rating,
        ambience_rating,
        total_ratings,
        food_images,
        ambience_images,
        reviews,
        facilities,
        highlights,
        worth_visit,
        menu,
        opening_hours,
        cover_image,
        is_active,
        latitude,
        longitude,
        created_at,
        owner_user_id,
        slug,
        booking_enabled,
        avg_duration_minutes,
        max_bookings_per_slot,
        advance_booking_days
      `)
      .eq("is_active", true)
      .limit(60);

    if (error) {
      setRestaurants([]);
      setLoading(false);
      setActiveIndex(0);
      loadingChangeRef.current?.(false);
      return;
    }

    const allRestaurants = data || [];

    const restaurantsWithComputedDistance = allRestaurants
      .map(row => {
        const restaurantLat = toNumberOrNull(row?.latitude);
        const restaurantLng = toNumberOrNull(row?.longitude);
        const fallbackDistance = toNumberOrNull(row?.distance);

        let computedDistanceKm = fallbackDistance;
        if (
          userCoords &&
          restaurantLat != null &&
          restaurantLng != null
        ) {
          computedDistanceKm = haversineKm(
            userCoords.latitude,
            userCoords.longitude,
            restaurantLat,
            restaurantLng
          );
        }

        return {
          ...row,
          computed_distance_km: computedDistanceKm,
        };
      })
      .filter(row => row.computed_distance_km != null);

    const nearbyTopRatedRestaurants = restaurantsWithComputedDistance
      .filter(row => Number(row.computed_distance_km) <= 20)
      .filter(row => Number(row?.rating ?? 0) >= 4)
      .filter(row => Number(row?.total_ratings ?? 0) >= 10)
      .map(row => ({ row, score: scoreRestaurant(row) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ row }) => mapRestaurantToFrontrow(row));

    const nearbyFallbackRestaurants = restaurantsWithComputedDistance
      .filter(row => Number(row.computed_distance_km) <= 20)
      .map(row => ({ row, score: scoreRestaurant(row) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ row }) => mapRestaurantToFrontrow(row));

    const sameCityTopRatedRestaurants = allRestaurants
      .filter(row => String(row?.city || "").trim().toLowerCase() === userCity)
      .filter(row => Number(row?.rating ?? 0) >= 4)
      .filter(row => Number(row?.total_ratings ?? 0) >= 10)
      .map(row => ({ row, score: scoreRestaurant(row) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ row }) => mapRestaurantToFrontrow(row));

    const topRatedAvailableRestaurants = allRestaurants
      .filter(row => Number(row?.rating ?? 0) >= 4)
      .filter(row => Number(row?.total_ratings ?? 0) >= 10)
      .map(row => ({ row, score: scoreRestaurant(row) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ row }) => mapRestaurantToFrontrow(row));

    const topAvailableRestaurants = allRestaurants
      .map(row => ({ row, score: scoreRestaurant(row) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ row }) => mapRestaurantToFrontrow(row));

    const nextRestaurants =
      nearbyTopRatedRestaurants.length > 0
        ? nearbyTopRatedRestaurants
        : sameCityTopRatedRestaurants.length > 0
          ? sameCityTopRatedRestaurants
          : topRatedAvailableRestaurants.length > 0
            ? topRatedAvailableRestaurants
            : nearbyFallbackRestaurants.length > 0
              ? nearbyFallbackRestaurants
              : topAvailableRestaurants;

    setRestaurants(nextRestaurants);
    setLoading(false);
    setActiveIndex(nextRestaurants.length > 0 ? nextRestaurants.length * 2 : 0);
    loadingChangeRef.current?.(false);
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const baseData = restaurants;

  const infiniteData = [
    ...baseData,
    ...baseData,
    ...baseData,
    ...baseData,
    ...baseData,
  ];

  const initialScrollIndex = baseData.length > 0 ? baseData.length * 2 : 0;

  useEffect(() => {
    if (!baseData.length) return;

    const centeredIndex = baseData.length * 2;
    const centeredOffset = (CARD_WIDTH + SPACING) * centeredIndex;

    scrollX.setValue(centeredOffset);
    setActiveIndex(centeredIndex);
  }, [baseData.length, scrollX]);

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
    if (!baseData.length) return;

    const index = Math.round(
      e.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING)
    );

    if (index <= baseData.length || index >= baseData.length * 3) {
      const targetIndex =
        (index % baseData.length) + baseData.length * 2;

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
    const isSaved = !!savedIds[item.id];

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          { transform: [{ scaleY }], opacity },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.92}
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() =>
            navigation.navigate("RestaurantDetails", {
              restaurant: item,
              restaurants: baseData,
            })
          }
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
              />
            )}
          </View>

          {/* FOOTER */}
          <View
            style={[
              styles.footer,
              { backgroundColor: colors.card, borderTopColor: colors.border },
            ]}
          >
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: titleColor }]} numberOfLines={2}>
                {item.title}
              </Text>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.card }]}
                onPress={async () => {
                  if (isSaved) {
                    const result = await toggleSavedRestaurant(item);
                    applyHotlistsState(result.state);
                    setSaveToast({
                      type: "removed",
                      name: "",
                    });
                    return;
                  }

                  openHotlistSheet(item);
                }}
              >
                {isSaved ? (
                  <SavedBookmarkIcon size={26} />
                ) : (
                  <Bookmark size={26} color={descriptionColor} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>

            <Text style={[styles.subtitle, { color: descriptionColor }]}>
              {item.subtitle}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Heading */}
      <View style={styles.headingContainer}>
        <Image source={leftHeadingLine} style={styles.headingLineLeft} resizeMode="contain" />
        <Text style={[styles.heading, { color: titleColor }]}>
          FOODIE FRONTROW
        </Text>
        <Image source={rightHeadingLine} style={styles.headingLineRight} resizeMode="contain" />
      </View>

      {/* Carousel */}
      {loading ? (
        <View style={styles.skeletonRow}>
          {[0, 1, 2].map(item => (
            <View key={item} style={styles.skeletonCardContainer}>
              <View
                style={[
                  styles.card,
                  styles.skeletonCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Shimmer
                  style={styles.skeletonMedia}
                  baseColor="#D8D2DC"
                  highlightColors={[
                    "rgba(255,255,255,0)",
                    "rgba(255,255,255,0.35)",
                    "rgba(255,255,255,0)",
                  ]}
                />
                <View
                  style={[
                    styles.footer,
                    {
                      backgroundColor: colors.card,
                      borderTopColor: colors.border,
                    },
                  ]}
                >
                  <Shimmer
                    style={styles.skeletonTitle}
                    baseColor="#D8D2DC"
                    highlightColors={[
                      "rgba(255,255,255,0)",
                      "rgba(255,255,255,0.35)",
                      "rgba(255,255,255,0)",
                    ]}
                  />
                  <Shimmer
                    style={styles.skeletonSubtitle}
                    baseColor="#D8D2DC"
                    highlightColors={[
                      "rgba(255,255,255,0)",
                      "rgba(255,255,255,0.35)",
                      "rgba(255,255,255,0)",
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : baseData.length > 0 ? (
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
          contentOffset={{ x: (CARD_WIDTH + SPACING) * initialScrollIndex, y: 0 }}
          onMomentumScrollEnd={onScrollEnd}
          onScroll={onScroll}
          scrollEventThrottle={16}
          bounces
          alwaysBounceHorizontal
        />
      ) : null}

      <Modal
        visible={showHotlistSheet}
        transparent
        animationType="fade"
        onRequestClose={handleDismissToAllSaves}
      >
        <Pressable style={[styles.modalBackdrop, { backgroundColor: overlayColor }]} onPress={handleDismissToAllSaves}>
          <Pressable
            style={[styles.hotlistSheet, { backgroundColor: sheetBg }]}
            onPress={() => {}}
          >
            <View style={styles.sheetHeroRow}>
              <View>
                <Text style={[styles.sheetTitle, { color: titleColor }]}>
                  {restaurantHotlists.length > 0 ? "Saved" : "Save to Hotlist"}
                </Text>
                <Text style={[styles.sheetSubtitle, { color: sheetMuted }]}>
                  {restaurantHotlists.length > 0
                    ? restaurantHotlists.length > 0
                      ? getDisplayHotlistName(restaurantHotlists[0])
                      : restaurantInAllSaves
                        ? "All saves"
                        : ""
                    : ""}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.sheetBookmarkChip}
                onPress={async () => {
                  if (!selectedRestaurant) return;
                    const result = await toggleSavedRestaurant(selectedRestaurant);
                    applyHotlistsState(result.state);
                    const linkedResult = await getHotlistsForRestaurant(selectedRestaurant.id);
                    setRestaurantHotlists(linkedResult.hotlists);
                    setRestaurantInAllSaves(linkedResult.inAllSaves);
                    setQueuedToast({
                      type: result.saved ? "saved" : "removed",
                      name: "",
                    });
                  }}
              >
                {restaurantHotlists.length > 0 || restaurantInAllSaves ? (
                  <SavedBookmarkIcon size={26} />
                ) : (
                  <Bookmark size={26} color={sheetMuted} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>

            <Text style={[styles.sheetSectionLabel, { color: sheetMuted }]}>Hotlists</Text>

            {hotlists.length ? (
              hotlists.map(list => {
                const linked = restaurantHotlists.some(item => item.id === list.id);
                return (
                  <TouchableOpacity
                    key={list.id}
                    style={[styles.hotlistRow, { borderColor: colors.border }]}
                    activeOpacity={0.9}
                    onPress={() => handleHotlistToggle(list.id)}
                  >
                    <View style={styles.hotlistRowLeft}>
                      <View style={[styles.hotlistIconWrap, styles.customHotlistIcon]}>
                        <Bookmark size={17} color={BOOKMARK_ACCENT} />
                      </View>
                      <View>
                        <Text style={[styles.hotlistRowTitle, { color: titleColor }]}>
                          {list.name}
                        </Text>
                        <Text style={[styles.hotlistRowMeta, { color: sheetMuted }]}>
                          {list.items.length} item{list.items.length === 1 ? "" : "s"}
                        </Text>
                      </View>
                    </View>
                    {linked ? (
                      <BookmarkCheck size={20} color={BOOKMARK_ACCENT} strokeWidth={2} />
                    ) : (
                      <ChevronRight size={20} color={sheetMuted} />
                    )}
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={[styles.emptyHotlistsText, { color: sheetMuted }]}>
                No hotlists yet. Create one to save this restaurant.
              </Text>
            )}

            <TouchableOpacity
              style={[styles.createHotlistRow, { borderColor: colors.border }]}
              activeOpacity={0.9}
              onPress={() => {
                setShowHotlistSheet(false);
                setShowCreateHotlist(true);
              }}
            >
              <View style={styles.createHotlistIcon}>
                <Plus size={20} color={sheetMuted} />
              </View>
              <Text style={[styles.createHotlistText, { color: titleColor }]}>Create new</Text>
              <ChevronRight size={20} color={sheetMuted} />
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showCreateHotlist}
        transparent
        animationType="fade"
        onRequestClose={handleDismissToAllSaves}
      >
        <Pressable style={[styles.modalBackdrop, { backgroundColor: overlayColor }]} onPress={handleDismissToAllSaves}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={12}
            style={styles.createKeyboardWrap}
          >
            <Pressable
              style={[styles.createSheet, { backgroundColor: sheetBg }]}
              onPress={() => {}}
            >
              <View style={styles.createSheetHeader}>
                <Text style={[styles.createSheetTitle, { color: titleColor }]}>Create new</Text>
                <TouchableOpacity
                  style={[styles.closeBtn, { backgroundColor: closeButtonBg }]}
                  onPress={handleDismissToAllSaves}
                >
                  <X size={22} color={titleColor} />
                </TouchableOpacity>
              </View>
              <TextInput
                value={newHotlistName}
                onChangeText={setNewHotlistName}
                placeholder="Write Hotlist name here"
                placeholderTextColor={sheetMuted}
                style={[
                  styles.createInput,
                  {
                    color: titleColor,
                    borderColor: colors.border,
                    backgroundColor: createInputBg,
                  },
                ]}
              />
              <TouchableOpacity
                style={[
                  styles.createBtn,
                  {
                    backgroundColor: newHotlistName.trim()
                      ? (isLightTheme ? "#1C1B1F" : "#E6E0E9")
                      : "#D9D5DC",
                  },
                ]}
                disabled={!newHotlistName.trim()}
                onPress={handleCreateHotlist}
              >
                <Text
                  style={[
                    styles.createBtnText,
                    { color: newHotlistName.trim() ? (isLightTheme ? "#FFFBFF" : "#1C1B1F") : "#938F96" },
                  ]}
                >
                  Create
                </Text>
              </TouchableOpacity>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      <Modal visible={!!saveToast} transparent animationType="fade" onRequestClose={() => setSaveToast(null)}>
        <View style={styles.toastModal} pointerEvents="box-none">
          {saveToast ? (
            <View
              style={[
                styles.toastCard,
                {
                  backgroundColor: sheetBg,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.toastLeft}>
                <View style={styles.toastIcon}>
                  <Bookmark size={18} color={BOOKMARK_ACCENT} fill={BOOKMARK_ACCENT} />
                </View>
                <Text style={[styles.toastText, { color: titleColor }]}>
                  {saveToast.type === "saved"
                    ? saveToast.name
                      ? `Saved to ${saveToast.name}`
                      : "Saved"
                    : saveToast.name
                      ? `Removed from ${saveToast.name}`
                      : "Removed"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("SavedRestaurants")}>
                <Text style={[styles.toastLink, { color: titleColor }]}>View Hotlist</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

/* ---------------------------------------- */
/*                 STYLES                   */
/* ---------------------------------------- */

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    padding: 10,
    marginTop: 10,
  },

  headingLineLeft: {
    flex: 1,
    height: 10,
    marginRight: 12,
  },
  headingLineRight: {
    flex: 1,
    height: 10,
    marginLeft: 12,
  },

  heading: {
    fontSize: 14,
    ...(Platform.OS === "android"
      ? { fontFamily: "sans-serif-medium", fontWeight: "500" }
      : { fontFamily: "Inter", fontWeight: "600" }),
    letterSpacing: 1.5,
  },

  cardContainer: {
    width: CARD_WIDTH,
    marginRight: SPACING,
    height: 500,
    justifyContent: "center",
  },
  skeletonRow: {
    flexDirection: "row",
    paddingLeft: SIDE_SPACING,
    paddingRight: 8,
  },
  skeletonCardContainer: {
    width: CARD_WIDTH,
    height: 500,
    marginRight: SPACING,
    justifyContent: "center",
  },

  card: {
    flex: 1,
    borderRadius: 18,
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
  skeletonCard: {
    borderRadius: 18,
  },
  skeletonMedia: {
    flex: 1,
  },
  skeletonTitle: {
    height: 18,
    borderRadius: 6,
    width: "72%",
    marginBottom: 6,
  },
  skeletonSubtitle: {
    height: 14,
    borderRadius: 6,
    width: "88%",
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
    paddingTop: 6,
    paddingBottom: 8,
    borderTopWidth: 1,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },

  title: {
    fontSize: 16,
    lineHeight: 19,
    ...(Platform.OS === "android"
      ? { fontFamily: "sans-serif-medium", fontWeight: "600" }
      : { fontFamily: "Inter", fontWeight: "600" }),
    flex: 1,
    marginRight: 10,
  },

  subtitle: {
    fontSize: 12,
    lineHeight: 14,
    marginTop: -5,
    marginBottom: 0,
    ...(Platform.OS === "android"
      ? { fontFamily: "sans-serif", fontWeight: "400" }
      : { fontFamily: "Inter", fontWeight: "400" }),
  },

  saveButton: {
    padding: 6,
    borderRadius: 8,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  hotlistSheet: {
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 18,
  },
  sheetHeroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  sheetBookmarkChip: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#F1EFEF",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  sheetSubtitle: {
    marginTop: 1,
    fontSize: 12,
    fontWeight: "400",
  },
  sheetSectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 10,
  },
  hotlistRow: {
    minHeight: 70,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hotlistRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  hotlistIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F5F2F4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  customHotlistIcon: {},
  hotlistRowTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  hotlistRowMeta: {
    marginTop: 2,
    fontSize: 12,
  },
  emptyHotlistsText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  createHotlistRow: {
    marginTop: 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 74,
  },
  createHotlistIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F5F2F4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  createHotlistText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  createSheet: {
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    marginHorizontal: 0,
    marginBottom: 0,
  },
  createKeyboardWrap: {
    width: "100%",
    justifyContent: "flex-end",
  },
  createSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDD7DE",
  },
  createSheetTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F0F3",
  },
  createInput: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 16,
  },
  createBtn: {
    marginTop: 16,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
  },
  createBtnText: {
    fontSize: 18,
    fontWeight: "600",
  },
  toastModal: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  toastWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  toastCard: {
    minHeight: 74,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toastLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  toastIcon: {
    marginRight: 12,
  },
  toastText: {
    fontSize: 14,
    fontWeight: "600",
  },
  toastLink: {
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
    textDecorationColor: "#A6A1A9",
  },
});
