import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

async function getWebItem(key: string) {
  if (typeof localStorage === "undefined") {
    return null;
  }

  return localStorage.getItem(key);
}

async function setWebItem(key: string, value: string) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(key, value);
  }
}

async function removeWebItem(key: string) {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(key);
  }
}

export const appStorage = {
  getItem(key: string) {
    if (Platform.OS === "web") {
      return getWebItem(key);
    }

    return SecureStore.getItemAsync(key);
  },
  setItem(key: string, value: string) {
    if (Platform.OS === "web") {
      return setWebItem(key, value);
    }

    return SecureStore.setItemAsync(key, value);
  },
  removeItem(key: string) {
    if (Platform.OS === "web") {
      return removeWebItem(key);
    }

    return SecureStore.deleteItemAsync(key);
  }
};

