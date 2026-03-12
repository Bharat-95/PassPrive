import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ArrowLeft, Plus } from "lucide-react-native";

import { ThemeContext } from "../App";
import { createHotlist, getHotlists, getSavedRestaurants } from "../services/savedRestaurants";

const ALL_SAVED_ART = require("../assets/DineIn/premium.png");
const HOTLIST_ART = require("../assets/DineIn/drinkndine.png");
const SECONDARY_HOTLIST_ART = require("../assets/DineIn/Bar.png");

function getPreviewImage(list, fallback) {
  const item = list?.items?.[0];
  return (
    item?.coverImage ||
    item?.cover_image ||
    item?.media ||
    item?.images?.ambience?.[0] ||
    item?.images?.food?.[0] ||
    fallback
  );
}

function TileCard({ title, image, count, left = 0 }) {
  const isLocalAsset = typeof image === "number";
  const { mode } = useContext(ThemeContext);
  const borderColor = mode === "light" ? "#D0CDD2" : "#4A4450";

  return (
    <View style={[styles.tileCard, { marginLeft: left }]}>
      <View style={[styles.tileImageFrame, { borderColor }]}>
        <Image
          source={isLocalAsset ? image : { uri: image }}
          style={styles.tileImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.tileTitle}>{title}</Text>
      {typeof count === "number" ? (
        <Text style={styles.tileCount}>
          {count} item{count === 1 ? "" : "s"}
        </Text>
      ) : null}
    </View>
  );
}

export default function SavedRestaurants() {
  const navigation = useNavigation();
  const { mode, colors } = useContext(ThemeContext);
  const [hotlists, setHotlists] = useState([]);
  const [allSaved, setAllSaved] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHotlistName, setNewHotlistName] = useState("");

  const isLightTheme = mode === "light";

  const loadHotlists = useCallback(async () => {
    const [lists, saved] = await Promise.all([getHotlists(), getSavedRestaurants()]);
    setHotlists(lists);
    setAllSaved(saved);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHotlists();
    }, [loadHotlists])
  );

  const pageBg = isLightTheme ? "#F5F2F4" : colors.background;
  const titleColor = isLightTheme ? "#101114" : "#FFFBFF";
  const subtitleColor = isLightTheme ? "#605D64" : "#CAC4D0";
  const pillBg = isLightTheme ? "#FFF7F3" : "#2B2522";
  const modalBg = isLightTheme ? "#FFFBFE" : "#1E1A20";
  const inputBg = isLightTheme ? "#FFFFFF" : "#2A2530";
  const closeBg = isLightTheme ? "#F3F0F3" : "#2A2530";
  const sectionBg = isLightTheme ? "#F5F2F4" : colors.background;

  const allSavesTile = useMemo(() => {
    if (!allSaved.length) return null;

    return {
      title: "All saves",
      count: allSaved.length,
      image: getPreviewImage({ items: allSaved }, ALL_SAVED_ART),
    };
  }, [allSaved]);

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: pillBg }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <ArrowLeft size={26} color={titleColor} strokeWidth={2.2} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: titleColor }]}>Hotlists</Text>

          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: pillBg }]}
            onPress={() => setShowCreateModal(true)}
            activeOpacity={0.85}
          >
            <Plus size={22} color={titleColor} strokeWidth={2.3} />
            <Text style={[styles.createButtonText, { color: titleColor }]}>Create new</Text>
          </TouchableOpacity>
        </View>

        {allSavesTile ? (
          <View style={[styles.section, { backgroundColor: sectionBg }]}>
            <Text style={[styles.sectionTitle, { color: titleColor }]}>All saves</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tileRow}
            >
              <TileCard
                title={allSavesTile.title}
                image={allSavesTile.image}
                count={allSavesTile.count}
              />
            </ScrollView>
          </View>
        ) : null}

        <View style={[styles.section, { backgroundColor: sectionBg }]}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>Hotlists</Text>

          {hotlists.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tileRow}
            >
              {hotlists.map((list, index) => (
                <TileCard
                  key={list.id}
                  title={list.name}
                  image={getPreviewImage(
                    list,
                    index % 2 === 0 ? HOTLIST_ART : SECONDARY_HOTLIST_ART
                  )}
                  count={list.items.length}
                  left={index === 0 ? 0 : 18}
                />
              ))}
            </ScrollView>
          ) : (
            <Text style={[styles.emptyText, { color: subtitleColor }]}>
              No hotlists created yet.
            </Text>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowCreateModal(false)}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: modalBg }]}
            onPress={() => {}}
          >
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: titleColor }]}>Create new</Text>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: closeBg }]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={[styles.closeText, { color: titleColor }]}>×</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              value={newHotlistName}
              onChangeText={setNewHotlistName}
              placeholder="Write Hotlist name here"
              placeholderTextColor={subtitleColor}
              style={[
                styles.modalInput,
                {
                  color: titleColor,
                  backgroundColor: inputBg,
                  borderColor: colors.border,
                },
              ]}
            />

            <TouchableOpacity
              disabled={!newHotlistName.trim()}
              style={[
                styles.modalAction,
                { backgroundColor: newHotlistName.trim() ? "#1C1B1F" : "#D9D5DC" },
              ]}
              onPress={async () => {
                await createHotlist(newHotlistName);
                setNewHotlistName("");
                setShowCreateModal(false);
                loadHotlists();
              }}
            >
              <Text
                style={[
                  styles.modalActionText,
                  { color: newHotlistName.trim() ? "#FFFBFF" : "#938F96" },
                ]}
              >
                Create
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const TILE_WIDTH = 158;
const TILE_IMAGE_SIZE = 126;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
  },
  createButton: {
    minWidth: 150,
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    marginLeft: 8,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 36,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    marginBottom: 14,
  },
  tileRow: {
    paddingRight: 20,
  },
  tileCard: {
    width: TILE_WIDTH,
  },
  tileImageFrame: {
    width: TILE_IMAGE_SIZE,
    height: TILE_IMAGE_SIZE,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 1,
  },
  tileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 22.5,
    backgroundColor: "#D7C0AF",
  },
  tileTitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: "#101114",
  },
  tileCount: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 16,
    color: "#605D64",
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalCard: {
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 28,
    lineHeight: 28,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 16,
  },
  modalAction: {
    marginTop: 16,
    borderRadius: 24,
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  modalActionText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
