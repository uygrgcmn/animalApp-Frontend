import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../core/theme/colors";
import { mainTabs, routes, type MainTabKey } from "../../core/navigation/routes";
import { radius, shadows, spacing } from "../../core/theme/tokens";

export function AppTabBar({ descriptors, navigation, state }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={styles.root}>
      <Pressable
        onPress={() => {
          router.push(routes.app.create);
        }}
        style={[styles.fab, { bottom: insets.bottom + 100 }]}
      >
        <MaterialCommunityIcons color={colors.textInverse} name="plus" size={26} />
      </Pressable>

      <View
        style={[
          styles.bar,
          {
            paddingBottom: Math.max(insets.bottom, spacing.standard),
            marginBottom: spacing.standard
          }
        ]}
      >
        {state.routes.map((route, index) => {
          const config = mainTabs[route.name as MainTabKey];
          const focused = state.index === index;

          if (!config) {
            return null;
          }

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
            <Pressable
              key={route.key}
              accessibilityLabel={descriptors[route.key]?.options.tabBarAccessibilityLabel}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabItem}
            >
              <View style={[styles.iconWrap, focused ? styles.iconWrapActive : null]}>
                <MaterialCommunityIcons
                  color={focused ? colors.primary : colors.textSubtle}
                  name={focused ? config.iconActive : config.icon}
                  size={24}
                />
              </View>
              <Text style={[styles.label, focused ? styles.labelActive : null]}>
                {config.label}
              </Text>
              {focused && <View style={styles.indicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    ...shadows.floating,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xlarge,
    borderWidth: 1,
    flexDirection: "row",
    marginHorizontal: spacing.standard,
    paddingHorizontal: spacing.tight,
    paddingTop: spacing.compact
  },
  fab: {
    ...shadows.floating,
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 56,
    justifyContent: "center",
    position: "absolute",
    right: spacing.standard,
    width: 56,
    zIndex: 10,
    elevation: 12
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: radius.medium,
    height: 38,
    justifyContent: "center",
    width: 48,
    marginBottom: 2
  },
  iconWrapActive: {
    backgroundColor: colors.primarySoft
  },
  indicator: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 4,
    marginTop: 2,
    width: 4
  },
  label: {
    color: colors.textSubtle,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2
  },
  labelActive: {
    color: colors.primary
  },
  root: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 64
  }
});
