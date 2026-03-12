import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ChevronDown, MapPin, Bookmark, UserRound } from 'lucide-react-native';

import { LocationContext } from '../App'; 
import { ThemeContext } from '../App';   
export default function Header() {
  const isAndroid = Platform.OS === 'android';
  const navigation = useNavigation();
  const locationText = useContext(LocationContext);
  const theme = useContext(ThemeContext);
  const locationParts = String(locationText || '')
    .split(',')
    .map(p => p.replace(/[•…]/g, '').trim())
    .filter(Boolean);
  const primaryLocation = locationParts[0] || '';
  const secondaryLocation = locationParts.slice(1).join(', ');

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: 'transparent' },
      ]}
    >
      {/* LEFT SIDE — LOCATION */}
      <TouchableOpacity
        style={styles.locationWrapper}
        onPress={() => navigation.navigate('SavedLocations')}
      >
        <View style={styles.pinWrap}>
          <MapPin size={24} color={'#FFFFFF'} />
        </View>
        <View style={styles.locationTextWrap}>
          <View style={styles.locationTitleRow}>
            <Text
              numberOfLines={1}
              style={[
                styles.locationText,
                { color: '#FFFFFF', fontSize: isAndroid ? 14 : 18 },
              ]}
            >
              {(primaryLocation || '').trim()}
            </Text>
            <ChevronDown size={19} color={'#FFFFFF'} />
          </View>
          {secondaryLocation ? (
            <Text
              numberOfLines={1}
              style={[
                styles.locationSubtext,
                { color: '#FFFFFF', fontSize: isAndroid ? 12 : 14 },
              ]}
            >
              {secondaryLocation}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* RIGHT SIDE — ICONS */}
      <View style={styles.iconsRow}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor: 'rgba(255,255,255,0.20)',
              padding: isAndroid ? 9 : 10,
            },
          ]}
          onPress={() => navigation.navigate('SavedRestaurants')}
        >
          <Bookmark size={23} color={'#FFFFFF'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              marginLeft: 12,
              backgroundColor: 'rgba(255,255,255,0.20)',
              padding: isAndroid ? 9 : 10,
            },
          ]}
          onPress={() => navigation.navigate('Profile')}
        >
          <UserRound size={23} color={'#FFFFFF'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginTop: 2,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },

  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '70%',
  },

  pinWrap: {
    marginTop: 4,
    marginRight: 10,
  },

  locationTextWrap: {
    flexShrink: 1,
  },

  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 6,
  },

  locationSubtext: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.85,
  },

  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconButton: {
    padding: 10,
    borderRadius: 50,
  },
});
