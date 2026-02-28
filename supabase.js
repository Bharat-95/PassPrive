import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yokfurjjqvzkzjpmepzq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlva2Z1cmpqcXZ6a3pqcG1lcHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MjUzNjgsImV4cCI6MjA3OTQwMTM2OH0.eHqiZN-nnLk7RBD_GWiiTWRGVjHi5a5OAnswMiUhRYg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
     flowType: "pkce",
  },
});

export default supabase;
