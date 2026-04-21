import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import type { PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "../../shared/ui/ErrorBoundary";
import { SessionBootstrap } from "../../features/auth/components/SessionBootstrap";
import { queryClient } from "../query/queryClient";
import { ToastProvider } from "./ToastProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <StatusBar style="dark" />
            <SessionBootstrap />
            {children}
          </ToastProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

