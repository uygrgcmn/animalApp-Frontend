import { ApiError } from "../api/errors";
import { mediaApi } from "../api/services/mediaApi";

type UploadMediaAssetInput = {
  folder: string;
  uri: string;
};

// In dev, the backend returns MinIO URLs with "localhost" which mobile devices can't reach.
// Replace localhost with the actual LAN host extracted from the configured API base URL.
function rewriteLocalhostMediaUrl(url: string): string {
  if (!url.includes("localhost") && !url.includes("127.0.0.1")) return url;
  try {
    const apiBase = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";
    const apiHost = new URL(apiBase).hostname;
    if (!apiHost || apiHost === "localhost" || apiHost === "127.0.0.1") return url;
    return url.replace(/localhost|127\.0\.0\.1/g, apiHost);
  } catch {
    return url;
  }
}

function inferImageContentType(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension === "png") {
    return "image/png";
  }

  if (extension === "webp") {
    return "image/webp";
  }

  return "image/jpeg";
}

export async function uploadMediaAsset({ folder, uri }: UploadMediaAssetInput) {
  if (!uri.startsWith("file:")) {
    return uri;
  }

  try {
    const fileName = uri.split("/").pop() || `media-${Date.now()}.jpg`;
    const contentType = inferImageContentType(fileName);
    const { uploadUrl, publicUrl } = await mediaApi.createPresignedUploadUrl({
      fileName,
      contentType,
      folder
    });
    const fileResponse = await fetch(uri);
    const fileBlob = await fileResponse.blob();
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType
      },
      body: fileBlob
    });

    if (!uploadResponse.ok) {
      throw new Error("Gorsel yuklenemedi.");
    }

    return rewriteLocalhostMediaUrl(publicUrl);
  } catch (error) {
    if (
      error instanceof ApiError ||
      (error instanceof Error &&
        (error.message.includes("S3") ||
          error.message.includes("presigned") ||
          error.message.includes("Sunucuya ulasilamadi")))
    ) {
      console.warn("[uploadMediaAsset] Upload failed:", error instanceof Error ? error.message : error);
      return uri;
    }

    throw error;
  }
}
