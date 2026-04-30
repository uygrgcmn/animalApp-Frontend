import { apiConfig } from "../api/config";

function getApiOrigin() {
  try {
    return new URL(apiConfig.baseUrl).origin;
  } catch {
    return "";
  }
}

function buildProxyUrlFromBucketPath(url: string) {
  const origin = getApiOrigin();

  if (!origin) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const mediaMarker = "/animal-media/";
    const markerIndex = parsed.pathname.indexOf(mediaMarker);

    if (markerIndex === -1) {
      return url;
    }

    const key = parsed.pathname.slice(markerIndex + mediaMarker.length);
    return `${origin}/api/media/assets?key=${encodeURIComponent(decodeURIComponent(key))}`;
  } catch {
    return url;
  }
}

export function resolveMediaUrl(url: string | null | undefined) {
  if (!url) {
    return url ?? null;
  }

  if (url.startsWith("file:")) {
    return url;
  }

  const origin = getApiOrigin();

  if (url.startsWith("/")) {
    return origin ? `${origin}${url}` : url;
  }

  if (url.includes("/animal-media/")) {
    return buildProxyUrlFromBucketPath(url);
  }

  try {
    const parsed = new URL(url);
    if (parsed.pathname === "/api/media/assets") {
      return origin ? `${origin}${parsed.pathname}${parsed.search}` : url;
    }
  } catch {
    return url;
  }

  return url;
}
