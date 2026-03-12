import AsyncStorage from "@react-native-async-storage/async-storage";

const HOTLISTS_KEY = "saved_hotlists_v1";
const LEGACY_DEFAULT_NAMES = new Set([
  "default hotlist",
  "bharat",
]);

function sanitizeName(name) {
  return String(name || "").trim().replace(/\s+/g, " ");
}

function makeListId(name) {
  return `${Date.now()}-${sanitizeName(name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function ensureStateShape(state) {
  if (!state || typeof state !== "object") {
    return { lists: [], ungrouped: [] };
  }

  const lists = Array.isArray(state.lists) ? state.lists : [];
  const ungrouped = Array.isArray(state.ungrouped) ? state.ungrouped : [];
  const migratedUngrouped = [...ungrouped];

  return {
    lists: lists
      .filter(Boolean)
      .map(list => {
        const normalizedName = sanitizeName(list?.name);
        const normalizedKey = normalizedName.toLowerCase();

        if (!normalizedName || LEGACY_DEFAULT_NAMES.has(normalizedKey)) {
          const legacyItems = Array.isArray(list?.items) ? list.items : [];
          legacyItems.forEach(item => {
            if (item?.id && !migratedUngrouped.some(existing => existing?.id === item.id)) {
              migratedUngrouped.push(item);
            }
          });
          return null;
        }

        return {
          id: list?.id || makeListId(normalizedName),
          name: normalizedName,
          items: Array.isArray(list?.items) ? list.items : [],
        };
      })
      .filter(Boolean),
    ungrouped: migratedUngrouped,
  };
}

async function persistState(state) {
  await AsyncStorage.setItem(HOTLISTS_KEY, JSON.stringify(state));
}

export async function getHotlistsState() {
  try {
    const raw = await AsyncStorage.getItem(HOTLISTS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const state = ensureStateShape(parsed);
    if (!raw || JSON.stringify(parsed) !== JSON.stringify(state)) {
      await persistState(state);
    }
    return state;
  } catch {
    const fallbackState = ensureStateShape(null);
    await persistState(fallbackState);
    return fallbackState;
  }
}

export async function getHotlists() {
  const state = await getHotlistsState();
  return state.lists;
}

export async function getSavedRestaurants() {
  const state = await getHotlistsState();
  const deduped = new Map();
  state.ungrouped.forEach(item => {
    if (item?.id && !deduped.has(item.id)) {
      deduped.set(item.id, item);
    }
  });
  state.lists.forEach(list => {
    list.items.forEach(item => {
      if (item?.id && !deduped.has(item.id)) {
        deduped.set(item.id, item);
      }
    });
  });
  return Array.from(deduped.values());
}

function upsertRestaurant(items, restaurant) {
  const next = items.filter(item => item?.id !== restaurant?.id);
  next.unshift(restaurant);
  return next;
}

export async function createHotlist(name) {
  const normalizedName = sanitizeName(name);
  if (!normalizedName) {
    throw new Error("Hotlist name is required");
  }

  const state = await getHotlistsState();
  const exists = state.lists.some(
    list => list.name.toLowerCase() === normalizedName.toLowerCase()
  );

  if (exists) {
    throw new Error("Hotlist already exists");
  }

  const nextList = {
    id: makeListId(normalizedName),
    name: normalizedName,
    items: [],
  };

  const nextState = {
    ...state,
    lists: [...state.lists, nextList],
  };

  await persistState(nextState);
  return nextList;
}

export async function saveRestaurantToHotlist(listId, restaurant) {
  const state = await getHotlistsState();
  const nextState = {
    ...state,
    lists: state.lists.map(list =>
      list.id === listId
        ? { ...list, items: upsertRestaurant(list.items, restaurant) }
        : list
    ),
  };
  await persistState(nextState);
  return nextState;
}

export async function removeRestaurantFromHotlist(listId, restaurantId) {
  const state = await getHotlistsState();
  const nextState = {
    ...state,
    lists: state.lists.map(list =>
      list.id === listId
        ? { ...list, items: list.items.filter(item => item?.id !== restaurantId) }
        : list
    ),
  };
  await persistState(nextState);
  return nextState;
}

export async function toggleRestaurantInHotlist(listId, restaurant) {
  const state = await getHotlistsState();
  let saved = false;

  const nextState = {
    ...state,
    lists: state.lists.map(list => {
      if (list.id !== listId) return list;
      const exists = list.items.some(item => item?.id === restaurant?.id);
      saved = !exists;
      return {
        ...list,
        items: exists
          ? list.items.filter(item => item?.id !== restaurant?.id)
          : upsertRestaurant(list.items, restaurant),
      };
    }),
  };

  await persistState(nextState);
  return { state: nextState, saved };
}

export async function getHotlistsForRestaurant(restaurantId) {
  const state = await getHotlistsState();
  const linkedLists = state.lists.filter(list =>
    list.items.some(item => item?.id === restaurantId)
  );
  const inAllSaves = state.ungrouped.some(item => item?.id === restaurantId);
  return {
    hotlists: linkedLists,
    inAllSaves,
  };
}

export async function isRestaurantSaved(restaurantId) {
  const state = await getHotlistsState();
  return (
    state.ungrouped.some(item => item?.id === restaurantId) ||
    state.lists.some(list => list.items.some(item => item?.id === restaurantId))
  );
}

export async function removeSavedRestaurant(restaurantId) {
  const state = await getHotlistsState();
  const nextState = {
    ...state,
    ungrouped: state.ungrouped.filter(item => item?.id !== restaurantId),
    lists: state.lists.map(list => ({
      ...list,
      items: list.items.filter(item => item?.id !== restaurantId),
    })),
  };
  await persistState(nextState);
  return nextState;
}

export async function toggleSavedRestaurant(restaurant) {
  const state = await getHotlistsState();
  const existsInUngrouped = state.ungrouped.some(item => item?.id === restaurant?.id);
  if (existsInUngrouped) {
    const nextState = {
      ...state,
      ungrouped: state.ungrouped.filter(item => item?.id !== restaurant?.id),
    };
    await persistState(nextState);
    return { state: nextState, saved: false };
  }

  const nextState = {
    ...state,
    ungrouped: upsertRestaurant(state.ungrouped, restaurant),
  };
  await persistState(nextState);
  return { state: nextState, saved: true };
}
