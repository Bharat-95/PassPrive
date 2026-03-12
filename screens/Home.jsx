import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, StatusBar, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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

const STICKY_BOTTOM_GAP = 3;

export default function HomeScreen() {
  const { colors } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  const scrollRef = useRef(null);
  const stickyBarHeightRef = useRef(0);
  const filterYRef = useRef(9999);
  const storeFilterYRef = useRef(9999);
  const homeInlineCatEndYRef = useRef(9999);
  const homeStickyVisibleRef = useRef(false);
  const homeStickyVisibility = useRef(new Animated.Value(0)).current;

  const [selectedCategory, setSelectedCategory] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showStickyHomeCategories, setShowStickyHomeCategories] = useState(false);
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [homeRefreshKey, setHomeRefreshKey] = useState(0);
  const [searchRowHeight, setSearchRowHeight] = useState(76);

  const hasStickyCategories = selectedCategory !== 'home' || showStickyHomeCategories;
  const topGradientColors = ['#48101A', '#A35629'];

  const onScroll = e => {
    const offset = e.nativeEvent.contentOffset.y;
    const scrolled = offset > 0;
    setIsScrolled(prev => (prev === scrolled ? prev : scrolled));

    if (selectedCategory === 'home') {
      const triggerY = Math.max(0, homeInlineCatEndYRef.current);
      const isVisible = homeStickyVisibleRef.current;
      const shouldShowSticky = offset >= triggerY;

      if (isVisible !== shouldShowSticky) {
        homeStickyVisibleRef.current = shouldShowSticky;
        homeStickyVisibility.setValue(shouldShowSticky ? 1 : 0);
        setShowStickyHomeCategories(shouldShowSticky);
      }
    } else if (!showStickyHomeCategories) {
      homeStickyVisibleRef.current = true;
      homeStickyVisibility.setValue(1);
      setShowStickyHomeCategories(true);
    }

    if (selectedCategory === 'dining') {
      const stickyStart = filterYRef.current - stickyBarHeightRef.current - insets.top;
      const shouldShow = offset >= stickyStart;
      setShowStickyFilters(prev => (prev === shouldShow ? prev : shouldShow));
    } else if (selectedCategory === 'stores') {
      const stickyStart = storeFilterYRef.current - stickyBarHeightRef.current - insets.top;
      const shouldShow = offset >= stickyStart;
      setShowStickyFilters(prev => (prev === shouldShow ? prev : shouldShow));
    } else if (showStickyFilters) {
      setShowStickyFilters(false);
    }
  };

  const onSelectCategory = key => {
    scrollRef.current?.scrollToOffset({ offset: 0, animated: false });
    setSelectedCategory(key);
    setShowStickyFilters(false);

    if (key === 'home') {
      homeStickyVisibleRef.current = false;
      homeStickyVisibility.setValue(0);
      setShowStickyHomeCategories(false);
    } else {
      homeStickyVisibleRef.current = true;
      homeStickyVisibility.setValue(1);
      setShowStickyHomeCategories(true);
    }
  };

  const onSpotlightRefresh = () => {
    setRefreshing(true);
    if (selectedCategory === 'home') {
      setHomeRefreshKey(prev => prev + 1);
    }
    setTimeout(() => setRefreshing(false), 700);
  };

  const listData = [{ key: 'sticky' }, { key: 'content' }];

  useEffect(() => {
    if (selectedCategory !== 'home') {
      homeStickyVisibleRef.current = true;
      homeStickyVisibility.setValue(1);
    }
  }, [selectedCategory, homeStickyVisibility]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <FlatList
        ref={scrollRef}
        data={listData}
        keyExtractor={item => item.key}
        renderItem={({ item }) => {
          if (item.key === 'sticky') {
            return (
              <View
                style={[
                  styles.stickyBar,
                  {
                    elevation: 0,
                    backgroundColor: 'transparent',
                    paddingBottom: STICKY_BOTTOM_GAP,
                  },
                ]}
                onLayout={e => {
                  stickyBarHeightRef.current = e.nativeEvent.layout.height;
                }}
              >
                <LinearGradient
                  pointerEvents="none"
                  colors={topGradientColors}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFillObject}
                />

                <View
                  style={[
                    styles.searchRow,
                    {
                      backgroundColor: 'transparent',
                      paddingVertical: 16,
                    },
                  ]}
                  onLayout={e => {
                    const h = e.nativeEvent.layout.height;
                    if (h > 0 && Math.abs(h - searchRowHeight) > 1) {
                      setSearchRowHeight(h);
                    }
                  }}
                >
                  <HomeSearchBar elevated={isScrolled} />
                </View>

                {selectedCategory === 'home' ? (
                  <Animated.View
                    pointerEvents={showStickyHomeCategories ? 'auto' : 'none'}
                    style={[
                      styles.homeStickyOverlay,
                      {
                        top: searchRowHeight,
                        opacity: homeStickyVisibility,
                      },
                    ]}
                  >
                    <LinearGradient
                      pointerEvents="none"
                      colors={topGradientColors}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <HomeCategories
                      variant="sticky"
                      collapsed={isScrolled}
                      selected={selectedCategory}
                      elevated={isScrolled}
                      onSelect={onSelectCategory}
                    />
                  </Animated.View>
                ) : selectedCategory !== 'home' && hasStickyCategories ? (
                  <View>
                    <HomeCategories
                      variant="sticky"
                      collapsed={isScrolled}
                      selected={selectedCategory}
                      elevated={isScrolled}
                      onSelect={onSelectCategory}
                    />
                    <View style={{ height: 8 }} />
                  </View>
                ) : null}

                {selectedCategory === 'dining' && showStickyFilters && (
                  <View style={{ marginTop: 8 }}>
                    <DineFilters />
                  </View>
                )}

                {selectedCategory === 'stores' && showStickyFilters && (
                  <View style={{ marginTop: 8 }}>
                    <StoreFilters />
                  </View>
                )}
              </View>
            );
          }

          return (
            <View>
              <View
                style={[
                  selectedCategory === 'home' ? styles.visible : styles.hidden,
                  selectedCategory === 'home' ? styles.homeContentAttachTop : null,
                ]}
                pointerEvents={selectedCategory === 'home' ? 'auto' : 'none'}
              >
                <HomeContent
                  key={`home-content-${homeRefreshKey}`}
                  onInlineCategoriesLayout={layout => {
                    if (!layout) {
                      return;
                    }
                    homeInlineCatEndYRef.current = layout.endY ?? 9999;
                  }}
                  onSpotlightRefresh={onSpotlightRefresh}
                  spotlightRefreshing={refreshing}
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
                style={selectedCategory === 'dining' ? styles.visible : styles.hidden}
                pointerEvents={selectedCategory === 'dining' ? 'auto' : 'none'}
              >
                <DiningHome
                  onFilterPosition={y => {
                    filterYRef.current = y;
                  }}
                />
              </View>

              <View
                style={selectedCategory === 'stores' ? styles.visible : styles.hidden}
                pointerEvents={selectedCategory === 'stores' ? 'auto' : 'none'}
              >
                <StoresHome
                  onFilterPosition={y => {
                    storeFilterYRef.current = y;
                  }}
                />
              </View>

              <View
                style={selectedCategory === 'sports' ? styles.visible : styles.hidden}
                pointerEvents={selectedCategory === 'sports' ? 'auto' : 'none'}
              >
                <SportsHome />
              </View>
            </View>
          );
        }}
        ListHeaderComponent={
          <View
            style={[
              styles.headerContainer,
              {
                marginTop: -insets.top,
                paddingTop: insets.top,
                backgroundColor: 'transparent',
              },
            ]}
          >
            <LinearGradient
              pointerEvents="none"
              colors={topGradientColors}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFillObject}
            />
            <Header />
          </View>
        }
        style={[styles.scroll, { marginTop: insets.top }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        scrollEventThrottle={1}
        onScroll={onScroll}
        stickyHeaderIndices={[1]}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
        contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
        scrollIndicatorInsets={{ top: 0, left: 0, bottom: 0, right: 0 }}
      />

      <View pointerEvents="none" style={[styles.statusOverlay, { height: insets.top }]}> 
        <LinearGradient
          pointerEvents="none"
          colors={topGradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  statusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 999,
    overflow: 'hidden',
  },
  headerContainer: {
    paddingBottom: 0,
  },
  stickyBar: {
    zIndex: 30,
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  homeStickyOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 8,
  },
  homeContentAttachTop: {
    marginTop: -16,
  },
  visible: { display: 'flex' },
  hidden: { display: 'none' },
});
