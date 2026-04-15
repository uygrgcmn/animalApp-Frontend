import type { ViewStyle } from "react-native";

export const spacing = {
  micro: 4,
  tight: 8,
  compact: 12,
  standard: 16,
  comfortable: 20,
  section: 24,
  large: 32
} as const;

export const radius = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 20,
  pill: 999
} as const;

export const typography = {
  display: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40
  },
  h1: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34
  },
  h2: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28
  },
  h3: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24
  },
  body: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22
  },
  bodyStrong: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18
  },
  caption: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16
  }
} as const;

export const shadows = {
  card: {
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.08,
    shadowRadius: 18
  },
  floating: {
    elevation: 8,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.12,
    shadowRadius: 16
  }
} satisfies Record<string, ViewStyle>;
