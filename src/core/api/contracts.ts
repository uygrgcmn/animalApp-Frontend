export type Role = "USER" | "ADMIN";

export type Permission =
  | "post:create"
  | "post:delete:own"
  | "post:delete:any"
  | "message:send"
  | "pet:create"
  | "pet:update:own"
  | "shop:manage"
  | "admin:access";

export type ListingType =
  | "ADOPTION"
  | "SITTING"
  | "COMMUNITY"
  | "FREE_ITEM"
  | "ACTIVITY"
  | "HELP_REQUEST";

export type ListingStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED" | "ARCHIVED";

export type ApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export type ProfileRequestStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

export type DiscoverableProfileKind = "ALL" | "SITTER" | "PET_SHOP";

export type DecimalValue = string | number | null;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: string;
};

export type CurrentUser = {
  sub: string;
  email: string;
  role: Role;
  isPetshop: boolean;
  isSitter: boolean;
  permissions: Permission[];
  type: "access" | "refresh";
};

export type UserSummary = {
  id: string;
  email: string;
  role: Role;
  fullName: string | null;
  avatar: string | null;
  city: string | null;
  district: string | null;
  rating: DecimalValue;
  isPetshop: boolean;
  isSitter: boolean;
};

export type PetRecord = {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  microchipId: string | null;
  healthStatus: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CommunityItemRecord = {
  id: string;
  listingId: string;
  itemCondition: string;
  quantity: number;
  category: string;
  attributes: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type ListingApplicationSummary = {
  id: string;
  listingId: string;
  applicantId: string;
  status: ApplicationStatus;
  message: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  applicant?: UserSummary;
};

export type ListingRecord = {
  id: string;
  creatorId: string;
  petId: string | null;
  type: ListingType;
  title: string;
  description: string;
  status: ListingStatus;
  latitude: number | null;
  longitude: number | null;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: UserSummary;
  pet?: PetRecord | null;
  communityItem?: CommunityItemRecord | null;
  applications?: ListingApplicationSummary[];
  distanceKm?: number;
};

export type ApplicationRecord = {
  id: string;
  listingId: string;
  applicantId: string;
  status: ApplicationStatus;
  message: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  applicant?: UserSummary;
  listing?: {
    id: string;
    creatorId: string;
    title: string;
    type: ListingType;
    creator?: UserSummary;
    pet?: PetRecord | null;
  };
};

export type MyProfile = {
  id: string;
  email: string;
  role: Role;
  fullName: string | null;
  phoneNumber: string | null;
  bio: string | null;
  city: string | null;
  district: string | null;
  avatar: string | null;
  userLatitude: number | null;
  userLongitude: number | null;
  isPetshop: boolean;
  isSitter: boolean;
  sitterProfileStatus: ProfileRequestStatus;
  petshopProfileStatus: ProfileRequestStatus;
  sitterExperienceYears: number | null;
  sitterBio: string | null;
  sitterDailyRate: DecimalValue;
  sitterServices: string[];
  businessName: string | null;
  taxNumber: string | null;
  businessAddress: string | null;
  businessLatitude: number | null;
  businessLongitude: number | null;
  businessPhoneNumber: string | null;
  rating: DecimalValue;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
  profileCompletion: number;
};

export type PublicProfile = {
  id: string;
  role: Role;
  fullName: string | null;
  bio: string | null;
  city: string | null;
  district: string | null;
  avatar: string | null;
  userLatitude: number | null;
  userLongitude: number | null;
  isPetshop: boolean;
  isSitter: boolean;
  sitterProfileStatus: ProfileRequestStatus;
  petshopProfileStatus: ProfileRequestStatus;
  sitterExperienceYears: number | null;
  sitterBio: string | null;
  sitterDailyRate: DecimalValue;
  sitterServices: string[];
  businessName: string | null;
  businessAddress: string | null;
  businessLatitude: number | null;
  businessLongitude: number | null;
  businessPhoneNumber: string | null;
  rating: DecimalValue;
  createdAt: string;
  updatedAt: string;
  profileKind: "USER" | "SITTER" | "PET_SHOP";
  displayName: string;
  headline: string;
  latitude: number | null;
  longitude: number | null;
};

export type DiscoverableProfile = PublicProfile & {
  distanceKm: number | null;
};

export type RegisterRequest = {
  email: string;
  password: string;
  fullName?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RequestPasswordResetRequest = {
  email: string;
};

export type UpdateMyProfileRequest = {
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  city?: string;
  district?: string;
  avatar?: string;
  userLatitude?: number;
  userLongitude?: number;
};

export type RequestSitterProfileRequest = {
  experience: number;
  bio: string;
  dailyRate: number;
  services: string[];
};

export type RequestPetshopProfileRequest = {
  businessName: string;
  taxNumber: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
};

export type FindPublicUsersQuery = {
  kind?: DiscoverableProfileKind;
  query?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  limit?: number;
};

export type CreateListingRequest = {
  petId?: string;
  type: ListingType;
  title: string;
  description: string;
  status?: ListingStatus;
  publishedAt?: string;
  expiresAt?: string;
  latitude?: number;
  longitude?: number;
};

export type UpdateListingRequest = Partial<CreateListingRequest>;

export type FindListingsQuery = {
  type?: ListingType;
  status?: ListingStatus;
  creatorId?: string;
  petId?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  limit?: number;
  offset?: number;
};

export type CreateApplicationRequest = {
  message: string;
  startDate?: string;
  endDate?: string;
};

export type TransitionApplicationRequest = {
  status: ApplicationStatus;
};

export type CommunityListingType = "FREE_ITEM" | "ACTIVITY" | "HELP_REQUEST";

export type CreateCommunityListingRequest = {
  type: CommunityListingType;
  title: string;
  description: string;
  status?: ListingStatus;
  latitude: number;
  longitude: number;
  itemCondition: string;
  quantity: number;
  category: string;
};

export type UpdateCommunityListingRequest = Partial<CreateCommunityListingRequest>;

export type FindCommunityListingsQuery = {
  type?: CommunityListingType;
  status?: ListingStatus;
  category?: string;
  creatorId?: string;
  limit?: number;
  offset?: number;
};

export type ProximityCommunityListingsQuery = {
  type?: CommunityListingType;
  status?: ListingStatus;
  category?: string;
  latitude: number;
  longitude: number;
  radiusKm?: number;
};

export type CreatePetRequest = {
  name: string;
  species: string;
  breed: string;
  age: number;
  microchipId?: string;
  healthStatus: string;
  description?: string;
};

export type UpdatePetRequest = Partial<CreatePetRequest>;

export type ConversationRecord = {
  id: string;
  listingId: string;
  initiatorId: string;
  recipientId: string;
  unreadCount: number;
  isArchived: boolean;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  createdAt: string;
  updatedAt: string;
  listing?: {
    id: string;
    title: string;
    type: ListingType;
  };
  otherParticipant?: UserSummary;
};

export type MessageRecord = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: UserSummary;
};

export type CreateConversationRequest = {
  listingId: string;
  recipientId: string;
  initialMessage: string;
};

export type SendMessageRequest = {
  content: string;
};

export type CreatePresignedUploadUrlRequest = {
  fileName: string;
  contentType: string;
  folder?: string;
};

export type PresignedUploadUrlResponse = {
  key: string;
  uploadUrl: string;
  expiresIn: number;
  publicUrl: string;
};

