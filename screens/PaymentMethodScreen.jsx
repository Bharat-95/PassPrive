import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { ChevronLeft, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react-native';
import { ThemeContext } from '../App';

const PURPLE = '#4B23FF';

export default function PaymentMethodScreen({ route, navigation }) {
  const { amount, discount, originalAmount, restaurant } = route.params || {};
  const { colors } = useContext(ThemeContext);
  const [selectedMethod, setSelectedMethod] = useState(null);

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
    if (methodId === 'card') {
      navigation.navigate('CardPayment', {
        amount,
        discount,
        originalAmount,
        restaurant,
      });
    } else if (methodId === 'upi') {
      // Simulate UPI payment success
      setTimeout(() => {
        navigation.navigate('PaymentSuccess', {
          amount,
          method: 'UPI',
          restaurant,
        });
      }, 1500);
    } else if (methodId === 'netbanking') {
      // Simulate Netbanking payment success
      setTimeout(() => {
        navigation.navigate('PaymentSuccess', {
          amount,
          method: 'Net Banking',
          restaurant,
        });
      }, 1500);
    } else if (methodId === 'wallet') {
      // Simulate Wallet payment success
      setTimeout(() => {
        navigation.navigate('PaymentSuccess', {
          amount,
          method: 'Wallet',
          restaurant,
        });
      }, 1500);
    }
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
        <Text style={[styles.headerTitle, { color: BLACK }]}>Select Payment Method</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Amount Summary */}
        <View style={[styles.amountCard, { backgroundColor: CARD, borderColor: BORDER }]}>
          <Text style={[styles.amountLabel, { color: MUTED }]}>Total Amount to Pay</Text>
          <Text style={[styles.amountValue, { color: BLACK }]}>₹{amount?.toFixed(2) || '0.00'}</Text>
          {discount > 0 && (
            <Text style={[styles.savingsText, { color: '#4CAF50' }]}>
              You saved ₹{discount.toFixed(2)}!
            </Text>
          )}
        </View>

        {/* Payment Methods */}
        <Text style={[styles.sectionTitle, { color: BLACK }]}>Choose Payment Method</Text>

        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <Pressable
                key={method.id}
                style={[
                  styles.methodCard,
                  {
                    backgroundColor: BG,
                    borderColor: isSelected ? PURPLE : BORDER,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                onPress={() => handlePaymentMethod(method.id)}
              >
                <View style={[styles.iconCircle, { backgroundColor: CARD }]}>
                  <Icon size={24} color={PURPLE} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.methodName, { color: BLACK }]}>{method.name}</Text>
                  <Text style={[styles.methodDesc, { color: MUTED }]}>{method.description}</Text>
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    { borderColor: isSelected ? PURPLE : BORDER },
                  ]}
                >
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: PURPLE }]} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Security Note */}
        <View style={[styles.securityNote, { backgroundColor: CARD }]}>
          <Text style={[styles.securityText, { color: MUTED }]}>
            🔒 All transactions are secure and encrypted
          </Text>
        </View>
      </ScrollView>
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
  amountCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '900',
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  sectionTitle: {
    marginTop: 28,
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  methodsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  methodDesc: {
    fontSize: 13,
    fontWeight: '600',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  securityNote: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  securityText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
