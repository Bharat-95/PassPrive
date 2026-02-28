import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { Sparkles } from "lucide-react-native";

/**
 * StoreAboutSection
 *
 * Reads from:
 * store.about (string)
 * store.topItems (string[])
 *
 * Props:
 * - store
 * - ui: { bg, card, text, muted, border, active }
 */
export default function StoreAboutSection({ store, ui }) {
  const accent = ui?.active || "#DA3224";
  const bg = ui?.bg || "#0D0D0D";
  const cardBg = ui?.card || "#1A1A1A";
  const text = ui?.text || "#F5F5F5";
  const muted = ui?.muted || "#B3B3B3";
  const border = ui?.border || "rgba(255,255,255,0.10)";

  const [expanded, setExpanded] = useState(false);

  const about = useMemo(() => {
    return typeof store?.about === "string" ? store.about.trim() : "";
  }, [store]);

  const topItems = useMemo(() => {
    const arr = store?.topItems;
    return Array.isArray(arr) ? arr : [];
  }, [store]);

  const showReadToggle = about.length > 160;

  return (
    <View style={{marginTop: 18 }}>
      {/* About the brand */}
      <Text style={[styles.sectionTitle, { color: text }]}>About the brand</Text>

      <View style={[styles.aboutCard, { backgroundColor: bg }]}>
        <Text
          style={[styles.aboutText, { color: muted }]}
          numberOfLines={expanded ? 999 : 5}
        >
          {about || "No description added yet."}
        </Text>

        {showReadToggle ? (
          <Pressable onPress={() => setExpanded((p) => !p)} style={{ marginTop: 10 }}>
            <Text style={[styles.readMore, { color: text }]}>
              {expanded ? "Read less" : "Read more"}
            </Text>
            <View style={[styles.dottedUnderline, { borderColor: muted }]} />
          </Pressable>
        ) : null}
      </View>

      {/* Top Items */}
      <Text style={[styles.sectionTitle, { color: text, marginTop: 18 }]}>
        Top Items in store
      </Text>

      <View
        style={[
          styles.topItemsCard,
          { backgroundColor: bg, borderColor: border },
        ]}
      >
        <FlatList
          data={topItems}
          keyExtractor={(it, idx) => `${it}-${idx}`}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 14 }}
          contentContainerStyle={{ paddingTop: 6 }}
          renderItem={({ item }) => (
            <View style={styles.topItemRow}>
              <Sparkles size={16} color={accent} />
              <Text style={[styles.topItemText, { color: text }]} numberOfLines={1}>
                {item}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 6,
  },

  aboutCard: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 6,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  readMore: {
    fontSize: 14,
    fontWeight: "900",
  },
  dottedUnderline: {
    marginTop: 3,
    borderBottomWidth: 1,
    borderStyle: "dotted",
    width: 84,
  },

  topItemsCard: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  topItemRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  topItemText: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
});
