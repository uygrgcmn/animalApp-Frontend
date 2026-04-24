import { apiConfig } from "./config";
import { ApiError, toApiError } from "./errors";
import { clearStoredAuthTokens, getStoredAuthTokens, setStoredAuthTokens } from "./tokenStorage";

type Primitive = string | number | boolean;
type QueryValue = Primitive | null | undefined | Primitive[];

type RequestOptions = Omit<RequestInit, "body"> & {
  auth?: boolean;
  body?: BodyInit | Record<string, unknown> | null;
  query?: Record<string, QueryValue>;
  timeoutMs?: number;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${apiConfig.baseUrl}${normalizedPath}`);

  if (!query) {
    return url.toString();
  }

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        url.searchParams.append(key, String(item));
      });
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

async function parseResponse(response: Response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function buildHeaders(options: RequestOptions) {
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  const hasJsonBody =
    options.body !== undefined &&
    options.body !== null &&
    !(options.body instanceof FormData) &&
    typeof options.body !== "string";

  if (hasJsonBody) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const accessToken = await ensureAccessToken();

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  return headers;
}

// Prevents concurrent refresh races: only one refresh runs at a time.
let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const stored = await getStoredAuthTokens();
      if (!stored?.refreshToken) return null;

      const response = await fetch(`${apiConfig.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: stored.refreshToken })
      });

      if (!response.ok) {
        await clearStoredAuthTokens();
        return null;
      }

      const newTokens = await response.json();
      await setStoredAuthTokens(newTokens);
      return newTokens.accessToken as string;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function ensureAccessToken(): Promise<string | null> {
  const stored = await getStoredAuthTokens();

  if (stored?.accessToken) {
    return stored.accessToken;
  }

  if (stored?.refreshToken) {
    return tryRefreshAccessToken();
  }

  return null;
}

function serializeBody(body: RequestOptions["body"]) {
  if (body === undefined || body === null || body instanceof FormData || typeof body === "string") {
    return body;
  }
  return JSON.stringify(body);
}

async function executeRequest<T>(path: string, options: RequestOptions): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? apiConfig.timeoutMs
  );

  try {
    const headers = await buildHeaders(options);
    const response = await fetch(buildUrl(path, options.query), {
      ...options,
      headers,
      body: serializeBody(options.body),
      signal: controller.signal
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
      throw toApiError(response.status, payload);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Istek zaman asimina ugradi.");
    }

    if (error instanceof TypeError) {
      throw new Error(
        `Sunucuya ulasilamadi. API adresini kontrol edin: ${apiConfig.baseUrl}`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function request<T>(path: string, options: RequestOptions = {}) {
  try {
    return await executeRequest<T>(path, options);
  } catch (error) {
    // On 401, refresh the access token once and retry
    if (error instanceof ApiError && error.statusCode === 401 && options.auth) {
      const newToken = await tryRefreshAccessToken();
      if (newToken) {
        return await executeRequest<T>(path, options);
      }

      await clearStoredAuthTokens();
      throw new ApiError("Oturumunuzun suresi doldu. Lutfen yeniden giris yapin.", 401);
    }
    throw error;
  }
}

export const httpClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: RequestOptions["body"], options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: RequestOptions["body"], options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "DELETE" })
};

