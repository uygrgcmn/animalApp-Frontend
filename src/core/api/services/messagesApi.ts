import type {
  ConversationRecord,
  CreateConversationRequest,
  MessageRecord,
  SendMessageRequest
} from "../contracts";
import { httpClient } from "../httpClient";

export const messagesApi = {
  listConversations: () =>
    httpClient.get<ConversationRecord[]>("/conversations", { auth: true }),

  getConversation: (conversationId: string) =>
    httpClient.get<ConversationRecord>(`/conversations/${conversationId}`, { auth: true }),

  createConversation: (payload: CreateConversationRequest) =>
    httpClient.post<ConversationRecord>("/conversations", payload, { auth: true }),

  getMessages: (conversationId: string) =>
    httpClient.get<MessageRecord[]>(`/conversations/${conversationId}/messages`, { auth: true }),

  sendMessage: (conversationId: string, payload: SendMessageRequest) =>
    httpClient.post<MessageRecord>(
      `/conversations/${conversationId}/messages`,
      payload,
      { auth: true }
    ),

  markAsRead: (conversationId: string) =>
    httpClient.patch<ConversationRecord>(
      `/conversations/${conversationId}/read`,
      {},
      { auth: true }
    ),

  archiveConversation: (conversationId: string) =>
    httpClient.patch<ConversationRecord>(
      `/conversations/${conversationId}/archive`,
      {},
      { auth: true }
    )
};
