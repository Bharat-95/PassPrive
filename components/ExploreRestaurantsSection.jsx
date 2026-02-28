import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import { Star } from 'lucide-react-native';
import { ThemeContext } from '../App';
import { useContext } from 'react';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.65;

export default function ExploreRestaurantsSection({
  restaurants = [],
  currentRestaurantId,
}) {
  const list = Array.isArray(restaurants) ? restaurants : [];
  if (list.length === 0) return null;

  const current = list.find(r => r.id === currentRestaurantId);
  const { colors } = useContext(ThemeContext);

  const exploreOthers = list.filter(r => r.id !== currentRestaurantId);

  // Cuisine-based (future-ready)
  const similarRestaurants = current
    ? list.filter(
        r =>
          r.id !== currentRestaurantId &&
          Array.isArray(r.cuisines) &&
          Array.isArray(current.cuisines) &&
          r.cuisines.some(cuisine => current.cuisines.includes(cuisine)),
      )
    : [];

  // ✅ TEMP FALLBACK (AS REQUESTED)
  const finalSimilarRestaurants =
    similarRestaurants.length > 0 ? similarRestaurants : exploreOthers;

  const renderCard = item => (
    <Pressable
      key={item.id}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Image source={{ uri: item.images?.food?.[0] }} style={styles.image} />

      <View style={styles.cardBody}>
        <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
          {item.name}
        </Text>

        <View style={styles.ratingRow}>
          <Star size={14} color="#0E8B5F" fill="#0E8B5F" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={[styles.dot, { color: colors.subtitle }]}>•</Text>
          <Text numberOfLines={1} style={[styles.meta, { color: colors.subtitle }]}>
            {item.cuisines?.join(', ')}
          </Text>
        </View>

        <Text style={[styles.meta, { color: colors.subtitle }]}>
          ₹{item.costForTwo} for two • {item.distance} km
        </Text>

        {item.offer && <Text style={styles.offer}>{item.offer}</Text>}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* EXPLORE OTHER RESTAURANTS */}
      {exploreOthers.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Explore other restaurants
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {exploreOthers.map(renderCard)}
          </ScrollView>
        </View>
      )}

      {/* SIMILAR RESTAURANTS (TEMP SAME DATA) */}
      {finalSimilarRestaurants.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Similar restaurants
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {finalSimilarRestaurants.map(renderCard)}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },

  scrollContent: {
    paddingRight: 10,
  },

  card: {
    width: CARD_WIDTH,
    marginRight: 14,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1, // ✅ keeps same UI but ensures card separation in dark mode
    borderColor: 'transparent',
  },

  image: {
    width: '100%',
    height: 140,
  },

  cardBody: {
    padding: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  rating: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
    color: '#0E8B5F',
  },

  dot: {
    marginHorizontal: 6,
    color: '#888',
  },

  meta: {
    fontSize: 13,
    color: '#666',
  },

  offer: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#D32F2F',
  },
});
