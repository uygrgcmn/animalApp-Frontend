import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ApiError } from "../../../core/api/errors";
import { authApi } from "../../../core/api/services/authApi";
import { uploadMediaAsset } from "../../../core/media/uploadMediaAsset";
import { usersApi } from "../../../core/api/services/usersApi";
import { clearStoredAuthTokens, getStoredAuthTokens, setStoredAuthTokens } from "../../../core/api/tokenStorage";
import type { MyProfile } from "../../../core/api/contracts";
import { sessionStorage } from "../../../core/storage/sessionStorage";
import type { CaregiverActivationValues } from "../../caregiver/schemas";
import type {
  CreateListingType,
  CreateWizardDraft,
  CreateWizardValues
} from "../../create/schemas";
import type { PetshopActivationValues } from "../../petshop/schemas";
import {
  deriveCaregiverDraftStatus,
  derivePetshopDraftStatus,
  normalizeCaregiverProfile,
  normalizePetshopProfile,
  type CaregiverModeStatus,
  type PetshopModeStatus
} from "../../profile/utils/modeStatus";
import type {
  ProfileGoal,
  ProfileSetupValues,
  SignInValues,
  SignUpValues
} from "../schemas";

type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  city: string | null;
  district: string | null;
  avatar: string | null;
  profileCompletion: number;
};

type SessionState = {
  hasHydrated: boolean;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  hasCompletedProfileSetup: boolean;
  user: UserProfile | null;
  profileGoal: ProfileGoal | null;
  caregiverStatus: CaregiverModeStatus;
  petshopStatus: PetshopModeStatus;
  caregiverProfile: CaregiverActivationValues | null;
  petshopProfile: PetshopActivationValues | null;
  createDrafts: Partial<Record<CreateListingType, CreateWizardDraft>>;
  bootstrap: () => Promise<void>;
  signIn: (values: SignInValues) => Promise<void>;
  signUp: (values: SignUpValues) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => void;
  completeProfileSetup: (payload: ProfileSetupValues) => Promise<void>;
  saveCaregiverDraft: (payload: CaregiverActivationValues) => void;
  submitCaregiverProfile: (payload: CaregiverActivationValues) => Promise<void>;
  savePetshopDraft: (payload: PetshopActivationValues) => void;
  submitPetshopApplication: (payload: PetshopActivationValues) => Promise<void>;
  saveCreateDraft: (
    listingType: CreateListingType,
    payload: CreateWizardValues,
    currentStep: number
  ) => void;
  clearCreateDraft: (listingType: CreateListingType) => void;
};

const initialState = {
  hasHydrated: false,
  isBootstrapping: false,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  hasCompletedProfileSetup: false,
  user: null,
  profileGoal: null,
  caregiverStatus: "inactive" as const,
  petshopStatus: "inactive" as const,
  caregiverProfile: null,
  petshopProfile: null,
  createDrafts: {}
};

function resolveProfileAvatar(
  profile: MyProfile,
  currentState?: Pick<SessionState, "user">
) {
  if (profile.avatar?.trim()) {
    return profile.avatar;
  }

  if (currentState?.user?.avatar?.trim()) {
    return currentState.user.avatar;
  }

  return null;
}

function toSessionUser(
  profile: MyProfile,
  currentState?: Pick<SessionState, "user">
): UserProfile {
  return {
    id: profile.id,
    fullName: profile.fullName?.trim() || profile.email,
    email: profile.email,
    city: profile.city,
    district: profile.district,
    avatar: resolveProfileAvatar(profile, currentState),
    profileCompletion: profile.profileCompletion
  };
}

function hasFinishedProfileSetup(
  profile: MyProfile,
  profileGoal: ProfileGoal | null,
  currentState?: Pick<SessionState, "user">
) {
  return Boolean(
    profile.fullName?.trim() &&
      profile.city?.trim() &&
      profile.district?.trim() &&
      resolveProfileAvatar(profile, currentState)?.trim() &&
      profileGoal
  );
}

function toCaregiverProfile(profile: MyProfile): CaregiverActivationValues | null {
  if (!profile.isSitter) {
    return null;
  }

  return normalizeCaregiverProfile({
    availability: "esnek",
    city: profile.city ?? "",
    district: profile.district ?? "",
    experienceYears:
      profile.sitterExperienceYears !== null ? String(profile.sitterExperienceYears) : "",
    profileBio: profile.sitterBio ?? "",
    rateExpectation:
      profile.sitterDailyRate !== null && profile.sitterDailyRate !== undefined
        ? String(profile.sitterDailyRate)
        : "",
    serviceTypes: profile.sitterServices,
    supportingAssets: []
  });
}

function toPetshopProfile(profile: MyProfile): PetshopActivationValues | null {
  if (!profile.isPetshop) {
    return null;
  }

  return normalizePetshopProfile({
    address: profile.businessAddress ?? "",
    authorizedPerson: profile.fullName ?? "",
    businessName: profile.businessName ?? "",
    businessType: "petshop",
    contactEmail: profile.email,
    contactPhone: profile.businessPhoneNumber ?? "",
    storeImages: [],
    taxNumber: profile.taxNumber ?? "",
    verificationDocuments: []
  });
}

function toCaregiverStatus(profile: MyProfile): CaregiverModeStatus {
  if (profile.isSitter && profile.sitterProfileStatus === "APPROVED") {
    return "active";
  }

  if (profile.isSitter) {
    return "incomplete";
  }

  return "inactive";
}

function toPetshopStatus(profile: MyProfile): PetshopModeStatus {
  if (profile.isPetshop && profile.petshopProfileStatus === "APPROVED") {
    return "active";
  }

  if (profile.petshopProfileStatus === "PENDING") {
    return "in_review";
  }

  if (profile.petshopProfileStatus === "REJECTED") {
    return "rejected";
  }

  if (profile.isPetshop) {
    return "incomplete";
  }

  return "inactive";
}

function toSessionState(
  profile: MyProfile,
  profileGoal: ProfileGoal | null,
  currentState: Pick<
    SessionState,
    "caregiverProfile" | "petshopProfile" | "caregiverStatus" | "petshopStatus" | "user"
  >
): Pick<
  SessionState,
  | "isAuthenticated"
  | "hasCompletedProfileSetup"
  | "user"
  | "profileGoal"
  | "caregiverStatus"
  | "petshopStatus"
  | "caregiverProfile"
  | "petshopProfile"
> {
  const preservedCaregiverProfile =
    toCaregiverProfile(profile) ??
    (currentState.caregiverProfile
      ? normalizeCaregiverProfile(currentState.caregiverProfile, {
          city: profile.city,
          district: profile.district
        })
      : null);
  const preservedPetshopProfile =
    toPetshopProfile(profile) ??
    (currentState.petshopProfile
      ? normalizePetshopProfile(currentState.petshopProfile, {
          email: profile.email,
          fullName: profile.fullName
        })
      : null);

  return {
    isAuthenticated: true,
    hasCompletedProfileSetup: hasFinishedProfileSetup(profile, profileGoal, currentState),
    user: toSessionUser(profile, currentState),
    profileGoal,
    caregiverStatus: profile.isSitter
      ? toCaregiverStatus(profile)
      : preservedCaregiverProfile
        ? deriveCaregiverDraftStatus(
            preservedCaregiverProfile,
            currentState.caregiverStatus
          )
        : "inactive",
    petshopStatus:
      profile.isPetshop || profile.petshopProfileStatus === "PENDING" || profile.petshopProfileStatus === "REJECTED"
        ? toPetshopStatus(profile)
        : preservedPetshopProfile
          ? derivePetshopDraftStatus(preservedPetshopProfile, currentState.petshopStatus)
          : "inactive",
    caregiverProfile: preservedCaregiverProfile,
    petshopProfile: preservedPetshopProfile
  };
}

async function uploadProfileAvatar(uri: string) {
  if (!uri.startsWith("file:")) {
    return {
      avatar: uri,
      persisted: true
    };
  }

  try {
    const uploaded = await uploadMediaAsset({ folder: "avatars", uri });
    // uploadMediaAsset upload hatalarında yerel URI'yi döndürür — API'ye gönderme
    const persisted = !uploaded.startsWith("file:");
    return { avatar: uploaded, persisted };
  } catch (error) {
    if (
      error instanceof ApiError ||
      (error instanceof Error &&
        (error.message.includes("S3") ||
          error.message.includes("presigned") ||
          error.message.includes("Sunucuya ulasilamadi")))
    ) {
      return { avatar: uri, persisted: false };
    }

    throw error;
  }
}

async function uploadPetshopVerificationDocument(uri: string) {
  if (!uri.startsWith("file:")) {
    return uri;
  }

  const uploaded = await uploadMediaAsset({ folder: "petshop-documents", uri });

  if (uploaded.startsWith("file:")) {
    throw new Error("Dogrulama belgesi yuklenemedi. Lutfen tekrar deneyin.");
  }

  return uploaded;
}

async function fetchAuthenticatedProfile() {
  try {
    return await usersApi.getMyProfile();
  } catch (error) {
    const tokens = await getStoredAuthTokens();

    if (!(error instanceof ApiError) || error.statusCode !== 401 || !tokens?.refreshToken) {
      throw error;
    }

    const refreshedTokens = await authApi.refresh({
      refreshToken: tokens.refreshToken
    });

    await setStoredAuthTokens(refreshedTokens);

    return usersApi.getMyProfile();
  }
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...initialState,
      bootstrap: async () => {
        const tokens = await getStoredAuthTokens();

        if (!tokens) {
          set((state) => ({
            ...initialState,
            hasCompletedOnboarding: state.hasCompletedOnboarding,
            hasHydrated: true
          }));
          return;
        }

        set({
          isBootstrapping: true
        });

        try {
          const profile = await fetchAuthenticatedProfile();

          set((state) => ({
            ...toSessionState(profile, state.profileGoal, state),
            hasCompletedOnboarding: state.hasCompletedOnboarding,
            hasHydrated: true,
            isBootstrapping: false
          }));
        } catch {
          await clearStoredAuthTokens();

          set((state) => ({
            ...initialState,
            hasCompletedOnboarding: state.hasCompletedOnboarding,
            hasHydrated: true,
            isBootstrapping: false
          }));
        }
      },
      signIn: async (values) => {
        const tokens = await authApi.login(values);
        await setStoredAuthTokens(tokens);

        try {
          const profile = await usersApi.getMyProfile();

          set((state) => ({
            ...toSessionState(profile, state.profileGoal, state),
            hasCompletedOnboarding: state.hasCompletedOnboarding,
            hasHydrated: true
          }));
        } catch (error) {
          await clearStoredAuthTokens();
          throw error;
        }
      },
      signUp: async (values) => {
        const tokens = await authApi.register(values);
        await setStoredAuthTokens(tokens);

        try {
          const profile = await usersApi.getMyProfile();

          set((state) => ({
            ...toSessionState(profile, state.profileGoal, state),
            hasCompletedOnboarding: state.hasCompletedOnboarding,
            hasHydrated: true
          }));
        } catch (error) {
          await clearStoredAuthTokens();
          throw error;
        }
      },
      signOut: async () => {
        await clearStoredAuthTokens();

        set((state) => ({
          ...initialState,
          hasCompletedOnboarding: state.hasCompletedOnboarding,
          hasHydrated: true
        }));
      },
      completeOnboarding: () =>
        set({
          hasCompletedOnboarding: true
        }),
      completeProfileSetup: async (payload) => {
        const avatarUpload = await uploadProfileAvatar(payload.photoUri);
        const profile = await usersApi.updateMyProfile({
          city: payload.city,
          district: payload.district,
          fullName: payload.fullName,
          ...(avatarUpload.persisted ? { avatar: avatarUpload.avatar } : {})
        });
        const hydratedProfile =
          avatarUpload.persisted || profile.avatar
            ? profile
            : {
                ...profile,
                avatar: avatarUpload.avatar
              };

        set((state) => ({
          ...toSessionState(hydratedProfile, payload.goal, state),
          hasCompletedOnboarding: true,
          hasCompletedProfileSetup: true,
          hasHydrated: true
        }));
      },
      saveCaregiverDraft: (payload) =>
        set((state) => {
          const caregiverProfile = normalizeCaregiverProfile(payload, {
            city: state.user?.city,
            district: state.user?.district
          });

          return {
            caregiverStatus: deriveCaregiverDraftStatus(
              caregiverProfile,
              state.caregiverStatus
            ),
            caregiverProfile
          };
        }),
      submitCaregiverProfile: async (payload) => {
        const normalized = normalizeCaregiverProfile(payload);
        const experience = Number(normalized.experienceYears) || 0;
        const dailyRate = Number(normalized.rateExpectation) || 0;

        const updatedProfile = await usersApi.convertToSitter({
          experience,
          bio: normalized.profileBio,
          dailyRate,
          services: normalized.serviceTypes
        });

        set((state) => ({
          ...toSessionState(updatedProfile, state.profileGoal, state),
          hasCompletedOnboarding: state.hasCompletedOnboarding,
          hasCompletedProfileSetup: state.hasCompletedProfileSetup
        }));
      },
      savePetshopDraft: (payload) =>
        set((state) => {
          const petshopProfile = normalizePetshopProfile(payload, {
            email: state.user?.email,
            fullName: state.user?.fullName
          });

          return {
            petshopStatus: derivePetshopDraftStatus(petshopProfile, state.petshopStatus),
            petshopProfile
          };
        }),
      submitPetshopApplication: async (payload) => {
        const normalized = normalizePetshopProfile(payload);
        const certificateUri = normalized.verificationDocuments[0];

        if (!certificateUri) {
          throw new Error("Petshop basvurusu icin en az bir dogrulama belgesi gerekli.");
        }

        const businessCertificateUrl = await uploadPetshopVerificationDocument(
          certificateUri
        );

        const updatedProfile = await usersApi.convertToPetshop({
          businessName: normalized.businessName,
          taxNumber: normalized.taxNumber,
          address: normalized.address,
          latitude: 0,
          longitude: 0,
          phoneNumber: normalized.contactPhone,
          businessCertificateUrl
        });

        const storedTokens = await getStoredAuthTokens();

        if (storedTokens?.refreshToken) {
          const refreshedTokens = await authApi.refresh({
            refreshToken: storedTokens.refreshToken
          });
          await setStoredAuthTokens(refreshedTokens);
        }

        set((state) => ({
          ...toSessionState(updatedProfile, state.profileGoal, state),
          hasCompletedOnboarding: state.hasCompletedOnboarding,
          hasCompletedProfileSetup: state.hasCompletedProfileSetup
        }));
      },
      saveCreateDraft: (listingType, payload, currentStep) =>
        set((state) => ({
          createDrafts: {
            ...state.createDrafts,
            [listingType]: {
              currentStep,
              updatedAt: new Date().toISOString(),
              values: payload
            }
          }
        })),
      clearCreateDraft: (listingType) =>
        set((state) => {
          const nextDrafts = { ...state.createDrafts };
          delete nextDrafts[listingType];

          return {
            createDrafts: nextDrafts
          };
        })
    }),
    {
      name: "animal-app-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        hasCompletedProfileSetup: state.hasCompletedProfileSetup,
        user: state.user,
        profileGoal: state.profileGoal,
        caregiverStatus: state.caregiverStatus,
        petshopStatus: state.petshopStatus,
        caregiverProfile: state.caregiverProfile,
        petshopProfile: state.petshopProfile,
        createDrafts: state.createDrafts
      })
    }
  )
);

