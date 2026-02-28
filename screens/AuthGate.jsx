import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function AuthGate() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const isLogged = await AsyncStorage.getItem("isLoggedIn");

        if (isLogged === "true") {
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }
      } catch (e) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }

      setLoading(false);
    };

    checkLogin();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0D0D0D",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#C59D5F" />
    </View>
  );
}
