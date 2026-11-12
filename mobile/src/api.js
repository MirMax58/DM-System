import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_GRAPHQL_URL || 'http://localhost:4001/';

export async function getToken() {
  return SecureStore.getItemAsync('dm-system-token');
}
export async function saveToken(token) {
  return SecureStore.setItemAsync('dm-system-token', token);
}
export async function clearToken() {
  return SecureStore.deleteItemAsync('dm-system-token');
}
export async function gql(query, variables = {}) {
  const token = await getToken();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  let result;
  try { result = await response.json(); }
  catch { throw new Error('Сервер повернув некоректну відповідь. Перевір, чи запущений GraphQL backend.'); }
  if (!response.ok || result.errors?.length) {
    throw new Error(result.errors?.[0]?.message || 'Помилка запиту до сервера.');
  }
  return result.data;
}
