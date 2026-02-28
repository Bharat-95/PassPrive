import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

export default function PayWithEaseCard() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <View style={styles.line} />
        <Text style={styles.heading}>PAY WITH EASE</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.card}>
        <Image
          source={{ uri: 'https://via.placeholder.com/300x180.png?text=0%25+EMI' }}
          style={styles.image}
        />

        <Text style={styles.text1}>Split your payments easily with</Text>
        <Text style={styles.text2}>✦ No Cost EMI ✦</Text>

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Know more ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30,
    alignItems: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#333',
  },

  card: {
    width: width * 0.9,
    backgroundColor: '#5fc783ff',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 15,
  },

  text1: {
    fontSize: 15,
    color: '#333',
  },

  text2: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 6,
  },

  btn: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },

  btnText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});
