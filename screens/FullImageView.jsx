import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Pressable,
  Animated,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { ThemeContext } from '../App';
import { useContext } from 'react';

const { width, height } = Dimensions.get('window');

export default function FullImageView({ route, navigation }) {
  const { images, startIndex = 0, name, costForTwo } = route.params;
  const { colors } = useContext(ThemeContext);

  const scrollX = useRef(new Animated.Value(startIndex * width)).current;
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(startIndex);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER (Back + Name + Cost) */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={26} color={colors.text} />
        </Pressable>

        <View>
          <Text style={[styles.title, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.subTitle, { color: colors.subtitle }]}>₹{costForTwo} for two</Text>
        </View>
      </View>

      {/* MAIN FULLSCREEN IMAGE VIEWER */}
      <Animated.FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={startIndex}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        renderItem={({ item }) => (
          <View style={{ width, height: height * 0.55 }}>
            <Image source={{ uri: item }} style={styles.fullImage} />
          </View>
        )}
      />

      {/* THUMBNAIL STRIP */}
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbRow}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          const isSelected = index === activeIndex;

          return (
            <Pressable
              onPress={() =>
                flatListRef.current.scrollToIndex({ index, animated: true })
              }
              style={[
                styles.thumbWrapper,
                isSelected && styles.thumbSelectedWrapper,
              ]}
            >
              <Image
                source={{ uri: item }}
                style={[
                  styles.thumbnail,
                  isSelected && styles.selectedThumbnail,
                ]}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

/* ==========================================================
      STYLES — EXACTLY LIKE THE SCREENSHOT
=========================================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },

  backBtn: {
    padding: 6,
    marginRight: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },

  subTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },

  /* MAIN IMAGE */
  fullImage: {
    width: width,
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },

  /* FOOTER TEXT */
  postedText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14,
    color: '#666',
  },

  /* THUMBNAIL STRIP */
  thumbRow: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    gap: 12,
  },

  thumbWrapper: {
    width: 110,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
  },

  thumbSelectedWrapper: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
  },

  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  selectedThumbnail: {
    opacity: 1,
  },
});
