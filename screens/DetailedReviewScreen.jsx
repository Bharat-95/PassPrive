import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { launchImageLibrary } from 'react-native-image-picker';
import { Utensils, CupSoda, HandHelping, Lamp, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DetailedReviewScreen({ navigation, route }) {
  const { restaurant, rating: initialRating } = route.params;

  const [rating, setRating] = useState(initialRating);
  const [reviewText, setReviewText] = useState('');
  const [selected, setSelected] = useState([]);
  const [photos, setPhotos] = useState([]);

  const confettiRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      confettiRef.current?.start();
    }, 300);
  }, []);

  const IMPRESS_OPTIONS = ['Food', 'Beverages', 'Service', 'Ambience'];

  const toggleSelect = item => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  // Pick images
  const pickImage = async () => {
    const result = await launchImageLibrary({
      selectionLimit: 5,
      mediaType: 'photo',
    });

    if (!result.didCancel && result.assets) {
      setPhotos([...photos, ...result.assets]);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X size={28} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>{restaurant.name}</Text>
      </View>

      {/* MAIN SCROLL AREA */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 220 }}
      >
        {/* EXPERIENCE CARD */}
        <View style={styles.experienceCard}>
          <Text style={styles.experienceTitle}>My experience was good</Text>

          {/* STAR RATING */}
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Pressable key={i} onPress={() => setRating(i + 1)}>
                <Text style={[styles.star, i < rating && styles.starActive]}>
                  ★
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.emoji}>😍</Text>
        </View>

        {/* REVIEW BOX */}
        <View style={styles.reviewBox}>
          <Text style={styles.sectionTitle}>
            Add a review for the restaurant
          </Text>

          <TextInput
            placeholder="Write here"
            style={styles.textArea}
            multiline
            value={reviewText}
            onChangeText={setReviewText}
          />
        </View>

        {/* ADD PHOTOS */}
        <Pressable style={styles.photoBox} onPress={pickImage}>
          <Text style={styles.photoIcon}>📷＋</Text>
          <Text style={styles.photoText}>Add photos here</Text>
        </Pressable>

        {/* DISPLAY IMAGES */}
        {photos.length > 0 && (
          <ScrollView horizontal style={{ marginLeft: 16, marginTop: 10 }}>
            {photos.map((p, index) => (
              <Image
                key={index}
                source={{ uri: p.uri }}
                style={styles.selectedPhoto}
              />
            ))}
          </ScrollView>
        )}

        {/* WHAT IMPRESSED YOU */}
        <View style={styles.impressBox}>
          <Text style={styles.sectionTitle}>What impressed you?</Text>
          <Text style={styles.sectionSub}>Select all that apply</Text>

          {IMPRESS_OPTIONS.map(item => (
            <Pressable
              key={item}
              style={styles.optionRow}
              onPress={() => toggleSelect(item)}
            >
              <View style={styles.optionLeft}>
                {/* ICONS USING LUCIDE */}
                {item === 'Food' && (
                  <Utensils
                    size={22}
                    color="#000"
                    style={styles.optionIconFix}
                  />
                )}
                {item === 'Beverages' && (
                  <CupSoda
                    size={22}
                    color="#000"
                    style={styles.optionIconFix}
                  />
                )}
                {item === 'Service' && (
                  <HandHelping
                    size={22}
                    color="#000"
                    style={styles.optionIconFix}
                  />
                )}
                {item === 'Ambience' && (
                  <Lamp size={22} color="#000" style={styles.optionIconFix} />
                )}

                <Text style={styles.optionLabel}>{item}</Text>
              </View>

              {/* CHECKBOX */}
              <View
                style={[
                  styles.checkbox,
                  selected.includes(item) && styles.checkboxActive,
                ]}
              >
                {selected.includes(item) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* STICKY BOTTOM BUTTONS */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.continueBtnSticky}>
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>

        <Pressable style={styles.submitBtnSticky}>
          <Text style={styles.submitTextSticky}>Submit</Text>
        </Pressable>
      </View>

      {/* CONFETTI ALWAYS ON TOP */}
      <ConfettiCannon
        count={80}
        fadeOut={true}
        autoStart={false}
        ref={confettiRef}
        origin={{ x: width / 2, y: -20 }}
        style={{ position: 'absolute', zIndex: 9999 }}
      />
    </View>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  closeBtn: { padding: 8, marginRight: 10 },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  /* EXPERIENCE CARD */
  experienceCard: {
    marginTop: 10,
    marginHorizontal: 16,
    backgroundColor: '#F8F8F8',
    padding: 18,
    borderRadius: 14,
  },

  experienceTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },

  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },

  star: { fontSize: 34, color: '#d1d1d1' },
  starActive: { color: '#FFC107' },

  emoji: {
    fontSize: 24,
    position: 'absolute',
    right: 14,
    top: 16,
  },

  /* REVIEW BOX */
  reviewBox: { marginTop: 20, marginHorizontal: 16 },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },

  textArea: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
  },

  /* ADD PHOTOS */
  photoBox: {
    marginTop: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    borderStyle: 'dashed',
  },

  photoIcon: { fontSize: 24, marginBottom: 6 },
  photoText: { fontSize: 15, color: '#555' },

  selectedPhoto: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },

  /* IMPRESS SECTION */
  impressBox: {
    marginTop: 22,
    marginHorizontal: 16,
    paddingBottom: 30,
  },

  sectionSub: {
    fontSize: 13,
    color: '#777',
    marginBottom: 12,
  },

  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },

  optionLabel: { fontSize: 16 },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#AAA',
  },

  checkboxActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },

  /* STICKY BOTTOM BAR */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderColor: '#EEE',
  },

  continueBtnSticky: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 40,
  },

  continueText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  submitBtnSticky: {
    marginTop: 12,
    alignSelf: 'center',
  },

  submitTextSticky: {
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionIconFix: {
    marginRight: 12,
  },

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#AAA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxActive: {
    backgroundColor: '#4B23FF',
    borderColor: '#4B23FF',
  },

  checkmark: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
