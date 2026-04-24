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
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  if (extension === "heic" || extension === "heif") return "image/heic";
  return "image/jpeg";
}

export async function uploadMediaAsset({ folder, uri }: UploadMediaAssetInput) {
  if (!uri.startsWith("file:")) {
    return uri;
  }

  const fileName = uri.split("/").pop() || `media-${Date.now()}.jpg`;
  const contentType = inferImageContentType(fileName);

  let uploadUrl: string;
  let publicUrl: string;

  try {
    ({ uploadUrl, publicUrl } = await mediaApi.createPresignedUploadUrl({
      fileName,
      contentType,
      folder
    }));
  } catch (error) {
    throw new Error(
      `Görsel için yükleme adresi alınamadı: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`
    );
  }

  // publicUrl may contain localhost in dev — rewrite to LAN host for display/storage.
  // uploadUrl must NOT be rewritten: AWS Signature V4 embeds the host, changing it breaks the signature.
  const resolvedPublicUrl = rewriteLocalhostMediaUrl(publicUrl);

  let fileBlob: Blob;
  try {
    const fileResponse = await fetch(uri);
    fileBlob = await fileResponse.blob();
  } catch (error) {
    throw new Error(
      `Görsel okunamadı: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`
    );
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: fileBlob
  });

  if (!uploadResponse.ok) {
    throw new Error(`Görsel sunucuya yüklenemedi (HTTP ${uploadResponse.status}).`);
  }

  return resolvedPublicUrl;
}
