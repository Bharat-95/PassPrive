import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../supabase';

async function resolveCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id) return user.id;

  const rawStoredUser = await AsyncStorage.getItem('auth_user');
  const storedUser = rawStoredUser ? JSON.parse(rawStoredUser) : null;
  return storedUser?.id || null;
}

async function updateUserActivity(fields) {
  const userId = await resolveCurrentUserId();
  if (!userId) return { ok: false, error: 'User not found' };

  const { error } = await supabase
    .from('users')
    .update({
      ...fields,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function markLastLogin() {
  const now = new Date().toISOString();
  return updateUserActivity({
    last_login: now,
    last_opened: now,
  });
}

export async function markLastOpened() {
  return updateUserActivity({
    last_opened: new Date().toISOString(),
  });
}
