import { StyleSheet, View } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import StoresHero from '../StoresHome/StoresHero';
import PayWithEase from '../StoresHome/PayWithEaseCard';
import StoresCategory from '../StoresHome/StoresCategory';
import InYourDistrict from '../StoresHome/InyourDistrict';
import OffersForYou from '../StoresHome/OffersForYou';
import FilterModal from '../DininHome/FilterModal';
import StoresList from '../StoresHome/StoresList';

const StoreHome = ({ onFilterPosition, compactTopSpacing = false }) => {
  const [filterModal, setFilterModal] = useState(false);
  const [contentTopOffset, setContentTopOffset] = useState(0);
  const bannerAnim = useRef(new Animated.Value(0)).current;

  const [filters, setFilters] = useState({
    sort: null,
    rating: null,
    cost: null,
    cuisines: [],
    more: [],
  });

  const handleQuickFilter = filter => {
    console.log('Quick filter applied:', filter);
  };

  const applyFilters = newFilters => {
    setFilters(newFilters);
    console.log('Filters applied:', newFilters);
  };

  useEffect(() => {
    Animated.timing(bannerAnim, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [bannerAnim]);

  return (
    <>
      <View
        onLayout={e => {
          setContentTopOffset(e.nativeEvent.layout.y);
        }}
      >
        <Animated.View
          style={[
            {
              marginTop: compactTopSpacing ? 2 : 30,
            },
            {
              opacity: bannerAnim,
              transform: [
                {
                  translateY: bannerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <StoresHero />
        </Animated.View>
        <StoresCategory />
        <InYourDistrict />
        <OffersForYou />
        <StoresList
          onFilterPosition={localY => {
            const absoluteY = contentTopOffset + localY;
            onFilterPosition?.(absoluteY);
          }}
          onOpenFilters={() => setFilterModal(true)}
          onApplyQuickFilter={handleQuickFilter}
        />
      </View>
      <FilterModal
        visible={filterModal}
        onClose={() => setFilterModal(false)}
        onApplyFilters={applyFilters}
        currentFilters={filters}
      />
    </>
  );
};

export default StoreHome;

const styles = StyleSheet.create({
});
