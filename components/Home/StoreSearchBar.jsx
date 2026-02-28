import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

import { ThemeContext } from '../../App';

const { width } = Dimensions.get('window');
const cardSize = (width - 16 * 2 - 12 * 2) / 3;

export default function StoreCategoryGrid({ onLoadingChange }) {
  const { colors } = useContext(ThemeContext);
  const [active, setActive] = useState(null);

  const categories = [
    { key: "beauty", label: "Beauty & Salon", image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg" },
    { key: "footwear", label: "Footwear", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" },
    { key: "apparel", label: "Apparel", image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg" },
    { key: "accessories", label: "Accessories", image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg" },
    { key: "jewellery", label: "Jewellery", image: "https://images.pexels.com/photos/1453005/pexels-photo-1453005.jpeg" },
    { key: "homegifting", label: "Home & Gifting", image: "https://images.pexels.com/photos/718981/pexels-photo-718981.jpeg" },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      
      {/* Heading */}
      <View style={styles.headingContainer}>
        <View style={[styles.lineLeft, { backgroundColor: colors.subtitle + "30" }]} />
        <Text style={[styles.headingText, { color: colors.text }]}>
          SHOP BY CATEGORY
        </Text>
        <View style={[styles.lineRight, { backgroundColor: colors.subtitle + "30" }]} />
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {categories.map(cat => {
          const isActive = active === cat.key;

          return (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.cardBox,
                { 
                  width: cardSize,
                  height: cardSize,
                  borderColor: isActive ? colors.primary : colors.border,
                  backgroundColor: colors.card,
                }
              ]}
              onPress={() => setActive(cat.key)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: cat.image }}
                style={styles.img}
                resizeMode="cover"

                // ⭐ ADDED FOR PARENT LOADING FEEDBACK
                onLoadStart={() => onLoadingChange?.(true)}
                onLoadEnd={() => onLoadingChange?.(false)}
              />

              <View
                style={[
                  styles.textBadge,
                  { backgroundColor: isActive ? colors.primary : "rgba(0,0,0,0.45)" }
                ]}
              >
                <Text style={[styles.cardText, { color: "#fff" }]}>
                  {cat.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginTop:20
  },

  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 8,
  },

  lineLeft: {
    flex: 1,
    height: 1,
    marginRight: 12,
    borderRadius: 4,
  },

  lineRight: {
    flex: 1,
    height: 1,
    marginLeft: 12,
    borderRadius: 4,
  },

  headingText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardBox: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },

  img: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  textBadge: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 6,
    alignItems: 'center',
  },

  cardText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
