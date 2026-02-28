import React, { useState, useMemo, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { ThemeContext } from '../App';

const { width } = Dimensions.get('window');

export default function AllReviewsScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const { colors } = useContext(ThemeContext);

  /* ------------------------------------
        FILTER / SORT STATE
  ------------------------------------- */
  const [activeFilters, setActiveFilters] = useState(['Latest']);
  const [sortBy, setSortBy] = useState('Latest');
  const [category, setCategory] = useState(null);
  const [types, setTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Sticky state
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const filtersAbsoluteY = useRef(0);
  const scrollY = useRef(0);

  // Theme helpers (only colors; no layout change)
  const isDark = colors.background === '#0D0D0D';
  const surface = colors.background; // main bg
  const card = colors.background; // keep same white-card look in light, dark becomes dark surface
  const border = colors.border;
  const text = colors.text;
  const subtitle = colors.subtitle;

  // To preserve your “Zomato style” while still being readable in dark mode:
  const subtleBorder = border; // replaces #eee
  const chipBorder = isDark ? '#555555' : '#aaa';
  const barBg = isDark ? '#2A2A2A' : '#eee';
  const barFill = isDark ? '#F5F5F5' : '#000';
  const modalOverlay = 'rgba(0,0,0,0.3)';

  // Existing accent colors (UI unchanged)
  const accent = '#4B23FF';
  const green = '#3AB757';

  const toggleQuickFilter = filter => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const toggleType = type => {
    if (types.includes(type)) {
      setTypes(types.filter(t => t !== type));
    } else {
      setTypes([...types, type]);
    }
  };

  const clearAllFilters = () => {
    setSortBy('Latest');
    setCategory(null);
    setTypes([]);
    setActiveFilters([]);
  };

  /* ------------------------------------
        STAR DISTRIBUTION (Dummy)
  ------------------------------------- */
  const starDistribution = {
    5: 0.7,
    4: 0.2,
    3: 0.05,
    2: 0.03,
    1: 0.02,
  };

  /* ------------------------------------
        FILTER + SORT LOGIC
  ------------------------------------- */
  const filteredReviews = useMemo(() => {
    let reviews = [...restaurant.reviews];

    if (sortBy === 'Latest') {
      reviews.sort((a, b) => a.daysAgo - b.daysAgo);
    } else if (sortBy === 'High Rating') {
      reviews.sort((a, b) => b.rating - a.rating);
    }

    if (activeFilters.includes('High Ratings')) {
      reviews = reviews.filter(r => r.rating >= 4);
    }

    if (
      activeFilters.includes('Detailed Reviews') ||
      types.includes('Detailed Reviews')
    ) {
      reviews = reviews.filter(r => r.text.length >= 60);
    }

    if (activeFilters.includes('Blogs') || category === 'Blogs') {
      reviews = reviews.filter(r => r.isBlog === true);
    }

    if (activeFilters.includes('With Photos') || types.includes('With Photos')) {
      reviews = reviews.filter(r => r.photo);
    }

    return reviews;
  }, [activeFilters, sortBy, types, category, restaurant.reviews]);

  /* ------------------------------------
        FILTER CHIPS COMPONENT
  ------------------------------------- */
  const FilterChips = () => (
    <View style={{ paddingLeft: 16, paddingVertical: 12 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16, gap: 10 }}
      >
        {/* FILTERS BUTTON */}
        <Pressable
          style={[
            styles.filterBtn,
            { borderColor: chipBorder, backgroundColor: surface },
          ]}
          onPress={() => setShowModal(true)}
        >
          <Text style={[styles.filterBtnText, { color: text }]}>Filters ⌄</Text>
        </Pressable>

        {/* HORIZONTAL QUICK FILTER CHIPS */}
        {[
          'Latest',
          'Verified',
          'With Photos',
          'Detailed Reviews',
          'High Ratings',
          'Blogs',
          'Relevance',
        ].map(chip => {
          const isActive = activeFilters.includes(chip);

          return (
            <Pressable
              key={chip}
              style={[
                isActive ? styles.chipActive : styles.chip,
                isActive
                  ? { backgroundColor: isDark ? 'rgba(75,35,255,0.22)' : '#EAE3FF' }
                  : { borderColor: chipBorder, backgroundColor: surface },
              ]}
              onPress={() => toggleQuickFilter(chip)}
            >
              <Text
                style={[
                  isActive ? styles.chipActiveText : styles.chipText,
                  { color: isActive ? accent : text },
                ]}
              >
                {chip} {isActive ? '✕' : ''}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ---------- HEADER ---------- */}
      <View
        style={[
          styles.header,
          { backgroundColor: surface, borderBottomColor: subtleBorder },
        ]}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={26} color={text} />
        </Pressable>
        <Text numberOfLines={1} style={[styles.title, { color: text }]}>
          {restaurant.name}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={e => {
          const y = e.nativeEvent.contentOffset.y;
          scrollY.current = y;

          if (y >= filtersAbsoluteY.current) {
            setShowStickyFilters(true);
          } else {
            setShowStickyFilters(false);
          }
        }}
        scrollEventThrottle={16}
      >
        {/* ---------- RATING OVERVIEW ---------- */}
        <View style={styles.ratingRow}>
          <View style={styles.leftRatingCard}>
            <View style={[styles.greenBox, { backgroundColor: green }]}>
              <Text style={styles.greenRating}>{restaurant.rating}</Text>
              <Text style={styles.greenStar}>★</Text>
            </View>
            <Text style={[styles.basedOn, { color: subtitle }]}>
              Based on {restaurant.totalRatings}+ ratings
            </Text>
          </View>

          {/* STAR DISTRIBUTION */}
          <View style={styles.distCol}>
            {Object.entries(starDistribution)
              .sort((a, b) => b[0] - a[0])
              .map(([star, val]) => (
                <View key={star} style={styles.distRow}>
                  <Text style={[styles.starLabel, { color: text }]}>
                    {star} ★
                  </Text>
                  <View style={[styles.barBg, { backgroundColor: barBg }]}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${val * 100}%`, backgroundColor: barFill },
                      ]}
                    />
                  </View>
                </View>
              ))}
          </View>
        </View>

        {/* ---------- CATEGORY RATINGS ---------- */}
        <View
          style={[
            styles.categoriesRow,
            { borderColor: subtleBorder },
          ]}
        >
          <View style={styles.catCol}>
            <Text style={[styles.catRating, { color: text }]}>
              {restaurant.foodRating}
            </Text>
            <Text style={[styles.catLabel, { color: subtitle }]}>Food</Text>
          </View>
          <View style={styles.catCol}>
            <Text style={[styles.catRating, { color: text }]}>
              {restaurant.beveragesRating ?? 4.3}
            </Text>
            <Text style={[styles.catLabel, { color: subtitle }]}>Beverages</Text>
          </View>
          <View style={styles.catCol}>
            <Text style={[styles.catRating, { color: text }]}>
              {restaurant.serviceRating}
            </Text>
            <Text style={[styles.catLabel, { color: subtitle }]}>Service</Text>
          </View>
          <View style={styles.catCol}>
            <Text style={[styles.catRating, { color: text }]}>
              {restaurant.ambienceRating}
            </Text>
            <Text style={[styles.catLabel, { color: subtitle }]}>Ambience</Text>
          </View>
        </View>

        {/* ---------- FILTERS ROW ---------- */}
        <View
          onLayout={e => {
            e.target.measure((x, y, w, h, pageX, pageY) => {
              filtersAbsoluteY.current = pageY - 60;
            });
          }}
        >
          <FilterChips />
        </View>

        {/* ---------- REVIEW LIST ---------- */}
        <FlatList
          data={filteredReviews}
          scrollEnabled={false}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.reviewCard,
                {
                  backgroundColor: card,
                  borderColor: subtleBorder,
                },
              ]}
            >
              <View style={styles.reviewHeader}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />

                <View style={{ flex: 1 }}>
                  <Text style={[styles.username, { color: text }]}>
                    {item.username}
                  </Text>
                  <Text style={[styles.timeAgo, { color: subtitle }]}>
                    {item.daysAgo} days ago
                  </Text>
                </View>

                <View style={[styles.ratingBadge, { backgroundColor: green }]}>
                  <Text style={styles.badgeText}>{item.rating}</Text>
                  <Text style={styles.badgeStar}>★</Text>
                </View>
              </View>

              <Text style={[styles.reviewText, { color: subtitle }]}>
                {item.text}
              </Text>

              {item.photo && (
                <Image source={{ uri: item.photo }} style={styles.reviewPhoto} />
              )}
            </View>
          )}
        />
      </ScrollView>

      {/* ---------- STICKY FILTERS ---------- */}
      {showStickyFilters && (
        <View
          style={[
            styles.stickyFiltersContainer,
            { backgroundColor: surface, borderBottomColor: subtleBorder },
          ]}
        >
          <FilterChips />
        </View>
      )}

      {/* ---------- BOTTOM BUTTON ---------- */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: surface, borderColor: subtleBorder },
        ]}
      >
        <Pressable
          style={[
            styles.reviewButton,
            { backgroundColor: isDark ? '#F5F5F5' : '#000' },
          ]}
          onPress={() => navigation.navigate('LeaveReview', { restaurant })}
        >
          <Text
            style={[
              styles.reviewButtonText,
              { color: isDark ? '#000' : '#fff' },
            ]}
          >
            Leave a review
          </Text>
        </Pressable>
      </View>

      {/* ==========================================================
                     FILTERS BOTTOM SHEET MODAL
      ========================================================== */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: modalOverlay }]}>
          <Pressable style={{ flex: 1 }} onPress={() => setShowModal(false)} />

          <View
            style={[
              styles.modalBox,
              { backgroundColor: surface, borderColor: subtleBorder },
            ]}
          >
            <View style={[styles.dragHandle, { backgroundColor: isDark ? '#666' : '#ccc' }]} />

            {/* -------- SORT BY -------- */}
            <Text style={[styles.modalSectionTitle, { color: text }]}>
              Sort By
            </Text>
            {['Relevance', 'Latest', 'High Rating'].map(s => (
              <Pressable
                key={s}
                style={styles.modalOption}
                onPress={() => setSortBy(s)}
              >
                <Text style={[styles.modalOptionText, { color: text }]}>{s}</Text>
                <Text style={[styles.radioCircle, { color: text }]}>
                  {sortBy === s ? '●' : '○'}
                </Text>
              </Pressable>
            ))}

            {/* -------- CATEGORY -------- */}
            <Text style={[styles.modalSectionTitle, { color: text }]}>
              Category
            </Text>
            <Pressable
              style={styles.modalOption}
              onPress={() => setCategory(category === 'Blogs' ? null : 'Blogs')}
            >
              <Text style={[styles.modalOptionText, { color: text }]}>Blogs</Text>
              <Text style={[styles.radioCircle, { color: text }]}>
                {category === 'Blogs' ? '●' : '○'}
              </Text>
            </Pressable>

            {/* -------- TYPE -------- */}
            <Text style={[styles.modalSectionTitle, { color: text }]}>Type</Text>

            {['With Photos', 'Verified', 'Detailed Reviews'].map(t => (
              <Pressable
                key={t}
                style={styles.modalOption}
                onPress={() => toggleType(t)}
              >
                <Text style={[styles.modalOptionText, { color: text }]}>{t}</Text>
                <Text style={[styles.radioCircle, { color: text }]}>
                  {types.includes(t) ? '●' : '○'}
                </Text>
              </Pressable>
            ))}

            {/* -------- BUTTONS -------- */}
            <View style={styles.modalButtons}>
              <Pressable
                style={[
                  styles.clearBtn,
                  { backgroundColor: isDark ? '#222' : '#F3F3F3' },
                ]}
                onPress={clearAllFilters}
              >
                <Text style={[styles.clearBtnText, { color: text }]}>
                  Clear All
                </Text>
              </Pressable>

              <Pressable
                style={[styles.applyBtn, { backgroundColor: accent }]}
                onPress={() => {
                  setShowModal(false);
                  setActiveFilters([
                    ...(sortBy ? [sortBy] : []),
                    ...(category ? [category] : []),
                    ...types,
                  ]);
                }}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ==========================================================
      STYLES — UI UNCHANGED (only colors overridden inline)
=========================================================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: { padding: 6, marginRight: 10 },
  title: { fontSize: 22, fontWeight: '700', color: '#000' },

  /* --- Rating Overview --- */
  ratingRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 10 },
  leftRatingCard: { width: width * 0.33, alignItems: 'center' },

  greenBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3AB757',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  greenRating: { color: '#fff', fontSize: 20, fontWeight: '700' },
  greenStar: { color: '#fff', marginLeft: 4, fontWeight: '700' },
  basedOn: { marginTop: 4, fontSize: 13, color: '#555' },

  distCol: { flex: 1, paddingLeft: 20 },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  starLabel: { width: 28, fontSize: 14 },
  barBg: { flex: 1, height: 6, backgroundColor: '#eee', borderRadius: 4 },
  barFill: { height: 6, backgroundColor: '#000', borderRadius: 4 },

  /* --- Category Ratings --- */
  categoriesRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 16,
  },
  catCol: { alignItems: 'center' },
  catRating: { fontSize: 18, fontWeight: '700' },
  catLabel: { marginTop: 4, fontSize: 14, color: '#555' },

  /* --- Quick Filters --- */
  filterBtn: {
    borderWidth: 1,
    borderColor: '#aaa',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  filterBtnText: { fontSize: 15, fontWeight: '600' },

  chip: {
    borderWidth: 1,
    borderColor: '#aaa',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chipText: { fontSize: 15 },

  chipActive: {
    backgroundColor: '#EAE3FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActiveText: {
    color: '#4B23FF',
    fontWeight: '600',
  },

  /* --- Sticky Filters --- */
  stickyFiltersContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    zIndex: 400,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  /* --- Review Card --- */
  reviewCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
  },

  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  username: { fontSize: 16, fontWeight: '600' },
  timeAgo: { fontSize: 13, color: '#888' },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3AB757',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  badgeStar: { color: '#fff', marginLeft: 3 },

  reviewText: { fontSize: 14, color: '#444', marginTop: 4 },
  reviewPhoto: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginTop: 10,
  },

  /* --- Bottom Button --- */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  reviewButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 30,
  },
  reviewButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  /* --- Bottom Sheet Modal --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },

  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 10,
  },

  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  modalOptionText: { fontSize: 16 },
  radioCircle: { fontSize: 18 },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
  },
  clearBtnText: { fontSize: 16, fontWeight: '600' },

  applyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    backgroundColor: '#4B23FF',
  },
  applyBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
