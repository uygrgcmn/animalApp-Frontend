import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { SendMessageRequest } from "../../../core/api/contracts";
import { messagesApi } from "../../../core/api/services/messagesApi";
import { queryKeys } from "../../../core/query/queryKeys";

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations.all,
    queryFn: () => messagesApi.listConversations()
  });
}

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: queryKeys.conversations.detail(conversationId),
    queryFn: () => messagesApi.getConversation(conversationId),
    enabled: Boolean(conversationId)
  });
}

export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: queryKeys.conversations.messages(conversationId),
    queryFn: () => messagesApi.getMessages(conversationId),
    enabled: Boolean(conversationId),
    refetchInterval: 10_000
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendMessageRequest) =>
      messagesApi.sendMessage(conversationId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.messages(conversationId)
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
    }
  });
}

export function useMarkAsRead(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => messagesApi.markAsRead(conversationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
    }
  });
}
