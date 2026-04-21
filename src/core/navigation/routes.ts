import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import type { ComponentProps } from "react";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export const routes = {
  auth: {
    welcome: "/(auth)/welcome" as Href,
    signIn: "/(auth)/sign-in" as Href,
    signUp: "/(auth)/sign-up" as Href,
    forgotPassword: "/(auth)/forgot-password" as Href,
    onboarding: "/(auth)/onboarding" as Href,
    profileSetup: "/(auth)/profile-setup" as Href,
    splash: "/(auth)/splash" as Href
  },
  app: {
    tabsRoot: "/(app)/(tabs)" as Href,
    home: "/(app)/(tabs)/home" as Href,
    explore: "/(app)/(tabs)/explore" as Href,
    community: "/(app)/(tabs)/community" as Href,
    create: "/(app)/(tabs)/create" as Href,
    messages: "/(app)/(tabs)/messages" as Href,
    profile: "/(app)/(tabs)/profile" as Href,
    petshop: "/(app)/(tabs)/petshop" as Href,
    profileEdit: "/(app)/profile/edit" as Href,
    profileModes: "/(app)/profile/modes" as Href,
    profileApplications: "/(app)/profile/applications" as Href,
    profileListings: "/(app)/profile/listings" as Href,
    profileSaved: "/(app)/profile/saved" as Href,
    profileSettings: "/(app)/profile/settings" as Href,
    caregiverActivation: "/(app)/caregiver-activation" as Href,
    petshopActivation: "/(app)/petshop-activation" as Href,
    petshopDashboard: "/(app)/petshop/dashboard" as Href,
    petshopCampaignManagement: "/(app)/petshop/campaigns" as Href,
    profilePets: "/(app)/profile/pets" as Href,
    petNew: "/(app)/profile/pets/new" as Href,
    petEdit: (petId: string) =>
      ({
        pathname: "/(app)/profile/pets/[petId]",
        params: { petId }
      }) as const
  }
} as const;

export const mainTabs = {
  home: {
    href: routes.app.home,
    icon: "home-variant-outline" as IconName,
    iconActive: "home-variant" as IconName,
    label: "Ana Sayfa"
  },
  community: {
    href: routes.app.community,
    icon: "hand-heart-outline" as IconName,
    iconActive: "hand-heart" as IconName,
    label: "Topluluk"
  },
  create: {
    href: routes.app.create,
    icon: "plus-circle-outline" as IconName,
    iconActive: "plus-circle" as IconName,
    label: "İlan Oluştur"
  },
  messages: {
    href: routes.app.messages,
    icon: "message-text-outline" as IconName,
    iconActive: "message-text" as IconName,
    label: "Mesajlar"
  },
  profile: {
    href: routes.app.profile,
    icon: "account-circle-outline" as IconName,
    iconActive: "account-circle" as IconName,
    label: "Profil"
  }
} as const;

export type MainTabKey = keyof typeof mainTabs;

type RouteValues<T> = T[keyof T];

export type AuthRoute = RouteValues<typeof routes.auth>;
export type MainTabRoute = RouteValues<typeof routes.app>;

export const routeBuilders = {
  createWithType: (
    listingType:
      | "caregiver-listing"
      | "owner-request"
      | "community-post"
      | "petshop-campaign"
  ) =>
    ({
      pathname: "/(app)/(tabs)/create",
      params: { listingType }
    }) as const,
  caregiverListingDetail: (listingId: string) =>
    ({
      pathname: "/(app)/caregiver-listings/[listingId]",
      params: { listingId }
    }) as const,
  communityPostDetail: (postId: string) =>
    ({
      pathname: "/(app)/community/[postId]",
      params: { postId }
    }) as const,
  ownerRequestDetail: (listingId: string) =>
    ({
      pathname: "/(app)/owner-requests/[listingId]",
      params: { listingId }
    }) as const,
  petshopCampaignDetail: (listingId: string) =>
    ({
      pathname: "/(app)/petshop-campaigns/[listingId]",
      params: { listingId }
    }) as const,
  petshopStoreProfile: (storeId: string) =>
    ({
      pathname: "/(app)/petshop/store/[storeId]",
      params: { storeId }
    }) as const,
  listingApplications: (listingId: string) =>
    ({
      pathname: "/(app)/listings/[listingId]/applications",
      params: { listingId }
    }) as const
};

export function resolveAuthenticatedRoute({
  hasCompletedOnboarding,
  hasCompletedProfileSetup
}: {
  hasCompletedOnboarding: boolean;
  hasCompletedProfileSetup: boolean;
}) {
  if (!hasCompletedOnboarding) {
    return routes.auth.onboarding;
  }

  if (!hasCompletedProfileSetup) {
    return routes.auth.profileSetup;
  }

  return routes.app.home;
}
