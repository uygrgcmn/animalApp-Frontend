import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type PropsWithChildren
} from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../theme/colors";
import { radius, spacing, typography } from "../theme/tokens";

type ToastType = "success" | "error" | "info";

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

interface ToastEntry {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, options?: ToastOptions) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICON: Record<ToastType, string> = {
  success: "check-circle-outline",
  error: "alert-circle-outline",
  info: "information-outline"
};

const BG: Record<ToastType, string> = {
  success: "#0D9488",
  error: colors.error,
  info: "#6366F1"
};

function ToastBanner({ entry, onDismiss }: { entry: ToastEntry; onDismiss: () => void }) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 100, duration: 200, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true })
    ]).start(onDismiss);
  }, [opacity, onDismiss, translateY]);

  // Animate in on mount
  useState(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();
  });

  return (
    <Animated.View
      style={[
        styles.banner,
        { backgroundColor: BG[entry.type], bottom: Math.max(insets.bottom + 90, 110) },
        { transform: [{ translateY }], opacity }
      ]}
    >
      <MaterialCommunityIcons color="#fff" name={ICON[entry.type] as any} size={20} />
      <Text numberOfLines={3} style={styles.bannerText}>{entry.message}</Text>
      <TouchableOpacity hitSlop={12} onPress={dismiss}>
        <MaterialCommunityIcons color="rgba(255,255,255,0.7)" name="close" size={18} />
      </TouchableOpacity>
    </Animated.View>
  );
}

let _idCounter = 0;

export function ToastProvider({ children }: PropsWithChildren) {
  const [current, setCurrent] = useState<ToastEntry | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrent(null);
  }, []);

  const show = useCallback(
    (message: string, options: ToastOptions = {}) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const entry: ToastEntry = {
        id: ++_idCounter,
        message,
        type: options.type ?? "info"
      };
      setCurrent(entry);
      timerRef.current = setTimeout(dismiss, options.duration ?? 3500);
    },
    [dismiss]
  );

  const success = useCallback((msg: string) => show(msg, { type: "success" }), [show]);
  const error = useCallback((msg: string) => show(msg, { type: "error" }), [show]);
  const info = useCallback((msg: string) => show(msg, { type: "info" }), [show]);

  return (
    <ToastContext.Provider value={{ show, success, error, info }}>
      {children}
      {current && (
        <ToastBanner key={current.id} entry={current} onDismiss={dismiss} />
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  banner: {
    alignItems: "center",
    borderRadius: radius.xl,
    elevation: 8,
    flexDirection: "row",
    gap: spacing.compact,
    left: spacing.lg,
    paddingHorizontal: spacing.standard,
    paddingVertical: spacing.compact,
    position: "absolute",
    right: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  bannerText: {
    ...typography.body,
    color: "#fff",
    flex: 1
  }
});
