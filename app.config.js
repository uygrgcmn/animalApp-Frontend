module.exports = () => ({
  name: "Animal App",
  slug: "animal-app-frontend",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "animalapp",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  plugins: ["expo-router", "expo-font"],
  android: {
    package: "com.uygar.animalapp",
    usesCleartextTraffic: true
  },
  ios: {
    bundleIdentifier: "com.uygar.animalapp"
  },
  web: {
    bundler: "metro"
  },
  experiments: {
    typedRoutes: true
  },
  extra: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api"
  }
});

