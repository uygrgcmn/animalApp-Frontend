import type { ConversationSummary, MessageRecord, SendMessageRequest } from "../contracts";
import { httpClient } from "../httpClient";

export const messagesApi = {
  listConversations: () =>
    httpClient.get<ConversationSummary[]>("/messages/conversations", { auth: true }),

  getMessages: (withUserId: string) =>
    httpClient.get<MessageRecord[]>(`/messages?withUserId=${withUserId}`, { auth: true }),

  sendMessage: (payload: SendMessageRequest) =>
    httpClient.post<MessageRecord>("/messages", payload, { auth: true }),

  markAsRead: (messageId: string) =>
    httpClient.patch<MessageRecord>(`/messages/${messageId}/read`, {}, { auth: true })
};
