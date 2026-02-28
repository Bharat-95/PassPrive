import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { Gem, Footprints, X, CheckCircle2 } from 'lucide-react-native';
import { ThemeContext } from '../App';

const { width, height } = Dimensions.get('window');

export default function AboutSection({ restaurant }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('highlight');
  const { colors } = useContext(ThemeContext);

  const translateY = useRef(new Animated.Value(height)).current;
  const scrollRef = useRef(null);

  const isDark = colors.background === '#0D0D0D';

  const openModal = type => {
    setModalType(type);
    setModalVisible(true);

    // Ensure starting page matches selected card
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        x: type === 'highlight' ? 0 : width,
        animated: false,
      });
    }, 20);

    Animated.timing(translateY, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const onScroll = e => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    setModalType(page === 0 ? 'highlight' : 'worth');
  };

  // Theme-only adjustments (no layout changes)
  const cardBg = colors.card;
  const cardText = colors.subtitle; // replaces #444
  const viewMoreColor = isDark ? '#B3B3B3' : '#6A6A6A';
  const overlayBg = 'rgba(0,0,0,0.33)';

  // Modal sheet background (keep same idea; make dark-friendly)
  const modalBg =
    modalType === 'highlight'
      ? isDark
        ? '#1A1710' // dark warm-gold tint
        : '#F8F3E6' // SOFT GOLD
      : isDark
      ? '#151225' // dark purple tint
      : '#F1EDFF'; // SOFT PURPLE

  const modalTitleColor = isDark ? colors.text : '#222';
  const modalContentColor = isDark ? colors.text : '#333';
  const closeIconColor = isDark ? colors.text : '#333';

  return (
    <>
      <View style={styles.container}>
        <Text style={[styles.aboutTitle, { color: colors.text }]}>
          About the restaurant
        </Text>

        <Text style={[styles.costText, { color: colors.subtitle }]}>
          ₹{restaurant.costForTwo} for two
        </Text>

        {/* SWIPEABLE CARDS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable
            style={[
              styles.card,
              {
                borderColor: '#9A7B1640',
                backgroundColor: cardBg,
              },
            ]}
            onPress={() => openModal('highlight')}
          >
            <View style={styles.cardHeader}>
              <Gem size={18} color="#9A7B16" />
              <Text style={[styles.cardTitle, { color: '#9A7B16' }]}>
                Restaurant highlights
              </Text>
            </View>

            <Text style={[styles.cardText, { color: cardText }]} numberOfLines={3}>
              {restaurant.highlights[0]}
            </Text>

            <Text style={[styles.viewMore, { color: viewMoreColor }]}>view more</Text>
          </Pressable>

          <Pressable
            style={[
              styles.card,
              {
                borderColor: '#4B23FF40',
                backgroundColor: cardBg,
              },
            ]}
            onPress={() => openModal('worth')}
          >
            <View style={styles.cardHeader}>
              <Footprints size={20} color="#4B23FF" />
              <Text style={[styles.cardTitle, { color: '#4B23FF' }]}>
                Why it’s worth a visit
              </Text>
            </View>

            <Text style={[styles.cardText, { color: cardText }]} numberOfLines={3}>
              {restaurant.worthVisit[0]}
            </Text>

            <Text style={[styles.viewMore, { color: viewMoreColor }]}>view more</Text>
          </Pressable>
        </ScrollView>

        {/* AVAILABLE FACILITIES */}
        <Text style={[styles.facilityTitle, { color: colors.text }]}>
          Available facilities
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <View style={styles.facilityColumns}>
            {Array.from(
              { length: Math.ceil(restaurant.facilities.length / 3) },
              (_, colIndex) => {
                const columnItems = restaurant.facilities.slice(
                  colIndex * 3,
                  colIndex * 3 + 3,
                );

                return (
                  <View key={colIndex} style={styles.facilityColumn}>
                    {columnItems.map((item, index) => (
                      <View key={index} style={styles.facilityItem}>
                        <CheckCircle2 size={18} color="#4B23FF" />
                        <Text style={[styles.facilityText, { color: colors.text }]}>
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              },
            )}
          </View>
        </ScrollView>
      </View>

      {/* MODAL SHEET */}
      <Modal visible={modalVisible} transparent animationType="none">
        <Pressable
          style={[styles.overlay, { backgroundColor: overlayBg }]}
          onPress={closeModal}
        />

        <Animated.View
          style={[
            styles.modalSheet,
            {
              transform: [{ translateY }],
              backgroundColor: modalBg,
            },
          ]}
        >
          {/* HEADER */}
          <View style={styles.modalHeader}>
            {modalType === 'highlight' ? (
              <Gem size={22} color={isDark ? '#C59D5F' : '#7A5A00'} />
            ) : (
              <Footprints size={22} color="#4B23FF" />
            )}

            <Text style={[styles.modalTitle, { color: modalTitleColor }]}>
              {modalType === 'highlight'
                ? 'Restaurant highlights'
                : 'Why it’s worth a visit'}
            </Text>

            <Pressable onPress={closeModal}>
              <X size={28} color={closeIconColor} />
            </Pressable>
          </View>

          {/* SWIPEABLE CONTENT */}
          <ScrollView
            horizontal
            pagingEnabled
            ref={scrollRef}
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
          >
            {/* PAGE 1 — Highlights */}
            <View style={{ width, paddingHorizontal: 20 }}>
              <Text style={[styles.modalContent, { color: modalContentColor }]}>
                {restaurant.highlights[0]}
              </Text>
            </View>

            {/* PAGE 2 — Worth visit */}
            <View style={{ width, paddingHorizontal: 20 }}>
              <Text style={[styles.modalContent, { color: modalContentColor }]}>
                {restaurant.worthVisit[0]}
              </Text>
            </View>
          </ScrollView>

          {/* BUTTON */}
          <Pressable style={styles.bottomButton} onPress={closeModal}>
            <Text style={styles.buttonText}>Got it</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { marginTop: 16 },

  aboutTitle: { fontSize: 19, fontWeight: '700' },

  costText: { fontSize: 15, color: '#333', marginBottom: 14 },

  card: {
    width: width * 0.78,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 14,
    backgroundColor: '#FFF',
  },

  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardText: { marginTop: 6, fontSize: 14, color: '#444' },
  viewMore: {
    marginTop: 8,
    color: '#6A6A6A',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  facilityTitle: {
    marginTop: 26,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 20,
  },

  facilityColumns: {
    flexDirection: 'row',
  },

  facilityColumn: {
    marginRight: 22, // gap between columns
  },

  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16, // gap between rows
    minWidth: width * 0.28, // keeps column width consistent
  },

  facilityText: {
    fontSize: 14,
    color: '#333',
  },

  /* MODAL */
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#00000055',
  },

  modalSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.55,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 22,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    flex: 1,
    marginLeft: 10,
    color: '#222',
  },

  modalContent: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    paddingBottom: 80,
    marginTop: 12,
  },

  bottomButton: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 40,
  },

  buttonText: {
    textAlign: 'center',
    fontSize: 17,
    color: '#FFF',
    fontWeight: '700',
  },
});
