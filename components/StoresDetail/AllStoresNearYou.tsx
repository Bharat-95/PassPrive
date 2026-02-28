// components/StoresDetail/AllStoresNearYou.tsx
import React, { useMemo, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { MapPin } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";

// ✅ Use your existing ThemeContext (you already use it elsewhere)
// Update the import path to your actual ThemeContext file
import { ThemeContext } from "../../App";

const { width } = Dimensions.get("window");

export type Store = {
  id: number;
  name: string;
  distance?: number;
  images?: string[];
  locality?: string;
  city?: string;
  badgeText?: string;
};

type Props = {
  stores: Store[];
  onPressStore: (store: Store) => void;
  title?: string;
};

const CARD_W = Math.min(320, width * 0.5);
const IMG_H = 200;

export default function AllStoresNearYou({
  stores,
  onPressStore,
  title = "All Stores near you",
}: Props) {
  const { colors, mode } = useContext(ThemeContext);

  const styles = useMemo(() => createStyles(colors, mode), [colors, mode]);

  if (!stores?.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>{title}</Text>

      <FlatList
        data={stores}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={({ item }) => {
          const image = item.images?.[0];
          const distanceText =
            typeof item.distance === "number"
              ? `${item.distance.toFixed(1)} km`
              : null;

          const locality = item.locality || "Banjara Hills";
          const city = item.city || "Hyderabad";

          return (
            <Pressable
              onPress={() => onPressStore(item)}
              style={({ pressed }) => [
                styles.card,
                pressed && { opacity: 0.93 },
              ]}
            >
              <View style={styles.imageWrap}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={[styles.image, styles.imageFallback]} />
                )}

                {/* Keep ribbon same, or theme it if you want */}
                <LinearGradient
                  colors={["#4B23FF", "#8C78FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.badgeBar}
                >
                  <MapPin size={16} color="#fff" />
                  <Text style={styles.badgeText}>
                    {item.badgeText || "Bank benefits"}
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>

                <Text style={styles.meta} numberOfLines={2}>
                  {distanceText ? `${distanceText} • ` : ""}
                  {locality}, {city}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

/**
 * ✅ Theme-aware styles
 * Expecting colors like:
 * colors.background, colors.card, colors.text, colors.mutedText, colors.border
 *
 * If your ThemeContext doesn't have these keys, map them below.
 */
function createStyles(
  colors: any,
  mode: "light" | "dark" | string
) {
  // Fallback mapping (so it still works even if some keys are missing)
  const isDark = mode === "dark";

  const theme = {
    background: colors?.background ?? (isDark ? "#0D0D0D" : "#FFFFFF"),
    card: colors?.card ?? (isDark ? "#1A1A1A" : "#FFFFFF"),
    text: colors?.text ?? (isDark ? "#F5F5F5" : "#111111"),
    mutedText: colors?.mutedText ?? (isDark ? "#B3B3B3" : "#2F2F2F"),
    border: colors?.border ?? (isDark ? "#2A2A2A" : "#E8E8EE"),
    shadow: isDark ? "transparent" : "#000",
  };

  return StyleSheet.create({
    wrap: {
      marginTop: 14,
      paddingHorizontal: 16,
      backgroundColor: "transparent", // let parent decide background
    },

    heading: {
      fontSize: 26,
      fontWeight: "900",
      color: theme.text,
      marginBottom: 16,
      letterSpacing: -0.2,
    },

    listContent: {
      paddingRight: 16,
    },

    card: {
      width: CARD_W,
      borderRadius: 22,
      backgroundColor: theme.card,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.border,

      // ✅ Shadows tuned by theme
      shadowColor: theme.shadow,
      shadowOpacity: isDark ? 0 : 0.06,
      shadowRadius: isDark ? 0 : 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: isDark ? 0 : 4,
    },

    imageWrap: {
      position: "relative",
      width: "100%",
    },

    image: {
      width: "100%",
      height: IMG_H,
      resizeMode: "cover",
    },

    imageFallback: {
      backgroundColor: isDark ? "#2B2B2B" : "#EEE",
    },

    badgeBar: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 40,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
    },

    badgeText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "800",
      marginLeft: 8,
    },

    body: {
      paddingHorizontal: 18,
      paddingTop: 10,
      paddingBottom: 16,
    },

    name: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
      letterSpacing: -0.2,
    },

    meta: {
      fontSize: 14,
      color: theme.mutedText,
      lineHeight: 22,
      fontWeight: "600",
    },
  });
}
   