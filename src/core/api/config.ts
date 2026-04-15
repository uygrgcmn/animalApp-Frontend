import Constants from "expo-constants";
import { Platform } from "react-native";

type ExpoExtra = {
  apiBaseUrl?: string;
};

const expoExtra = (Constants.expoConfig?.extra ?? {}) as ExpoExtra;

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function getHostFromExpoConfig() {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(":")[0] ?? null;
}

function getDefaultApiBaseUrl() {
  const detectedHost = getHostFromExpoConfig();

  if (detectedHost && detectedHost !== "localhost" && detectedHost !== "127.0.0.1") {
    return `http://${detectedHost}:3000/api`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000/api";
  }

  return "http://localhost:3000/api";
}

export const apiConfig = {
  baseUrl: normalizeBaseUrl(expoExtra.apiBaseUrl ?? getDefaultApiBaseUrl()),
  timeoutMs: 15_000
};

