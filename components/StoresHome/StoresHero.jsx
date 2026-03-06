import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function HeroBanner() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://images.pexels.com/photos/1674757/pexels-photo-1674757.jpeg',
        }}
        style={styles.bannerImage}
      />

      <View style={styles.overlay}>
        <Text style={styles.title}>WEDDING SEASON</Text>
        <Text style={styles.subtitle}>finds</Text>

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Step out & shop ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    borderBottomStartRadius: 20,
    borderBottomEndRadius:20,
    overflow: 'hidden',
    marginTop: 0,
  },

  bannerImage: {
    width: '100%',
    height: 240,
  },

  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFD9A0',
    letterSpacing: 2,
  },

  subtitle: {
    fontSize: 28,
    fontWeight: '500',
    color: '#FFD9A0',
    marginTop: -6,
  },

  btn: {
    marginTop: 15,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  btnText: {
    color: 'white',
    fontWeight: '600',
  },
});
