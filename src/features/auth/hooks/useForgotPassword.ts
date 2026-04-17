import { useMutation } from "@tanstack/react-query";

import type { RequestPasswordResetRequest } from "../../../core/api/contracts";
import { authApi } from "../../../core/api/services/authApi";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: RequestPasswordResetRequest) => authApi.requestPasswordReset(payload)
  });
}
