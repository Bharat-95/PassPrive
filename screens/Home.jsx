import React, { useState, useContext, useRef } from 'react';
import { View, StyleSheet, Animated, StatusBar } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '../components/Header';
import HomeSearchBar from '../components/Home/SearchBar';
import HomeCategories from '../components/Home/HomeCategories';

import { ThemeContext } from '../App';

import HomeContent from '../components/Home/HomeContent';
import DiningHome from '../components/DininHome/DineinHome';
import StoresHome from '../components/StoresHome/StoreHome';
import SportsHome from '../components/SportsHome/SportsHome';
import DineFilters from '../components/DininHome/DineFilters';
import StoreFilters from '../components/StoresHome/StoreFilters';

export default function HomeScreen() {
  const { colors } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const MIN_STICKY_SEARCH_HEIGHT = 0;

  const [selectedCategory, setSelectedCategory] = useState('home');
  const [collapsed, setCollapsed] = useState(false);
  const [forceCollapsed, setForceCollapsed] = useState(false);
  const [filterY, setFilterY] = useState(9999);
  const [storeFilterY, setStoreFilterY] = useState(9999);
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const [showStickyHomeCategories, setShowStickyHomeCategories] =
    useState(false);
  const [stickyBaseHeight, setStickyBaseHeight] = useState(
    MIN_STICKY_SEARCH_HEIGHT,
  );
  const [stickyFilterHeight, setStickyFilterHeight] = useState(0);
  const [homeInlineCategoriesEndY, setHomeInlineCategoriesEndY] =
    useState(9999);
  const [headerHeight, setHeaderHeight] = useState(0);

  const stickyHeaderBaseHeightRef = useRef(0);
  const homeStickyVisibleRef = useRef(false);

  const yOffset = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const filterHeightRef = useRef(50);
  const stickyHeaderHeightRef = useRef(155);

  const hasStickyCategories =
    selectedCategory !== 'home' || showStickyHomeCategories;
  const isStickyActive = collapsed;
  const activeStickyFilterHeight =
    showStickyFilters &&
    (selectedCategory === 'dining' || selectedCategory === 'stores')
      ? stickyFilterHeight + 8
      : 0;
  const effectiveStickyHeight = stickyBaseHeight + activeStickyFilterHeight;

  const headerTranslateY = yOffset.interpolate({
    inputRange: [0, Math.max(1, headerHeight)],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });
  const headerOpacity = yOffset.interpolate({
    inputRange: [0, Math.max(1, headerHeight * 0.75)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const stickyTop = yOffset.interpolate({
    inputRange: [0, Math.max(1, headerHeight)],
    outputRange: [headerHeight, insets.top],
    extrapolate: 'clamp',
  });
  const stickyOverlayOpacity = yOffset.interpolate({
    inputRange: [0, 35, 90],
    outputRange: [0, 0.45, 1],
    extrapolate: 'clamp',
  });

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
            stickyBaseHeight + homeInlineCategoriesEndY + 8,
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

        const headerSpacerHeight = stickyBaseHeight;
        stickyHeaderHeightRef.current = headerSpacerHeight;

        if (selectedCategory === 'dining') {
          const stickyStart =
            filterY - headerSpacerHeight - filterHeightRef.current;
          setShowStickyFilters(offset >= stickyStart);
        } else if (selectedCategory === 'stores') {
          const filterBottom = storeFilterY + filterHeightRef.current;
          const stickyStart = filterBottom - headerSpacerHeight - 50;
          setShowStickyFilters(offset >= stickyStart);
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
      homeStickyVisibleRef.current = false;
      setShowStickyHomeCategories(false);
      return;
    }

    setForceCollapsed(false);
    setCollapsed(false);
    setShowStickyHomeCategories(true);
  };

  const renderContent = () => (
    <View>
      <View
        style={
          selectedCategory === 'home'
            ? styles.contentVisible
            : styles.contentHidden
        }
        pointerEvents={selectedCategory === 'home' ? 'auto' : 'none'}
      >
        <HomeContent
          onInlineCategoriesLayout={endY => setHomeInlineCategoriesEndY(endY)}
          renderInlineCategories={
            <HomeCategories
              variant="inline"
              collapsed={false}
              selected={selectedCategory}
              onSelect={onSelectCategory}
            />
          }
        />
      </View>

      <View
        style={
          selectedCategory === 'dining'
            ? styles.contentVisible
            : styles.contentHidden
        }
        pointerEvents={selectedCategory === 'dining' ? 'auto' : 'none'}
      >
        <DiningHome onFilterPosition={absoluteY => setFilterY(absoluteY)} />
      </View>

      <View
        style={
          selectedCategory === 'stores'
            ? styles.contentVisible
            : styles.contentHidden
        }
        pointerEvents={selectedCategory === 'stores' ? 'auto' : 'none'}
      >
        <StoresHome onFilterPosition={absoluteY => setStoreFilterY(absoluteY)} />
      </View>

      <View
        style={
          selectedCategory === 'sports'
            ? styles.contentVisible
            : styles.contentHidden
        }
        pointerEvents={selectedCategory === 'sports' ? 'auto' : 'none'}
      >
        <SportsHome />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={
          colors.background === '#0D0D0D' ? 'light-content' : 'dark-content'
        }
      />
      <Animated.View
        onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top,
          backgroundColor: colors.background,
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
          zIndex: 20,
        }}
      >
        <Header />
      </Animated.View>

      <Animated.View
        style={[
          styles.stickySearchContainer,
          {
            backgroundColor: 'transparent',
            ...(hasStickyCategories
              ? styles.stickyWithCategories
              : styles.stickyNoCategories),
          },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, { opacity: stickyOverlayOpacity }]}
        >
          <BlurView
            style={StyleSheet.absoluteFillObject}
            blurType={colors.background === '#0D0D0D' ? 'dark' : 'light'}
            blurAmount={22}
            reducedTransparencyFallbackColor={colors.background}
          />
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor:
                  colors.background === '#0D0D0D'
                    ? 'rgba(13, 13, 13, 0.58)'
                    : 'rgba(255, 255, 255, 0.58)',
              },
            ]}
          />
        </Animated.View>
        <Animated.View style={{ marginTop: stickyTop }}>
          <View
            onLayout={e => {
              const h = e.nativeEvent.layout.height;
              if (h > 0 && h !== stickyHeaderBaseHeightRef.current) {
                stickyHeaderBaseHeightRef.current = h;
                setStickyBaseHeight(h);
              }
            }}
          >
            <View style={styles.searchOuterTint}>
              <View>
                <HomeSearchBar elevated={isStickyActive} />
              </View>
            </View>

            {hasStickyCategories && (
              <HomeCategories
                variant="sticky"
                collapsed={collapsed}
                selected={selectedCategory}
                elevated={isStickyActive}
                onSelect={onSelectCategory}
              />
            )}
          </View>

          {selectedCategory === 'dining' && showStickyFilters && (
            <View
              style={{ marginTop: 8 }}
              onLayout={e => {
                filterHeightRef.current = e.nativeEvent.layout.height;
              }}
            >
              <DineFilters />
            </View>
          )}

          {selectedCategory === 'stores' && showStickyFilters && (
            <View
              style={{ marginTop: 8 }}
              onLayout={e => {
                const h = e.nativeEvent.layout.height;
                filterHeightRef.current = h;
                if (h > 0 && h !== stickyFilterHeight) {
                  setStickyFilterHeight(h);
                }
              }}
            >
              <StoreFilters />
            </View>
          )}
        </Animated.View>
      </Animated.View>

      <Animated.FlatList
        ref={listRef}
        data={[1]}
        keyExtractor={() => 'screen'}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        ListHeaderComponent={
          <>
            <View style={{ height: headerHeight + effectiveStickyHeight }} />
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
    zIndex: 40,
  },
  stickyWithCategories: {
    paddingBottom: 12,
    shadowOpacity: 0,
    elevation: 0,
  },
  stickyNoCategories: {
    paddingBottom: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  searchOuterTint: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 0,
  },
  contentVisible: {
    display: 'flex',
  },
  contentHidden: {
    display: 'none',
  },
});
