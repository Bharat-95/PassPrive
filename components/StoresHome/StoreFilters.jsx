import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ThemeContext } from '../../App';
import { SlidersHorizontal } from 'lucide-react-native';

const QUICK_FILTERS = [
  'Home Decor',
  'Apparel',
  'Footwear',
  'Accessories',
];

export default function DineFilters({ onOpenFilters, onSelectQuick }) {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={{ marginBottom: 12 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {/* Filter Button */}
        <TouchableOpacity
          style={[styles.filterChip, { backgroundColor: colors.card }]}
          onPress={onOpenFilters}
        >
          <SlidersHorizontal size={18} color={colors.text} />
          <Text style={[styles.filterChipText, { color: colors.text }]}>
            Filters
          </Text>
        </TouchableOpacity>

        {/* Quick Filter Chips */}
        {QUICK_FILTERS.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.quickFilterChip,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => onSelectQuick?.(filter)}
          >
            <Text style={[styles.quickFilterText, { color: colors.text }]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },

  filterChipText: {
    fontSize: 12.5,
    fontWeight: '600',
  },

  quickFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },

  quickFilterText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
});