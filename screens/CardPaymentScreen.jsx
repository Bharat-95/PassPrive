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
  Dimensions,
} from 'react-native';
import { ChevronLeft, CreditCard } from 'lucide-react-native';
import { ThemeContext } from '../App';
import LinearGradient from 'react-native-linear-gradient';

const PURPLE = '#8F3AFF';
const DARK_PURPLE = '#5800AB';

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
            <Text style={styles.headerTitle}>Card Payment</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={{ backgroundColor: '#F5F5F7' }} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Amount Display */}
        <LinearGradient
          colors={[DARK_PURPLE, PURPLE]}
          style={styles.amountBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amountValue}>₹{amount?.toFixed(2) || '0.00'}</Text>
        </LinearGradient>

        {/* Card Preview */}
        <LinearGradient
          colors={['#2C2C2C', '#1A1A1A']}
          style={styles.cardPreview}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
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
        </LinearGradient>

        {/* Card Details Form */}
        <Text style={styles.sectionTitle}>Enter Card Details</Text>

        {/* Card Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Card Number</Text>
          <TextInput
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            style={styles.input}
            maxLength={19}
          />
        </View>

        {/* Card Holder Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Cardholder Name</Text>
          <TextInput
            value={cardName}
            onChangeText={setCardName}
            placeholder="John Doe"
            placeholderTextColor="#999"
            autoCapitalize="words"
            style={styles.input}
          />
        </View>

        {/* Expiry & CVV Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.inputLabel}>Expiry Date</Text>
            <TextInput
              value={expiryDate}
              onChangeText={handleExpiryChange}
              placeholder="MM/YY"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              style={styles.input}
              maxLength={5}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              value={cvv}
              onChangeText={handleCvvChange}
              placeholder="123"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              secureTextEntry
              style={styles.input}
              maxLength={3}
            />
          </View>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityText}>
            🔒 Your card details are secure and encrypted. We don't store your CVV.
          </Text>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.ctaBar}>
        <Pressable
          disabled={!isFormValid() || processing}
          onPress={handlePayment}
        >
          <LinearGradient
            colors={isFormValid() && !processing ? [DARK_PURPLE, PURPLE] : ['#E0E0E0', '#BDBDBD']}
            style={styles.payBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {processing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payBtnText}>
                Pay ₹{amount?.toFixed(2) || '0.00'}
              </Text>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  amountBanner: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  amountValue: {
    fontSize: 44,
    fontWeight: '900',
    color: '#fff',
  },
  cardPreview: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 26,
    borderRadius: 24,
    minHeight: 210,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  cardChip: {
    width: 52,
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    marginBottom: 32,
  },
  cardNumberPreview: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 3,
    marginBottom: 28,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
    letterSpacing: 1,
  },
  cardInfo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  cardIcon: {
    position: 'absolute',
    right: 24,
    top: 24,
  },
  sectionTitle: {
    marginTop: 32,
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  inputGroup: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 18,
    padding: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#666',
  },
  input: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
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
    marginTop: 28,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
  },
  securityText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
    color: '#2E7D32',
  },
  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F5F5F7',
  },
  payBtn: {
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  payBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
});
