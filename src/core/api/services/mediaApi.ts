import type {
  CreatePresignedUploadUrlRequest,
  PresignedUploadUrlResponse,
  UploadedMediaResponse
} from "../contracts";
import { httpClient } from "../httpClient";

export const mediaApi = {
  createPresignedUploadUrl: (payload: CreatePresignedUploadUrlRequest) =>
    httpClient.post<PresignedUploadUrlResponse>("/media/presigned-upload-url", payload, {
      auth: true
    }),
  uploadAsset: (payload: FormData) =>
    httpClient.post<UploadedMediaResponse>("/media/upload", payload, {
      auth: true
    })
};

