// screens/PayBillScreen.jsx
import React, { useMemo, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { ThemeContext } from '../App';

const PURPLE = '#4B23FF';

export default function PayBillScreen({ route, navigation }) {
  const { restaurant } = route.params || {};
  const { colors } = useContext(ThemeContext);

  const [amount, setAmount] = useState('0.00');

  const numeric = useMemo(() => Number(amount.replace(/,/g, '')) || 0, [amount]);
  const canProceed = numeric > 0;

  // theme tokens (keep UI same, just themed)
  const BG = colors.background;
  const BLACK = colors.text;
  const MUTED = colors.subtitle;
  const BORDER = colors.border;
  const CARD = colors.card;

  function onChangeAmount(txt) {
    const cleaned = txt.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    let next = parts[0];
    if (parts[1] !== undefined) next += '.' + parts[1].slice(0, 2);
    if (next === '' || next === '.') next = '0';
    const fixed = Number(next).toFixed(2);
    setAmount(fixed);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: BG }]}>
        <Pressable
          style={[styles.backBtn, { backgroundColor: CARD }]}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={20} color={BLACK} />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: BLACK }]}>
            {restaurant?.name || "AB's - Absolute Barbecues"}
          </Text>
          <Text style={[styles.subtitle, { color: MUTED }]}>
            {restaurant?.area ? `${restaurant.area}, ${restaurant.city}` : 'ECIL, Secunderabad'}
          </Text>
        </View>

        <View style={[styles.menuStub, { borderColor: BORDER, backgroundColor: BG }]} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Distance warning pill */}
        <View style={styles.warnPill}>
          <Text style={styles.warnStrong}>
            You’re 9.3 km away from this restaurant{'\n'}
          </Text>
          <Text style={styles.warnSub}>Please ensure you’re paying at the correct outlet</Text>
        </View>

        {/* Enter bill amount */}
        <Text style={[styles.sectionTitle, { color: BLACK }]}>Enter your bill amount</Text>

        <View style={[styles.amountWrap, { borderColor: BORDER, backgroundColor: BG }]}>
          <View style={styles.amountRow}>
            <Text style={[styles.rupee, { color: BLACK }]}>₹</Text>
            <TextInput
              value={amount}
              onChangeText={onChangeAmount}
              keyboardType="decimal-pad"
              style={[styles.amountInput, { color: BLACK }]}
              placeholder="0.00"
              placeholderTextColor={MUTED}
            />
          </View>

          {/* Cashback strip */}
          <Pressable
            style={[
              styles.cashbackStrip,
              { backgroundColor: CARD, borderTopColor: BORDER },
            ]}
          >
            <Text style={[styles.cashStrong, { color: PURPLE }]}>Get extra 10% cashback</Text>
            <Text style={[styles.cashSub, { color: BLACK }]}> on your dining bill</Text>
          </Pressable>
        </View>

        {/* Available Offers */}
        <Text style={[styles.sectionTitle, { marginTop: 24, color: BLACK }]}>
          Available Offers
        </Text>

        <View style={styles.offersGrid}>
          <View style={[styles.offerCard, { borderColor: BORDER, backgroundColor: BG }]}>
            <Text style={[styles.offerTitle, { color: BLACK }]}>Flat ₹250 OFF</Text>
            <View style={[styles.offerDivider, { backgroundColor: CARD }]} />
            <Text style={[styles.offerSub, { color: MUTED }]}>Pass benefit</Text>
          </View>

          <View style={[styles.offerCard, { borderColor: BORDER, backgroundColor: BG }]}>
            <Text style={[styles.offerTitle, { color: BLACK }]}>
              20% OFF up to ₹5000 on Solito
            </Text>
            <View style={[styles.offerDivider, { backgroundColor: CARD }]} />
            <Text style={[styles.offerSub, { color: MUTED }]}>
              and more with other banks
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.ctaBar, { backgroundColor: BG, borderTopColor: BORDER }]}>
        <Pressable
          disabled={!canProceed}
          style={[
            styles.ctaBtn,
            canProceed ? { backgroundColor: BLACK } : { backgroundColor: CARD },
          ]}
          onPress={() => {
            // handle proceed
          }}
        >
          <Text
            style={[
              styles.ctaText,
              { color: canProceed ? BG : (colors.mutedText ?? MUTED) },
            ]}
          >
            Proceed
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuStub: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
  },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { marginTop: 2, fontSize: 13 },

  // keep this pill exactly as it is (brand warning)
  warnPill: {
    marginHorizontal: 16,
    marginTop: 6,
    backgroundColor: '#8B3E2A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  warnStrong: { color: '#fff', fontWeight: '800' },
  warnSub: { color: '#F3EAE7', marginTop: 2, fontWeight: '600' },

  sectionTitle: {
    marginTop: 18,
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: '800',
  },

  amountWrap: {
    marginTop: 10,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  amountRow: {
    minHeight: 82,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  rupee: { fontSize: 34, fontWeight: '900', marginRight: 6 },
  amountInput: {
    flex: 1,
    fontSize: 34,
    fontWeight: '800',
  },

  cashbackStrip: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cashStrong: { fontWeight: '800' },
  cashSub: { fontWeight: '600' },

  offersGrid: {
    marginTop: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
  },
  offerCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  offerTitle: { fontWeight: '800' },
  offerDivider: {
    height: 34,
    marginVertical: 8,
    borderRadius: 8,
  },
  offerSub: { fontWeight: '700' },

  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
