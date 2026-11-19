import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'dm_system_token';
const GRAPHQL_URL = (process.env.EXPO_PUBLIC_GRAPHQL_URL || 'http://localhost:4001/').trim();

async function readToken() {
  if (Platform.OS === 'web') {
    return globalThis.localStorage?.getItem(TOKEN_KEY) ?? null;
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function saveToken(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Сервер не повернув токен авторизації.');
  }

  if (Platform.OS === 'web') {
    globalThis.localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  return readToken();
}

export async function clearToken() {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function gql(query, variables = {}) {
  if (typeof query !== 'string' || !query.trim()) {
    throw new Error('GraphQL-запит порожній.');
  }

  let token = null;
  try {
    token = await readToken();
  } catch {
    // A missing token is valid for login and registration operations.
  }

  let response;
  try {
    response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (error) {
    throw new Error(
      `Не вдалося підключитися до GraphQL API (${GRAPHQL_URL}). Перевір, чи запущений сервер і чи правильно задана EXPO_PUBLIC_GRAPHQL_URL.`,
      { cause: error },
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`GraphQL API повернув не JSON (HTTP ${response.status}).`);
  }

  if (!response.ok || payload.errors?.length) {
    const message = payload.errors?.map((item) => item.message).filter(Boolean).join('\n')
      || `Помилка HTTP ${response.status}`;
    throw new Error(message);
  }

  if (!payload.data) {
    throw new Error('GraphQL API не повернув дані.');
  }

  return payload.data;
}
