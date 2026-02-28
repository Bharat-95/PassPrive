import React, { useState, useContext, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { ThemeContext } from "../../App";
import { BlurView } from "@react-native-community/blur";
import { Check, ChevronRight } from "lucide-react-native";

export default function FilterModal({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) {
  const { colors } = useContext(ThemeContext);

  // Left side menu
  const MENU = ["Sort by", "Dishes & cuisines", "Rating", "Cost for two", "More Filters"];

  const [activeMenu, setActiveMenu] = useState("Sort by");

  // Sort options
  const SORT_OPTIONS = [
    "Popularity",
    "Rating: High to Low",
    "Cost: Low to High",
    "Cost: High to Low",
    "Delivery Time",
  ];

  // Rating options
  const RATING_OPTIONS = ["4.5+", "4.0+", "3.5+", "3.0+"];

  // Cost options
  const COST_OPTIONS = ["₹300–₹600", "₹600–₹900", "₹900–₹1500", "₹1500–₹3000"];

  // More filters
  const MORE_FILTERS = [
    "Pure Veg",
    "Serves Alcohol",
    "Outdoor Seating",
    "Pet Friendly",
    "Cafe",
    "Fine Dining",
    "Open Late",
    "Buffet Available",
    "Live Music",
    "Rooftop",
  ];

  // Cuisine list
  const CUISINES = [
    "North Indian",
    "South Indian",
    "Chinese",
    "Italian",
    "Thai",
    "Mexican",
    "Andhra",
    "Biryani",
    "Healthy Food",
    "Desserts",
    "Beverages",
    "Continental",
    "Mughlai",
  ];

  const [selectedSort, setSelectedSort] = useState(currentFilters.sort || null);
  const [selectedRating, setSelectedRating] = useState(currentFilters.rating || null);
  const [selectedCost, setSelectedCost] = useState(currentFilters.cost || null);
  const [selectedCuisines, setSelectedCuisines] = useState(currentFilters.cuisines || []);
  const [selectedMore, setSelectedMore] = useState(currentFilters.more || []);

  const [cuisineSearch, setCuisineSearch] = useState("");

  const filteredCuisines = useMemo(() => {
    return CUISINES.filter((c) =>
      c.toLowerCase().includes(cuisineSearch.toLowerCase())
    );
  }, [cuisineSearch]);

  // Toggle cuisine
  const toggleCuisine = (c) => {
    if (selectedCuisines.includes(c)) {
      setSelectedCuisines(selectedCuisines.filter((x) => x !== c));
    } else {
      setSelectedCuisines([...selectedCuisines, c]);
    }
  };

  // Toggle More Filters
  const toggleMore = (m) => {
    if (selectedMore.includes(m)) {
      setSelectedMore(selectedMore.filter((x) => x !== m));
    } else {
      setSelectedMore([...selectedMore, m]);
    }
  };

  // CLEAR ALL
  const clearAll = () => {
    setSelectedSort(null);
    setSelectedRating(null);
    setSelectedCost(null);
    setSelectedCuisines([]);
    setSelectedMore([]);
  };

  // APPLY — but DO NOT close modal (your choice "B")
  const applyFilters = () => {
    onApplyFilters({
      sort: selectedSort,
      rating: selectedRating,
      cost: selectedCost,
      cuisines: selectedCuisines,
      more: selectedMore,
    });
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      {/* Blur Overlay */}
      <BlurView
        style={styles.blurOverlay}
        blurType="dark"
        blurAmount={12}
        reducedTransparencyFallbackColor="rgba(0,0,0,0.5)"
      />

      <View style={styles.modalWrapper}>
        <View style={[styles.modalBox, { backgroundColor: colors.card }]}>

          {/* Top Bar */}
          <View style={styles.topBar}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>

            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeText, { color: colors.text }]}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            {/* LEFT MENU */}
            <View style={[styles.leftMenu, { borderRightColor: colors.border }]}>
              {MENU.map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setActiveMenu(m)}
                  style={[
                    styles.menuItem,
                    activeMenu === m && styles.activeMenuItem,
                  ]}
                >
                  <Text
                    style={[
                      styles.menuText,
                      { color: activeMenu === m ? "#4B23FF" : colors.text },
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* RIGHT CONTENT */}
            <View style={styles.rightContent}>
              {activeMenu === "Sort by" && (
                <ScrollView>
                  {SORT_OPTIONS.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={styles.optionRow}
                      onPress={() => setSelectedSort(s)}
                    >
                      <Text
                        style={[styles.optionText, { color: colors.text }]}
                      >
                        {s}
                      </Text>

                      {selectedSort === s && <Check size={18} color="#4B23FF" />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {activeMenu === "Dishes & cuisines" && (
                <View>
                  <TextInput
                    placeholder="Search cuisines"
                    placeholderTextColor={colors.subtitle}
                    style={[styles.searchInput, { color: colors.text, borderColor: colors.border }]}
                    value={cuisineSearch}
                    onChangeText={setCuisineSearch}
                  />

                  <ScrollView style={{ maxHeight: 350 }}>
                    {filteredCuisines.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={styles.optionRow}
                        onPress={() => toggleCuisine(c)}
                      >
                        <Text style={[styles.optionText, { color: colors.text }]}>
                          {c}
                        </Text>

                        {selectedCuisines.includes(c) && (
                          <Check size={18} color="#4B23FF" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {activeMenu === "Rating" && (
                <ScrollView>
                  {RATING_OPTIONS.map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={styles.optionRow}
                      onPress={() => setSelectedRating(r)}
                    >
                      <Text style={[styles.optionText, { color: colors.text }]}>
                        {r}
                      </Text>
                      {selectedRating === r && <Check size={18} color="#4B23FF" />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {activeMenu === "Cost for two" && (
                <ScrollView>
                  {COST_OPTIONS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={styles.optionRow}
                      onPress={() => setSelectedCost(c)}
                    >
                      <Text style={[styles.optionText, { color: colors.text }]}>
                        {c}
                      </Text>
                      {selectedCost === c && <Check size={18} color="#4B23FF" />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {activeMenu === "More Filters" && (
                <ScrollView>
                  {MORE_FILTERS.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={styles.optionRow}
                      onPress={() => toggleMore(m)}
                    >
                      <Text style={[styles.optionText, { color: colors.text }]}>
                        {m}
                      </Text>

                      {selectedMore.includes(m) && (
                        <Check size={18} color="#4B23FF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>

          {/* Bottom Buttons */}
          <View style={[styles.bottomBar, { borderTopColor: colors.border }]}>
            <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={applyFilters} style={styles.applyBtn}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBox: {
    height: "88%",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
  },

  topBar: {
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  closeText: {
    fontSize: 14,
    opacity: 0.8,
  },

  row: {
    flex: 1,
    flexDirection: "row",
  },

  leftMenu: {
    width: 140,
    borderRightWidth: 1,
    paddingVertical: 10,
  },

  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  activeMenuItem: {
    backgroundColor: "rgba(75,35,255,0.07)",
  },

  menuText: {
    fontSize: 14,
    fontWeight: "600",
  },

  rightContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  optionRow: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderColor: "rgba(255,255,255,0.08)",
  },

  optionText: {
    fontSize: 14,
    fontWeight: "600",
  },

  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 14,
  },

  bottomBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },

  clearBtn: {},

  clearText: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.7,
  },

  applyBtn: {
    backgroundColor: "#4B23FF",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
  },

  applyText: {
    color: "#fff",
    fontWeight: "700",
  },
});
