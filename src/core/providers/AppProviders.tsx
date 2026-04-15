import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import type { PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SessionBootstrap } from "../../features/auth/components/SessionBootstrap";
import { queryClient } from "../query/queryClient";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <SessionBootstrap />
        {children}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

