type ApiErrorPayload = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: string[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function toApiError(statusCode: number, payload: unknown) {
  if (payload && typeof payload === "object") {
    const candidate = payload as ApiErrorPayload;
    const details = Array.isArray(candidate.message)
      ? candidate.message
      : candidate.message
        ? [candidate.message]
        : undefined;
    const message = details?.[0] ?? candidate.error ?? "Beklenmeyen bir API hatasi olustu.";

    return new ApiError(message, candidate.statusCode ?? statusCode, details);
  }

  if (typeof payload === "string" && payload.trim()) {
    return new ApiError(payload, statusCode);
  }

  return new ApiError("Beklenmeyen bir API hatasi olustu.", statusCode);
}

