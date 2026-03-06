import { backend_url } from '@env';

const API_BASE = (backend_url || '').replace(/\/+$/, '');

const SIGNUP_PATHS = ['/api/auth', '/api/auth/signup', '/api/create-user', '/create-user'];
const GOOGLE_TOKEN_PATHS = ['/api/auth', '/api/auth/google', '/api/google-auth', '/auth/google'];

const isObject = value => value && typeof value === 'object' && !Array.isArray(value);

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getErrorMessage(payload, fallback = 'Request failed') {
  if (isObject(payload)) {
    return payload.error || payload.message || fallback;
  }
  return fallback;
}

async function postFirstSuccess(paths, body) {
  if (!API_BASE) {
    return { ok: false, error: 'Missing backend_url in .env' };
  }

  let lastError = 'Request failed';

  for (const path of paths) {
    const url = `${API_BASE}${path}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const payload = await safeJson(response);

      if (response.ok) {
        return {
          ok: true,
          payload,
          endpoint: path,
        };
      }

      const message = getErrorMessage(payload, `HTTP ${response.status}`);
      lastError = message;

      if (response.status !== 404 && response.status !== 405) {
        return {
          ok: false,
          error: message,
          status: response.status,
          endpoint: path,
        };
      }
    } catch (error) {
      lastError = error?.message || lastError;
    }
  }

  return { ok: false, error: lastError, status: 404 };
}

export async function signupWithPassword({ email, password, full_name }) {
  const result = await postFirstSuccess(SIGNUP_PATHS, {
    action: 'signup',
    provider: 'email',
    email,
    password,
    full_name,
    role: 'user',
  });

  if (!result.ok) return result;

  return {
    ok: true,
    payload: result.payload || {},
  };
}

export async function requestGoogleSignupUrl(role = 'customer') {
  if (!API_BASE) {
    return { ok: false, error: 'Missing backend_url in .env' };
  }

  const url = `${API_BASE}/api/auth/google-signup?role=${encodeURIComponent(role)}`;

  try {
    const response = await fetch(url, { method: 'GET' });
    const payload = await safeJson(response);

    if (!response.ok) {
      return {
        ok: false,
        error: getErrorMessage(payload, `HTTP ${response.status}`),
        status: response.status,
      };
    }

    const oauthUrl = payload?.url;
    if (!oauthUrl) {
      return { ok: false, error: 'Google signup URL was not returned by backend.' };
    }

    return { ok: true, url: oauthUrl };
  } catch (error) {
    return { ok: false, error: error?.message || 'Request failed' };
  }
}

export async function signupWithGoogleIdToken(idToken) {
  const result = await postFirstSuccess(GOOGLE_TOKEN_PATHS, {
    action: 'signup',
    provider: 'google',
    idToken,
    id_token: idToken,
    token: idToken,
  });

  if (!result.ok) return result;
  return { ok: true, payload: result.payload || {} };
}
