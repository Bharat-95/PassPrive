import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeContext } from '../App';
import { useContext } from 'react';

/* --------------------------------------------------
   OFFER TICKET CARD
----------------------------------------------------*/
function OfferTicket() {
  const { colors } = useContext(ThemeContext);

  return (
    <LinearGradient
      colors={['#A97FFF', '#E7D9FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.ticketContainer}
    >
      {/* LEFT */}
      <View style={styles.left}>
        <Text style={styles.leftTitle}>FLAT</Text>
        <Text style={styles.leftDiscount}>40% OFF</Text>
      </View>

      {/* CUTOUTS */}
      <View
        style={[
          styles.cutOutTop,
          { backgroundColor: colors.background },
        ]}
      />
      <View
        style={[
          styles.cutOutBottom,
          { backgroundColor: colors.background },
        ]}
      />

      {/* DOTTED LINE */}
      <View style={styles.dottedLine} />

      {/* RIGHT */}
      <View style={styles.right}>
        <Text style={styles.rightTime}>From 8:30 PM, today</Text>
        <Text style={styles.rightSub}>35 slots left | Cover charge ₹25</Text>

        <Pressable style={styles.bookNow}>
          <Text style={styles.bookNowText}>Book now →</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

/* --------------------------------------------------
   ADD-ON BENEFITS SLIDER
----------------------------------------------------*/
const addOns = [
  {
    id: '1',
    icon: 'https://cdn-icons-png.flaticon.com/512/833/833472.png',
    title: 'Flat 10% OFF up to ₹150',
    sub: 'Exclusive offer',
  },
  {
    id: '2',
    icon: 'https://cdn-icons-png.flaticon.com/512/2950/2950308.png',
    title: '20% OFF Kotak Cards',
    sub: 'Bank offer',
  },
];

function AddOnBenefits() {
  const { colors } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.addonWrapper,
        { borderColor: colors.border },
      ]}
    >
      {/* Title */}
      <View style={styles.addonRow}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />

        <Text style={[styles.addonTitle, { color: colors.text }]}>
          ＋ Add-on benefits
        </Text>

        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>

      {/* SLIDER */}
      <FlatList
        horizontal
        data={addOns}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.addonCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Image source={{ uri: item.icon }} style={styles.icon} />

            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.cardSub, { color: colors.subtitle }]}>
                {item.sub}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

/* --------------------------------------------------
   MAIN EXPORT — Combine Ticket + Dots + Add-ons
----------------------------------------------------*/
export default function OffersSection() {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Offers for today, dinner
      </Text>

      {/* Purple Ticket */}
      <OfferTicket />

      {/* Dots */}
      <View style={styles.paginationDots}>
        <View
          style={[
            styles.dotActive,
            { backgroundColor: colors.text },
          ]}
        />
      </View>

      {/* Add-On Benefits */}
      <AddOnBenefits />
    </View>
  );
}

/* --------------------------------------------------
   STYLES
----------------------------------------------------*/
const styles = StyleSheet.create({
  /* MAIN SECTION TITLE */
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600', // reduced weight
    marginBottom: 12,
  },

  /* OFFER TICKET */
  ticketContainer: {
    width: '100%',
    height: 120,
    borderRadius: 18,
    flexDirection: 'row',
    overflow: 'visible',
  },

  left: {
    width: '32%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  leftTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  leftDiscount: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },

  cutOutTop: {
    position: 'absolute',
    left: '32%',
    top: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },

  cutOutBottom: {
    position: 'absolute',
    left: '32%',
    bottom: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },

  dottedLine: {
    position: 'absolute',
    left: '32%',
    top: 20,
    bottom: 20,
    width: 1,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ffffffaa',
  },

  right: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  rightTime: {
    color: '#333',
    fontSize: 15,
    fontWeight: '700',
  },

  rightSub: {
    color: '#555',
    fontSize: 13,
    marginTop: 4,
  },

  bookNow: {
    marginTop: 14,
  },

  bookNowText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B23FF',
  },

  /* PAGINATION DOTS */
  paginationDots: {
    alignItems: 'center',
    marginTop: 14,
  },

  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
  },

  /* ADD-ONS */
  addonWrapper: {
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
    borderColor: '#eee',
  },

  addonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  plus: {
    fontSize: 22,
    fontWeight: '600',
    color: '#666',
    marginRight: 6,
  },

  addonTitle: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 10,
  },

  addonCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 14,
    padding: 14,
    marginLeft: 16,
    width: 230,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  icon: {
    width: 26,
    height: 26,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },

  cardSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc', // fades near text
    opacity: 0.5,
    marginHorizontal: 10,
  },
});
