import React from "react";
import { ScrollView, View, Image, Text, StyleSheet } from "react-native";

export default function HorizontalCardList({ type }) {
  const data = [
    { id: 1, title: `${type} One`, img: "https://picsum.photos/200/200" },
    { id: 2, title: `${type} Two`, img: "https://picsum.photos/201/200" },
    { id: 3, title: `${type} Three`, img: "https://picsum.photos/202/200" },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 22 }}>
      {data.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.img }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { marginRight: 16 },
  image: { width: 160, height: 110, borderRadius: 18 },
  title: { color: "#F5F5F5", fontSize: 16, fontWeight: "600", marginTop: 6 },
});
