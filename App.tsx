import React, {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  AppState,
  useColorScheme,
  Linking,
} from 'react-native';

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import Profile from './screens/Profile';
import SavedLocations from './screens/SavedLocations';
import Login from './screens/Login';
import Onboarding from './screens/Onboarding';
import Signup from './screens/Signup';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import Details from './screens/Details';
import Splash from './screens/Splash';
import Membership from './screens/Membership';
import DineinHome from './screens/DineinHome';
import RestaurantDetails from './screens/RestaurantDetails';
import GalleryScreen from './screens/GalleryScreen';
import FullImageView from './screens/FullImageView';
import MenuPagesScreen from './screens/MenuPagesScreen';
import AllReviews from './screens/AllReviewsScreen';
import LeaveReview from './screens/LeaveReviewScreen';
import DetailedReview from './screens/DetailedReviewScreen';
import BookTableScreen from './screens/BookTableScreen';
import Paybill from './screens/PayBillScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import CardPaymentScreen from './screens/CardPaymentScreen';
import PaymentSuccessScreen from './screens/PaymentSuccessScreen';
import StoreDetails from './screens/StoreDetails';
import ReviewRestaurantBooking from './screens/ReviewRestaurantBooking';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';

import { LightThemeColors, DarkThemeColors } from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import { markLastOpened } from './services/userActivity';
import supabase from './supabase';

// ---------------------------------------------------------------------
// CONTEXTS
// ---------------------------------------------------------------------
export const LocationContext = createContext<string>('Fetching...');

// Theme now supports manual selection
export const ThemeContext = createContext({
  mode: 'dark',
  colors: DarkThemeColors,
  setThemeMode: (mode: 'system' | 'light' | 'dark') => {},
});

export type RootStackParamList = {
  Home: { safeColor?: string } | undefined;
  Profile: undefined;
  SavedLocations: undefined;
  Login: undefined;
  Details: undefined;
  AuthGate: undefined;
  Splash: undefined;
  Membership: undefined;
  DineinHome: undefined;
  RestaurantDetails: undefined;
  GalleryScreen: undefined;
  FullImageView: undefined;
  MenuPagesScreen: undefined;
  AllReviews: undefined;
  LeaveReview: undefined;
  DetailedReview: undefined;
  BookTableScreen: undefined;
  Paybill: undefined;
  PaymentMethod: undefined;
  CardPayment: undefined;
  PaymentSuccess: undefined;
  StoreDetails: undefined;
  ReviewRestaurantBooking: undefined;
  Onboarding: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ---------------------------------------------------------------------
// SCREEN WRAPPER WITH STATUS BAR
// ---------------------------------------------------------------------
function ScreenWrapper({
  children,
  safeColor,
}: {
  children: ReactNode;
  safeColor?: string;
}) {
  let insets = { top: 0, bottom: 0 };
  try {
    const safeInsets = useSafeAreaInsets();
    if (safeInsets && typeof safeInsets.top === 'number' && typeof safeInsets.bottom === 'number') {
      insets = safeInsets;
    }
  } catch (e) {
    // fallback already set
  }
  const theme = React.useContext(ThemeContext);

  const finalSafeColor = safeColor || theme.colors.background;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* STATUS BAR */}
      <View style={{ height: insets.top || 0, backgroundColor: finalSafeColor }}>
        <StatusBar
          translucent={false}
          backgroundColor={finalSafeColor}
          barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        />
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {children}
      </View>

      {/* BOTTOM SAFE AREA */}
      <View
        style={{
          height: insets.bottom || 0,
          backgroundColor: theme.colors.background,
        }}
      />
    </View>
  );
}


function EdgeToEdgeWrapper({ children }: { children: ReactNode }) {
  const theme = React.useContext(ThemeContext);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* ✅ Let screen manage StatusBar (translucent, transparent, etc.) */}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}


// ---------------------------------------------------------------------
// NAVIGATOR
// ---------------------------------------------------------------------
function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash">
        {() => (
          <EdgeToEdgeWrapper>
            <Splash />
          </EdgeToEdgeWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen name="Login" options={{ animation: 'slide_from_bottom' }}>
        {() => (
          <ScreenWrapper safeColor="#5800AB">
            <Login />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen name="Onboarding" options={{ animation: 'slide_from_bottom' }}>
        {() => (
          <ScreenWrapper>
            <Onboarding />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen name="Signup" options={{ animation: 'slide_from_bottom' }}>
        {() => (
          <ScreenWrapper safeColor="#5800AB">
            <Signup />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen name="ForgotPassword" options={{ animation: 'slide_from_bottom' }}>
        {() => (
          <ScreenWrapper safeColor="#5800AB">
            <ForgotPassword />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen name="ResetPassword" options={{ animation: 'slide_from_bottom' }}>
        {() => (
          <ScreenWrapper>
            <ResetPassword />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Home"
        options={({ route }) => ({
          animation: 'slide_from_right',
          safeColor: (route.params as any)?.safeColor,
        })}
      >
        {props => {
          const safeColor = (props.route.params as any)?.safeColor;
          return (
            <ScreenWrapper safeColor={safeColor}>
              <Home />
            </ScreenWrapper>
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="Profile">
        {() => (
          <ScreenWrapper>
            <Profile />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen name="SavedLocations">
        {() => (
          <ScreenWrapper>
            <SavedLocations />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen name="Details">
        {() => (
          <ScreenWrapper safeColor="#5800AB">
            <Details />
          </ScreenWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen name="Membership">
        {() => (
          <ScreenWrapper>
            <Membership />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="DineinHome"
        options={{ animation: 'slide_from_right' }}
      >
        {() => (
          <ScreenWrapper>
            <DineinHome />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="RestaurantDetails"
        options={{ animation: 'slide_from_right' }}
      >
        {() => (
          <ScreenWrapper>
            <RestaurantDetails />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="GalleryScreen"
        options={{ animation: 'slide_from_bottom' }}
      >
        {props => (
          <ScreenWrapper>
            <GalleryScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="FullImageView"
        options={{ animation: 'slide_from_bottom' }}
      >
        {props => (
          <ScreenWrapper>
            <FullImageView {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="MenuPagesScreen"
        options={{ animation: 'slide_from_bottom' }}
      >
        {props => (
          <ScreenWrapper>
            <MenuPagesScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="AllReviews"
        options={{ animation: 'slide_from_bottom' }}
      >
        {props => (
          <ScreenWrapper>
            <AllReviews {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="LeaveReview"
        options={{ animation: 'slide_from_bottom' }}
      >
        {props => (
          <ScreenWrapper>
            <LeaveReview {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="DetailedReview"
        options={{ animation: 'slide_from_bottom' }}
      >
        {props => (
          <ScreenWrapper>
            <DetailedReview {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="BookTableScreen">
        {props => (
          <ScreenWrapper>
            <BookTableScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="Paybill">
        {props => (
          <ScreenWrapper>
            <Paybill {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="PaymentMethod">
        {props => (
          <ScreenWrapper>
            <PaymentMethodScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="CardPayment">
        {props => (
          <ScreenWrapper>
            <CardPaymentScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="PaymentSuccess" options={{ headerShown: false, gestureEnabled: false }}>
        {props => (
          <ScreenWrapper>
            <PaymentSuccessScreen {...props} />
          </ScreenWrapper>
        )}
      </Stack.Screen>
       <Stack.Screen name="StoreDetails" >
        {props => (
          <EdgeToEdgeWrapper>
            <StoreDetails />
          </EdgeToEdgeWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="ReviewRestaurantBooking" >
        {props => (
          <EdgeToEdgeWrapper>
            <ReviewRestaurantBooking {...props} />
          </EdgeToEdgeWrapper>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// ---------------------------------------------------------------------
// MAIN APP COMPONENT
// ---------------------------------------------------------------------
export default function App() {
  const deviceTheme = useColorScheme(); // device setting (light/dark)

  // THEME MODE: system | light | dark
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>(
    'system',
  );

  // ACTUAL COLORS BASED ON THEME MODE
  const [theme, setTheme] = useState({
    mode: 'dark',
    colors: DarkThemeColors,
    setThemeMode: (mode: 'system' | 'light' | 'dark') => {},
  });

  // Load saved theme from storage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('themeMode');
      if (saved === 'system' || saved === 'light' || saved === 'dark') {
        setThemeMode(saved);
      }
    })();
  }, []);

  // Update theme based on mode OR device theme
  useEffect(() => {
    let finalMode = themeMode === 'system' ? deviceTheme : themeMode;

    if (finalMode === 'light') {
      setTheme({
        mode: 'light',
        colors: LightThemeColors,
        setThemeMode,
      });
    } else {
      setTheme({
        mode: 'dark',
        colors: DarkThemeColors,
        setThemeMode,
      });
    }
  }, [themeMode, deviceTheme]);

  // Save theme selection
  const handleThemeChange = async (mode: 'system' | 'light' | 'dark') => {
    setThemeMode(mode);
    await AsyncStorage.setItem('themeMode', mode);
  };
  theme.setThemeMode = handleThemeChange;

  // ---------------- LOCATION ONLY FETCHED ONCE ----------------
  const [locationText, setLocationText] = useState('Fetching...');

  useEffect(() => {
    const init = async () => {
      const saved = await AsyncStorage.getItem('user_location');
      if (saved) setLocationText(saved);

      let permissionGranted = false;

      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        permissionGranted = result === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const status = await Geolocation.requestAuthorization('whenInUse');
        permissionGranted = status === 'granted';
      }

      if (!permissionGranted) return;

      Geolocation.getCurrentPosition(
        async pos => {
          const { latitude, longitude } = pos.coords;

          try {
            if (!GOOGLE_MAPS_API_KEY) {
              setLocationText(saved || 'Location unavailable');
              return;
            }

            const res = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  latlng: `${latitude},${longitude}`,
                  key: GOOGLE_MAPS_API_KEY,
                },
              },
            );

            const comps = res.data?.results?.[0]?.address_components || [];
            let area = '',
              city = '';

            for (let c of comps) {
              if (
                !area &&
                (c.types.includes('sublocality') ||
                  c.types.includes('political'))
              )
                area = c.long_name;
              if (!city && c.types.includes('locality')) city = c.long_name;
            }

            const text =
              area && city
                ? `${area}, ${city} …`
                : area || city || 'Location unavailable';

            setLocationText(text);
            await AsyncStorage.setItem('user_location', text);
            await AsyncStorage.setItem(
              'user_location_coords',
              JSON.stringify({ latitude, longitude }),
            );
          } catch {
            setLocationText(saved || 'Unable to fetch');
          }
        },
        () => {},
        { enableHighAccuracy: true, timeout: 15000 },
      );
    };

    init();
  }, []);

  useEffect(() => {
    markLastOpened();

    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        markLastOpened();
      }
    });

    return () => sub.remove();
  }, []);

  const locationValue = useMemo(() => locationText, [locationText]);
  const linking = useMemo(
    () => ({
      prefixes: ['passprive://'],
      config: {
        screens: {
          ResetPassword: 'reset-password',
        },
      },
    }),
    [],
  );

  useEffect(() => {
    const applyRecoverySessionFromUrl = async (url?: string | null) => {
      if (!url || !url.includes('type=recovery')) return;

      const hash = url.split('#')[1] || '';
      if (!hash) return;

      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    };

    Linking.getInitialURL()
      .then(url => applyRecoverySessionFromUrl(url))
      .catch(() => {});

    const sub = Linking.addEventListener('url', ({ url }) => {
      applyRecoverySessionFromUrl(url).catch(() => {});
    });

    return () => sub.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={theme}>
        <LocationContext.Provider value={locationValue}>
          <AuthProvider>
            <NavigationContainer linking={linking}>
              <AppNavigator />
            </NavigationContainer>
          </AuthProvider>
        </LocationContext.Provider>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

// ---------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
});
