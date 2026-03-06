import React, { useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";

import {
  ArrowLeft,
  Info,
  MessageCircle,
  ShieldAlert,
  Bookmark,
  MapPin,
  HelpCircle,
  Gift,
  Calendar,
  Tag,
  User,
  Star,
  Sun,
  Moon,
  Monitor as SystemIcon,
} from "lucide-react-native";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// THEME + AUTH CONTEXT
import { ThemeContext } from "../App";
import { AuthContext } from "../context/AuthContext";
import supabase from "../supabase";

export default function Profile() {
  const navigation = useNavigation();

  const { mode, colors, setThemeMode } = useContext(ThemeContext);
  const { user, loading } = useContext(AuthContext);

  const opacity = useRef(new Animated.Value(0.3)).current;

  // 🔥 SKELETON SHIMMER
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // 🔥 Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await GoogleSignin.signOut().catch(() => {});
      await AsyncStorage.multiRemove(["isLoggedIn", "auth_user"]);
    } finally {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };

  // 🔥 Skeleton Component
  const Skeleton = () => (
    <Animated.View style={[styles.profileCard(colors), { opacity }]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.skelAvatar(colors)} />
        <View style={{ marginLeft: 12 }}>
          <View style={styles.skelLine(colors)} />
          <View style={[styles.skelLine(colors), { width: "60%", marginTop: 8 }]} />
        </View>
      </View>
    </Animated.View>
  );

  // 🔥 Membership Card
  const MembershipCard = () => (
    <TouchableOpacity
      style={styles.membershipCard(colors)}
      onPress={() => (user ? navigation.navigate("Membership") : navigation.navigate("Login"))}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Star size={26} color="#F0D98A" />
        <View style={{ marginLeft: 12 }}>
          <Text style={[styles.membershipTitle, { color: "#F0D98A" }]}>
            PassPrivé Membership
          </Text>
          <Text style={[styles.membershipSub, { color: colors.subtitle }]}>
            Unlock exclusive dining benefits
          </Text>
        </View>
      </View>

      <ArrowLeft size={20} color="#F0D98A" style={{ transform: [{ rotate: "180deg" }] }} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.bg(colors)} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn(colors)} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* PROFILE SECTION */}
      {loading ? (
        <Skeleton />
      ) : user ? (
        <View style={[styles.profileCard(colors), styles.loggedInCard]}>
          <View style={{ flexDirection: "row" }}>
            {/* Avatar */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.user_metadata?.full_name?.[0] || user.email?.[0]).toUpperCase()}
              </Text>
            </View>

            {/* User Info */}
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={[styles.nameText, { color: colors.text }]}>
                {user?.user_metadata?.full_name || "User"}
              </Text>
              <Text style={[styles.emailText, { color: colors.subtitle }]}>
                {user.email}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        // NOT LOGGED IN
        <View style={[styles.profileCard(colors), styles.loggedOutCard]}>
          <User size={32} color="#C59D5F" />
          <Text style={[styles.loggedOutTitle, { color: colors.text }]}>Your Profile</Text>
          <Text style={[styles.loggedOutText, { color: colors.subtitle }]}>
            Sign in to access dining rewards & bookings
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MEMBERSHIP */}
      <MembershipCard />

      {/* COLLECTIONS */}
      <View style={styles.rowActions}>
        <TouchableOpacity style={styles.actionBox(colors)}>
          <View style={styles.iconCircle(colors)}>
            <Bookmark size={22} color="#C59D5F" />
          </View>
          <Text style={[styles.actionLabel, { color: colors.text }]}>Collections</Text>
        </TouchableOpacity>
      </View>

      {/* DINING SECTION */}
      {user && (
        <View style={styles.section(colors)}>
          <Text style={styles.sectionTitle}>Dining & Experiences</Text>

          {[
            "Dining Transactions",
            "Dining Rewards",
            "Your Bookings",
            "Dining Help",
            "Frequently Asked Questions",
          ].map((label, index) => (
            <TouchableOpacity key={index} style={styles.rowItem(colors)}>
              <View style={styles.rowLeft}>
                <View style={styles.lucideIcon(colors)}>
                  <Gift size={18} color="#C59D5F" />
                </View>
                <Text style={[styles.rowText, { color: colors.text }]}>{label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* STORE */}
      {user && (
        <View style={styles.section(colors)}>
          <Text style={styles.sectionTitle}>Store Experiences</Text>

          {[
            "Store Transactions",
            "Store Rewards",
            "Store Help",
            "Frequently Asked Questions",
          ].map((label, index) => (
            <TouchableOpacity key={index} style={styles.rowItem(colors)}>
              <View style={styles.rowLeft}>
                <View style={styles.lucideIcon(colors)}>
                  <MapPin size={18} color="#C59D5F" />
                </View>
                <Text style={[styles.rowText, { color: colors.text }]}>{label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* COUPONS */}
      {user && (
        <View style={styles.section(colors)}>
          <Text style={styles.sectionTitle}>Coupons</Text>

          <TouchableOpacity style={styles.rowItem(colors)}>
            <View style={styles.rowLeft}>
              <View style={styles.lucideIcon(colors)}>
                <Tag size={18} color="#C59D5F" />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>Available Coupons</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* MORE + THEME SWITCH */}
      <View style={styles.section(colors)}>
        <Text style={styles.sectionTitle}>More</Text>

        {/* More Items */}
        {[
          { icon: <Info size={18} color="#C59D5F" />, label: "About" },
          { icon: <MessageCircle size={18} color="#C59D5F" />, label: "Send Feedback" },
          { icon: <ShieldAlert size={18} color="#C59D5F" />, label: "Safety Emergency" },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.rowItem(colors)}>
            <View style={styles.rowLeft}>
              <View style={styles.lucideIcon(colors)}>{item.icon}</View>
              <Text style={[styles.rowText, { color: colors.text }]}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* THEME MODE */}
        <View style={styles.rowItem(colors)}>
          <View style={styles.rowLeft}>
            <View style={styles.lucideIcon(colors)}>
              {mode === "dark" ? (
                <Moon size={18} color="#C59D5F" />
              ) : mode === "light" ? (
                <Sun size={18} color="#C59D5F" />
              ) : (
                <SystemIcon size={18} color="#C59D5F" />
              )}
            </View>
            <Text style={[styles.rowText, { color: colors.text }]}>Theme</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            {["system", "light", "dark"].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setThemeMode(option)}
                style={{
                  marginLeft: 12,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                  backgroundColor: mode === option ? "#C59D5F33" : "transparent",
                }}
              >
                <Text
                  style={{
                    color: mode === option ? "#C59D5F" : colors.subtitle,
                    fontSize: 13,
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* LOGOUT */}
        {user && (
          <TouchableOpacity style={styles.rowItem(colors)} onPress={handleLogout}>
            <View style={styles.rowLeft}>
              <View style={styles.lucideIcon(colors)}>
                <ArrowLeft size={18} color="#C59D5F" />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.footer, { color: colors.subtitle }]}>PassPrivé v1.0</Text>
    </ScrollView>
  );
}

/* ---------------------------------------------------
   ALL STYLES
---------------------------------------------------- */

const styles = {
  bg: (colors) => ({
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 20,
  }),

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: (colors) => ({
    backgroundColor: colors.card,
    padding: 8,
    borderRadius: 50,
  }),

  profileCard: (colors) => ({
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 22,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(197,157,95,0.32)",
  }),

  loggedOutCard: {
    alignItems: "center",
  },

  loggedOutTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },

  loggedOutText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },

  loginButton: {
    borderWidth: 1.3,
    borderColor: "#C59D5F",
    paddingVertical: 10,
    paddingHorizontal: 45,
    borderRadius: 14,
    marginTop: 18,
  },

  loginButtonText: {
    color: "#C59D5F",
    fontSize: 16,
    fontWeight: "600",
  },

  loggedInCard: {
    borderColor: "rgba(197,157,95,0.5)",
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 54,
    backgroundColor: "#C59D5F22",
    borderWidth: 1.2,
    borderColor: "#C59D5F",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#C59D5F",
  },

  nameText: {
    fontSize: 18,
    fontWeight: "700",
  },

  emailText: {
    fontSize: 13,
    marginTop: 3,
  },

  membershipCard: (colors) => ({
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "rgba(240,217,138,0.45)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }),

  membershipTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  membershipSub: {
    fontSize: 13,
    marginTop: 3,
  },

  skelAvatar: (colors) => ({
    width: 55,
    height: 55,
    borderRadius: 55,
    backgroundColor: colors.border,
  }),

  skelLine: (colors) => ({
    height: 12,
    width: "80%",
    backgroundColor: colors.border,
    borderRadius: 6,
  }),

  rowActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },

  actionBox: (colors) => ({
    flex: 1,
    backgroundColor: colors.card,
    marginHorizontal: 5,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  }),

  iconCircle: (colors) => ({
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 50,
  }),

  actionLabel: {
    marginTop: 10,
    fontSize: 14,
  },

  section: (colors) => ({
    marginTop: 15,
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 14,
  }),

  sectionTitle: {
    color: "#C59D5F",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 12,
  },

  rowItem: (colors) => ({
    paddingVertical: 12,
    borderBottomWidth: 0.4,
    borderBottomColor: colors.border,
  }),

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  lucideIcon: (colors) => ({
    width: 30,
    height: 30,
    backgroundColor: colors.background,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  }),

  rowText: {
    fontSize: 15,
  },

  footer: {
    textAlign: "center",
    marginVertical: 30,
  },
};
