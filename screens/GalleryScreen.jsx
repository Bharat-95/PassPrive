import React, { useState, useContext } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  Text,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { ThemeContext } from '../App';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 3;

export default function GalleryScreen({ route, navigation }) {
  const {
    foodImages = [],
    ambienceImages = [],
    name,
    costForTwo,
  } = route.params;

  const allImages = [...foodImages, ...ambienceImages];

  const { colors, mode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Food', 'Ambience'];

  const getImagesForTab = () => {
    if (activeTab === 'Food') return foodImages;
    if (activeTab === 'Ambience') return ambienceImages;
    return allImages;
  };

  const imagesToShow = getImagesForTab();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={26} color={colors.text} />
        </Pressable>

        <View style={styles.titleBox}>
          <Text style={[styles.title, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.subTitle, { color: colors.subtitle }]}>
            ₹{costForTwo} for two
          </Text>
        </View>
      </View>

      {/* CATEGORY TABS */}
      <View
        style={[
          styles.categoryWrapper,
          { backgroundColor: mode === 'dark' ? '#1A1A1A' : '#F2F2F2' },
        ]}
      >
        {tabs.map(t => {
          const isActive = activeTab === t;

          return (
            <Pressable
              key={t}
              onPress={() => setActiveTab(t)}
              style={[
                styles.tab,
                { backgroundColor: isActive ? (mode === 'dark' ? '#fff' : '#000') : 'transparent' },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive
                      ? mode === 'dark'
                        ? '#000'
                        : '#fff'
                      : mode === 'dark'
                      ? '#ccc'
                      : '#555',
                  },
                ]}
              >
                {t}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* IMAGE GRID */}
      <FlatList
        data={imagesToShow}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 16 }}
        columnWrapperStyle={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          gap: 10,
          marginTop: 10,
        }}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.imageWrapper}
            onPress={() =>
              navigation.navigate("FullImageView", {
                images: imagesToShow,   // pass filtered images
                startIndex: index,      // which image user clicked
                name: name
              })
            }
          >
            <Image source={{ uri: item }} style={styles.gridImage} />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backBtn: { padding: 6 },

  categoryWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginHorizontal: 16,
    borderRadius: 30,
    justifyContent: 'space-between',
    marginTop: 10,
  },

  tab: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 22,
  },

  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  titleBox: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 6,
  },

  title: { fontSize: 20, fontWeight: '700' },

  subTitle: { fontSize: 15, fontWeight: '500', marginTop: 2 },

  gridImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 14,
  },
});
