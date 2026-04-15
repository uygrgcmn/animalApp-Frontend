import type { AuthTokens } from "./contracts";
import { appStorage } from "../storage/appStorage";

const AUTH_TOKENS_STORAGE_KEY = "animal-app-auth-tokens";

export async function getStoredAuthTokens() {
  const rawValue = await appStorage.getItem(AUTH_TOKENS_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthTokens;
  } catch {
    await appStorage.removeItem(AUTH_TOKENS_STORAGE_KEY);
    return null;
  }
}

export async function setStoredAuthTokens(tokens: AuthTokens) {
  await appStorage.setItem(AUTH_TOKENS_STORAGE_KEY, JSON.stringify(tokens));
}

export async function clearStoredAuthTokens() {
  await appStorage.removeItem(AUTH_TOKENS_STORAGE_KEY);
}

