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
  const MIN_STICKY_SEARCH_HEIGHT = 86;

  const [selectedCategory, setSelectedCategory] = useState('home');
  const [collapsed, setCollapsed] = useState(false);
  const [forceCollapsed, setForceCollapsed] = useState(false);
  const [filterY, setFilterY] = useState(9999);
  const [storeFilterY, setStoreFilterY] = useState(9999);
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const [showStickyHomeCategories, setShowStickyHomeCategories] = useState(false);
  const [stickySpacerHeight, setStickySpacerHeight] = useState(MIN_STICKY_SEARCH_HEIGHT);
  const [homeInlineCategoriesEndY, setHomeInlineCategoriesEndY] = useState(9999);

  // ── NEW: track the Header component's height so the sticky bar sits below it ──
  const [headerHeight, setHeaderHeight] = useState(0);

  const stickyHeaderFullHeightRef = useRef(MIN_STICKY_SEARCH_HEIGHT);
  const homeStickyVisibleRef = useRef(false);

  const yOffset = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const filterHeightRef = useRef(50);
  const stickyHeaderHeightRef = useRef(155);

  // ---------------------------------------------------------------------------
  // Scroll handler
  // ---------------------------------------------------------------------------
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: yOffset } } }],
    {
      useNativeDriver: false,
      listener: e => {
        const offset = e.nativeEvent.contentOffset.y;

        if (!forceCollapsed) {
          setCollapsed(offset > 80);
        }

        if (selectedCategory === 'home') {
          const triggerY = Math.max(
            0,
            stickySpacerHeight + homeInlineCategoriesEndY + 8,
          );
          const hideY = Math.max(0, triggerY - 40);
          const isVisible = homeStickyVisibleRef.current;

          if (!isVisible && offset >= triggerY) {
            homeStickyVisibleRef.current = true;
            setShowStickyHomeCategories(true);
          } else if (isVisible && offset <= hideY) {
            homeStickyVisibleRef.current = false;
            setShowStickyHomeCategories(false);
          }
        } else {
          homeStickyVisibleRef.current = true;
          setShowStickyHomeCategories(true);
        }

        const headerSpacerHeight = stickySpacerHeight;
        stickyHeaderHeightRef.current = headerSpacerHeight;

        if (selectedCategory === 'dining') {
          const stickyStart = filterY - headerSpacerHeight - filterHeightRef.current;
          setShowStickyFilters(offset >= stickyStart);
        } else if (selectedCategory === 'stores') {
          const filterBottom = storeFilterY + filterHeightRef.current;
          const stickyStart = filterBottom - headerSpacerHeight - 50;
          setShowStickyFilters(offset >= stickyStart);
        }
      },
    },
  );

  // ---------------------------------------------------------------------------
  // Category selection
  // ---------------------------------------------------------------------------
  const onSelectCategory = key => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    yOffset.setValue(0);

    setSelectedCategory(key);
    setShowStickyFilters(false);

    if (key === 'home') {
      setForceCollapsed(false);
      setCollapsed(false);
      homeStickyVisibleRef.current = false;
      setShowStickyHomeCategories(false);
      return;
    }

    setForceCollapsed(true);
    setCollapsed(true);
    setShowStickyHomeCategories(true);
  };

  // ---------------------------------------------------------------------------
  // Content renderer
  // ---------------------------------------------------------------------------
  const renderContent = () => {
    switch (selectedCategory) {
      case 'home':
        return (
          <HomeContent
            onInlineCategoriesLayout={endY => {
              setHomeInlineCategoriesEndY(endY);
            }}
            renderInlineCategories={
              <HomeCategories
                variant="inline"
                collapsed={false}
                selected={selectedCategory}
                onSelect={onSelectCategory}
              />
            }
          />
        );
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
      //  return <EventsHome />;
      case 'sports':
        return <SportsHome />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/*
        Measure the Header height so the sticky search bar can sit exactly
        below it — no overlap, no gap.
      */}
      <View
        onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <Header />
      </View>

      {/* ── Sticky Search + Categories ─────────────────────────────────────
          top = headerHeight so it starts right below the Header, never on top of it.
      ──────────────────────────────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.stickySearchContainer,
          {
            top: headerHeight,            // ← KEY FIX: sits below Header
            backgroundColor: collapsed
              ? `${colors.background}F2`
              : colors.background,
          },
        ]}
      >
        <View
          onLayout={e => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && h !== stickyHeaderFullHeightRef.current) {
              stickyHeaderFullHeightRef.current = h;
              setStickySpacerHeight(h);
            }
          }}
        >
          <HomeSearchBar
            collapsed={collapsed}
            selectedCategory={selectedCategory}
          />
        </View>

        {(selectedCategory !== 'home' || showStickyHomeCategories) && (
          <HomeCategories
            variant="sticky"
            collapsed={collapsed}
            selected={selectedCategory}
            onSelect={onSelectCategory}
          />
        )}

        {/* Sticky filters */}
        {selectedCategory === 'dining' && showStickyFilters && (
          <View
            onLayout={e => {
              filterHeightRef.current = e.nativeEvent.layout.height;
            }}
          >
            <DineFilters />
          </View>
        )}

        {selectedCategory === 'stores' && showStickyFilters && (
          <View
            onLayout={e => {
              filterHeightRef.current = e.nativeEvent.layout.height;
            }}
          >
            <StoreFilters />
          </View>
        )}
      </Animated.View>

      {/* ── Scrollable content ────────────────────────────────────────────── */}
      <Animated.FlatList
        ref={listRef}
        data={[1]}
        keyExtractor={() => 'screen'}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        ListHeaderComponent={
          <>
            {/*
              Spacer = Header height + sticky search/categories height combined.
              This ensures content starts below both the Header and the sticky bar.
            */}
            <View style={{ height: headerHeight + stickySpacerHeight }} />
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
    // top is set dynamically to headerHeight in the component
    left: 0,
    right: 0,
    zIndex: 20,
    paddingBottom: 10,
  },
});
