import React, { useEffect, useMemo, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Platform,
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  User,
  Ban,
  Edit3,
} from "lucide-react-native";
import { ThemeContext } from "../App";
import supabase from "../supabase";

export default function ReviewRestaurantBookingScreen({ route, navigation }) {
  const params = route?.params || {};
const {
  restaurant,
  guests,
  selectedDate,
  selectedTime,
  meal,
  option,
  user: userFromParams,
  benefits: benefitsFromParams,
  restaurantTerms: restaurantTermsFromParams,
  terms: termsFromParams,
} = params;


  const theme = useContext(ThemeContext);
  const colors = theme?.colors || {};
  const mode = theme?.mode;

  const BG = colors.background || "#0D0D0D";
  const TEXT = colors.text || "#F5F5F5";
  const MUTED = colors.subtitle || colors.mutedText || "#B3B3B3";
  const CARD = colors.card || "#1A1A1A";
  const BORDER = colors.border || "rgba(255,255,255,0.12)";

  const isDark =
    mode ? mode === "dark" : String(BG).toLowerCase() === "#0d0d0d";

  const headerIconBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const pillBg = isDark ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.12)";
  const pillText = TEXT;

  const primaryBtnBg = isDark ? "#F5F5F5" : "#0D0D0D";
  const primaryBtnText = isDark ? "#0D0D0D" : "#FFFFFF";

  const divider = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

  // ✅ keep this near the top (after theme tokens)
const [user, setUser] = useState(
  userFromParams || { full_name: "", phone: "", email: "" }
);
const [loadingUser, setLoadingUser] = useState(false);

useEffect(() => {
  let mounted = true;

  (async () => {
    try {
      setLoadingUser(true);

      // 1) get logged-in session
      const { data: sessionData, error: sessionErr } =
        await supabase.auth.getSession();

      const sessionUser = sessionData?.session?.user;

      // If not logged in, fallback to params (or you can navigate to Login)
      if (sessionErr || !sessionUser) {
        if (mounted) setLoadingUser(false);
        return;
      }

      // 2) fetch from public.users using auth user id
      const { data: dbUser, error: dbErr } = await supabase
        .from("users")
        .select("id, full_name, phone, email, profile_image")
        .eq("id", sessionUser.id)
        .single();

      if (dbErr) {
        // fallback: at least show email from auth
        if (mounted) {
          setUser((prev) => ({
            ...prev,
            email: prev.email || sessionUser.email || "",
          }));
        }
        return;
      }

      if (mounted && dbUser) {
        setUser({
          full_name: dbUser.full_name || "",
          phone: dbUser.phone || "",
          email: dbUser.email || sessionUser.email || "",
          profile_image: dbUser.profile_image || "",
        });
      }
    } catch (e) {
      // ignore
    } finally {
      if (mounted) setLoadingUser(false);
    }
  })();

  return () => {
    mounted = false;
  };
}, [userFromParams]);


  const dateTimeText = useMemo(() => {
    const d = selectedDate || "";
    const t = selectedTime || "";
    if (!d && !t) return "—";
    if (d && t) return `${d} at ${t}`;
    return d || t;
  }, [selectedDate, selectedTime]);

  const locationTitle = restaurant?.name || "—";
  const locationSub =
    [restaurant?.locality, restaurant?.city].filter(Boolean).join(", ") || "—";

  const guestsText =
    guests != null ? `${guests} guest${Number(guests) === 1 ? "" : "s"}` : "—";

  const benefitsText = benefitsFromParams || "10% cashback";

  const restaurantTerms = restaurantTermsFromParams || [
    "The 50% is only valid during breakfast slots and only on the breakfast menu",
  ];

  const terms = termsFromParams || [
    "Please arrive 15 minutes prior to your reservation time.",
    "Booking valid for the specified number of guests entered during reservation",
    "Cover charges upon entry are subject to the discretion of the restaurant",
    "Additional service charges on the bill are at the restaurant’s discretion",
    "House rules are to be observed at all times",
    "Special requests will be accommodated at the restaurant’s discretion",
    "Offers can be availed only by paying via District",
    "Cover charges cannot be refunded if slot is cancelled within 30 minutes of slot start time",
    "Other T&Cs may apply",
  ];

  const onAddSpecialRequest = () => {
    // navigation.navigate("SpecialRequest", { ...route.params })
    // or open a modal
  };

  const onCancelInfo = () => {
    // navigation.navigate("CancellationPolicy", { ...route.params })
  };

  const onConfirm = async () => {
    // Call your booking API here
    // navigation.navigate("BookingSuccess", { ...route.params })
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: BG }]}>
        <Pressable
          onPress={() => navigation?.goBack?.()}
          style={[styles.backBtn, { backgroundColor: headerIconBg }]}
        >
          <ChevronLeft size={20} color={TEXT} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: TEXT }]}>
          Review your booking
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Blue info banner */}
        <View style={[styles.banner, { backgroundColor: pillBg }]}>
          <Text style={[styles.bannerText, { color: pillText }]}>
            Reach the restaurant 15 minutes before your booking time for a
            hassle-free experience
          </Text>
        </View>

        {/* Booking details card */}
        <View style={[styles.card, { backgroundColor: CARD, borderColor: BORDER }]}>
          <InfoRow
            label="Date and Time"
            value={dateTimeText}
            colors={{ TEXT, MUTED }}
          />
          <Divider color={divider} />

          <InfoRow
            label="Location"
            value={locationTitle}
            subValue={locationSub}
            colors={{ TEXT, MUTED }}
          />
          <Divider color={divider} />

          <InfoRow
            label="Number of guest(s)"
            value={guestsText}
            colors={{ TEXT, MUTED }}
          />
          <Divider color={divider} />

          <InfoRow
            label="Benefits"
            value={benefitsText}
            valueColor={isDark ? "rgba(167,139,250,1)" : "rgba(79,70,229,1)"}
            colors={{ TEXT, MUTED }}
          />
        </View>

        {/* Add special request */}
        <Pressable
          onPress={onAddSpecialRequest}
          style={[styles.rowCard, { backgroundColor: CARD, borderColor: BORDER }]}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.iconCircle, { borderColor: divider }]}>
              <Plus size={18} color={TEXT} />
            </View>
            <Text style={[styles.rowTitle, { color: TEXT }]}>
              Add a special request
            </Text>
          </View>
          <ChevronRight size={20} color={MUTED} />
        </Pressable>

        {/* Modification / Cancellation */}
        <View style={[styles.card, { backgroundColor: CARD, borderColor: BORDER }]}>
          <View style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <Edit3 size={18} color={MUTED} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.actionTitle, { color: TEXT }]}>
                  Modification unavailable
                </Text>
                <Text style={[styles.actionSub, { color: MUTED }]}>
                  Not eligible within 30 mins of booking time
                </Text>
              </View>
            </View>
          </View>

          <Divider color={divider} />

          <Pressable onPress={onCancelInfo} style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <Ban size={18} color={"rgba(255,99,99,1)"} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.actionTitle, { color: TEXT }]}>
                  Cancellation available
                </Text>
                <Text style={[styles.actionSub, { color: MUTED }]}>
                  Valid till 6:00 PM, today
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={MUTED} />
          </Pressable>
        </View>

        {/* Restaurant Terms */}
        <Text style={[styles.sectionTitle, { color: TEXT }]}>Restaurant Terms</Text>
        <BulletCard
          items={restaurantTerms}
          colors={{ CARD, BORDER, TEXT, MUTED }}
          divider={divider}
        />

        {/* Your details */}
        <Text style={[styles.sectionTitle, { color: TEXT }]}>Your details</Text>
        <View style={[styles.card, { backgroundColor: CARD, borderColor: BORDER }]}>
          <View style={styles.detailsRow}>
            <View style={[styles.userIconWrap, { borderColor: divider }]}>
              <User size={20} color={MUTED} />
            </View>

            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[styles.detailsName, { color: TEXT }]}>
                {user?.full_name || "—"}
              </Text>
              <Text style={[styles.detailsPhone, { color: MUTED }]}>
                {user?.phone || "—"}
              </Text>
            </View>
          </View>
        </View>

        {/* Terms & Conditions */}
        <Text style={[styles.sectionTitle, { color: TEXT }]}>
          Terms & Conditions
        </Text>
        <BulletCard
          items={terms}
          colors={{ CARD, BORDER, TEXT, MUTED }}
          divider={divider}
          dense
        />
      </ScrollView>

      {/* Sticky CTA */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: BG,
            borderTopColor: divider,
          },
        ]}
      >
        <Pressable
          onPress={onConfirm}
          style={[styles.cta, { backgroundColor: primaryBtnBg }]}
        >
          <Text style={[styles.ctaText, { color: primaryBtnText }]}>
            Confirm your seat
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/* ---------------------------
   Small UI pieces
--------------------------- */

function Divider({ color }) {
  return <View style={{ height: 1, backgroundColor: color, marginVertical: 14 }} />;
}

function InfoRow({ label, value, subValue, colors, valueColor }) {
  const { TEXT, MUTED } = colors;
  return (
    <View>
      <Text style={[styles.infoLabel, { color: MUTED }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: valueColor || TEXT }]}>{value}</Text>
      {!!subValue && (
        <Text style={[styles.infoSubValue, { color: MUTED }]}>{subValue}</Text>
      )}
    </View>
  );
}

function BulletCard({ items, colors, divider, dense }) {
  const { CARD, BORDER, MUTED } = colors;

  return (
    <View style={[styles.card, { backgroundColor: CARD, borderColor: BORDER }]}>
      {items.map((t, idx) => (
        <View key={`${t}-${idx}`} style={{ paddingVertical: dense ? 10 : 12 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View style={[styles.bulletDot, { backgroundColor: MUTED }]} />
            <Text style={[styles.bulletText, { color: MUTED }]}>{t}</Text>
          </View>

          {idx !== items.length - 1 && (
            <View style={{ height: 1, backgroundColor: divider, marginTop: dense ? 10 : 12 }} />
          )}
        </View>
      ))}
    </View>
  );
}

/* ---------------------------
   Styles
--------------------------- */

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  banner: {
    marginTop: 14,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  bannerText: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },

  card: {
    marginTop: 14,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.85,
  },
  infoValue: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "900",
  },
  infoSubValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.9,
  },

  rowCard: {
    marginTop: 14,
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  actionRow: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "900",
  },
  actionSub: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.85,
  },

  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  bulletDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 7,
    marginRight: 10,
    opacity: 0.9,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    opacity: 0.85,
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  detailsName: {
    fontSize: 17,
    fontWeight: "900",
  },
  detailsPhone: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.85,
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 18,
    borderTopWidth: 1,
  },
  cta: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 17,
    fontWeight: "900",
  },
});
