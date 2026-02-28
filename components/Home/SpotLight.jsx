import React, { useRef, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import { Bookmark, BookmarkCheck } from 'lucide-react-native';
import { VolumeX, Volume2 } from 'lucide-react-native';

import { ThemeContext } from '../../App';

const { width } = Dimensions.get('window');

const originalData = [
  {
    id: 1,
    type: 'image',
    media: 'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg',
    title: 'Beauty Essentials',
    subtitle: 'Skincare & glam picks',
    date: 'Sat, 6 Dec, 8:00 PM',
    location: 'Hyderabad',
    isSaved: false,
  },
  {
    id: 2,
    type: 'image',
    media: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg',
    title: 'Fashion Forward',
    subtitle: 'Trendy fits for your wardrobe',
    date: 'Sun, 7 Dec, 6:00 PM',
    location: 'Mumbai',
    isSaved: false,
  },
  {
    id: 3,
    type: 'image',
    media: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
    title: 'Accessorize Boldly',
    subtitle: 'Statement pieces for your look',
    date: 'Mon, 8 Dec, 5:30 PM',
    location: 'Delhi',
    isSaved: false,
  },
  {
    id: 4,
    type: 'image',
    media: 'https://images.pexels.com/photos/1456716/pexels-photo-1456716.jpeg',
    title: 'Lifestyle Favourites',
    subtitle: 'Curated everyday essentials',
    date: 'Tue, 9 Dec, 4:00 PM',
    location: 'Hyderabad',
    isSaved: false,
  },
  {
    id: 5,
    type: 'image',
    media: 'https://images.pexels.com/photos/2811088/pexels-photo-2811088.jpeg',
    title: 'Home & Gifting',
    subtitle: 'Decor that speaks elegance',
    date: 'Wed, 10 Dec, 7:00 PM',
    location: 'Bangalore',
    isSaved: false,
  },
];

const CARD_WIDTH = width * 0.82;
const SPACING = 2;
const SIDE_SPACING = (width - CARD_WIDTH) / 2 - SPACING;

export default function FoodieFrontrow({ onLoadingChange }) {
  const { colors } = useContext(ThemeContext);

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(originalData.length * 2);

  // 🔥 Notify parent when any media starts or stops loading
  const handleLoadStartAll = () => onLoadingChange?.(true);
  const handleLoadEndAll = () => onLoadingChange?.(false);

  const infiniteData = [
    ...originalData,
    ...originalData,
    ...originalData,
    ...originalData,
    ...originalData,
  ];

  const initialScrollIndex = originalData.length * 2;

  const getItemLayout = (_, index) => ({
    length: CARD_WIDTH + SPACING,
    offset: (CARD_WIDTH + SPACING) * index,
    index,
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: event => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / (CARD_WIDTH + SPACING));
        if (index !== activeIndex) setActiveIndex(index);
      },
    },
  );

  const onScrollEnd = e => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING),
    );

    if (index <= originalData.length || index >= originalData.length * 3) {
      const targetIndex =
        (index % originalData.length) + originalData.length * 2;

      setActiveIndex(targetIndex);
      flatListRef.current?.scrollToIndex({
        index: targetIndex,
        animated: false,
      });
    }
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING),
    ];

    const scaleY = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp',
    });

    const isActive = index === activeIndex;

    return (
      <Animated.View
        style={[styles.cardContainer, { transform: [{ scaleY }], opacity }]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.mediaContainer}>
            {item.type === 'video' ? (
              <>
                <Video
                  source={{ uri: item.media }}
                  style={styles.media}
                  resizeMode="cover"
                  repeat
                  muted={muted}
                  paused={!isActive}
                  onLoadStart={handleLoadStartAll}
                  onLoad={handleLoadEndAll}
                />

                <TouchableOpacity
                  style={[
                    styles.muteBtn,
                    { backgroundColor: colors.background + 'AA' },
                  ]}
                  onPress={() => setMuted(!muted)}
                >
                  {muted ? (
                    <VolumeX color={colors.text} size={22} />
                  ) : (
                    <Volume2 color={colors.text} size={22} />
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <Image
                source={{ uri: item.media }}
                style={styles.media}
                onLoadStart={handleLoadStartAll}
                onLoadEnd={handleLoadEndAll}
              />
            )}
          </View>

          <View style={[styles.footer, { backgroundColor: colors.card }]}>
            <Text style={[styles.eventDate]}>{item.date}</Text>

            <View style={styles.titleRow}>
              <Text
                style={[styles.eventTitle, { color: colors.text }]}
                numberOfLines={2}
              >
                {item.title}
              </Text>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.card }]}
                onPress={() => console.log("Save pressed")}
              >
                <Bookmark size={22} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={{ marginTop: 30 }}>
      {/* Heading */}
      <View style={styles.headingContainer}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', colors.subtitle + '30']}
          style={styles.lineGradientLeft}
        />
        <Text style={[styles.heading, { color: colors.text }]}>
          IN THE SPOTLIGHT
        </Text>
        <LinearGradient
          colors={[colors.subtitle + '30', 'rgba(0,0,0,0)']}
          style={styles.lineGradientRight}
        />
      </View>

      {/* Carousel */}
      <Animated.FlatList
        ref={flatListRef}
        data={infiniteData}
        horizontal
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SIDE_SPACING }}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialScrollIndex}
        onMomentumScrollEnd={onScrollEnd}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={true}
        alwaysBounceHorizontal={true}
      />
    </View>
  );
}

/* ---------------------------------------- */
/*                 STYLES                   */
/* ---------------------------------------- */

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    padding: 10,
  },

  lineGradientLeft: { flex: 1, height: 1, marginRight: 12 },
  lineGradientRight: { flex: 1, height: 1, marginLeft: 12 },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  cardContainer: {
    width: CARD_WIDTH,
    marginRight: SPACING,
    height: 600,
    justifyContent: 'center',
  },

  card: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),

    marginHorizontal: 10,
  },

  mediaContainer: {
    flex: 1,
    position: 'relative',
  },

  media: {
    width: '100%',
    height: '100%',
  },

  muteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    borderRadius: 20,
  },

  textBox: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
  },

  footer: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  eventDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6D6F00',
    marginBottom: 6,
  },

  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  eventLocation: {
    fontSize: 14,
    fontWeight: '500',
  },

  saveButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
});
