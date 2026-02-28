import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from "react-native";
import { 
  ArrowLeft, 
  ChevronRight, 
  Tag, 
  ShieldCheck, 
  Plus 
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const MembershipScreen = () => {
  const navigation = useNavigation();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const opacity = useRef(new Animated.Value(0.3)).current;

  /* Skeleton animation */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  /* Simulate fetch */
  useEffect(() => {
    setLoading(true);

    // Simulated loading for frontend demo
    setTimeout(() => {
      setPlans([
        {
          id: "1",
          name: "Premium",
          price: "1499",
          description: "Best for food lovers",
          validity_days: 365,
          benefits: ["10% OFF on dining", "Priority booking", "Exclusive events access"],
        },
        {
          id: "2",
          name: "Elite",
          price: "799",
          description: "Great savings at best restaurants",
          validity_days: 180,
          benefits: ["5% OFF", "Limited partner rewards"],
        },
      ]);

      setLoading(false);
    }, 1500);
  }, []);

  const SkeletonCard = () => (
    <Animated.View style={[styles.skeletonCard, { opacity }]} />
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.bg} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Membership</Text>
        </View>

        {/* USER STATUS */}
        <View style={styles.statusCard}>
          <ShieldCheck size={26} color="#C59D5F" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.statusTitle}>No Active Membership</Text>
            <Text style={styles.statusSubtitle}>Upgrade now to unlock premium advantages.</Text>
          </View>
        </View>

        {/* Promo Code */}
        <TouchableOpacity style={styles.promoCard}>
          <Tag size={24} color="#C59D5F" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.promoTitle}>Have a Promo Code?</Text>
            <Text style={styles.promoSubtitle}>Redeem corporate / partner coupons</Text>
          </View>
          <ChevronRight size={22} color="#C59D5F" />
        </TouchableOpacity>

        {/* Best Offers */}
        <View style={styles.offerCard}>
          <Text style={styles.offerTitle}>Best Offers For You</Text>

          <View style={styles.offerBox}>
            <Text style={styles.offerText}>🔥 Extra 10% OFF on all membership plans</Text>
          </View>

          <View style={styles.offerBox}>
            <Text style={styles.offerText}>💳 Get 20% OFF using HDFC Debit Card</Text>
          </View>
        </View>

        {/* Membership Plans */}
        <Text style={styles.sectionTitle}>Membership Plans</Text>

        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={styles.planCard}
              onPress={() => navigation.navigate("MembershipPlanDetails", { plan })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.planTitle}>{plan.name}</Text>
                <Text style={styles.planDesc}>{plan.description}</Text>
                <Text style={styles.planPrice}>₹{plan.price}</Text>
                <Text style={styles.planValidity}>{plan.validity_days} days validity</Text>

                {plan.benefits?.map((b, i) => (
                  <Text key={i} style={styles.benefitItem}>• {b}</Text>
                ))}
              </View>

              <View style={styles.planArrow}>
                <ChevronRight size={26} color="#C59D5F" />
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 70 }} />
      </ScrollView>

      {/* Add new plan button - frontend only */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate("AddMembershipPlan")}
      >
        <Plus size={26} color="#0D0D0D" />
      </TouchableOpacity>
    </View>
  );
};

export default MembershipScreen;

/* ------------------------------ */
/* STYLES */
/* ------------------------------ */

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  headerRow: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    backgroundColor: "#1A1A1A",
    padding: 8,
    borderRadius: 50,
  },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "700", marginLeft: 12 },

  statusCard: {
    backgroundColor: "#1A1A1A",
    padding: 18,
    borderRadius: 14,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(197,157,95,0.3)",
  },

  statusTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  statusSubtitle: { color: "#B3B3B3", fontSize: 13, marginTop: 3 },

  promoCard: {
    backgroundColor: "#1A1A1A",
    padding: 18,
    borderRadius: 14,
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  promoTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  promoSubtitle: { color: "#B3B3B3", fontSize: 13 },

  offerCard: {
    marginTop: 22,
    backgroundColor: "#1A1A1A",
    padding: 18,
    borderRadius: 14,
  },
  offerTitle: { color: "#C59D5F", fontSize: 16, fontWeight: "700", marginBottom: 12 },
  offerBox: {
    backgroundColor: "#0D0D0D",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  offerText: { color: "#fff", fontSize: 14 },

  sectionTitle: {
    color: "#C59D5F",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
  },

  planCard: {
    backgroundColor: "#1A1A1A",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: "row",
  },

  planTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  planDesc: { color: "#B3B3B3", marginTop: 4 },
  planPrice: { color: "#C59D5F", fontSize: 18, fontWeight: "700", marginTop: 10 },
  planValidity: { color: "#B3B3B3", fontSize: 13, marginTop: 2 },

  benefitItem: { color: "#ccc", fontSize: 13, marginTop: 4 },

  planArrow: { justifyContent: "center", paddingLeft: 12 },

  skeletonCard: {
    height: 130,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    marginBottom: 14,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 25,
    backgroundColor: "#C59D5F",
    width: 58,
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
