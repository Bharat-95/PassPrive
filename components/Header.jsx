import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ChevronDown, Bell, UserRound } from 'lucide-react-native';

import { LocationContext } from '../App'; 
import { ThemeContext } from '../App';   
export default function Header() {
  const navigation = useNavigation();
  const locationText = useContext(LocationContext);
  const theme = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* LEFT SIDE — LOCATION */}
      <TouchableOpacity
        style={styles.locationWrapper}
        onPress={() => navigation.navigate('SavedLocations')}
      >
        <Text
          numberOfLines={1}
          style={[styles.locationText, { color: theme.colors.text }]}
        >
          {locationText}
        </Text>
        <ChevronDown size={18} color={theme.colors.text} />
      </TouchableOpacity>

      {/* RIGHT SIDE — ICONS */}
      <View style={styles.iconsRow}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Bell size={22} color={theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconButton,
            { marginLeft: 12, backgroundColor: theme.colors.card },
          ]}
          onPress={() => navigation.navigate('Profile')}
        >
          <UserRound size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },

  locationText: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: 6,
  },

  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconButton: {
    padding: 8,
    borderRadius: 50,
  },
});
