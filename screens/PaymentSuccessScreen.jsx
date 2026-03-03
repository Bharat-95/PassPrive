import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Animated,
} from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { ThemeContext } from '../App';

const PURPLE = '#4B23FF';

export default function PaymentSuccessScreen({ route, navigation }) {
  const { amount, method, restaurant, cardLastFour } = route.params || {};
  const { colors } = useContext(ThemeContext);
  
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  const BG = colors.background;
  const BLACK = colors.text;
  const MUTED = colors.subtitle;

  useEffect(() => {
    // Animate check icon
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const transactionId = 'TXN' + Date.now().toString().slice(-10);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <View style={styles.container}>
        {/* Success Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#4CAF50' }]}>
            <CheckCircle size={80} color="#fff" strokeWidth={2.5} />
          </View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={[styles.title, { color: BLACK }]}>Payment Successful!</Text>
          <Text style={[styles.subtitle, { color: MUTED }]}>
            Your payment has been processed successfully
          </Text>

          {/* Amount Box */}
          <View style={[styles.amountBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.amountLabel, { color: MUTED }]}>Amount Paid</Text>
            <Text style={[styles.amountValue, { color: BLACK }]}>
              ₹{amount?.toFixed(2) || '0.00'}
            </Text>
          </View>

          {/* Transaction Details */}
          <View style={[styles.detailsCard, { backgroundColor: colors.card }]}>
            <DetailRow
              label="Transaction ID"
              value={transactionId}
              colors={colors}
            />
            <DetailRow
              label="Payment Method"
              value={cardLastFour ? `${method} (**** ${cardLastFour})` : method}
              colors={colors}
            />
            <DetailRow
              label="Restaurant"
              value={restaurant?.name || "AB's - Absolute Barbecues"}
              colors={colors}
            />
            <DetailRow
              label="Date & Time"
              value={new Date().toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
              colors={colors}
            />
          </View>

          {/* Success Note */}
          <View style={[styles.noteBox, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.noteText, { color: '#2E7D32' }]}>
              ✓ Payment receipt has been sent to your email
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={[styles.actionBar, { backgroundColor: BG }]}>
        <Pressable
          style={[styles.secondaryBtn, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[styles.secondaryBtnText, { color: BLACK }]}>Go to Home</Text>
        </Pressable>

        <Pressable
          style={[styles.primaryBtn, { backgroundColor: PURPLE }]}
          onPress={() => {
            // Navigate back to restaurant details or home
            navigation.navigate('Home');
          }}
        >
          <Text style={styles.primaryBtnText}>Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, colors }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.subtitle }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
  },
  amountBox: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 40,
    fontWeight: '900',
  },
  detailsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1.2,
    textAlign: 'right',
  },
  noteBox: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  noteText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  primaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});
