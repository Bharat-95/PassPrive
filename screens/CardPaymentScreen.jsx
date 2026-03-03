import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ChevronLeft, CreditCard } from 'lucide-react-native';
import { ThemeContext } from '../App';

const PURPLE = '#4B23FF';

export default function CardPaymentScreen({ route, navigation }) {
  const { amount, discount, originalAmount, restaurant } = route.params || {};
  const { colors } = useContext(ThemeContext);

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const BG = colors.background;
  const BLACK = colors.text;
  const MUTED = colors.subtitle;
  const BORDER = colors.border;
  const CARD = colors.card;

  function formatCardNumber(text) {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  }

  function handleCardNumberChange(text) {
    const cleaned = text.replace(/\s/g, '');
    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
      setCardNumber(formatCardNumber(cleaned));
    }
  }

  function handleExpiryChange(text) {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    if (cleaned.length <= 5) {
      setExpiryDate(cleaned);
    }
  }

  function handleCvvChange(text) {
    if (text.length <= 3 && /^\d*$/.test(text)) {
      setCvv(text);
    }
  }

  function isFormValid() {
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      cardName.trim().length > 2 &&
      expiryDate.length === 5 &&
      cvv.length === 3
    );
  }

  function handlePayment() {
    if (!isFormValid()) {
      alert('Please fill all card details correctly');
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      navigation.navigate('PaymentSuccess', {
        amount,
        method: 'Card',
        restaurant,
        cardLastFour: cardNumber.replace(/\s/g, '').slice(-4),
      });
    }, 2000);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: BG, borderBottomColor: BORDER }]}>
        <Pressable
          style={[styles.backBtn, { backgroundColor: CARD }]}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={20} color={BLACK} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: BLACK }]}>Card Payment</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Amount Display */}
        <View style={[styles.amountBanner, { backgroundColor: PURPLE }]}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amountValue}>₹{amount?.toFixed(2) || '0.00'}</Text>
        </View>

        {/* Card Preview */}
        <View style={[styles.cardPreview, { backgroundColor: BLACK }]}>
          <View style={styles.cardChip} />
          <Text style={styles.cardNumberPreview}>
            {cardNumber || '•••• •••• •••• ••••'}
          </Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardLabel}>CARD HOLDER</Text>
              <Text style={styles.cardInfo}>
                {cardName.toUpperCase() || 'YOUR NAME'}
              </Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>EXPIRES</Text>
              <Text style={styles.cardInfo}>{expiryDate || 'MM/YY'}</Text>
            </View>
          </View>
          <CreditCard size={32} color="rgba(255,255,255,0.2)" style={styles.cardIcon} />
        </View>

        {/* Card Details Form */}
        <Text style={[styles.sectionTitle, { color: BLACK }]}>Enter Card Details</Text>

        {/* Card Number */}
        <View style={[styles.inputGroup, { borderColor: BORDER, backgroundColor: BG }]}>
          <Text style={[styles.inputLabel, { color: MUTED }]}>Card Number</Text>
          <TextInput
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={MUTED}
            keyboardType="number-pad"
            style={[styles.input, { color: BLACK }]}
            maxLength={19}
          />
        </View>

        {/* Card Holder Name */}
        <View style={[styles.inputGroup, { borderColor: BORDER, backgroundColor: BG }]}>
          <Text style={[styles.inputLabel, { color: MUTED }]}>Cardholder Name</Text>
          <TextInput
            value={cardName}
            onChangeText={setCardName}
            placeholder="John Doe"
            placeholderTextColor={MUTED}
            autoCapitalize="words"
            style={[styles.input, { color: BLACK }]}
          />
        </View>

        {/* Expiry & CVV Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput, { borderColor: BORDER, backgroundColor: BG }]}>
            <Text style={[styles.inputLabel, { color: MUTED }]}>Expiry Date</Text>
            <TextInput
              value={expiryDate}
              onChangeText={handleExpiryChange}
              placeholder="MM/YY"
              placeholderTextColor={MUTED}
              keyboardType="number-pad"
              style={[styles.input, { color: BLACK }]}
              maxLength={5}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfInput, { borderColor: BORDER, backgroundColor: BG }]}>
            <Text style={[styles.inputLabel, { color: MUTED }]}>CVV</Text>
            <TextInput
              value={cvv}
              onChangeText={handleCvvChange}
              placeholder="123"
              placeholderTextColor={MUTED}
              keyboardType="number-pad"
              secureTextEntry
              style={[styles.input, { color: BLACK }]}
              maxLength={3}
            />
          </View>
        </View>

        {/* Security Note */}
        <View style={[styles.securityNote, { backgroundColor: CARD }]}>
          <Text style={[styles.securityText, { color: MUTED }]}>
            🔒 Your card details are secure and encrypted. We don't store your CVV.
          </Text>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={[styles.ctaBar, { backgroundColor: BG, borderTopColor: BORDER }]}>
        <Pressable
          disabled={!isFormValid() || processing}
          style={[
            styles.payBtn,
            {
              backgroundColor: isFormValid() && !processing ? PURPLE : CARD,
            },
          ]}
          onPress={handlePayment}
        >
          {processing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={[
                styles.payBtnText,
                { color: isFormValid() ? '#fff' : MUTED },
              ]}
            >
              Pay ₹{amount?.toFixed(2) || '0.00'}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  amountBanner: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
  },
  cardPreview: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 24,
    borderRadius: 20,
    minHeight: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  cardChip: {
    width: 50,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    marginBottom: 30,
  },
  cardNumberPreview: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 24,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  cardInfo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  cardIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  sectionTitle: {
    marginTop: 32,
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  inputGroup: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 0,
  },
  securityNote: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  securityText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  payBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    fontSize: 18,
    fontWeight: '800',
  },
});
