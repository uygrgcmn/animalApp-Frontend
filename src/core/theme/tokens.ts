import type { ViewStyle } from "react-native";

// 8pt grid system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  // Legacy aliases (backward compat)
  nano: 2,
  micro: 4,
  tight: 8,
  compact: 12,
  standard: 16,
  comfortable: 20,
  section: 32,
  large: 48,
  xlarge: 64
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  // Legacy aliases
  small: 10,
  medium: 16,
  large: 20,
  xlarge: 28,
  pill: 999,
  full: 9999
} as const;

export const typography = {
  display: {
    fontSize: 40,
    fontWeight: "900" as const,
    letterSpacing: -1.0,
    lineHeight: 48
  },
  h1: {
    fontSize: 30,
    fontWeight: "800" as const,
    letterSpacing: -0.6,
    lineHeight: 38
  },
  h2: {
    fontSize: 24,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
    lineHeight: 32
  },
  h3: {
    fontSize: 20,
    fontWeight: "700" as const,
    letterSpacing: -0.2,
    lineHeight: 28
  },
  subheading: {
    fontSize: 17,
    fontWeight: "600" as const,
    lineHeight: 26
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 26
  },
  bodyStrong: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 26
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 22
  },
  caption: {
    fontSize: 13,
    fontWeight: "500" as const,
    letterSpacing: 0.1,
    lineHeight: 20
  },
  overline: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 1.2,
    lineHeight: 16,
    textTransform: "uppercase" as const
  }
} as const;

export const shadows = {
  micro: {
    elevation: 1,
    shadowColor: "#4C1D95",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  card: {
    elevation: 4,
    shadowColor: "#4C1D95",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20
  },
  floating: {
    elevation: 14,
    shadowColor: "#4C1D95",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 32
  }
} satisfies Record<string, ViewStyle>;
