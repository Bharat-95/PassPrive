import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import StoresHero from '../StoresHome/StoresHero';
import PayWithEase from '../StoresHome/PayWithEaseCard';
import StoresCategory from '../StoresHome/StoresCategory';
import InYourDistrict from '../StoresHome/InyourDistrict';
import OffersForYou from '../StoresHome/OffersForYou';
import FilterModal from '../DininHome/FilterModal';
import StoresList from '../StoresHome/StoresList';

const StoreHome = ({ onFilterPosition }) => {
  const [filterModal, setFilterModal] = useState(false);
  const [contentTopOffset, setContentTopOffset] = useState(0);

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

  return (
    <>
      <View
        onLayout={e => {
          setContentTopOffset(e.nativeEvent.layout.y);
        }}
      >
        <StoresHero />
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

const styles = StyleSheet.create({});
