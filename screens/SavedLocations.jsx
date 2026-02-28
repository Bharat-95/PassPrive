import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";

import { MapPin, Plus, LocateFixed, Clock, ArrowLeft } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function SavedLocations() {
  const navigation = useNavigation();

  const [currentAddress, setCurrentAddress] = useState("");
  const [recentLocations, setRecentLocations] = useState([]);
  const [nearbyLocations, setNearbyLocations] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const saved = await AsyncStorage.getItem("user_location");
    if (saved) setCurrentAddress(saved);

    // For now using dummy nearby — replace with Google Places API later
    setNearbyLocations([
      { id: "1", title: "Kistamma Building", address: "Baba Nagar, Nacharam, Secunderabad" },
      { id: "2", title: "Holy Faith High School", address: "Baba Nagar, Nacharam, Secunderabad" },
      { id: "3", title: "Samskruthi Prangan apartments", address: "Ram Reddy Colony, Secunderabad" },
    ]);

    setRecentLocations([
      { id: "10", title: "Baba Nagar", address: "Nacharam, Secunderabad", distance: "0 m" },
    ]);
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Select a location</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <MapPin size={20} color="#aaa" />
        <TextInput
          placeholder="Search for area, street name…"
          placeholderTextColor="#666"
          style={styles.searchInput}
        />
      </View>

      {/* ADD ADDRESS */}
      <TouchableOpacity
        style={styles.rowCard}
        onPress={() => navigation.navigate("AddAddress")}
      >
        <Plus size={20} color="#DA3224" />
        <Text style={[styles.rowText, { color: "#DA3224" }]}>Add address</Text>
      </TouchableOpacity>

      {/* CURRENT LOCATION */}
      <TouchableOpacity style={styles.rowCard}>
        <LocateFixed size={20} color="#DA3224" />
        <View>
          <Text style={[styles.rowText, { color: "#DA3224" }]}>
            Use your current location
          </Text>
          <Text style={styles.subText}>{currentAddress}</Text>
        </View>
      </TouchableOpacity>

      {/* NEARBY SECTION */}
      <Text style={styles.sectionTitle}>NEARBY LOCATIONS</Text>

      {nearbyLocations.map((item) => (
        <View key={item.id} style={styles.locationItem}>
          <MapPin size={20} color="#fff" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemSub}>{item.address}</Text>
          </View>
        </View>
      ))}

      {/* RECENT LOCATIONS */}
      <Text style={styles.sectionTitle}>RECENT LOCATIONS</Text>

      {recentLocations.map((item) => (
        <View key={item.id} style={styles.locationItem}>
          <Clock size={20} color="#fff" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemSub}>{item.address}</Text>
          </View>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    padding: 16,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "white",
  },

  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },

  rowText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },

  subText: {
    marginTop: 4,
    color: "#aaa",
    fontSize: 13,
  },

  sectionTitle: {
    color: "#888",
    marginTop: 20,
    marginBottom: 8,
    fontSize: 12,
    letterSpacing: 1.2,
  },

  locationItem: {
    backgroundColor: "#1A1A1A",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  itemTitle: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },

  itemSub: {
    fontSize: 13,
    color: "#9A9A9A",
  },

  distance: {
    color: "#DA3224",
    marginLeft: "auto",
  },

  googleFooter: {
    textAlign: "center",
    color: "white",
    opacity: 0.6,
    marginTop: 30,
    fontSize: 12,
  },
});
