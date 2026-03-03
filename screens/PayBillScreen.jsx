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
  Dimensions,
} from 'react-native';
import { ChevronLeft, Tag, Sparkles } from 'lucide-react-native';
import { ThemeContext } from '../App';
import LinearGradient from 'react-native-linear-gradient';

const PURPLE = '#8F3AFF';
const DARK_PURPLE = '#5800AB';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PayBillScreen({ route, navigation }) {
  const { restaurant } = route.params || {};
  const { colors } = useContext(ThemeContext);

  const [amount, setAmount] = useState('0.00');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const numeric = useMemo(() => Number(amount.replace(/,/g, '')) || 0, [amount]);
  
  // Calculate discount and final amount
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'flat') {
      return appliedCoupon.value;
    } else if (appliedCoupon.type === 'percent') {
      return (numeric * appliedCoupon.value) / 100;
    }
    return 0;
  }, [appliedCoupon, numeric]);

  const finalAmount = useMemo(() => Math.max(0, numeric - discount), [numeric, discount]);
  const canProceed = numeric > 0;

  // theme tokens (keep UI same, just themed)
  const BG = colors.background;
  const BLACK = colors.text;
  const MUTED = colors.subtitle;
  const BORDER = colors.border;
  const CARD = colors.card;

  // Sample coupons for validation
  const availableCoupons = {
    'SAVE250': { type: 'flat', value: 250, description: 'Flat ₹250 OFF' },
    'SAVE20': { type: 'percent', value: 20, description: '20% OFF up to ₹5000' },
    'PASS10': { type: 'percent', value: 10, description: '10% OFF on dining' },
  };

  function applyCoupon() {
    const code = couponCode.toUpperCase().trim();
    if (availableCoupons[code]) {
      setAppliedCoupon(availableCoupons[code]);
    } else {
      alert('Invalid coupon code');
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode('');
  }

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
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[DARK_PURPLE, PURPLE, PURPLE]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <SafeAreaView>
          <View style={styles.header}>
            <Pressable
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft size={22} color="#fff" />
            </Pressable>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {restaurant?.name || "AB's - Absolute Barbecues"}
              </Text>
              <Text style={styles.subtitle}>
                {restaurant?.area ? `${restaurant.area}, ${restaurant.city}` : 'ECIL, Secunderabad'}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 120, backgroundColor: '#F5F5F7' }}>
        {/* Distance warning pill */}
        <View style={styles.warnPill}>
          <Text style={styles.warnStrong}>
            You’re 9.3 km away from this restaurant{'\n'}
          </Text>
          <Text style={styles.warnSub}>Please ensure you’re paying at the correct outlet</Text>
        </View>

        {/* Enter bill amount */}
        <Text style={styles.sectionTitle}>Enter your bill amount</Text>

        <View style={styles.amountWrap}>
          <View style={styles.amountRow}>
            <Text style={styles.rupee}>₹</Text>
            <TextInput
              value={amount}
              onChangeText={onChangeAmount}
              keyboardType="decimal-pad"
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#999"
            />
          </View>

          {/* Cashback strip */}
          <LinearGradient
            colors={['#E8F5E9', '#C8E6C9']}
            style={styles.cashbackStrip}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Sparkles size={18} color="#4CAF50" />
            <Text style={styles.cashStrong}>Get extra 10% cashback</Text>
            <Text style={styles.cashSub}> on your dining bill</Text>
          </LinearGradient>
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

        {/* Coupon Code Section */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Apply Coupon Code
        </Text>

        {appliedCoupon ? (
          <LinearGradient
            colors={['#E8F5E9', '#C8E6C9']}
            style={styles.appliedCouponCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.appliedCouponCode, { color: '#2E7D32' }]}>
                {couponCode.toUpperCase()}
              </Text>
              <Text style={[styles.appliedCouponDesc, { color: '#388E3C' }]}>
                {appliedCoupon.description}
              </Text>
              <Text style={[styles.discountText, { color: '#1B5E20' }]}>
                You saved ₹{discount.toFixed(2)}!
              </Text>
            </View>
            <Pressable onPress={removeCoupon} style={styles.removeCouponBtn}>
              <Text style={{ color: '#C62828', fontWeight: '700' }}>Remove</Text>
            </Pressable>
          </LinearGradient>
        ) : (
          <View style={styles.couponInputWrap}>
            <Tag size={20} color="#666" />
            <TextInput
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder="Enter coupon code"
              placeholderTextColor="#999"
              style={styles.couponInput}
              autoCapitalize="characters"
            />
            <Pressable 
              onPress={applyCoupon}
              disabled={!couponCode.trim()}
            >
              <LinearGradient
                colors={couponCode.trim() ? [DARK_PURPLE, PURPLE] : ['#E0E0E0', '#BDBDBD']}
                style={styles.applyBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.applyBtnText}>
                  Apply
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}

        {/* Bill Summary */}
        {numeric > 0 && (
          <View style={[styles.summaryCard, { marginTop: 24 }]}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Bill Amount</Text>
              <Text style={styles.summaryValue}>₹{numeric.toFixed(2)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: '#4CAF50' }]}>Discount</Text>
                <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>- ₹{discount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>Total Payable</Text>
              <Text style={[styles.summaryTotal, { color: PURPLE }]}>₹{finalAmount.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.ctaBar}>
        <Pressable
          disabled={!canProceed}
          onPress={() => {
            navigation.navigate('PaymentMethod', {
              amount: finalAmount,
              discount: discount,
              originalAmount: numeric,
              restaurant: restaurant,
            });
          }}
        >
          <LinearGradient
            colors={canProceed ? [DARK_PURPLE, PURPLE] : ['#BDBDBD', '#9E9E9E']}
            style={styles.ctaBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>
              Proceed to Payment
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  title: { 
    fontSize: 20, 
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: { 
    marginTop: 2, 
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },

  // keep this pill exactly as it is (brand warning)
  warnPill: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#8B3E2A',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  warnStrong: { 
    color: '#fff', 
    fontWeight: '800',
    fontSize: 14,
  },
  warnSub: { 
    color: '#F3EAE7', 
    marginTop: 2, 
    fontWeight: '600',
    fontSize: 13,
  },

  sectionTitle: {
    marginTop: 20,
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },

  amountWrap: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  amountRow: {
    minHeight: 90,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  rupee: { 
    fontSize: 40, 
    fontWeight: '900', 
    marginRight: 8,
    color: '#1A1A1A',
  },
  amountInput: {
    flex: 1,
    fontSize: 40,
    fontWeight: '800',
    color: '#1A1A1A',
  },

  cashbackStrip: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cashStrong: { 
    fontWeight: '800',
    color: '#2E7D32',
    fontSize: 14,
  },
  cashSub: { 
    fontWeight: '600',
    color: '#388E3C',
    fontSize: 13,
  },

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

  couponInputWrap: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  couponInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 8,
    color: '#1A1A1A',
    textTransform: 'uppercase',
  },
  applyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  appliedCouponCard: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  appliedCouponCode: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
    color: '#1B5E20',
  },
  appliedCouponDesc: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2E7D32',
  },
  discountText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
  },
  removeCouponBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  summaryCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  summaryDivider: {
    height: 1.5,
    marginVertical: 12,
    backgroundColor: '#E0E0E0',
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A1A1A',
  },

  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  ctaBtn: {
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { 
    fontSize: 17, 
    fontWeight: '800',
    color: '#fff',
  },
});
