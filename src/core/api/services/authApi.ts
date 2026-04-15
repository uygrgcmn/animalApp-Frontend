import type {
  AuthTokens,
  CurrentUser,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest
} from "../contracts";
import { httpClient } from "../httpClient";

export const authApi = {
  register: (payload: RegisterRequest) =>
    httpClient.post<AuthTokens>("/auth/register", payload),
  login: (payload: LoginRequest) => httpClient.post<AuthTokens>("/auth/login", payload),
  refresh: (payload: RefreshTokenRequest) =>
    httpClient.post<AuthTokens>("/auth/refresh", payload),
  me: () => httpClient.get<CurrentUser>("/auth/me", { auth: true })
};

