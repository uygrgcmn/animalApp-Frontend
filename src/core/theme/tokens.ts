import type { ViewStyle } from "react-native";

export const spacing = {
  nano: 2,
  micro: 4,
  tight: 8,
  compact: 12,
  standard: 16,
  comfortable: 20,
  section: 28,
  large: 40,
  xlarge: 60
} as const;

export const radius = {
  small: 10,
  medium: 14,
  large: 18,
  xlarge: 24,
  pill: 999,
  full: 9999
} as const;

export const typography = {
  display: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.8,
    lineHeight: 44
  },
  h1: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 36
  },
  h2: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 30
  },
  h3: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
    lineHeight: 26
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24
  },
  body: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 24
  },
  bodyStrong: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 24
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20
  },
  caption: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.1,
    lineHeight: 18
  },
  overline: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.0,
    lineHeight: 16
  }
} as const;

export const shadows = {
  micro: {
    elevation: 1,
    shadowColor: "#0A1929",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4
  },
  card: {
    elevation: 3,
    shadowColor: "#0A1929",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16
  },
  floating: {
    elevation: 12,
    shadowColor: "#0A1929",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 28
  }
} satisfies Record<string, ViewStyle>;
