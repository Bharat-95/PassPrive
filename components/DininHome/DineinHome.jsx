import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

import HomeOffers from '../Home/HomeOffers';
import IntheMood from '../DininHome/IntheMoodFor';
import FoodieFrontRow from '../Home/FoodieFrontrow';
import InTheLimelight from '../DininHome/InTheLimelight';
import InyourDistrict from '../DininHome/InyourDistrict';

import RestaurantList from '../DininHome/RestaurantList';
import FilterModal from '../DininHome/FilterModal';

const DineinHome = ({ onFilterPosition }) => {
  const [filterModal, setFilterModal] = useState(false);
  const [contentTopOffset, setContentTopOffset] = useState(0);
  const bannerAnim = useRef(new Animated.Value(0)).current;
  const [filters, setFilters] = useState({
    sort: null, rating: null, cost: null, cuisines: [], more: [],
  });

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
        onLayout={(e) => {
          setContentTopOffset(e.nativeEvent.layout.y);
        }}
      >
        <Animated.View
          style={[
            styles.bannerTopSpacing,
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
          <HomeOffers />
        </Animated.View>
        <IntheMood />
        <FoodieFrontRow />
        <InTheLimelight />
        <InyourDistrict />
        <RestaurantList
          onFilterPosition={localY => {
            const absoluteY = contentTopOffset + localY;
            onFilterPosition?.(absoluteY);
          }}
          onOpenFilters={() => setFilterModal(true)}
          onApplyQuickFilter={filter => console.log('Quick filter:', filter)}
        />
      </View>
      <FilterModal
        visible={filterModal}
        onClose={() => setFilterModal(false)}
        onApplyFilters={f => setFilters(f)}
        currentFilters={filters}
      />
    </>
  );
};
export default DineinHome;

const styles = StyleSheet.create({
  bannerTopSpacing: {
    marginTop: 30,
  },
});
