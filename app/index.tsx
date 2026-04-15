import { Redirect } from "expo-router";

import {
  resolveAuthenticatedRoute,
  routes
} from "../src/core/navigation/routes";
import { SplashScreen } from "../src/features/auth/screens/SplashScreen";
import { useSessionStore } from "../src/features/auth/store/sessionStore";

export default function IndexRoute() {
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const hasCompletedOnboarding = useSessionStore(
    (state) => state.hasCompletedOnboarding
  );
  const hasCompletedProfileSetup = useSessionStore(
    (state) => state.hasCompletedProfileSetup
  );

  if (!hasHydrated) {
    return <SplashScreen />;
  }

  return (
    <Redirect
      href={
        isAuthenticated
          ? resolveAuthenticatedRoute({
              hasCompletedOnboarding,
              hasCompletedProfileSetup
            })
          : routes.auth.welcome
      }
    />
  );
}

