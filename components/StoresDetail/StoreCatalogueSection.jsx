import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Dimensions,
  Modal,
  SafeAreaView,
} from "react-native";
import { X, ChevronLeft, ChevronRight } from "lucide-react-native";

/**
 * StoreCatalogueSection (JSX)
 * Props:
 * - store: { catalogue: { categories: [{ id, title, startingFrom, items:[{id,title,price,image}]}] } }
 * - ui: { bg, card, text, muted, border, active }
 */
export default function StoreCatalogueSection({ store, ui }) {
  const accent = (ui && ui.active) || "#DA3224";
  const bg = (ui && ui.bg) || "#0D0D0D";
  const cardBg = (ui && ui.card) || "#1A1A1A";
  const text = (ui && ui.text) || "#F5F5F5";
  const muted = (ui && ui.muted) || "#B3B3B3";
  const border = (ui && ui.border) || "rgba(255,255,255,0.10)";

  const categories = useMemo(() => {
    const cats = store && store.catalogue && store.catalogue.categories;
    return Array.isArray(cats) ? cats : [];
  }, [store]);

  const { width } = Dimensions.get("window");
  const CARD_W = Math.min(340, Math.round(width * 0.82));
  const GAP = 14;

  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const pagerRef = useRef(null);
  const thumbsRef = useRef(null);

  const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const openCategory = (category, startIndex = 0) => {
    setActiveCategory(category);
    setActiveIndex(startIndex);
    setOpen(true);

    setTimeout(() => {
      try {
        if (pagerRef.current) {
          pagerRef.current.scrollToIndex({ index: startIndex, animated: false });
        }
        if (thumbsRef.current) {
          thumbsRef.current.scrollToIndex({
            index: startIndex,
            animated: false,
            viewPosition: 0.5,
          });
        }
      } catch (e) {}
    }, 50);
  };

  const closeViewer = () => {
    setOpen(false);
    setTimeout(() => {
      setActiveCategory(null);
      setActiveIndex(0);
    }, 150);
  };

  const items = (activeCategory && activeCategory.items) || [];
  const total = items.length;

  const goToIndex = (idx) => {
    const next = Math.max(0, Math.min(idx, total - 1));
    setActiveIndex(next);

    try {
      if (pagerRef.current) {
        pagerRef.current.scrollToIndex({ index: next, animated: true });
      }
      if (thumbsRef.current) {
        thumbsRef.current.scrollToIndex({
          index: next,
          animated: true,
          viewPosition: 0.5,
        });
      }
    } catch (e) {}
  };

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={[styles.sectionTitle, { color: text }]}>Catalogue</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 14 }}
        contentContainerStyle={{ paddingRight: 16 }}
        snapToInterval={CARD_W + GAP}
        decelerationRate="fast"
        snapToAlignment="start"
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openCategory(item, 0)}
            style={[
              styles.catCard,
              { width: CARD_W, backgroundColor: bg, borderColor: border },
            ]}
          >
            <Mosaic
              bg={bg}
              border={border}
              items={item.items || []}
              onPress={(index) => openCategory(item, index)}
            />

            <View style={{ marginTop: 10 }}>
              <Text style={[styles.catTitle, { color: text }]}>{item.title}</Text>
              <Text style={[styles.catSub, { color: muted }]}>
                Starting from {formatINR(item.startingFrom)}
              </Text>
            </View>
          </Pressable>
        )}
      />

      {/* FULL SCREEN VIEWER */}
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={closeViewer}
      >
        <SafeAreaView style={[styles.modalWrap, { backgroundColor: bg }]}>
          {/* top bar */}
          <View style={styles.modalTop}>
            <Pressable onPress={closeViewer} style={styles.closeBtn}>
              <X size={22} color={text} />
            </Pressable>

            <Text numberOfLines={1} style={[styles.modalTitle, { color: text }]}>
              Catalogue
            </Text>

            <View style={{ width: 44 }} />
          </View>

          {/* big pager */}
          <View style={{ flex: 1 }}>
            <FlatList
              ref={pagerRef}
              data={items}
              keyExtractor={(it) => String(it.id)}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={0}
              getItemLayout={(_, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                setActiveIndex(idx);

                setTimeout(() => {
                  try {
                    if (thumbsRef.current) {
                      thumbsRef.current.scrollToIndex({
                        index: idx,
                        animated: true,
                        viewPosition: 0.5,
                      });
                    }
                  } catch (err) {}
                }, 0);
              }}
              renderItem={({ item }) => (
                <View style={{ width, alignItems: "center", justifyContent: "center" }}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.heroImg}
                    resizeMode="contain"
                  />
                </View>
              )}
            />

            {/* product title + price */}
            <View style={styles.metaWrap}>
              <Text style={[styles.productTitle, { color: text }]}>
                {(items[activeIndex] && items[activeIndex].title) || ""}
              </Text>
              <Text style={[styles.productPrice, { color: muted }]}>
                {formatINR(items[activeIndex] && items[activeIndex].price)}
              </Text>

              {/* index indicator */}
              <View style={styles.indexRow}>
                <Pressable
                  onPress={() => goToIndex(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  style={[
                    styles.navArrow,
                    { opacity: activeIndex === 0 ? 0.3 : 1 },
                  ]}
                >
                  <ChevronLeft size={20} color={text} />
                </Pressable>

                <Text style={[styles.indexText, { color: muted }]}>
                  {total ? `${activeIndex + 1}/${total}` : "0/0"}
                </Text>

                <Pressable
                  onPress={() => goToIndex(activeIndex + 1)}
                  disabled={activeIndex === total - 1}
                  style={[
                    styles.navArrow,
                    { opacity: activeIndex === total - 1 ? 0.3 : 1 },
                  ]}
                >
                  <ChevronRight size={20} color={text} />
                </Pressable>
              </View>
            </View>

            {/* thumbnails */}
            <View style={styles.thumbBar}>
              <FlatList
                ref={thumbsRef}
                data={items}
                keyExtractor={(it) => String(it.id)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 12 }}
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                renderItem={({ item, index }) => {
                  const isActive = index === activeIndex;
                  return (
                    <Pressable
                      onPress={() => goToIndex(index)}
                      style={[
                        styles.thumbCard,
                        {
                          borderColor: isActive ? accent : "transparent",
                          backgroundColor: cardBg,
                        },
                      ]}
                    >
                      <Image source={{ uri: item.image }} style={styles.thumbImg} />
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

/* Mosaic collage (+N overlay) */
function Mosaic({ items, onPress, bg, border }) {
  const previews = (items || []).slice(0, 6);
  const extraCount = Math.max(0, (items && items.length ? items.length : 0) - 6);

  const getUri = (i) => previews && previews[i] && previews[i].image;

  return (
    <View style={[styles.mosaicWrap, { backgroundColor: bg, borderColor: border }]}>
      <View style={styles.mosaicTop}>
        <Pressable style={styles.bigLeft} onPress={() => onPress && onPress(0)}>
          {!!getUri(0) && (
            <Image source={{ uri: getUri(0) }} style={styles.mosaicImg} />
          )}
        </Pressable>

        <View style={styles.rightCol}>
          <Pressable style={styles.smallRight} onPress={() => onPress && onPress(1)}>
            {!!getUri(1) && (
              <Image source={{ uri: getUri(1) }} style={styles.mosaicImg} />
            )}
          </Pressable>

          <Pressable style={styles.smallRight} onPress={() => onPress && onPress(2)}>
            {!!getUri(2) && (
              <Image source={{ uri: getUri(2) }} style={styles.mosaicImg} />
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.mosaicBottom}>
        <Pressable style={styles.bottomSmall} onPress={() => onPress && onPress(3)}>
          {!!getUri(3) && (
            <Image source={{ uri: getUri(3) }} style={styles.mosaicImg} />
          )}
        </Pressable>

        <Pressable style={styles.bottomSmall} onPress={() => onPress && onPress(4)}>
          {!!getUri(4) && (
            <Image source={{ uri: getUri(4) }} style={styles.mosaicImg} />
          )}
        </Pressable>

        <Pressable style={styles.bottomSmall} onPress={() => onPress && onPress(5)}>
          {!!getUri(5) && (
            <Image source={{ uri: getUri(5) }} style={styles.mosaicImg} />
          )}

          {extraCount > 0 ? (
            <View style={styles.plusOverlay}>
              <Text style={styles.plusText}>{`+${extraCount}`}</Text>
            </View>
          ) : null}
        </Pressable>
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

  catCard: {
  },

  catTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
  catSub: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
  },

  mosaicWrap: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  mosaicTop: {
    flexDirection: "row",
    height: 240,
  },
  bigLeft: {
    flex: 1.4,
    borderRightWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  rightCol: {
    flex: 1,
  },
  smallRight: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  mosaicBottom: {
    flexDirection: "row",
    height: 72,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  bottomSmall: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  mosaicImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  plusOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  modalWrap: {
    flex: 1,
  },
  modalTop: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  heroImg: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },

  metaWrap: {
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },
  productPrice: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "800",
  },

  indexRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  navArrow: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  indexText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "900",
  },

  thumbBar: {
    paddingVertical: 10,
  },
  thumbCard: {
    width: 70,
    height: 70,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
