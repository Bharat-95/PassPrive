import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  Dimensions,
} from 'react-native';
import { ThemeContext } from '../App';

const { width } = Dimensions.get('window');

const ITEM_WIDTH = 56; // keep tight spacing
const GUESTS = Array.from({ length: 15 }, (_, i) => i + 1);

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function BookGuestsModal({ visible, onClose, onContinue }) {
  const { colors } = useContext(ThemeContext);

  const [guests, setGuests] = useState(2);
  const listRef = useRef(null);

  // reduce side spacing
  const SIDE_PADDING = 16;
  const SPACER = Math.max(0, (width - ITEM_WIDTH) / 2 - SIDE_PADDING);

  const scrollToGuest = (value, animated = true) => {
    const index = clamp(value - 1, 0, GUESTS.length - 1);
    try {
      listRef.current?.scrollToIndex({ index, animated });
    } catch (e) {
      // ignore
    }
  };

  // avoid FlatList initialScrollIndex crash + ensure correct position on open
  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => scrollToGuest(guests, false));
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.wrapper, { backgroundColor: 'rgba(0,0,0,0.45)' }]}>
        <Pressable style={styles.overlay} onPress={onClose} />

        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <Text style={[styles.title, { color: colors.text }]}>
            Select number of guests
          </Text>

          {/* SWIPE + TAP NUMBER PICKER */}
          <FlatList
            ref={listRef}
            horizontal
            data={GUESTS}
            keyExtractor={item => item.toString()}
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: SPACER }}
            getItemLayout={(_, index) => ({
              length: ITEM_WIDTH,
              offset: ITEM_WIDTH * index,
              index,
            })}
            onMomentumScrollEnd={e => {
              const index = clamp(
                Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH),
                0,
                GUESTS.length - 1,
              );
              setGuests(GUESTS[index]);
            }}
            renderItem={({ item }) => {
              const isActive = item === guests;

              return (
                <Pressable
                  onPress={() => {
                    setGuests(item); // ✅ select on tap
                    scrollToGuest(item, true); // ✅ also align to center
                  }}
                  style={styles.numberItem}
                >
                  <View
                    style={[
                      styles.numberPill,
                      {
                        borderColor: isActive ? colors.text : 'transparent',
                        backgroundColor: isActive
                          ? colors.background
                          : 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.numberText,
                        { color: colors.mutedText ?? colors.subtitle },
                        isActive && {
                          color: colors.text,
                          fontSize: 28,
                          fontWeight: '800',
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />

          <Pressable
            style={[
              styles.continueBtn,
              { backgroundColor: colors.text, borderColor: colors.border },
            ]}
            onPress={() => onContinue(guests)}
          >
            <Text style={[styles.continueText, { color: colors.background }]}>
              Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: { flex: 1 },

  container: {
    paddingTop: 12,
    paddingBottom: 24,
  },

  handle: {
    width: 44,
    height: 5,
    alignSelf: 'center',
    borderRadius: 3,
    marginBottom: 16,
    opacity: 0.9,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: 20,
    marginBottom: 18,
  },

  numberItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ✅ not round: "some rounded borders"
  numberPill: {
    width: 46,
    height: 44,
    borderRadius: 12, // <-- changed from circle to softly rounded rectangle
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },

  numberText: {
    fontSize: 22,
    fontWeight: '700',
  },

  continueBtn: {
    marginTop: 26,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    borderWidth: 1,
  },

  continueText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
