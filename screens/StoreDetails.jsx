// screens/StoreDetails.jsx
import React, { useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Animated,
  PanResponder,
  StatusBar,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeContext } from '../App';
import {
  ChevronLeft,
  Bookmark,
  Share,
  Navigation as NavIcon,
  Phone,
} from 'lucide-react-native';

import StoreOffersSection from '../components/StoresDetail/StoreOffersSection';
import StoreCatalogueSection from '../components/StoresDetail/StoreCatalogueSection';
import StoreAboutSection from '../components/StoresDetail/StoreAboutSection';
import AllStoresNearYou from '../components/StoresDetail/AllStoresNearYou';

function isVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.toLowerCase();
  return (
    u.endsWith('.mp4') ||
    u.endsWith('.mov') ||
    u.endsWith('.m4v') ||
    u.endsWith('.webm')
  );
}

const { height, width } = Dimensions.get('window');

export default function StoreDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  let insets = {};
  try {
    insets = useSafeAreaInsets() || { top: 0, bottom: 0 };
  } catch (e) {
    insets = { top: 0, bottom: 0 };
  }
  const { colors, mode } = useContext(ThemeContext);

  const { store, stores = [] } = route.params || {};
  const images = Array.isArray(store?.images) ? store.images : [];
  const hero = images?.[0];

  const allStoresNearYou = Array.isArray(stores)
    ? stores.filter(s => s?.id !== store?.id)
    : [];

  // ✅ ONLY ONE media (image OR video)
  const heroMedia =
    store?.heroVideo || store?.video || store?.hero || store?.image || hero;

  const tabs = ['Offers', 'Catalogue', 'About'];

  const isDark = mode === 'dark';
  const ui = {
    bg: colors?.background ?? (isDark ? '#0D0D0D' : '#FFFFFF'),
    card: colors?.card ?? (isDark ? '#1A1A1A' : '#FFFFFF'),
    text: colors?.text ?? (isDark ? '#F5F5F5' : '#111111'),
    muted:
      colors?.mutedText ?? colors?.subtitle ?? (isDark ? '#B3B3B3' : '#6E6E6E'),
    border: colors?.border ?? (isDark ? 'rgba(255,255,255,0.10)' : '#EAEAEA'),
    divider: isDark ? 'rgba(255,255,255,0.08)' : '#EFEFEF',
    overlayBtn: isDark ? 'rgba(26,26,26,0.85)' : 'rgba(255,255,255,0.88)',
    icon: isDark ? '#F5F5F5' : '#000000',
    danger: '#FF4D4D',
    active: '#4B23FF',
    green: '#1C7D4B',
    ctaBg: isDark ? '#F5F5F5' : '#000000',
    ctaText: isDark ? '#000000' : '#FFFFFF',
  };

  const statusText = 'Closed  ·  Opens 10:30 AM';

  /* ---------------------------------------------------------
     ✅ PULL-DOWN ZOOM
  --------------------------------------------------------- */
  const zoom = useRef(new Animated.Value(1)).current;
  const contentShift = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => {
        return scrollY.current <= 0 && g.dy > 0;
      },
      onPanResponderMove: (_, g) => {
        if (scrollY.current > 0) return;
        if (g.dy < 0) return;

        const pull = Math.min(g.dy, 140);
        zoom.setValue(1 + pull / 260);
        contentShift.setValue(pull);
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(zoom, { toValue: 1, useNativeDriver: false }),
          Animated.spring(contentShift, { toValue: 0, useNativeDriver: false }),
        ]).start();
      },
    }),
  ).current;

  /* ---------------------------------------------------------
     ✅ STICKY TITLE + STICKY TABS
  --------------------------------------------------------- */
  const scrollRef = useRef(null);
  const isProgrammaticScroll = useRef(false);

  const [activeTab, setActiveTab] = useState(0);
  const [showStickyTitle, setShowStickyTitle] = useState(false);
  const [showStickyTabs, setShowStickyTabs] = useState(false);

  // Store absolute positions from top of ScrollView content (using measure)
  const titleAbsoluteY = useRef(0);
  const tabsAbsoluteY = useRef(0);
  const sectionPositions = useRef({}); // { Offers: y, Catalogue: y, About: y }

  // ✅ FIX: sticky header should respect safe area
  const STICKY_HEADER_HEIGHT = insets.top + 56;
  const STICKY_TABS_TOP = STICKY_HEADER_HEIGHT;

  // ✅ FIX: scroll offset should match real sticky stack height
  const SCROLL_TO_OFFSET = STICKY_HEADER_HEIGHT + 56;

  const scrollToSection = key => {
    const y = sectionPositions.current[key];
    if (y === undefined) return;

    isProgrammaticScroll.current = true;
    scrollRef.current?.scrollTo({
      y: Math.max(0, y - SCROLL_TO_OFFSET),
      animated: true,
    });

    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 400);
  };

  return (
    <View style={{ flex: 1, backgroundColor: ui.bg }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />

      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{ paddingBottom: 140 }}
          scrollEventThrottle={16}
          onScroll={e => {
            const y = e.nativeEvent.contentOffset.y;
            scrollY.current = y;

            if (y >= titleAbsoluteY.current + 30) setShowStickyTitle(true);
            else setShowStickyTitle(false);

            if (y >= tabsAbsoluteY.current) setShowStickyTabs(true);
            else setShowStickyTabs(false);

            if (!isProgrammaticScroll.current) {
              let next = activeTab;

              tabs.forEach((t, i) => {
                const pos = sectionPositions.current[t];
                if (pos !== undefined && y >= pos - 150) next = i;
              });

              if (next !== activeTab) setActiveTab(next);
            }
          }}
        >
          {/* HERO (unchanged) */}
          <View
            style={[
              styles.heroWrap,
              { backgroundColor: isDark ? '#111' : '#eee' },
            ]}
          >
            <Animated.View
              style={[styles.zoomWrapper, { transform: [{ scale: zoom }] }]}
            >
              {heroMedia ? (
                isVideoUrl(heroMedia) ? (
                  <Video
                    source={{ uri: heroMedia }}
                    style={styles.heroMedia}
                    resizeMode="cover"
                    repeat
                    muted
                    paused={false}
                    ignoreSilentSwitch="obey"
                  />
                ) : (
                  <Image source={{ uri: heroMedia }} style={styles.heroMedia} />
                )
              ) : (
                <View
                  style={[
                    styles.heroMedia,
                    { backgroundColor: isDark ? '#111' : '#ddd' },
                  ]}
                />
              )}
            </Animated.View>

            <View style={[styles.heroTopRow, { top: insets.top + 12 }]}>
              <Pressable
                style={[styles.circleBtn, { backgroundColor: ui.overlayBtn }]}
                onPress={() => navigation.goBack()}
              >
                <ChevronLeft size={20} color={ui.icon} />
              </Pressable>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable
                  style={[styles.circleBtn, { backgroundColor: ui.overlayBtn }]}
                >
                  <Bookmark size={20} color={ui.icon} />
                </Pressable>
                <Pressable
                  style={[styles.circleBtn, { backgroundColor: ui.overlayBtn }]}
                >
                  <Share size={20} color={ui.icon} />
                </Pressable>
              </View>
            </View>
          </View>

          {/* CONTENT */}
          <Animated.View style={{ transform: [{ translateY: contentShift }] }}>
            <View style={styles.headerCard}>
              <View
                onLayout={e => {
                  e.target.measure((x, y, w, h, pageX, pageY) => {
                    // ✅ FIX: use sticky height (not hardcoded 60)
                    titleAbsoluteY.current = pageY - STICKY_HEADER_HEIGHT;
                  });
                }}
              >
                <View style={styles.topInfoRow}>
                  <View
                    style={[
                      styles.logoBox,
                      { backgroundColor: isDark ? '#0D0D0D' : '#111' },
                    ]}
                  >
                    {hero ? (
                      <Image source={{ uri: hero }} style={styles.logoImg} />
                    ) : (
                      <Text style={styles.logoFallback}>
                        {(store?.name || 'C')[0]}
                      </Text>
                    )}
                  </View>

                  <View style={styles.infoCol}>
                    <Text
                      style={[styles.storeName, { color: ui.text }]}
                      numberOfLines={1}
                    >
                      {store?.name || 'Store name'}
                    </Text>

                    <Text
                      style={[styles.addr, { color: ui.muted }]}
                      numberOfLines={2}
                    >
                      {store?.distance ? `${store.distance} km  |  ` : ''}
                      {store?.address ||
                        'Vamsiram BSR, 01, Road No. 2, Sri Nagar Colony, Kamalapuri Colony, Banjara Hills'}
                    </Text>

                    <Text
                      style={[styles.tags, { color: ui.muted }]}
                      numberOfLines={1}
                    >
                      {Array.isArray(store?.categories)
                        ? store.categories.join(' • ')
                        : store?.cuisines?.join(' • ') ||
                          'Fashion • Footwear • Apparel'}
                    </Text>

                    <Text style={[styles.status, { color: ui.danger }]}>
                      {statusText}
                    </Text>
                  </View>
                </View>

                <View style={styles.pillsRow}>
                  <Pressable
                    style={[
                      styles.pill,
                      { borderColor: ui.border, backgroundColor: ui.card },
                    ]}
                  >
                    <NavIcon size={16} color={ui.icon} />
                    <Text style={[styles.pillText, { color: ui.text }]}>
                      Directions
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.pill,
                      { borderColor: ui.border, backgroundColor: ui.card },
                    ]}
                  >
                    <Phone size={16} color={ui.icon} />
                    <Text style={[styles.pillText, { color: ui.text }]}>
                      Call Now
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Tabs (non-sticky) */}
              <View
                onLayout={e => {
                  e.target.measure((x, y, w, h, pageX, pageY) => {
                    // ✅ FIX: use sticky height (not hardcoded 60)
                    tabsAbsoluteY.current = pageY - STICKY_HEADER_HEIGHT;
                  });
                }}
                style={[styles.tabsRow, { borderBottomColor: ui.divider }]}
              >
                {tabs.map((t, i) => (
                  <Pressable
                    key={t}
                    onPress={() => {
                      setActiveTab(i);
                      scrollToSection(t);
                    }}
                    style={styles.tabItem}
                    hitSlop={10}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        { color: ui.text },
                        activeTab === i && { color: ui.active },
                      ]}
                    >
                      {t}
                    </Text>
                    {activeTab === i && (
                      <View
                        style={[
                          styles.tabUnderline,
                          { backgroundColor: ui.active },
                        ]}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            {/* OFFERS */}
            <View
              onLayout={e => {
                e.target.measure((x, y, w, h, pageX, pageY) => {
                  sectionPositions.current['Offers'] =
                    pageY - STICKY_HEADER_HEIGHT;
                });
              }}
              style={styles.sectionNoPad}
            >
              <StoreOffersSection store={store} ui={ui} />
            </View>

            {/* CATALOGUE */}
            <View
              onLayout={e => {
                e.target.measure((x, y, w, h, pageX, pageY) => {
                  sectionPositions.current['Catalogue'] =
                    pageY - STICKY_HEADER_HEIGHT;
                });
              }}
              style={styles.sectionPad}
            >
              <StoreCatalogueSection store={store} ui={ui} />
            </View>

            {/* ABOUT */}
            <View
              onLayout={e => {
                e.target.measure((x, y, w, h, pageX, pageY) => {
                  sectionPositions.current['About'] =
                    pageY - STICKY_HEADER_HEIGHT;
                });
              }}
              style={styles.sectionPad}
            >
              <StoreAboutSection store={store} ui={ui} />
            </View>
            {/* ABOUT */}

            <View style={{ marginTop: 18 }}>
              <AllStoresNearYou
                stores={allStoresNearYou}
                ui={ui} // ✅
                onPressStore={s =>
                  navigation.push('StoreDetails', { store: s, stores })
                }
              />
            </View>
          </Animated.View>
        </ScrollView>

        {/* ✅ Sticky Title Header (NOW respects safe area) */}
        {showStickyTitle && (
          <View
            style={[
              styles.headerFixed,
              {
                paddingTop: insets.top,
                height: STICKY_HEADER_HEIGHT,
                backgroundColor: `${ui.bg}F2`,
                borderBottomColor: ui.border,
              },
            ]}
          >
            <Pressable
              style={[
                styles.headerBtn,
                { backgroundColor: `${ui.card}E6`, borderColor: ui.border },
              ]}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft size={22} color={ui.text} />
            </Pressable>

            <Text
              numberOfLines={1}
              style={[styles.headerTitle, { color: ui.text }]}
            >
              {store?.name || 'Store'}
            </Text>

            <View style={styles.headerRight}>
              <Pressable
                style={[
                  styles.headerBtn,
                  { backgroundColor: `${ui.card}E6`, borderColor: ui.border },
                ]}
              >
                <Bookmark size={22} color={ui.text} />
              </Pressable>
              <Pressable
                style={[
                  styles.headerBtn,
                  { backgroundColor: `${ui.card}E6`, borderColor: ui.border },
                ]}
              >
                <Share size={22} color={ui.text} />
              </Pressable>
            </View>
          </View>
        )}

        {/* ✅ Sticky Tabs (top follows sticky header height) */}
        {showStickyTabs && (
          <View
            style={[
              styles.stickyTabsContainer,
              {
                top: STICKY_TABS_TOP,
                backgroundColor: `${ui.bg}F2`,
                borderBottomColor: ui.border,
              },
            ]}
          >
            <View
              style={[
                styles.tabsRow,
                {
                  borderBottomColor: ui.divider,
                  paddingTop: 10,
                },
              ]}
            >
              {tabs.map((t, i) => (
                <Pressable
                  key={t}
                  onPress={() => {
                    setActiveTab(i);
                    scrollToSection(t);
                  }}
                  style={styles.tabItem}
                  hitSlop={10}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: ui.text },
                      activeTab === i && { color: ui.active },
                    ]}
                  >
                    {t}
                  </Text>
                  {activeTab === i && (
                    <View
                      style={[
                        styles.tabUnderline,
                        { backgroundColor: ui.active },
                      ]}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Bottom CTA */}
        <View
          style={[
            styles.bottomSheet,
            {
              backgroundColor: ui.card,
              shadowOpacity: isDark ? 0.25 : 0.1,
              borderWidth: isDark ? 1 : 0,
              borderColor: isDark ? ui.border : 'transparent',
            },
          ]}
        >
          <Pressable
            style={[styles.payBtn, { backgroundColor: ui.ctaBg }]}
            onPress={() =>
              navigation.navigate('Paybill', { restaurant: store })
            }
          >
            <Text style={[styles.payBtnText, { color: ui.ctaText }]}>
              Pay bill
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    width: '100%',
    height: height * 0.46,
    position: 'relative',
  },
  zoomWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  heroMedia: { width: '100%', height: '100%' },

  heroTopRow: {
    position: 'absolute',
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleBtn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCard: { paddingHorizontal: 16, paddingTop: 14 },

  topInfoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoCol: { flex: 1, paddingTop: 2 },

  logoBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: { width: '100%', height: '100%' },
  logoFallback: { color: '#fff', fontSize: 20, fontWeight: '800' },

  storeName: { fontSize: 20, fontWeight: '800' },
  addr: { marginTop: 6, lineHeight: 18 },
  tags: { marginTop: 6, lineHeight: 18 },
  status: { marginTop: 8, fontWeight: '700' },

  pillsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 22,
  },
  pillText: { fontWeight: '800' },

  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  tabText: { fontSize: 16, fontWeight: '800' },
  tabUnderline: { marginTop: 8, height: 3, width: 42, borderRadius: 3 },

  sectionNoPad: { paddingTop: 14 },
  sectionPad: { paddingHorizontal: 16, paddingTop: 18 },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 12,
  },

  gridRow: { flexDirection: 'row', gap: 12 },
  gridCard: {
    flex: 1,
    height: Math.max(150, width * 0.42),
    borderRadius: 18,
    borderWidth: 1,
  },

  aboutCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  aboutText: { fontSize: 14, fontWeight: '600', lineHeight: 20 },

  /* ✅ Sticky header base (safe area is applied inline) */
  headerFixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 500,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerBtn: { padding: 10, borderRadius: 30, borderWidth: 1 },
  headerTitle: {
    position: 'absolute',
    left: 60,
    right: 60,
    paddingTop: 50,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: { flexDirection: 'row', gap: 10 },

  stickyTabsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 450,
    borderBottomWidth: 1,
  },

  bottomSheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  payBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: { fontSize: 16, fontWeight: '800' },
});
