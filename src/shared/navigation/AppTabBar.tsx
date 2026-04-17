import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../core/theme/colors";
import { mainTabs, type MainTabKey } from "../../core/navigation/routes";
import { radius, shadows, spacing } from "../../core/theme/tokens";

export function AppTabBar({ descriptors, navigation, state }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={styles.root}>
      <View
        style={[
          styles.bar,
          { paddingBottom: Math.max(insets.bottom + 4, spacing.compact) }
        ]}
      >
        {state.routes.map((route, index) => {
          const config = mainTabs[route.name as MainTabKey];
          const focused = state.index === index;

          if (!config) return null;

          const onPress = () => {
            const event = navigation.emit({
              canPreventDefault: true,
              target: route.key,
              type: "tabPress"
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TabItemButton
              key={route.key}
              accessibilityLabel={descriptors[route.key]?.options.tabBarAccessibilityLabel}
              config={config}
              focused={focused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

type TabConfig = (typeof mainTabs)[MainTabKey];

function TabItemButton({
  accessibilityLabel,
  config,
  focused,
  onPress
}: {
  accessibilityLabel: string | undefined;
  config: TabConfig;
  focused: boolean;
  onPress: () => void;
}) {
  const iconScale = useSharedValue(1);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (focused) {
      iconScale.value = withSpring(1.18, { damping: 6, stiffness: 280 }, () => {
        "worklet";
        iconScale.value = withSpring(1, { damping: 12, stiffness: 300 });
      });
    }
  }, [focused, iconScale]);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }]
  }));

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      onPress={onPress}
      style={styles.tabItem}
    >
      {focused && <View style={styles.activeBackground} />}
      <Animated.View style={iconAnimStyle}>
        <MaterialCommunityIcons
          color={focused ? colors.primary : colors.textTertiary}
          name={focused ? config.iconActive : config.icon}
          size={24}
        />
      </Animated.View>
      <Text style={[styles.label, focused ? styles.labelActive : null]}>
        {config.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    ...shadows.floating,
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    flexDirection: "row",
    marginBottom: spacing.compact,
    marginHorizontal: spacing.standard,
    paddingHorizontal: spacing.tight,
    paddingTop: spacing.tight
  },
  activeBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.large,
    marginHorizontal: spacing.micro,
    marginVertical: spacing.micro
  },
  label: {
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.1
  },
  labelActive: {
    color: colors.primary
  },
  root: {
    backgroundColor: "transparent",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
    gap: 3,
    justifyContent: "center",
    minHeight: 58,
    paddingVertical: spacing.tight
  }
});
