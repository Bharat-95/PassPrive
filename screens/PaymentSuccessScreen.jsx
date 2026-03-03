import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { ThemeContext } from '../App';
import LinearGradient from 'react-native-linear-gradient';

const PURPLE = '#8F3AFF';
const DARK_PURPLE = '#5800AB';

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
    <View style={{ flex: 1, backgroundColor: '#F5F5F7' }}>
      <SafeAreaView style={{ flex: 1 }}>
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
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={styles.iconCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <CheckCircle size={80} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.subtitle}>
            Your payment has been processed successfully
          </Text>

          {/* Amount Box */}
          <LinearGradient
            colors={[DARK_PURPLE, PURPLE]}
            style={styles.amountBox}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.amountLabel}>Amount Paid</Text>
            <Text style={styles.amountValue}>
              ₹{amount?.toFixed(2) || '0.00'}
            </Text>
          </LinearGradient>

          {/* Transaction Details */}
          <View style={styles.detailsCard}>
            <DetailRow
              label="Transaction ID"
              value={transactionId}
            />
            <DetailRow
              label="Payment Method"
              value={cardLastFour ? `${method} (**** ${cardLastFour})` : method}
            />
            <DetailRow
              label="Restaurant"
              value={restaurant?.name || "AB's - Absolute Barbecues"}
            />
            <DetailRow
              label="Date & Time"
              value={new Date().toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            />
          </View>

          {/* Success Note */}
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              ✓ Payment receipt has been sent to your email
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.secondaryBtnText}>Go to Home</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            // Navigate back to restaurant details or home
            navigation.navigate('Home');
          }}
        >
          <LinearGradient
            colors={[DARK_PURPLE, PURPLE]}
            style={styles.primaryBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.primaryBtnText}>Done</Text>
          </LinearGradient>
        </Pressable>
      </View>
      </SafeAreaView>
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>
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
    marginBottom: 36,
  },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 36,
    color: '#666',
  },
  amountBox: {
    padding: 28,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: 'rgba(255,255,255,0.8)',
  },
  amountValue: {
    fontSize: 46,
    fontWeight: '900',
    color: '#fff',
  },
  detailsCard: {
    padding: 22,
    borderRadius: 20,
    marginBottom: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '800',
    flex: 1.2,
    textAlign: 'right',
    color: '#1A1A1A',
  },
  noteBox: {
    padding: 18,
    borderRadius: 16,
    marginTop: 10,
    backgroundColor: '#E8F5E9',
  },
  noteText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2E7D32',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 12,
    backgroundColor: '#F5F5F7',
  },
  secondaryBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  primaryBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});
