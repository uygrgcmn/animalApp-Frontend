import type { CreatePresignedUploadUrlRequest, PresignedUploadUrlResponse } from "../contracts";
import { httpClient } from "../httpClient";

export const mediaApi = {
  createPresignedUploadUrl: (payload: CreatePresignedUploadUrlRequest) =>
    httpClient.post<PresignedUploadUrlResponse>("/media/presigned-upload-url", payload, {
      auth: true
    })
};

