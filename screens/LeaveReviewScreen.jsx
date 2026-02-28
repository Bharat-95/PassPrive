import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// ✅ Load image ONCE (cached)
const REVIEW_ILLUSTRATION = require('../assets/review_table.png');

export default function LeaveReviewScreen({ navigation, route }) {
  const { restaurant } = route.params;

  const [rating, setRating] = useState(0);

  return (
    <View style={styles.container}>
      {/* CLOSE BUTTON */}
      <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <X size={30} color="#000" />
      </Pressable>

      {/* ILLUSTRATION */}
      <Image
        source={REVIEW_ILLUSTRATION}
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* TITLE */}
      <Text style={styles.title}>
        How was your experience at {restaurant.name}?
      </Text>

      {/* SUBTITLE */}
      <Text style={styles.subtitle}>Let us know how it went?</Text>

      {/* STAR RATING */}
      <View style={styles.starsRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Pressable
            key={i}
            onPress={() =>
              navigation.navigate('DetailedReview', {
                restaurant,
                rating,
              })
            }
          >
            <Text style={[styles.star, i < rating && styles.starActive]}>
              ★
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 60,
    alignItems: 'center',
  },

  closeBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },

  illustration: {
    width: width * 0.55,
    height: width * 0.55,
    marginTop: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
    color: '#000',
  },

  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },

  starsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 35,
  },

  star: {
    fontSize: 40,
    color: '#bbb',
  },

  starActive: {
    color: '#000', // Black filled star
  },
});
