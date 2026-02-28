import React, { useMemo, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { Users, ChevronDown, ChevronLeft, Bell } from 'lucide-react-native';
import { ThemeContext } from '../App';
import BookGuestsModal from '../components/BookGuestsModal';
import supabase from '../supabase'; // ✅ add this (your RN supabase client)

const PURPLE = '#4B23FF';

export default function BookTableScreen({ route, navigation }) {
  const params = route?.params || {};
  const { restaurant, guests: initialGuests } = params;

  const { colors } = useContext(ThemeContext);

  const [guests, setGuests] = useState(initialGuests || 2);
  const [showGuestsModal, setShowGuestsModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState('13 Sat');
  const [meal, setMeal] = useState('Lunch');
  const [selectedTime, setSelectedTime] = useState(null);
  const [optionSelected, setOptionSelected] = useState(false);

  const [showAllSlots, setShowAllSlots] = useState(false);

  const dates = useMemo(
    () => [
      { month: 'DEC', label: '12', sub: 'Fri' },
      { month: 'DEC', label: '13', sub: 'Sat' },
      { month: 'DEC', label: '14', sub: 'Sun' },
      { month: 'DEC', label: '15', sub: 'Mon' },
      { month: 'DEC', label: '16', sub: 'Tue' },
      { month: 'DEC', label: '17', sub: 'Wed' },
    ],
    [],
  );

  const lunchSlots = [
    '12:00 PM',
    '12:30 PM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM',
  ];

  const dinnerSlots = [
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
    '9:30 PM',
    '10:00 PM',
  ];

  const timeSlots = meal === 'Lunch' ? lunchSlots : dinnerSlots;
  const visibleSlots = showAllSlots ? timeSlots : timeSlots.slice(0, 6);
  const canProceed = Boolean(selectedDate && selectedTime && optionSelected);
  const showOfferBanner = meal === 'Dinner';

  // theme-driven tokens (no UI/functionality changes)
  const BG = colors.background;
  const BLACK = colors.text;
  const MUTED = colors.subtitle;
  const BORDER = colors.border;
  const CARD = colors.card;

  // ✅ booking payload (reused for both routes)
  const bookingPayload = {
    restaurant,
    guests,
    selectedDate,
    meal,
    selectedTime,
    option: {
      type: 'Regular table reservation',
      coverChargeRequired: false,
    },
  };

  // ✅ Proceed: check session first
  const onProceed = async () => {
    if (!canProceed) return;

    const { data, error } = await supabase.auth.getSession();
    const session = data?.session;

    // If you ever get an error, treat as logged out
    if (error || !session) {
      navigation.navigate('Login', {
        redirectTo: 'ReviewRestaurantBooking',
        redirectParams: bookingPayload,
      });
      return;
    }

    // Logged in
    navigation.navigate('ReviewRestaurantBooking', bookingPayload);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: BG }]}>
        <Pressable
          onPress={() => navigation?.goBack?.()}
          style={[styles.backBtn, { backgroundColor: CARD }]}
        >
          <ChevronLeft size={20} color={BLACK} />
        </Pressable>

        <View>
          <Text style={[styles.title, { color: BLACK }]}>Book a table</Text>
          {!!restaurant?.name && (
            <Text style={[styles.subtitle, { color: MUTED }]}>
              {restaurant.name}
            </Text>
          )}
        </View>
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: BG }]}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Guests selector */}
        <Pressable
          onPress={() => setShowGuestsModal(true)}
          style={[
            styles.guestsBox,
            { borderColor: BORDER, backgroundColor: BG },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Users size={18} color={BLACK} />
            <Text style={[styles.guestsText, { color: BLACK }]}>
              Select number of guests
            </Text>
          </View>

          <View style={[styles.guestsValue, { backgroundColor: CARD }]}>
            <Text style={[styles.guestsValueText, { color: BLACK }]}>
              {guests}
            </Text>
            <ChevronDown size={18} color={BLACK} />
          </View>
        </Pressable>

        {/* Offer banner */}
        {showOfferBanner && (
          <Pressable
            style={[
              styles.offerBanner,
              {
                backgroundColor: CARD,
                borderColor: BORDER,
              },
            ]}
          >
            <View style={[styles.offerBadge, { backgroundColor: PURPLE }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerStrong, { color: PURPLE }]}>
                Flat 10% OFF
              </Text>
              <Text style={[styles.bannerSub, { color: BLACK }]}>
                available from 9:00 PM
              </Text>
            </View>
            <ChevronDown
              size={18}
              color={BLACK}
              style={{ transform: [{ rotate: '270deg' }] }}
            />
          </Pressable>
        )}

        <Text style={[styles.sectionTitle, { color: BLACK }]}>
          Select day and time
        </Text>

        {/* Date row */}
        <View style={styles.dateRow}>
          <View style={[styles.monthPill, { backgroundColor: CARD }]}>
            <Text style={[styles.monthText, { color: MUTED }]}>DEC</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {dates.map(d => {
              const key = `${d.label} ${d.sub}`;
              const active = selectedDate === key;

              return (
                <Pressable
                  key={key}
                  onPress={() => {
                    setSelectedDate(key);
                    setSelectedTime(null);
                    setOptionSelected(false);
                  }}
                  style={[
                    styles.dayChip,
                    { borderColor: BORDER, backgroundColor: BG },
                    active && { backgroundColor: BLACK, borderColor: BLACK },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayChipDate,
                      { color: BLACK },
                      active && { color: BG },
                    ]}
                  >
                    {d.label}
                  </Text>
                  <Text
                    style={[
                      styles.dayChipSub,
                      { color: MUTED },
                      active && { color: BG },
                    ]}
                  >
                    {d.sub}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Meal toggle */}
        <View style={styles.mealToggleRow}>
          {['Lunch', 'Dinner'].map(m => {
            const active = meal === m;
            return (
              <Pressable
                key={m}
                style={[
                  styles.mealChip,
                  { borderColor: BORDER },
                  active
                    ? { backgroundColor: BLACK, borderColor: BLACK }
                    : { backgroundColor: CARD },
                ]}
                onPress={() => {
                  setMeal(m);
                  setSelectedTime(null);
                  setOptionSelected(false);
                  setShowAllSlots(false);
                }}
              >
                <Text
                  style={[styles.mealChipText, { color: active ? BG : BLACK }]}
                >
                  {m}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Slots grid */}
        <View style={styles.grid}>
          {visibleSlots.map(slot => {
            const active = selectedTime === slot;
            const isDinnerOffer = meal === 'Dinner' && slot === '9:00 PM';
            const isLunch = meal === 'Lunch';

            return (
              <Pressable
                key={slot}
                onPress={() => {
                  setSelectedTime(slot);
                  setOptionSelected(false);
                }}
                style={[
                  styles.slot,
                  { borderColor: BORDER, backgroundColor: BG },
                  active && { backgroundColor: CARD, borderColor: BORDER },
                ]}
              >
                <Text style={[styles.slotText, { color: BLACK }]}>{slot}</Text>
                {isDinnerOffer && (
                  <Text style={[styles.offerText, { color: PURPLE }]}>
                    10% OFF
                  </Text>
                )}
                {isLunch && (
                  <Text style={[styles.lunchOfferText, { color: PURPLE }]}>
                    1 offer
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* View all slots */}
        <Pressable
          style={styles.viewAllRow}
          onPress={() => setShowAllSlots(s => !s)}
        >
          <Text style={[styles.viewAllText, { color: BLACK }]}>
            {showAllSlots ? 'Show fewer slots' : 'View all slots'}
          </Text>
          <ChevronDown
            size={16}
            color={BLACK}
            style={{
              transform: [{ rotate: showAllSlots ? '180deg' : '0deg' }],
            }}
          />
        </Pressable>

        {/* Options */}
        {selectedTime && (
          <>
            <Text
              style={[styles.sectionTitle, { marginTop: 14, color: BLACK }]}
            >
              1 option available
            </Text>

            <Pressable
              onPress={() => setOptionSelected(p => !p)}
              style={[
                styles.optionCard,
                { borderColor: BORDER, backgroundColor: BG },
              ]}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                <Bell size={18} color={BLACK} />
                <View>
                  <Text style={[styles.optionTitle, { color: BLACK }]}>
                    Regular table reservation
                  </Text>
                  <Text style={[styles.optionSub, { color: MUTED }]}>
                    No cover charge required
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.radio,
                  { borderColor: BLACK },
                  optionSelected && { borderColor: PURPLE },
                ]}
              >
                {optionSelected && (
                  <View
                    style={[styles.radioDot, { backgroundColor: PURPLE }]}
                  />
                )}
              </View>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={[styles.ctaBar, { backgroundColor: BG, borderTopColor: BORDER }]}
      >
        <Pressable
          disabled={!canProceed}
          onPress={onProceed} // ✅ added
          style={[
            styles.ctaBtn,
            !canProceed
              ? { backgroundColor: CARD }
              : { backgroundColor: BLACK },
          ]}
        >
          <Text
            style={[
              styles.ctaText,
              { color: canProceed ? BG : colors.mutedText ?? MUTED },
            ]}
          >
            Proceed to book
          </Text>
        </Pressable>
      </View>

      {/* Guests modal */}
      <BookGuestsModal
        visible={showGuestsModal}
        onClose={() => setShowGuestsModal(false)}
        onContinue={count => {
          setGuests(count);
          setShowGuestsModal(false);
        }}
      />
    </SafeAreaView>
  );
}

const SP = 30;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SP,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { marginTop: 2, fontSize: 14 },

  guestsBox: {
    marginTop: 0,
    marginBottom: SP,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  guestsText: { fontSize: 16, fontWeight: '600' },
  guestsValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 10,
  },
  guestsValueText: { fontSize: 16, fontWeight: '700' },

  offerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    marginBottom: SP,
  },
  offerBadge: {
    width: 20,
    height: 20,
    borderRadius: 4,
    opacity: 0.85,
  },
  bannerStrong: { fontWeight: '800' },
  bannerSub: { marginTop: 2 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 12,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: SP,
  },
  monthPill: {
    width: 46,
    height: 68,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  monthText: { fontWeight: '800', letterSpacing: 1 },

  dayChip: {
    width: 64,
    height: 68,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipDate: { fontSize: 18, fontWeight: '800' },
  dayChipSub: { marginTop: 4, fontWeight: '700' },

  mealToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SP,
  },
  mealChip: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  mealChipText: { fontWeight: '800' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginBottom: 14,
  },
  slot: {
    width: '31%',
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  slotText: { fontWeight: '700' },
  offerText: { marginTop: 4, fontSize: 12, fontWeight: '800' },
  lunchOfferText: { marginTop: 4, fontSize: 12, fontWeight: '800' },

  viewAllRow: {
    marginTop: 6,
    marginBottom: SP,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 4,
  },
  viewAllText: { fontWeight: '700' },

  optionCard: {
    marginTop: 10,
    marginBottom: SP,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTitle: { fontSize: 16, fontWeight: '800' },
  optionSub: { marginTop: 4 },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  ctaBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { fontSize: 16, fontWeight: '800' },
});
