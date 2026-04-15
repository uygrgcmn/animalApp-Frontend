import { apiConfig } from "./config";
import { toApiError } from "./errors";
import { getStoredAuthTokens } from "./tokenStorage";

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
    const tokens = await getStoredAuthTokens();

    if (tokens?.accessToken) {
      headers.set("Authorization", `Bearer ${tokens.accessToken}`);
    }
  }

  return headers;
}

async function request<T>(path: string, options: RequestOptions = {}) {
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
      body:
        options.body !== undefined &&
        options.body !== null &&
        !(options.body instanceof FormData) &&
        typeof options.body !== "string"
          ? JSON.stringify(options.body)
          : options.body,
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

