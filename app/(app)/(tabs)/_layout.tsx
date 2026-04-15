import { Tabs } from "expo-router";

import { mainTabs } from "../../../src/core/navigation/routes";
import { colors } from "../../../src/core/theme/colors";
import { AppTabBar } from "../../../src/shared/navigation/AppTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background
        }
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="home" options={{ title: mainTabs.home.label }} />
      <Tabs.Screen name="explore" options={{ title: mainTabs.explore.label }} />
      <Tabs.Screen name="community" options={{ title: mainTabs.community.label }} />
      <Tabs.Screen name="messages" options={{ title: mainTabs.messages.label }} />
      <Tabs.Screen name="profile" options={{ title: mainTabs.profile.label }} />
    </Tabs>
  );
}

