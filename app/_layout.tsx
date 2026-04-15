import { Stack, router, useRootNavigationState, useSegments } from "expo-router";
import { useEffect } from "react";

import { resolveAuthenticatedRoute, routes } from "../src/core/navigation/routes";
import { AppProviders } from "../src/core/providers/AppProviders";
import { useSessionStore } from "../src/features/auth/store/sessionStore";

function RootNavigator() {
  const rootNavigationState = useRootNavigationState();
  const segments = useSegments();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const hasCompletedOnboarding = useSessionStore(
    (state) => state.hasCompletedOnboarding
  );
  const hasCompletedProfileSetup = useSessionStore(
    (state) => state.hasCompletedProfileSetup
  );

  useEffect(() => {
    if (!rootNavigationState?.key || !hasHydrated) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const currentPath = `/${segments.join("/")}`;

    if (!isAuthenticated) {
      if (!inAuthGroup || currentPath === routes.auth.profileSetup) {
        router.replace(routes.auth.welcome);
      }
      return;
    }

    const authenticatedTarget = resolveAuthenticatedRoute({
      hasCompletedOnboarding,
      hasCompletedProfileSetup
    });

    if (currentPath !== authenticatedTarget) {
      if (authenticatedTarget !== routes.app.home || inAuthGroup) {
        router.replace(authenticatedTarget);
      }
      return;
    }

    if (inAuthGroup && authenticatedTarget === routes.app.home) {
      router.replace(routes.app.home);
    }
  }, [
    hasCompletedOnboarding,
    hasCompletedProfileSetup,
    hasHydrated,
    isAuthenticated,
    rootNavigationState?.key,
    segments
  ]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

