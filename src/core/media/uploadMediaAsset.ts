import { mediaApi } from "../api/services/mediaApi";
type UploadMediaAssetInput = { folder: string; uri: string };

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

  try {
    const formData = new FormData();
    formData.append("folder", folder);
    formData.append("file", {
      uri,
      name: fileName,
      type: contentType
    } as never);
    const { publicUrl } = await mediaApi.uploadAsset(formData);
    return publicUrl;
  } catch (error) {
    throw new Error(
      `Görsel yüklenemedi: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`
    );
  }
}
