import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { ChevronLeft, CreditCard, Smartphone, Building2, Wallet, CheckCircle2 } from 'lucide-react-native';
import { ThemeContext } from '../App';
import LinearGradient from 'react-native-linear-gradient';

const PURPLE = '#8F3AFF';
const DARK_PURPLE = '#5800AB';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PaymentMethodScreen({ route, navigation }) {
  const { amount, discount, originalAmount, restaurant } = route.params || {};
  const { colors } = useContext(ThemeContext);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processing, setProcessing] = useState(false);

  const BG = colors.background;
  const BLACK = colors.text;
  const MUTED = colors.subtitle;
  const BORDER = colors.border;
  const CARD = colors.card;

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
    },
    {
      id: 'upi',
      name: 'UPI / PhonePe',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building2,
      description: 'All major banks supported',
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: Wallet,
      description: 'Paytm, Amazon Pay, etc.',
    },
  ];

  function handlePaymentMethod(methodId) {
    setSelectedMethod(methodId);
    setProcessing(true);
    
    if (methodId === 'card') {
      setProcessing(false);
      navigation.navigate('CardPayment', {
        amount,
        discount,
        originalAmount,
        restaurant,
      });
    } else {
      // Simulate other payment methods
      setTimeout(() => {
        setProcessing(false);
        navigation.navigate('PaymentSuccess', {
          amount,
          method: methodId === 'upi' ? 'UPI' : methodId === 'netbanking' ? 'Net Banking' : 'Wallet',
          restaurant,
        });
      }, 2000);
    }
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
            <Text style={styles.headerTitle}>Select Payment</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={{ backgroundColor: '#F5F5F7' }} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Amount Summary */}
        <LinearGradient
          colors={[DARK_PURPLE, PURPLE]}
          style={styles.amountCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.amountLabel}>Total Amount to Pay</Text>
          <Text style={styles.amountValue}>₹{amount?.toFixed(2) || '0.00'}</Text>
          {discount > 0 && (
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>
                🎉 You saved ₹{discount.toFixed(2)}!
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <Pressable
                key={method.id}
                style={[
                  styles.methodCard,
                  isSelected && styles.methodCardSelected,
                ]}
                onPress={() => !processing && handlePaymentMethod(method.id)}
                disabled={processing}
              >
                <LinearGradient
                  colors={isSelected ? [PURPLE, DARK_PURPLE] : ['#F0F0F0', '#E0E0E0']}
                  style={styles.iconCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon size={24} color={isSelected ? '#fff' : '#666'} />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.methodName, isSelected && { color: PURPLE }]}>
                    {method.name}
                  </Text>
                  <Text style={styles.methodDesc}>{method.description}</Text>
                </View>
                {isSelected ? (
                  processing ? (
                    <ActivityIndicator color={PURPLE} />
                  ) : (
                    <CheckCircle2 size={24} color={PURPLE} fill={PURPLE} />
                  )
                ) : (
                  <View style={styles.radioOuter}>
                    <View style={styles.radioInner} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityText}>
            🔒 All transactions are secure and encrypted
          </Text>
        </View>
      </ScrollView>
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
  amountCard: {
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
  savingsBadge: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  sectionTitle: {
    marginTop: 32,
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  methodsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    gap: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  methodCardSelected: {
    backgroundColor: '#F5EDFF',
    shadowColor: PURPLE,
    shadowOpacity: 0.2,
    borderWidth: 2,
    borderColor: PURPLE,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  methodDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  radioOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  securityNote: {
    marginHorizontal: 16,
    marginTop: 28,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  securityText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
});
