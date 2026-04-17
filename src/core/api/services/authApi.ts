import type {
  AuthTokens,
  CurrentUser,
  LoginRequest,
  RequestPasswordResetRequest,
  RefreshTokenRequest,
  RegisterRequest
} from "../contracts";
import { httpClient } from "../httpClient";

export const authApi = {
  register: (payload: RegisterRequest) =>
    httpClient.post<AuthTokens>("/auth/register", payload),
  login: (payload: LoginRequest) => httpClient.post<AuthTokens>("/auth/login", payload),
  requestPasswordReset: (payload: RequestPasswordResetRequest) =>
    httpClient.post<null>("/auth/forgot-password", payload),
  refresh: (payload: RefreshTokenRequest) =>
    httpClient.post<AuthTokens>("/auth/refresh", payload),
  me: () => httpClient.get<CurrentUser>("/auth/me", { auth: true })
};

