import React, { useContext, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ScrollView,
  Image,
  PanResponder,
  Dimensions,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../App';
import {
  ArrowLeft,
  Bookmark,
  Share,
  ChevronDown,
  Navigation,
  Phone,
} from 'lucide-react-native';
import OfferCard from '../components/OfferCard';
import MenuSection from '../components/MenuSection';
import Gallery from '../components/GallerySection';
import Reviews from '../components/ReviewsSection';
import About from '../components/AboutSection';
import ExploreRestaurantsSection from '../components/ExploreRestaurantsSection';
import BookGuestsModal from '../components/BookGuestsModal';

const { width } = Dimensions.get('window');

/* ---------------------------------------------------------
   ✅ THEME HELPERS
--------------------------------------------------------- */
const withAlpha = (hex, alphaHex) => {
  // expects "#RRGGBB"
  if (!hex || typeof hex !== 'string') return hex;
  if (hex.startsWith('#') && hex.length === 7) return `${hex}${alphaHex}`;
  return hex; // if already rgba or #RRGGBBAA etc.
};

/* ---------------------------------------------------------
   🔥 OPEN/CLOSED UTILITY
--------------------------------------------------------- */
function parseTime12to24(t) {
  const [timeStr, modifier] = t.split(' ');
  let [h, m] = timeStr.split(':').map(Number);
  if (modifier === 'PM' && h !== 12) h += 12;
  if (modifier === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function getOpenStatus(openingHours) {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });

  const todayHours = openingHours?.[day];
  if (!todayHours) return { isOpen: false, openAt: null, closeAt: null };

  const [start, end] = todayHours.split(' - ');

  const nowMin = now.getHours() * 60 + now.getMinutes();
  const startMin = parseTime12to24(start);
  const endMin = parseTime12to24(end);

  const isOpen = nowMin >= startMin && nowMin <= endMin;

  return { isOpen, openAt: start, closeAt: end };
}

export default function RestaurantDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);

  // ✅ Sticky theme (same UI)
  const stickyBg = withAlpha(colors.background, 'F2'); // ~95% opacity overlay
  const stickyBtnBg = withAlpha(colors.card, 'E6'); // ~90% opacity button bg
  const stickyBorder = colors.border;
  const stickyText = colors.text;

  // ✅ Hero overlays on images (same UI)
  const heroOverlayBg = withAlpha(colors.background, 'BF'); // ~75%
  const heroBtnBorder = withAlpha(colors.border, 'CC'); // ~80%

  const { restaurant, restaurants } = route.params;

  const isProgrammaticScroll = useRef(false);
  const [showGuestsModal, setShowGuestsModal] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Offers', 'Menu', 'Gallery', 'Reviews', 'About'];
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollRef = useRef(null);
  const menuRef = useRef(null);
  const sectionPositions = useRef({});

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [showStickyTitle, setShowStickyTitle] = useState(false);
  const [showStickyTabs, setShowStickyTabs] = useState(false);

  // Store absolute positions from top of ScrollView content
  const titleAbsoluteY = useRef(0);
  const tabsAbsoluteY = useRef(0);

  const status = getOpenStatus(restaurant.openingHours);

  const allImages = useMemo(() => {
    const food = restaurant?.images?.food ?? [];
    const ambience = restaurant?.images?.ambience ?? [];
    return [...food, ...ambience];
  }, [restaurant?.images]);

  /* ---------------------------------------------------------
     ZOOM GALLERY FIXED LOGIC
----------------------------------------------------------- */
  const zoom = useRef(new Animated.Value(1)).current;
  const contentShift = useRef(new Animated.Value(0)).current;

  // Track scroll position
  const scrollY = useRef(0);

  // Split images into chunks of 3
  const slides = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < allImages.length; i += 3) {
      chunks.push(allImages.slice(i, i + 3));
    }
    return chunks;
  }, [allImages]);

  /* ---------------------------------------------------------
     PANRESPONDER UPDATED (Zoom only when scrollY == 0)
----------------------------------------------------------- */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => {
        // Only allow zoom when user is at the top AND pulling down
        return scrollY.current <= 0 && g.dy > 0;
      },

      onPanResponderMove: (_, g) => {
        if (scrollY.current > 0) return; // Prevent zoom when not at top
        if (g.dy < 0) return; // Do NOT zoom when user scrolls up

        const pull = Math.min(g.dy, 140);
        zoom.setValue(1 + pull / 260);
        contentShift.setValue(pull);
      },

      onPanResponderRelease: () => {
        // Always reset zoom back to 1
        Animated.parallel([
          Animated.spring(zoom, { toValue: 1, useNativeDriver: false }),
          Animated.spring(contentShift, { toValue: 0, useNativeDriver: false }),
        ]).start();
      },
    }),
  ).current;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          bounces={false}
          onScroll={e => {
            const y = e.nativeEvent.contentOffset.y;
            scrollY.current = y;

            // Stick title when scrolled past the title's bottom edge
            if (y >= titleAbsoluteY.current + 30) {
              setShowStickyTitle(true);
            } else {
              setShowStickyTitle(false);
            }

            // Stick tabs when scrolled to the tabs position
            if (y >= tabsAbsoluteY.current) {
              setShowStickyTabs(true);
            } else {
              setShowStickyTabs(false);
            }

            // Active tab highlight - Fixed to prevent jumping
            if (!isProgrammaticScroll.current) {
              let newActiveTab = activeTab;

              tabs.forEach((tab, i) => {
                const pos = sectionPositions.current[tab];
                if (pos !== undefined && y >= pos - 150) {
                  newActiveTab = i;
                }
              });

              if (newActiveTab !== activeTab) {
                setActiveTab(newActiveTab);
              }
            }
          }}
          scrollEventThrottle={16}
        >
          {/* ---------------- HEADER GALLERY ---------------- */}
          <View style={styles.galleryContainer}>
            <Animated.View
              style={[styles.zoomWrapper, { transform: [{ scale: zoom }] }]}
            >
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={e => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x / width,
                  );
                  setActiveIndex(index);
                }}
              >
                {slides.map((group, i) => (
                  <View key={i} style={{ width }}>
                    <View style={styles.imageGrid}>
                      {group[0] && (
                        <Image source={{ uri: group[0] }} style={styles.largeImg} />
                      )}

                      <View style={styles.rightGrid}>
                        {group[1] && (
                          <Image source={{ uri: group[1] }} style={styles.smallImg} />
                        )}
                        {group[2] && (
                          <Image
                            source={{ uri: group[2] }}
                            style={[styles.smallImg, { marginTop: 6 }]}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </Animated.View>

            {/* SLIDER DOTS */}
            <View style={styles.indicatorContainer}>
              {slides.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.indicator,
                    { backgroundColor: colors.border },
                    activeIndex === i && {
                      backgroundColor: colors.text,
                      opacity: 0.55,
                    },
                  ]}
                />
              ))}
            </View>

            {/* VIEW GALLERY BUTTON */}
            <Pressable
              style={[
                styles.viewGalleryBtn,
                {
                  backgroundColor: heroOverlayBg,
                  borderColor: heroBtnBorder,
                  borderWidth: 1,
                },
              ]}
              onPress={() =>
                navigation.navigate('GalleryScreen', {
                  foodImages: restaurant.images.food ?? [],
                  ambienceImages: restaurant.images.ambience ?? [],
                  name: restaurant.name,
                  costForTwo: restaurant.costForTwo,
                })
              }
            >
              <Text style={[styles.viewGalleryText, { color: colors.text }]}>
                View gallery
              </Text>
            </Pressable>

            {/* BACK & ICON BUTTONS */}
            <Pressable
              style={[styles.backBtn, { backgroundColor: heroOverlayBg }]}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={22} color={colors.text} />
            </Pressable>

            <View style={styles.rightButtons}>
              <Pressable style={[styles.circleBtn, { backgroundColor: heroOverlayBg }]}>
                <Bookmark size={22} color={colors.text} />
              </Pressable>
              <Pressable style={[styles.circleBtn, { backgroundColor: heroOverlayBg }]}>
                <Share size={22} color={colors.text} />
              </Pressable>
            </View>
          </View>

          {/* ---------------- CONTENT ---------------- */}
          <Animated.View style={{ transform: [{ translateY: contentShift }] }}>
            <View style={styles.infoBox}>
              {/* NAME + RATING */}
              <View
                onLayout={e => {
                  e.target.measure((x, y, w, h, pageX, pageY) => {
                    titleAbsoluteY.current = pageY - 60;
                  });
                }}
              >
                <View style={styles.rowBetween}>
                  <Text style={[styles.name, { color: colors.text }]}>
                    {restaurant.name}
                  </Text>

                  <View style={styles.ratingWrapper}>
                    <View style={styles.ratingTop}>
                      <Text style={styles.ratingTopText}>{restaurant.rating}</Text>
                      <Text style={styles.ratingStar}>★</Text>
                    </View>

                    <View style={[styles.ratingBottom, { backgroundColor: colors.card }]}>
                      <Text style={[styles.ratingBottomText, { color: colors.text }]}>
                        2.2K+
                      </Text>
                    </View>
                  </View>
                </View>

                {/* AREA + CITY */}
                <Pressable onPress={() => setShowAddressModal(true)}>
                  <View style={styles.locationRow}>
                    <Text style={[styles.locationText, { color: colors.subtitle }]}>
                      {restaurant.area}, {restaurant.city}
                    </Text>
                    <ChevronDown
                      size={18}
                      color={colors.subtitle}
                      style={{ marginLeft: 6 }}
                    />
                  </View>
                </Pressable>

                {/* DISTANCE + COST */}
                <Text style={[styles.subText, { color: colors.subtitle }]}>
                  {restaurant.distance} km · ₹{restaurant.costForTwo} for two
                </Text>

                {/* STATUS */}
                <Pressable
                  style={styles.statusRow}
                  onPress={() => setShowHoursModal(true)}
                >
                  {status.isOpen ? (
                    <>
                      <Text style={styles.statusOpen}>Open</Text>
                      <Text style={[styles.dot, { color: colors.subtitle }]}>•</Text>
                      <Text style={[styles.opensAt, { color: colors.subtitle }]}>
                        {status.openAt} to {status.closeAt}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.statusClosed}>Closed</Text>
                      <Text style={[styles.dot, { color: colors.subtitle }]}>•</Text>
                      <Text style={[styles.opensAt, { color: colors.subtitle }]}>
                        {status.openAt} to {status.closeAt}
                      </Text>
                    </>
                  )}
                  <ChevronDown size={16} color={colors.subtitle} style={{ marginLeft: 4 }} />
                </Pressable>

                {/* ACTION BUTTONS */}
                <View style={styles.actionRow}>
                  <Pressable
                    style={[
                      styles.iconBtn,
                      { borderColor: colors.border, backgroundColor: colors.card },
                    ]}
                  >
                    <Navigation size={18} color="#4B23FF" />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.iconBtn,
                      { borderColor: colors.border, backgroundColor: colors.card },
                    ]}
                  >
                    <Phone size={18} color="#4B23FF" />
                  </Pressable>
                </View>

                {/* TABS */}
                <View
                  onLayout={e => {
                    e.target.measure((x, y, w, h, pageX, pageY) => {
                      tabsAbsoluteY.current = pageY - 60;
                    });
                  }}
                >
                  <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
                    {tabs.map((tab, index) => (
                      <Pressable
                        key={tab}
                        onPress={() => {
                          isProgrammaticScroll.current = true;
                          setActiveTab(index);

                          const y = sectionPositions.current[tab];
                          if (y !== undefined) {
                            scrollRef.current.scrollTo({
                              y: y - 120,
                              animated: true,
                            });
                          }

                          setTimeout(() => {
                            isProgrammaticScroll.current = false;
                          }, 400);
                        }}
                      >
                        <View style={styles.tabItem}>
                          <Text
                            style={[
                              styles.tabText,
                              { color: colors.text },
                              activeTab === index && { color: '#4B23FF' },
                            ]}
                          >
                            {tab}
                          </Text>
                          {activeTab === index && <View style={styles.blueUnderline} />}
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* OFFERS SECTION */}
                <View
                  onLayout={e => {
                    e.target.measure((x, y, w, h, pageX, pageY) => {
                      sectionPositions.current['Offers'] = pageY - 60;
                    });
                  }}
                >
                  <View style={styles.offerBox}>
                    <OfferCard />
                  </View>
                </View>

                <View
                  onLayout={e => {
                    e.target.measure((x, y, w, h, pageX, pageY) => {
                      sectionPositions.current['Menu'] = pageY - 60;
                    });
                  }}
                >
                  <View ref={menuRef}>
                    <MenuSection menu={restaurant.menu} restaurant={restaurant} />
                  </View>
                </View>

                <View
                  onLayout={e => {
                    e.target.measure((x, y, w, h, pageX, pageY) => {
                      sectionPositions.current['Gallery'] = pageY - 60;
                    });
                  }}
                >
                  <View ref={menuRef}>
                    <Gallery navigation={navigation} restaurant={restaurant} />
                  </View>
                </View>

                <View
                  onLayout={e => {
                    e.target.measure((x, y, w, h, pageX, pageY) => {
                      sectionPositions.current['Reviews'] = pageY - 60;
                    });
                  }}
                >
                  <View ref={menuRef}>
                    <Reviews navigation={navigation} restaurant={restaurant} />
                  </View>
                </View>

                <View
                  onLayout={e => {
                    e.target.measure((x, y, w, h, pageX, pageY) => {
                      sectionPositions.current['About'] = pageY - 60;
                    });
                  }}
                >
                  <View ref={menuRef}>
                    <About restaurant={restaurant} />
                  </View>
                </View>
              </View>

              <ExploreRestaurantsSection
                restaurants={restaurants}
                currentRestaurantId={restaurant.id}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </View>

      {/* ---------------- ADDRESS MODAL ---------------- */}
      <Modal visible={showAddressModal} transparent animationType="slide">
        <View style={styles.modalWrapper}>
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowAddressModal(false)}
          />
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {restaurant.name}
            </Text>
            <Text style={[styles.fullAddress, { color: colors.subtitle }]}>
              {restaurant.fullAddress}
            </Text>

            <View style={styles.modalActions}>
              <Pressable style={[styles.callBtn, { borderColor: colors.border }]}>
                <Text style={[styles.callText, { color: colors.text }]}>Call</Text>
              </Pressable>

              <Pressable style={styles.directionBtn}>
                <Text style={styles.directionText}>Directions</Text>
              </Pressable>
            </View>

            <Text style={[styles.availTitle, { color: colors.text }]}>
              Available at this outlet
            </Text>

            <View style={styles.availRow}>
              <Text style={[styles.availItem, { color: colors.subtitle }]}>
                🅿 Standard parking
              </Text>
              <Text style={[styles.availItem, { color: colors.subtitle }]}>
                ♿ Wheelchair access
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* ---------------- OPENING HOURS MODAL ---------------- */}
      <Modal visible={showHoursModal} transparent animationType="slide">
        <View style={styles.modalWrapper}>
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowHoursModal(false)}
          />
          <View style={[styles.hoursModalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.hoursTitle, { color: colors.text }]}>Opening hours</Text>

            {Object.entries(restaurant.openingHours).map(([day, time]) => {
              const today = new Date().toLocaleDateString('en-US', {
                weekday: 'long',
              });
              const isToday = today === day;

              return (
                <View key={day} style={styles.hoursRow}>
                  <Text style={[styles.hoursDay, { color: colors.text }]}>
                    {day}{' '}
                    {isToday && (
                      <Text
                        style={[
                          styles.todayTag,
                          { backgroundColor: colors.border, color: colors.text },
                        ]}
                      >
                        Today
                      </Text>
                    )}
                  </Text>
                  <Text style={[styles.hoursTime, { color: colors.subtitle }]}>
                    {time}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* ---------------- STICKY HEADER ---------------- */}
      {showStickyTitle && (
        <View
          style={[
            styles.headerFixed,
            {
              backgroundColor: stickyBg,
              borderBottomWidth: 1,
              borderBottomColor: stickyBorder,
            },
          ]}
        >
          <Pressable
            style={[styles.headerBtn, { backgroundColor: stickyBtnBg }]}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color={stickyText} />
          </Pressable>

          <Text numberOfLines={1} style={[styles.headerTitle, { color: stickyText }]}>
            {restaurant.name}
          </Text>

          <View style={styles.headerRight}>
            <Pressable style={[styles.headerBtn, { backgroundColor: stickyBtnBg }]}>
              <Bookmark size={22} color={stickyText} />
            </Pressable>
            <Pressable style={[styles.headerBtn, { backgroundColor: stickyBtnBg }]}>
              <Share size={22} color={stickyText} />
            </Pressable>
          </View>
        </View>
      )}

      {/* ---------------- STICKY TABS ---------------- */}
      {showStickyTabs && (
        <View
          style={[
            styles.stickyTabsContainer,
            {
              backgroundColor: stickyBg,
              borderBottomWidth: 1,
              borderBottomColor: stickyBorder,
            },
          ]}
        >
          <View style={[styles.tabs, { borderBottomColor: stickyBorder }]}>
            {tabs.map((tab, index) => (
              <Pressable
                key={tab}
                onPress={() => {
                  isProgrammaticScroll.current = true;
                  setActiveTab(index);

                  const y = sectionPositions.current[tab];
                  if (y !== undefined) {
                    scrollRef.current.scrollTo({
                      y: y - 120,
                      animated: true,
                    });
                  }

                  setTimeout(() => {
                    isProgrammaticScroll.current = false;
                  }, 400);
                }}
              >
                <View style={styles.tabItem}>
                  <Text
                    style={[
                      styles.tabText,
                      { color: stickyText },
                      activeTab === index && { color: '#4B23FF' },
                    ]}
                  >
                    {tab}
                  </Text>
                  {activeTab === index && <View style={styles.blueUnderline} />}
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* ---------------- BOTTOM BUTTONS ---------------- */}
      <View
        style={[
          styles.bottomButtonsContainer,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
        <Pressable
          style={[
            styles.bookTableBtn,
            { borderColor: colors.text, backgroundColor: colors.background },
          ]}
          onPress={() => setShowGuestsModal(true)}
        >
          <Text style={[styles.bookTableText, { color: colors.text }]}>
            Book a table
          </Text>
        </Pressable>

        <Pressable
          style={[styles.payBillBtn, { backgroundColor: colors.text }]}
          onPress={() => navigation.navigate('Paybill', { restaurant })}
        >
          <Text style={[styles.payBillText, { color: colors.background }]}>
            Pay bill
          </Text>
        </Pressable>
      </View>

      <BookGuestsModal
        visible={showGuestsModal}
        onClose={() => setShowGuestsModal(false)}
        onContinue={guests => {
          setShowGuestsModal(false);
          navigation.navigate('BookTableScreen', { restaurant, guests });
        }}
      />
    </View>
  );
}

/* ==========================================================
      STYLES (unchanged structure — only dynamic colors applied above)
=========================================================== */
const styles = StyleSheet.create({
  galleryContainer: {
    width: '100%',
    height: 330,
    position: 'relative',
  },
  zoomWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageGrid: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
    paddingTop: 10,
    gap: 8,
  },
  largeImg: {
    width: width * 0.63,
    height: '100%',
    borderRadius: 18,
  },
  rightGrid: {
    flex: 1,
  },
  smallImg: {
    width: '100%',
    height: '48%',
    borderRadius: 18,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  indicator: {
    width: 20,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 3,
  },
  indicatorActive: {
    backgroundColor: '#555',
  },

  backBtn: {
    position: 'absolute',
    top: 25,
    left: 15,
    backgroundColor: 'rgba(255,255,255,0.75)',
    padding: 10,
    borderRadius: 30,
  },

  rightButtons: {
    position: 'absolute',
    top: 25,
    right: 15,
    flexDirection: 'row',
    gap: 10,
  },

  circleBtn: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    padding: 10,
    borderRadius: 30,
  },

  infoBox: {
    padding: 20,
    paddingBottom: 120,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 24,
    fontWeight: '700',
  },

  ratingWrapper: {
    alignItems: 'center',
    width: 60,
  },

  ratingTop: {
    backgroundColor: '#3AB757',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  ratingTopText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  ratingStar: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  ratingBottom: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 2,
    width: '100%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },

  ratingBottomText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#333',
    fontWeight: '700',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  locationText: {
    fontSize: 15,
    fontWeight: '500',
  },

  subText: {
    marginTop: 6,
    fontSize: 14,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  statusOpen: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '700',
  },

  statusClosed: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '700',
  },

  dot: {
    marginHorizontal: 6,
    color: '#666',
  },

  opensAt: {
    fontSize: 14,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },

  iconBtn: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabs: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },

  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },

  tabItem: {
    alignItems: 'center',
  },

  blueUnderline: {
    marginTop: 6,
    height: 3,
    width: 50,
    backgroundColor: '#4B23FF',
    borderRadius: 3,
  },

  offerBox: {
    marginTop: 25,
  },

  /* ------ MODALS ------ */

  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalOverlay: {
    flex: 1,
  },

  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  fullAddress: {
    marginTop: 10,
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
  },

  modalActions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },

  callBtn: {
    borderWidth: 1,
    borderColor: '#999',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  callText: {
    fontWeight: '600',
  },

  directionBtn: {
    backgroundColor: '#4B23FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  directionText: {
    color: '#fff',
    fontWeight: '700',
  },

  availTitle: {
    marginTop: 25,
    fontSize: 16,
    fontWeight: '700',
  },

  availRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  availItem: {
    fontSize: 14,
    color: '#444',
  },

  hoursModalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  hoursTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },

  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  hoursDay: {
    fontSize: 15,
    fontWeight: '600',
  },

  hoursTime: {
    fontSize: 15,
    color: '#444',
  },

  todayTag: {
    backgroundColor: '#EEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 12,
  },

  viewGalleryBtn: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  viewGalleryText: {
    fontSize: 13,
    fontWeight: '600',
  },

  stickyTabsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingLeft: 16,
  },

  headerBtn: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 10,
    borderRadius: 30,
  },

  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },

  headerTitle: {
    position: 'absolute',
    left: 60,
    right: 60,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  /* ------ BOTTOM BUTTONS ------ */
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
    zIndex: 300,
  },

  bookTableBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#000',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bookTableText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  payBillBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  payBillText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },

  headerFixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 500,
    height: 60,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
});
