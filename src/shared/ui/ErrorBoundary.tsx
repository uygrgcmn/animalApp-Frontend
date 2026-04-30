import { Component, type ErrorInfo, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../../core/theme/colors";
import { radius, spacing, typography } from "../../core/theme/tokens";
import { AppButton } from "./AppButton";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (__DEV__) {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <View style={styles.container}>
          <MaterialCommunityIcons
            color={colors.error}
            name="alert-circle-outline"
            size={52}
          />
          <Text style={styles.title}>Bir şeyler ters gitti</Text>
          <Text style={styles.subtitle}>
            Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
          </Text>
          {__DEV__ && this.state.error && (
            <Text numberOfLines={4} style={styles.devError}>
              {this.state.error.message}
            </Text>
          )}
          <AppButton label="Tekrar Dene" onPress={this.reset} variant="secondary" />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: spacing.standard,
    justifyContent: "center",
    padding: spacing.lg
  },
  devError: {
    ...typography.caption,
    backgroundColor: "#FEF2F2",
    borderRadius: radius.md,
    color: colors.error,
    fontFamily: "monospace",
    padding: spacing.compact,
    width: "100%"
  },
  subtitle: {
    ...typography.body,
    color: colors.textSubtle,
    textAlign: "center"
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center"
  }
});
