import React, { useRef, useState, useContext } from 'react';
import { View, Text, StyleSheet, Animated, FlatList } from 'react-native';

import { ThemeContext } from '../../App';
import LinearGradient from 'react-native-linear-gradient';

import StoresCard from './StoresCard';
import StoreFilters from './StoreFilters';

/* -------------------------------------------------------
    🔥 DUMMY STORES DATA
--------------------------------------------------------- */
// StoresList.js (or storesList.ts)
// ✅ Added: catalogue.categories -> each category has items with {id, title, price, image}

// storesList.js (or StoresList.js)

export const CATALOGUE_TEMPLATES = [
  {
    id: 'winter-wear',
    title: 'Winter Wear',
    startingFrom: 2999,
    items: [
      {
        key: 'ww-1',
        title: 'Puffer Jacket - Black',
        price: 8999,
        image:
          'https://images.pexels.com/photos/6347538/pexels-photo-6347538.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'ww-2',
        title: 'Oversized Hoodie - Beige',
        price: 4599,
        image:
          'https://images.pexels.com/photos/5698855/pexels-photo-5698855.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'ww-3',
        title: 'Winter Knit - Grey',
        price: 3499,
        image:
          'https://images.pexels.com/photos/6311386/pexels-photo-6311386.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'ww-4',
        title: 'Long Coat - Camel',
        price: 11999,
        image:
          'https://images.pexels.com/photos/5699106/pexels-photo-5699106.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'ww-5',
        title: 'Beanie + Scarf Set',
        price: 1999,
        image:
          'https://images.pexels.com/photos/6347547/pexels-photo-6347547.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'ww-6',
        title: 'Quilted Jacket - Olive',
        price: 9999,
        image:
          'https://images.pexels.com/photos/6347537/pexels-photo-6347537.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'ww-7',
        title: 'Thermal Set - Navy',
        price: 2799,
        image:
          'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
    ],
  },

  {
    id: 'stranger-things',
    title: 'Stranger Thing Collection',
    startingFrom: 9999,
    items: [
      {
        key: 'st-1',
        title: 'Hype Hoodie - Graphic',
        price: 9999,
        image:
          'https://images.pexels.com/photos/5698853/pexels-photo-5698853.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'st-2',
        title: 'Street Sweatshirt - Black',
        price: 8999,
        image:
          'https://images.pexels.com/photos/5698857/pexels-photo-5698857.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'st-3',
        title: 'Limited Tee - White',
        price: 4999,
        image:
          'https://images.pexels.com/photos/5699107/pexels-photo-5699107.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'st-4',
        title: 'Varsity Jacket - Red',
        price: 15999,
        image:
          'https://images.pexels.com/photos/5699108/pexels-photo-5699108.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'st-5',
        title: 'Cap - Black Edition',
        price: 2499,
        image:
          'https://images.pexels.com/photos/6311572/pexels-photo-6311572.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'st-6',
        title: 'Sneaker Drop - Retro',
        price: 13999,
        image:
          'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'st-7',
        title: 'Bag - Collector’s',
        price: 6999,
        image:
          'https://images.pexels.com/photos/7319155/pexels-photo-7319155.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
    ],
  },

  {
    id: 'hot-drops',
    title: 'Hot Drops',
    startingFrom: 7999,
    items: [
      {
        key: 'hd-1',
        title: 'Drop Tee - Neon',
        price: 7999,
        image:
          'https://images.pexels.com/photos/5699109/pexels-photo-5699109.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'hd-2',
        title: 'Drop Hoodie - Grey',
        price: 12999,
        image:
          'https://images.pexels.com/photos/5698856/pexels-photo-5698856.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'hd-3',
        title: 'Drop Jacket - Blue',
        price: 17999,
        image:
          'https://images.pexels.com/photos/6347539/pexels-photo-6347539.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'hd-4',
        title: 'Drop Pants - Black',
        price: 8999,
        image:
          'https://images.pexels.com/photos/6311571/pexels-photo-6311571.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'hd-5',
        title: 'Drop Sneakers - White',
        price: 14999,
        image:
          'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'hd-6',
        title: 'Drop Cap - Olive',
        price: 1999,
        image:
          'https://images.pexels.com/photos/6311570/pexels-photo-6311570.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'hd-7',
        title: 'Drop Bag - Mini',
        price: 4999,
        image:
          'https://images.pexels.com/photos/7319156/pexels-photo-7319156.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
    ],
  },

  {
    id: 'sneakers',
    title: 'Sneakers',
    startingFrom: 6999,
    items: [
      {
        key: 'sn-1',
        title: 'Yeezy Boost 700 Faded Azure',
        price: 13399,
        image:
          'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'sn-2',
        title: 'High-Top Retro - Grey',
        price: 12999,
        image:
          'https://images.pexels.com/photos/2529150/pexels-photo-2529150.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'sn-3',
        title: 'Low-Top Color Pop',
        price: 10999,
        image:
          'https://images.pexels.com/photos/2529151/pexels-photo-2529151.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'sn-4',
        title: 'Runner Sneaker - Red',
        price: 8999,
        image:
          'https://images.pexels.com/photos/2529152/pexels-photo-2529152.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'sn-5',
        title: 'Skate Sneaker - Yellow',
        price: 9999,
        image:
          'https://images.pexels.com/photos/2529153/pexels-photo-2529153.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'sn-6',
        title: 'Classic White Sneaker',
        price: 7999,
        image:
          'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'sn-7',
        title: 'Minimal Sneaker - Cream',
        price: 8499,
        image:
          'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
    ],
  },

  {
    id: 'mens-wear',
    title: 'Mens Wear',
    startingFrom: 2499,
    items: [
      {
        key: 'mw-1',
        title: 'Overshirt - Stone',
        price: 3499,
        image:
          'https://images.pexels.com/photos/6347535/pexels-photo-6347535.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'mw-2',
        title: 'Relaxed Tee - Black',
        price: 2499,
        image:
          'https://images.pexels.com/photos/5699105/pexels-photo-5699105.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'mw-3',
        title: 'Denim Jacket - Blue',
        price: 7999,
        image:
          'https://images.pexels.com/photos/6347536/pexels-photo-6347536.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'mw-4',
        title: 'Cargo Pants - Olive',
        price: 4999,
        image:
          'https://images.pexels.com/photos/6311571/pexels-photo-6311571.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'mw-5',
        title: 'Sneaker - Black Gum',
        price: 9999,
        image:
          'https://images.pexels.com/photos/2529154/pexels-photo-2529154.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'mw-6',
        title: 'Classic Shirt - White',
        price: 3299,
        image:
          'https://images.pexels.com/photos/5698854/pexels-photo-5698854.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'mw-7',
        title: 'Zip Hoodie - Grey',
        price: 4599,
        image:
          'https://images.pexels.com/photos/5698855/pexels-photo-5698855.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
    ],
  },

  {
    id: 'kids-wear',
    title: 'Kids Wear',
    startingFrom: 999,
    items: [
      {
        key: 'kw-1',
        title: 'Kids Hoodie - Sky Blue',
        price: 1599,
        image:
          'https://images.pexels.com/photos/5905924/pexels-photo-5905924.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'kw-2',
        title: 'Kids Jacket - Yellow',
        price: 2499,
        image:
          'https://images.pexels.com/photos/5905925/pexels-photo-5905925.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'kw-3',
        title: 'Kids Tee - Graphic',
        price: 999,
        image:
          'https://images.pexels.com/photos/5905926/pexels-photo-5905926.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'kw-4',
        title: 'Kids Sneakers - White',
        price: 2999,
        image:
          'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'kw-5',
        title: 'Kids Set - Winter',
        price: 1999,
        image:
          'https://images.pexels.com/photos/5905927/pexels-photo-5905927.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'kw-6',
        title: 'Kids Cap - Red',
        price: 799,
        image:
          'https://images.pexels.com/photos/6311572/pexels-photo-6311572.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'kw-7',
        title: 'Kids Backpack - Mini',
        price: 1499,
        image:
          'https://images.pexels.com/photos/7319155/pexels-photo-7319155.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
    ],
  },

  {
    id: 'women-wear',
    title: 'Women Wear',
    startingFrom: 1999,
    items: [
      {
        key: 'wwm-1',
        title: 'Coat - Ivory',
        price: 10999,
        image:
          'https://images.pexels.com/photos/5699106/pexels-photo-5699106.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'wwm-2',
        title: 'Hoodie - Soft Pink',
        price: 4599,
        image:
          'https://images.pexels.com/photos/5698855/pexels-photo-5698855.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'wwm-3',
        title: 'Dress - Black',
        price: 7999,
        image:
          'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'wwm-4',
        title: 'Sneaker - Cream',
        price: 8499,
        image:
          'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'wwm-5',
        title: 'Bag - Tan',
        price: 6999,
        image:
          'https://images.pexels.com/photos/7319156/pexels-photo-7319156.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'wwm-6',
        title: 'Sweater - Grey',
        price: 3499,
        image:
          'https://images.pexels.com/photos/6311386/pexels-photo-6311386.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'wwm-7',
        title: 'Top - White',
        price: 1999,
        image:
          'https://images.pexels.com/photos/5699107/pexels-photo-5699107.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
    ],
  },

  {
    id: 'global-hype',
    title: 'Global Hype',
    startingFrom: 8999,
    items: [
      {
        key: 'gh-1',
        title: 'Global Hoodie - Limited',
        price: 13999,
        image:
          'https://images.pexels.com/photos/5698857/pexels-photo-5698857.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'gh-2',
        title: 'Global Sneaker - Retro',
        price: 15999,
        image:
          'https://images.pexels.com/photos/2529150/pexels-photo-2529150.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'gh-3',
        title: 'Global Jacket - Street',
        price: 17999,
        image:
          'https://images.pexels.com/photos/6347539/pexels-photo-6347539.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'gh-4',
        title: 'Global Tee - Drop',
        price: 8999,
        image:
          'https://images.pexels.com/photos/5699109/pexels-photo-5699109.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'gh-5',
        title: 'Global Cap - Black',
        price: 2499,
        image:
          'https://images.pexels.com/photos/6311570/pexels-photo-6311570.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'gh-6',
        title: 'Global Bag - Utility',
        price: 6999,
        image:
          'https://images.pexels.com/photos/7319155/pexels-photo-7319155.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'gh-7',
        title: 'Global Sneaker - White',
        price: 9999,
        image:
          'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900',
      },
    ],
  },

  {
    id: 'running-shoes',
    title: 'Running Shoes',
    startingFrom: 5999,
    items: [
      {
        key: 'rs-1',
        title: 'Runner Pro - Blue',
        price: 8999,
        image:
          'https://images.pexels.com/photos/2529152/pexels-photo-2529152.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'rs-2',
        title: 'Runner Flex - White',
        price: 7999,
        image:
          'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'rs-3',
        title: 'Runner Lite - Red',
        price: 6999,
        image:
          'https://images.pexels.com/photos/2529154/pexels-photo-2529154.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'rs-4',
        title: 'Runner Carbon - Grey',
        price: 12999,
        image:
          'https://images.pexels.com/photos/2529150/pexels-photo-2529150.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'rs-5',
        title: 'Trail Runner - Olive',
        price: 9999,
        image:
          'https://images.pexels.com/photos/2529153/pexels-photo-2529153.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'rs-6',
        title: 'Daily Run - Cream',
        price: 8499,
        image:
          'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'rs-7',
        title: 'Speed Run - Black',
        price: 9499,
        image:
          'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
    ],
  },

  {
    id: 'street-wear',
    title: 'Street Wear',
    startingFrom: 2499,
    items: [
      {
        key: 'sw-1',
        title: 'Street Hoodie - Black',
        price: 5999,
        image:
          'https://images.pexels.com/photos/5698857/pexels-photo-5698857.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'sw-2',
        title: 'Street Tee - White',
        price: 2999,
        image:
          'https://images.pexels.com/photos/5699107/pexels-photo-5699107.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'sw-3',
        title: 'Street Jacket - Blue',
        price: 9999,
        image:
          'https://images.pexels.com/photos/6347536/pexels-photo-6347536.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'sw-4',
        title: 'Street Pants - Cargo',
        price: 4999,
        image:
          'https://images.pexels.com/photos/6311571/pexels-photo-6311571.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'sw-5',
        title: 'Street Sneaker - Retro',
        price: 12999,
        image:
          'https://images.pexels.com/photos/2529151/pexels-photo-2529151.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'sw-6',
        title: 'Street Cap - Olive',
        price: 1999,
        image:
          'https://images.pexels.com/photos/6311570/pexels-photo-6311570.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        key: 'sw-7',
        title: 'Street Bag - Utility',
        price: 6999,
        image:
          'https://images.pexels.com/photos/7319156/pexels-photo-7319156.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
    ],
  },
];

export function buildCatalogueForStore(storeId) {
  return {
    categories: CATALOGUE_TEMPLATES.map(cat => ({
      id: `${storeId}-${cat.id}`,
      title: cat.title,
      startingFrom: cat.startingFrom,
      items: cat.items.map(it => ({
        id: `${storeId}-${cat.id}-${it.key}`,
        title: it.title,
        price: it.price,
        image: it.image,
      })),
    })),
  };
}

export const STORES = [
  {
    id: 1,
    name: 'Lifestyle',
    catalogueKey: 'life',

    // ✅ ABOUT + TOP ITEMS
    about:
      'Lifestyle brings together fashion, accessories, and home essentials in one modern space. Discover curated seasonal drops, trending street styles, premium basics, and everyday essentials—picked to match a clean, premium look.',
    topItems: [
      'Sneakers',
      'Street Wear',
      'Winter Wear',
      'Global Hype',
      'Mens Wear',
      'Women Wear',
    ],

    rating: 4.5,
    cuisines: ['Fashion', 'Accessories', 'Home Decor'],
    locality: 'Banjara Hills',
    city: 'Hyderabad',
    badgeText: 'Bank benefits',
    costForTwo: 0,
    distance: 2.3,
    offer: 'Flat ₹1000 OFF',

    inStoreOffer: {
      id: 'life-store-1',
      label: 'In-store Offer',
      title: 'Get Up To 30% OFF on Cookware',
      subtitle: 'Winter Sale is Live!',
      type: 'INSTORE',
      minBill: null,
      discountText: 'Up to 30% OFF',
      couponCode: null,
      terms: 'Applied at billing counter',
    },

    districtPay: {
      instantOffer: {
        id: 'life-instant-1',
        label: 'Instant Offer',
        title: 'Flat 5% OFF',
        subtitle: 'Unlock when you pay via District',
        type: 'PERCENT',
        minBill: 0,
        discountPercent: 5,
        maxDiscount: null,
        bank: null,
        bankLogo: null,
        paymentMethod: 'CARD/UPI',
        couponCode: 'LIFEINSTANT5',
        terms: 'Auto-applied on eligible payments',
      },
      addOnOffers: [
        {
          id: 'life-addon-1',
          title: 'Get Flat ₹1000 OFF',
          subtitle: 'Valid on bill value of ₹12,000 or more',
          type: 'FLAT',
          minBill: 12000,
          discountAmount: 1000,
          bank: null,
          bankLogo: null,
          paymentMethod: 'CARD/UPI',
          couponCode: 'DISTRICT1000',
          terms: 'Once per user per day',
        },
        {
          id: 'life-addon-2',
          title: 'Get Flat ₹500 OFF',
          subtitle: 'Valid on bill value of ₹5,000 or more',
          type: 'FLAT',
          minBill: 5000,
          discountAmount: 500,
          bank: null,
          bankLogo: null,
          paymentMethod: 'CARD/UPI',
          couponCode: 'DISTRICT500',
          terms: 'Once per user per day',
        },
        {
          id: 'life-addon-3',
          title: 'Get 5% OFF up to ₹2,000',
          subtitle: 'Valid on final bill value of ₹12,000 or more',
          type: 'PERCENT',
          minBill: 12000,
          discountPercent: 5,
          maxDiscount: 2000,
          bank: null,
          bankLogo: null,
          paymentMethod: 'CARD',
          couponCode: 'SAVE5',
          terms: 'Not applicable on gift cards',
        },
        {
          id: 'life-addon-4',
          title: 'ICICI Bank: 10% OFF up to ₹700',
          subtitle: 'Valid on bill value of ₹7,000 or more',
          type: 'BANK',
          minBill: 7000,
          discountPercent: 10,
          maxDiscount: 700,
          bank: 'ICICI',
          bankLogo: 'https://logo.clearbit.com/icicibank.com',
          paymentMethod: 'ICICI Credit Card',
          couponCode: 'ICICI10',
          terms: 'Only ICICI credit cards',
        },
        {
          id: 'life-addon-5',
          title: 'HDFC Bank: Flat ₹750 OFF',
          subtitle: 'Valid on bill value of ₹10,000 or more',
          type: 'BANK',
          minBill: 10000,
          discountAmount: 750,
          bank: 'HDFC',
          bankLogo: 'https://logo.clearbit.com/hdfcbank.com',
          paymentMethod: 'HDFC Credit Card',
          couponCode: 'HDFC750',
          terms: 'Only HDFC credit cards',
        },
      ],
    },

    offers: [],
    images: [
      'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/2851716/pexels-photo-2851716.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/276224/pexels-photo-276224.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],

    catalogue: buildCatalogueForStore('life'),
  },

  {
    id: 2,
    name: 'Zara',
    catalogueKey: 'zara',

    // ✅ ABOUT + TOP ITEMS
    about:
      'Zara is known for trend-forward apparel and fast-moving collections. Explore sharp silhouettes, premium fits, seasonal layers, and statement pieces across men and women—updated frequently with new arrivals and limited edits.',
    topItems: [
      'Mens Wear',
      'Women Wear',
      'Hot Drops',
      'Street Wear',
      'Winter Wear',
      'Sneakers',
    ],

    rating: 4.4,
    cuisines: ['Apparel', 'Footwear'],
    locality: 'Banjara Hills',
    city: 'Hyderabad',
    badgeText: 'Bank benefits',
    costForTwo: 0,
    distance: 3.1,
    offer: 'Flat ₹500 OFF',

    inStoreOffer: {
      id: 'zara-store-1',
      label: 'In-store Offer',
      title: 'Buy 2 Get 1 Free on Select Styles',
      subtitle: 'Limited period in-store offer',
      type: 'INSTORE',
      discountText: 'Buy 2 Get 1',
      terms: 'Applied at billing counter',
    },

    districtPay: {
      instantOffer: {
        id: 'zara-instant-1',
        label: 'Instant Offer',
        title: 'Flat 5% OFF',
        subtitle: 'Unlock when you pay via District',
        type: 'PERCENT',
        minBill: 0,
        discountPercent: 5,
        couponCode: 'ZARAINSTANT5',
        paymentMethod: 'CARD/UPI',
        terms: 'Auto-applied on eligible payments',
      },
      addOnOffers: [
        {
          id: 'zara-addon-1',
          title: 'Get Flat ₹1000 OFF',
          subtitle: 'Valid on bill value of ₹12,000 or more',
          type: 'FLAT',
          minBill: 12000,
          discountAmount: 1000,
          couponCode: 'ZARA1000',
          paymentMethod: 'CARD/UPI',
          terms: 'Once per user per day',
        },
        {
          id: 'zara-addon-2',
          title: 'Get Flat ₹500 OFF',
          subtitle: 'Valid on bill value of ₹5,000 or more',
          type: 'FLAT',
          minBill: 5000,
          discountAmount: 500,
          couponCode: 'ZARA500',
          paymentMethod: 'CARD/UPI',
          terms: 'Once per user per day',
        },
        {
          id: 'zara-addon-3',
          title: 'Get 5% OFF up to ₹2,000',
          subtitle: 'Valid on final bill value of ₹12,000 or more',
          type: 'PERCENT',
          minBill: 12000,
          discountPercent: 5,
          maxDiscount: 2000,
          couponCode: 'ZARA5',
          paymentMethod: 'CARD',
          terms: 'Not applicable on sale items',
        },
        {
          id: 'zara-addon-4',
          title: 'AXIS Bank: 10% OFF up to ₹800',
          subtitle: 'Valid on bill value of ₹8,000 or more',
          type: 'BANK',
          minBill: 8000,
          discountPercent: 10,
          maxDiscount: 800,
          bank: 'AXIS',
          bankLogo: 'https://logo.clearbit.com/axisbank.com',
          paymentMethod: 'Axis Credit Card',
          couponCode: 'AXIS10',
          terms: 'Only Axis credit cards',
        },
        {
          id: 'zara-addon-5',
          title: 'SBI Bank: Flat ₹600 OFF',
          subtitle: 'Valid on bill value of ₹9,000 or more',
          type: 'BANK',
          minBill: 9000,
          discountAmount: 600,
          bank: 'SBI',
          bankLogo: 'https://logo.clearbit.com/sbi.co.in',
          paymentMethod: 'SBI Credit Card',
          couponCode: 'SBI600',
          terms: 'Only SBI credit cards',
        },
      ],
    },

    offers: [],
    images: [
      'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/2851716/pexels-photo-2851716.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],

    catalogue: buildCatalogueForStore('zara'),
  },

  {
    id: 3,
    name: 'H&M',
    catalogueKey: 'hm',

    // ✅ ABOUT + TOP ITEMS
    about:
      'H&M delivers everyday fashion with seasonal edits and value-driven essentials. Explore winter layers, denim, tees, hoodies, and street-ready fits across men, women, and kids—easy to style, easy to refresh.',
    topItems: [
      'Kids Wear',
      'Women Wear',
      'Mens Wear',
      'Winter Wear',
      'Street Wear',
      'Sneakers',
    ],

    rating: 4.3,
    cuisines: ['Apparel', 'Fashion'],
    locality: 'Banjara Hills',
    city: 'Hyderabad',
    badgeText: 'Bank benefits',
    costForTwo: 0,
    distance: 1.9,
    offer: '5% OFF up to ₹2000',

    inStoreOffer: {
      id: 'hm-store-1',
      label: 'In-store Offer',
      title: 'Flat 20% OFF on Winter Collection',
      subtitle: 'In-store only this week',
      type: 'INSTORE',
      discountText: 'Flat 20% OFF',
      terms: 'Applied at billing counter',
    },

    districtPay: {
      instantOffer: {
        id: 'hm-instant-1',
        label: 'Instant Offer',
        title: 'Flat 5% OFF',
        subtitle: 'Unlock when you pay via District',
        type: 'PERCENT',
        minBill: 0,
        discountPercent: 5,
        couponCode: 'HMINSTANT5',
        paymentMethod: 'CARD/UPI',
        terms: 'Auto-applied on eligible payments',
      },
      addOnOffers: [
        {
          id: 'hm-addon-1',
          title: 'Get Flat ₹1000 OFF',
          subtitle: 'Valid on bill value of ₹12,000 or more',
          type: 'FLAT',
          minBill: 12000,
          discountAmount: 1000,
          couponCode: 'HM1000',
          paymentMethod: 'CARD/UPI',
          terms: 'Once per user per day',
        },
        {
          id: 'hm-addon-2',
          title: 'Get Flat ₹500 OFF',
          subtitle: 'Valid on bill value of ₹5,000 or more',
          type: 'FLAT',
          minBill: 5000,
          discountAmount: 500,
          couponCode: 'HM500',
          paymentMethod: 'CARD/UPI',
          terms: 'Once per user per day',
        },
        {
          id: 'hm-addon-3',
          title: 'Get 5% OFF up to ₹2,000',
          subtitle: 'Valid on final bill value of ₹12,000 or more',
          type: 'PERCENT',
          minBill: 12000,
          discountPercent: 5,
          maxDiscount: 2000,
          couponCode: 'HM5',
          paymentMethod: 'CARD',
          terms: 'Not applicable on gift cards',
        },
        {
          id: 'hm-addon-4',
          title: 'ICICI Bank: Flat ₹750 OFF',
          subtitle: 'Valid on bill value of ₹10,000 or more',
          type: 'BANK',
          minBill: 10000,
          discountAmount: 750,
          bank: 'ICICI',
          bankLogo: 'https://logo.clearbit.com/icicibank.com',
          paymentMethod: 'ICICI Credit Card',
          couponCode: 'ICICI750',
          terms: 'Only ICICI credit cards',
        },
        {
          id: 'hm-addon-5',
          title: 'HDFC Bank: 10% OFF up to ₹900',
          subtitle: 'Valid on bill value of ₹9,000 or more',
          type: 'BANK',
          minBill: 9000,
          discountPercent: 10,
          maxDiscount: 900,
          bank: 'HDFC',
          bankLogo: 'https://logo.clearbit.com/hdfcbank.com',
          paymentMethod: 'HDFC Credit Card',
          couponCode: 'HDFC10',
          terms: 'Only HDFC credit cards',
        },
      ],
    },

    offers: [],
    images: [
      'https://images.pexels.com/photos/2851716/pexels-photo-2851716.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/276224/pexels-photo-276224.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],

    catalogue: buildCatalogueForStore('hm'),
  },

  {
    id: 4,
    name: 'Joyalukkas',
    catalogueKey: 'joy',
    locality: 'Banjara Hills',
    city: 'Hyderabad',
    badgeText: 'Bank benefits',

    // ✅ ABOUT + TOP ITEMS
    about:
      'Joyalukkas offers timeless jewellery crafted for everyday elegance and special occasions. Explore diamonds, gold essentials, premium gifting and signature collections—built on trusted quality and authentic certification.',
    topItems: [
      'Diamond Sets',
      'Gold Chains',
      'Rings',
      'Bracelets',
      'Luxury Watches',
      'Gifting',
    ],

    rating: 4.7,
    cuisines: ['Jewellery'],
    costForTwo: 0,
    distance: 2.8,
    offer: 'Flat ₹1500 OFF',

    inStoreOffer: {
      id: 'joy-store-1',
      label: 'In-store Offer',
      title: 'Get Flat ₹1,500 OFF on Diamond Purchase',
      subtitle: 'Valid on orders above ₹75,000',
      type: 'INSTORE',
      discountText: 'Flat ₹1,500 OFF',
      terms: 'Applied at billing counter',
    },

    districtPay: {
      instantOffer: {
        id: 'joy-instant-1',
        label: 'Instant Offer',
        title: 'Flat 5% OFF',
        subtitle: 'Unlock when you pay via District',
        type: 'PERCENT',
        minBill: 0,
        discountPercent: 5,
        couponCode: 'JOYINSTANT5',
        paymentMethod: 'CARD/UPI',
        terms: 'Auto-applied on eligible payments',
      },
      addOnOffers: [
        {
          id: 'joy-addon-1',
          title: 'Get Flat ₹1500 OFF',
          subtitle: 'Valid on bill value of ₹30,000 or more',
          type: 'FLAT',
          minBill: 30000,
          discountAmount: 1500,
          couponCode: 'JOY1500',
          paymentMethod: 'CARD/UPI',
          terms: 'Once per user per day',
        },
        {
          id: 'joy-addon-2',
          title: 'Get Flat ₹1000 OFF',
          subtitle: 'Valid on bill value of ₹20,000 or more',
          type: 'FLAT',
          minBill: 20000,
          discountAmount: 1000,
          couponCode: 'JOY1000',
          paymentMethod: 'CARD/UPI',
          terms: 'Once per user per day',
        },
        {
          id: 'joy-addon-3',
          title: 'Get 5% OFF up to ₹2,000',
          subtitle: 'Valid on final bill value of ₹40,000 or more',
          type: 'PERCENT',
          minBill: 40000,
          discountPercent: 5,
          maxDiscount: 2000,
          couponCode: 'JEWEL5',
          paymentMethod: 'CARD',
          terms: 'Not valid on coins/bars',
        },
        {
          id: 'joy-addon-4',
          title: 'SBI Bank: Flat ₹2000 OFF',
          subtitle: 'Valid on bill value of ₹50,000 or more',
          type: 'BANK',
          minBill: 50000,
          discountAmount: 2000,
          bank: 'SBI',
          bankLogo: 'https://logo.clearbit.com/sbi.co.in',
          paymentMethod: 'SBI Credit Card',
          couponCode: 'SBI2000',
          terms: 'Only SBI credit cards',
        },
        {
          id: 'joy-addon-5',
          title: 'AXIS Bank: 10% OFF up to ₹2,500',
          subtitle: 'Valid on bill value of ₹60,000 or more',
          type: 'BANK',
          minBill: 60000,
          discountPercent: 10,
          maxDiscount: 2500,
          bank: 'AXIS',
          bankLogo: 'https://logo.clearbit.com/axisbank.com',
          paymentMethod: 'Axis Credit Card',
          couponCode: 'AXISJEWEL10',
          terms: 'Only Axis credit cards',
        },
      ],
    },

    offers: [],
    images: [
      'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/1915685/pexels-photo-1915685.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/276224/pexels-photo-276224.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],

    catalogue: buildCatalogueForStore('joy'),
  },

  {
    id: 5,
    name: 'Bata',
    catalogueKey: 'bata',

    // ✅ ABOUT + TOP ITEMS
    about:
      'Bata is built for comfort-first footwear—everyday classics to modern street styles. Explore sneakers, running shoes, casuals and seasonal drops designed for durability, support, and all-day performance.',
    topItems: [
      'Sneakers',
      'Running Shoes',
      'Street Wear Shoes',
      'Daily Essentials',
      'Kids Footwear',
      'Hot Drops',
    ],

    rating: 4.2,
    cuisines: ['Footwear'],
    locality: 'Banjara Hills',
    city: 'Hyderabad',
    badgeText: 'Bank benefits',
    costForTwo: 0,
    distance: 3.8,
    offer: 'Flat ₹500 OFF',

    inStoreOffer: {
      id: 'bata-store-1',
      label: 'In-store Offer',
      title: 'Buy 1 Get 1 50% OFF',
      subtitle: 'Applicable on selected pairs',
      type: 'INSTORE',
      discountText: 'BOGO 50%',
      terms: 'Applied at billing counter',
    },

    districtPay: {
      instantOffer: {
        id: 'bata-instant-1',
        label: 'Instant Offer',
        title: 'Flat 5% OFF',
        subtitle: 'Unlock when you pay via District',
        type: 'PERCENT',
        minBill: 0,
        discountPercent: 5,
        couponCode: 'BATAINSTANT5',
        paymentMethod: 'CARD/UPI',
        terms: 'Auto-applied on eligible payments',
      },
      addOnOffers: [
        {
          id: 'bata-addon-1',
          title: 'Get Flat ₹500 OFF',
          subtitle: 'Valid on bill value of ₹5,000 or more',
          type: 'FLAT',
          minBill: 5000,
          discountAmount: 500,
          couponCode: 'BATA500',
          paymentMethod: 'CARD/UPI',
          terms: 'Once per user per day',
        },
        {
          id: 'bata-addon-2',
          title: 'Get Flat ₹1000 OFF',
          subtitle: 'Valid on bill value of ₹12,000 or more',
          type: 'FLAT',
          minBill: 12000,
          discountAmount: 1000,
          couponCode: 'BATA1000',
          paymentMethod: 'CARD/UPI',
          terms: 'Once per user per day',
        },
        {
          id: 'bata-addon-3',
          title: 'Get 5% OFF up to ₹2,000',
          subtitle: 'Valid on final bill value of ₹12,000 or more',
          type: 'PERCENT',
          minBill: 12000,
          discountPercent: 5,
          maxDiscount: 2000,
          couponCode: 'BATA5',
          paymentMethod: 'CARD',
          terms: 'Not applicable on sale items',
        },
        {
          id: 'bata-addon-4',
          title: 'ICICI Bank: 10% OFF up to ₹600',
          subtitle: 'Valid on bill value of ₹6,000 or more',
          type: 'BANK',
          minBill: 6000,
          discountPercent: 10,
          maxDiscount: 600,
          bank: 'ICICI',
          bankLogo: 'https://logo.clearbit.com/icicibank.com',
          paymentMethod: 'ICICI Credit Card',
          couponCode: 'ICICI10BATA',
          terms: 'Only ICICI credit cards',
        },
        {
          id: 'bata-addon-5',
          title: 'HDFC Bank: Flat ₹700 OFF',
          subtitle: 'Valid on bill value of ₹9,000 or more',
          type: 'BANK',
          minBill: 9000,
          discountAmount: 700,
          bank: 'HDFC',
          bankLogo: 'https://logo.clearbit.com/hdfcbank.com',
          paymentMethod: 'HDFC Credit Card',
          couponCode: 'HDFC700BATA',
          terms: 'Only HDFC credit cards',
        },
      ],
    },

    offers: [],
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/276224/pexels-photo-276224.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],

    catalogue: buildCatalogueForStore('bata'),
  },

  {
    id: 6,
    name: 'Home Centre',
    catalogueKey: 'hc',

    // ✅ ABOUT + TOP ITEMS
    about:
      'Home Centre curates furniture and décor that upgrades your space instantly. Explore modern designs, storage essentials, seasonal refreshes, and premium finishes—perfect for building a clean, luxury home vibe.',
    topItems: [
      'Furniture',
      'Home Decor',
      'Lighting',
      'Kitchen & Dining',
      'Storage',
      'New Arrivals',
    ],

    rating: 4.6,
    cuisines: ['Home Decor', 'Furniture'],
    locality: 'Banjara Hills',
    city: 'Hyderabad',
    badgeText: 'Bank benefits',
    costForTwo: 0,
    distance: 2.5,
    offer: 'Up to 40% OFF',

    inStoreOffer: {
      id: 'hc-store-1',
      label: 'In-store Offer',
      title: 'Up to 40% OFF on Furniture & Decor',
      subtitle: 'Valid on selected items',
      type: 'INSTORE',
      discountText: 'Up to 40% OFF',
      terms: 'Applied at billing counter',
    },

    districtPay: {
      instantOffer: {
        id: 'hc-instant-1',
        label: 'Instant Offer',
        title: 'Flat 5% OFF',
        subtitle: 'Unlock when you pay via District',
        type: 'PERCENT',
        minBill: 0,
        discountPercent: 5,
        couponCode: 'HCINSTANT5',
        paymentMethod: 'CARD/UPI',
        terms: 'Auto-applied on eligible payments',
      },
      addOnOffers: [
        {
          id: 'hc-addon-1',
          title: 'Get Flat ₹1000 OFF',
          subtitle: 'Valid on bill value of ₹12,000 or more',
          type: 'FLAT',
          minBill: 12000,
          discountAmount: 1000,
          couponCode: 'HC1000',
          paymentMethod: 'CARD/UPI',
          terms: 'Once per user per day',
        },
        {
          id: 'hc-addon-2',
          title: 'Get Flat ₹500 OFF',
          subtitle: 'Valid on bill value of ₹5,000 or more',
          type: 'FLAT',
          minBill: 5000,
          discountAmount: 500,
          couponCode: 'HC500',
          paymentMethod: 'CARD/UPI',
          terms: 'Once per user per day',
        },
        {
          id: 'hc-addon-3',
          title: 'Get 5% OFF up to ₹2,000',
          subtitle: 'Valid on final bill value of ₹12,000 or more',
          type: 'PERCENT',
          minBill: 12000,
          discountPercent: 5,
          maxDiscount: 2000,
          couponCode: 'HC5',
          paymentMethod: 'CARD',
          terms: 'Not applicable on assembly services',
        },
        {
          id: 'hc-addon-4',
          title: 'AXIS Bank: 10% OFF up to ₹1,000',
          subtitle: 'Valid on bill value of ₹10,000 or more',
          type: 'BANK',
          minBill: 10000,
          discountPercent: 10,
          maxDiscount: 1000,
          bank: 'AXIS',
          bankLogo: 'https://logo.clearbit.com/axisbank.com',
          paymentMethod: 'Axis Credit Card',
          couponCode: 'AXIS10HC',
          terms: 'Only Axis credit cards',
        },
        {
          id: 'hc-addon-5',
          title: 'SBI Bank: Flat ₹900 OFF',
          subtitle: 'Valid on bill value of ₹11,000 or more',
          type: 'BANK',
          minBill: 11000,
          discountAmount: 900,
          bank: 'SBI',
          bankLogo: 'https://logo.clearbit.com/sbi.co.in',
          paymentMethod: 'SBI Credit Card',
          couponCode: 'SBI900HC',
          terms: 'Only SBI credit cards',
        },
      ],
    },

    offers: [],
    images: [
      'https://images.pexels.com/photos/276224/pexels-photo-276224.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/2851716/pexels-photo-2851716.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],

    catalogue: buildCatalogueForStore('hc'),
  },
];

/* -------------------------------------------------------
    🍽 MAIN COMPONENT
--------------------------------------------------------- */

export default function StoresList({
  stores = STORES,
  onOpenFilters,
  onApplyQuickFilter,
  onFilterPosition,
}) {
  const { colors } = useContext(ThemeContext);

  const [activeIndex, setActiveIndex] = useState(0);
  const filterRef = useRef(null);

  /* ---------------------------------------------
      ⭐ VIEWABILITY CONFIG (DETECT ACTIVE CARD)
  --------------------------------------------- */
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 60, // card must be 60% visible
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View
      style={styles.wrapper}
      onLayout={() => {
        setTimeout(() => {
          filterRef.current?.measureInWindow((x, y) => {
            onFilterPosition?.(y);
          });
        }, 100);
      }}
    >
      {/* Heading */}
      <View style={styles.headingContainer}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', colors.subtitle + '30']}
          style={styles.lineGradientLeft}
        />
        <Text style={[styles.heading, { color: colors.text }]}>ALL STORES</Text>
        <LinearGradient
          colors={[colors.subtitle + '30', 'rgba(0,0,0,0)']}
          style={styles.lineGradientRight}
        />
      </View>

      {/* CONTENT LIST */}
      <FlatList
        data={stores}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <StoresCard item={item} isActive={index === activeIndex} stores={stores} />
        )}
        ListHeaderComponent={
          <View ref={filterRef}>
            <StoreFilters
              onOpenFilters={onOpenFilters}
              onSelectQuick={onApplyQuickFilter}
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

/* -------------------------------------------------------
    🎨 STYLES
--------------------------------------------------------- */

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 5,
  },

  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    padding: 10,
    marginTop: 10,
  },

  lineGradientLeft: { flex: 1, height: 1, marginRight: 12 },
  lineGradientRight: { flex: 1, height: 1, marginLeft: 12 },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
