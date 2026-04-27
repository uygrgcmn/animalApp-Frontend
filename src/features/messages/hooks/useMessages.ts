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

export function useConversationMessages(peerId: string) {
  return useQuery({
    queryKey: queryKeys.conversations.messages(peerId),
    queryFn: () => messagesApi.getMessages(peerId),
    enabled: Boolean(peerId),
    refetchInterval: 10_000
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendMessageRequest) => messagesApi.sendMessage(payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.messages(data.receiverId)
      });
    }
  });
}

export function useMarkAsRead() {
  return useMutation({
    mutationFn: (messageId: string) => messagesApi.markAsRead(messageId)
  });
}
