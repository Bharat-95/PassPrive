import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ShoppingBag, Ticket, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function StoreOffersSection({ store, ui, onPressPayBill }) {
  const insets = useSafeAreaInsets();

  const accent = ui?.active || "#4B23FF";
  const cardBg = ui?.card || "#FFFFFF";
  const border = ui?.border || "rgba(0,0,0,0.08)";
  const bg = ui?.bg || "#FFFFFF";

  const PAY_BRAND = store?.payBrand || "District";

  const [selected, setSelected] = useState(null); // { kind, offer }
  const closeModal = () => setSelected(null);

  const openOffer = (offer, kind) => {
    if (!offer) return;
    setSelected({ offer, kind });
  };

  const modalTitle =
    selected?.kind === "ADDON"
      ? "Add On Offer"
      : selected?.kind === "INSTANT"
      ? "Instant Offer"
      : "In-store Offer";

  /* ✅ Store Offers (top single card) */
  const inStoreOffer = useMemo(() => {
    if (store?.inStoreOffer) return store.inStoreOffer;
    if (Array.isArray(store?.inStoreOffers) && store.inStoreOffers.length)
      return store.inStoreOffers[0];

    return null;
  }, [store]);

  /* ✅ District Pay Offers */
  const districtPay = useMemo(() => {
    if (store?.districtPay) {
      return {
        instantOffer: store.districtPay?.instantOffer || null,
        addOnOffers: Array.isArray(store.districtPay?.addOnOffers)
          ? store.districtPay.addOnOffers
          : [],
      };
    }

    // old fallback
    if (Array.isArray(store?.offers) && store.offers.length) {
      return {
        instantOffer: store.offers[0],
        addOnOffers: store.offers.length > 1 ? store.offers.slice(1) : [],
      };
    }

    if (store?.offer) {
      return {
        instantOffer: {
          id: "fallback-instant",
          label: "Instant Offer",
          title: store.offer,
          subtitle: `Unlock when you pay via ${PAY_BRAND}`,
          tAndC: [
            `Applicable only when you pay via ${PAY_BRAND}`,
            "Offer applicable on final bill value net of other discounts",
            "Offer is applicable on select stores only",
            "Valid once per user during campaign period",
            "Platform T&C shall apply",
          ],
        },
        addOnOffers: [],
      };
    }

    return { instantOffer: null, addOnOffers: [] };
  }, [store, PAY_BRAND]);

  const instantOffer = districtPay.instantOffer;
  const addOnOffers = districtPay.addOnOffers;

  const { width } = Dimensions.get("window");
  const CARD_W = Math.min(320, Math.round(width * 0.78));
  const GAP = 14;

  // ✅ safe T&C builder fallback
  const termsList =
    selected?.offer?.tAndC?.length > 0
      ? selected.offer.tAndC
      : buildFallbackTnc(selected?.offer, PAY_BRAND);

  return (
    <View style={{ paddingHorizontal: 16 }}>
      {/* -------------------------
          STORE OFFERS (TOP)
      -------------------------- */}
      <Text style={[styles.hTitle, { color: ui.text }]}>Store Offers</Text>
      <Text style={[styles.hSub, { color: ui.muted }]}>
        In-store deals applied at billing counter
      </Text>

      {inStoreOffer ? (
        <Pressable
          onPress={() => openOffer(inStoreOffer, "INSTORE")}
          style={[
            styles.bigOfferCard,
            { backgroundColor: cardBg, borderColor: border, shadowColor: "#000" },
          ]}
        >
          <View style={styles.ticketWrap}>
            <LinearGradient
              colors={["#FFE4F2", "#F8B8E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ticketBadge}
            >
              <Ticket size={18} color={accent} />
            </LinearGradient>
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[styles.smallLabel, { color: accent }]}>
              {inStoreOffer?.label || "In-store Offer"}
            </Text>
            <Text numberOfLines={1} style={[styles.bigTitle, { color: ui.text }]}>
              {inStoreOffer?.title}
            </Text>
            <Text numberOfLines={1} style={[styles.bigSub, { color: ui.muted }]}>
              {inStoreOffer?.subtitle}
            </Text>
          </View>
        </Pressable>
      ) : null}

      {/* -------------------------
          PAY OFFERS
      -------------------------- */}
      <Text style={[styles.hTitle, { color: ui.text, marginTop: 22 }]}>
        {PAY_BRAND} offers
      </Text>
      <Text style={[styles.hSub, { color: ui.muted }]}>
        Unlock when you pay via {PAY_BRAND}
      </Text>

      {/* Instant Offer */}
      {instantOffer ? (
        <Pressable
          onPress={() => openOffer(instantOffer, "INSTANT")}
          style={[
            styles.bigOfferCard,
            {
              marginTop: 14,
              backgroundColor: cardBg,
              borderColor: border,
              shadowColor: "#000",
            },
          ]}
        >
          <View style={styles.ticketWrap}>
            <LinearGradient
              colors={["#FFE4F2", "#F8B8E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ticketBadge}
            >
              <Ticket size={18} color={accent} />
            </LinearGradient>
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[styles.smallLabel, { color: accent }]}>
              {instantOffer?.label || "Instant Offer"}
            </Text>

            <Text numberOfLines={1} style={[styles.bigTitle, { color: ui.text }]}>
              {instantOffer?.title}
            </Text>

            {!!instantOffer?.subtitle && (
              <Text
                numberOfLines={1}
                style={[styles.bigSub, { color: ui.muted }]}
              >
                {instantOffer.subtitle}
              </Text>
            )}
          </View>
        </Pressable>
      ) : null}

      {/* ADD ON OFFERS label */}
      {addOnOffers?.length ? (
        <View style={styles.addOnRow}>
          <View style={[styles.addOnLine, { backgroundColor: border }]} />
          <Text style={[styles.addOnText, { color: ui.muted }]}>
            ADD ON OFFERS
          </Text>
          <View style={[styles.addOnLine, { backgroundColor: border }]} />
        </View>
      ) : null}

      {/* Swipeable add-on offers row */}
      {addOnOffers?.length ? (
        <FlatList
          data={addOnOffers}
          keyExtractor={(item) => String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12 }}
          contentContainerStyle={{ paddingRight: 16 }}
          snapToInterval={CARD_W + GAP}
          decelerationRate="fast"
          snapToAlignment="start"
          ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
          renderItem={({ item }) => {
            const hasBankLogo = !!item?.bankLogo;

            return (
              <Pressable
                onPress={() => openOffer(item, "ADDON")}
                style={[
                  styles.offerCard,
                  {
                    width: CARD_W,
                    backgroundColor: cardBg,
                    borderColor: border,
                    shadowColor: "#000",
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconBubble,
                    { backgroundColor: bg, borderColor: border },
                  ]}
                >
                  {hasBankLogo ? (
                    <Image
                      source={{ uri: item.bankLogo }}
                      style={styles.bankLogo}
                      resizeMode="contain"
                    />
                  ) : (
                    <ShoppingBag size={18} color={accent} />
                  )}
                </View>

                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={1} style={[styles.offerTitle, { color: ui.text }]}>
                    {item.title}
                  </Text>
                  <Text numberOfLines={1} style={[styles.offerSub, { color: ui.muted }]}>
                    {item.subtitle}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      ) : null}

      {/* -------------------------
          ✅ MODAL (Offer details)
      -------------------------- */}
      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />

          <View
            style={[
              styles.sheet,
              {
                backgroundColor: ui.card || "#fff",
                paddingBottom: (insets.bottom || 0) + 18,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: ui.text }]}>
                {modalTitle}
              </Text>
              <Pressable onPress={closeModal} style={styles.closeBtn}>
                <X size={18} color={ui.text} />
              </Pressable>
            </View>

            {/* Offer card */}
            <View
              style={[
                styles.detailCard,
                { backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.08)" },
              ]}
            >
              <Text style={styles.detailTitle}>
                {selected?.offer?.title || "Offer"}
              </Text>
              {!!selected?.offer?.subtitle && (
                <Text style={styles.detailSub}>{selected.offer.subtitle}</Text>
              )}

              <View style={styles.divider} />

              <Text style={styles.tcTitle}>Terms & Conditions</Text>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 220 }}
              >
                {termsList.map((t, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.bulletText}>{t}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Pay bill button */}
            <Pressable
              onPress={() => (onPressPayBill ? onPressPayBill() : closeModal())}
              style={styles.payBtn}
            >
              <Text style={styles.payBtnText}>Pay bill</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function buildFallbackTnc(offer, payBrand) {
  if (!offer) return [];
  const arr = [];

  if (offer?.minBill && offer.minBill > 0) {
    arr.push(`Valid on bill value of ₹${offer.minBill} or more`);
  }

  if (offer?.bank) {
    arr.push(`Applicable only on ${offer.bank} card payments`);
  } else if (offer?.paymentMethod) {
    arr.push(`Applicable on ${offer.paymentMethod} payments`);
  }

  if (offer?.couponCode) arr.push(`Coupon code: ${offer.couponCode}`);

  arr.push(`Applicable only when you pay via ${payBrand}`);
  arr.push("Offer applicable on final bill value net of other discounts");
  arr.push("Valid once per user during campaign period");
  arr.push("Platform T&C shall apply");
  return arr;
}

const styles = StyleSheet.create({
  hTitle: { fontSize: 22, fontWeight: "900", marginTop: 6 },
  hSub: { marginTop: 6, fontSize: 14, fontWeight: "600" },

  bigOfferCard: {
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  ticketWrap: { width: 46, height: 46, alignItems: "center", justifyContent: "center" },
  ticketBadge: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },

  smallLabel: { fontSize: 14, fontWeight: "800", marginBottom: 4 },
  bigTitle: { fontSize: 18, fontWeight: "900" },
  bigSub: { marginTop: 4, fontSize: 14, fontWeight: "700" },

  addOnRow: { marginTop: 18, flexDirection: "row", alignItems: "center", gap: 12 },
  addOnLine: { flex: 1, height: 1, opacity: 0.6 },
  addOnText: { fontSize: 14, fontWeight: "900", letterSpacing: 2, opacity: 0.9 },

  offerCard: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  iconBubble: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  bankLogo: { width: 26, height: 26, borderRadius: 6 },
  offerTitle: { fontSize: 16, fontWeight: "900" },
  offerSub: { marginTop: 4, fontSize: 13, fontWeight: "600" },

  /* ✅ MODAL */
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 14,
    paddingHorizontal: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  sheetTitle: { fontSize: 22, fontWeight: "900" },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.55)",
  },

  detailCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginTop: 10,
  },
  detailTitle: { fontSize: 22, fontWeight: "900", color: "#111" },
  detailSub: { marginTop: 6, fontSize: 15, fontWeight: "700", color: "rgba(0,0,0,0.65)" },
  divider: { marginTop: 14, height: 1, backgroundColor: "rgba(0,0,0,0.08)" },

  tcTitle: { marginTop: 14, fontSize: 20, fontWeight: "900", color: "#111" },
  bulletRow: { flexDirection: "row", gap: 10, marginTop: 14, alignItems: "flex-start" },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7, backgroundColor: "rgba(0,0,0,0.65)" },
  bulletText: { flex: 1, fontSize: 15, fontWeight: "700", color: "rgba(0,0,0,0.65)", lineHeight: 20 },

  payBtn: {
    marginTop: 16,
    marginBottom: 10,
    height: 54,
    borderRadius: 28,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
    justifyContent: "center",
  },
  payBtnText: { color: "#fff", fontSize: 18, fontWeight: "900" },
});
