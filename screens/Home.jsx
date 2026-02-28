import React, { useState, useContext, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import Header from '../components/Header';
import HomeSearchBar from '../components/Home/SearchBar';
import HomeCategories from '../components/Home/HomeCategories';

import { ThemeContext } from '../App';

import HomeContent from '../components/Home/HomeContent';
import DiningHome from '../components/DininHome/DineinHome';
import StoresHome from '../components/StoresHome/StoreHome';
//import EventsHome from '../components/EventsHome/EventsHome';
import SportsHome from '../components/SportsHome/SportsHome';
import DineFilters from '../components/DininHome/DineFilters';
import StoreFilters from '../components/StoresHome/StoreFilters';

export default function HomeScreen() {
  const { colors } = useContext(ThemeContext);

  const [selectedCategory, setSelectedCategory] = useState('home');
  const [collapsed, setCollapsed] = useState(false);
  const [forceCollapsed, setForceCollapsed] = useState(false);
  const [filterY, setFilterY] = useState(9999);
  const [storeFilterY, setStoreFilterY] = useState(9999);
  const [showStickyFilters, setShowStickyFilters] = useState(false);

  const yOffset = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const filterHeightRef = useRef(50);
  const stickyHeaderHeightRef = useRef(155);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: yOffset } } }],
    {
      useNativeDriver: false,
      listener: e => {
        const offset = e.nativeEvent.contentOffset.y;

        if (!forceCollapsed) {
          setCollapsed(offset > 80);
        }

        const headerSpacerHeight = collapsed ? 155 : 230;
        stickyHeaderHeightRef.current = headerSpacerHeight;

        // ✅ FIXED: Different calculation for dining vs stores
        if (selectedCategory === 'dining') {
          // For dining: Show sticky when non-sticky filters reach the category bottom
          // Need much larger offset because filterY measurement seems higher
          const stickyStart = filterY - headerSpacerHeight - filterHeightRef.current;
          
          if (offset >= stickyStart) {
            setShowStickyFilters(true);
          } else {
            setShowStickyFilters(false);
          }
        } else if (selectedCategory === 'stores') {
          // For stores: Original calculation works fine
          const filterBottom = storeFilterY + filterHeightRef.current;
          const stickyStart = filterBottom - headerSpacerHeight - 50;
          
          if (offset >= stickyStart) {
            setShowStickyFilters(true);
          } else {
            setShowStickyFilters(false);
          }
        }
      },
    },
  );

  const onSelectCategory = key => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    yOffset.setValue(0);

    setSelectedCategory(key);
    setShowStickyFilters(false);

    if (key === 'home') {
      setForceCollapsed(false);
      setCollapsed(false);
      return;
    }

    setForceCollapsed(true);
    setCollapsed(true);
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case 'home':
        return <HomeContent />;
      case 'dining':
        return (
          <DiningHome
            onFilterPosition={absoluteY => {
              setFilterY(absoluteY);
            }}
          />
        );
      case 'stores':
        return (
          <StoresHome
            onFilterPosition={absoluteY => {
              setStoreFilterY(absoluteY);
            }}
          />
        );
      //case 'events':
      //return <EventsHome />;
      case 'sports':
        return <SportsHome />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />

      {/* Sticky Search + Categories */}
      <Animated.View
        style={[
          styles.stickySearchContainer,
          {
            backgroundColor: collapsed
              ? `${colors.background}F2`
              : colors.background,
            transform: [
              {
                translateY: yOffset.interpolate({
                  inputRange: [0, 80],
                  outputRange: [80, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <HomeSearchBar
          collapsed={collapsed}
          selectedCategory={selectedCategory}
        />
        <HomeCategories
          collapsed={collapsed}
          selected={selectedCategory}
          onSelect={onSelectCategory}
        />

        {/* ✅ Sticky filters appear below categories after non-sticky filters scroll past */}
        {selectedCategory === 'dining' && showStickyFilters && (
          <View
            onLayout={(e) => {
              filterHeightRef.current = e.nativeEvent.layout.height;
            }}
          >
            <DineFilters />
          </View>
        )}

        {selectedCategory === 'stores' && showStickyFilters && (
          <View
            onLayout={(e) => {
              filterHeightRef.current = e.nativeEvent.layout.height;
            }}
          >
            <StoreFilters />
          </View>
        )}
      </Animated.View>

      {/* Content */}
      <Animated.FlatList
        ref={listRef}
        data={[1]}
        keyExtractor={() => 'screen'}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        ListHeaderComponent={
          <>
            <View style={{ height: collapsed ? 155 : 230 }} />
            {renderContent()}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  stickySearchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingBottom: 10,
  },
});