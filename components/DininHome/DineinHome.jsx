import React, { useState } from 'react';
import { View } from 'react-native';

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

  const [filters, setFilters] = useState({
    sort: null,
    rating: null,
    cost: null,
    cuisines: [],
    more: [],
  });

  const handleQuickFilter = (filter) => {
    console.log('Quick filter applied:', filter);
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters applied:', newFilters);
  };

  return (
    <>
      <View
        onLayout={(e) => {
          setContentTopOffset(e.nativeEvent.layout.y);
        }}
      >
        <HomeOffers />
        <IntheMood />
        <FoodieFrontRow />
        <InTheLimelight />
        <InyourDistrict />

        <RestaurantList
          onFilterPosition={(localY) => {
            // Calculate absolute Y position: content offset + local position
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

export default DineinHome;