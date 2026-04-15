import { Redirect } from "expo-router";

import { routes } from "../../../src/core/navigation/routes";

export default function TabsIndexRoute() {
  return <Redirect href={routes.app.home} />;
}
