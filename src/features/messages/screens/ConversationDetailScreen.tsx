import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ListingType } from "../../../core/api/contracts";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { routeBuilders } from "../../../core/navigation/routes";
import { AppButton } from "../../../shared/ui/AppButton";
import { formatMessageTime } from "../../../shared/utils/formatDate";
import { useSessionStore } from "../../auth/store/sessionStore";
import {
  useConversation,
  useConversationMessages,
  useMarkAsRead,
  useSendMessage
} from "../hooks/useMessages";

function getListingHref(listingId: string, listingType?: ListingType) {
  if (listingType === "SITTING") return routeBuilders.caregiverListingDetail(listingId);
  if (listingType === "HELP_REQUEST") return routeBuilders.ownerRequestDetail(listingId);
  return routeBuilders.communityPostDetail(listingId);
}

const listingTypeLabels: Record<ListingType, string> = {
  SITTING: "Bakıcı İlanı",
  HELP_REQUEST: "Bakıcı Arıyorum",
  FREE_ITEM: "Ücretsiz Eşya",
  ACTIVITY: "Etkinlik",
  COMMUNITY: "Topluluk",
  ADOPTION: "Sahiplendirme"
};

export function ConversationDetailScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const router = useRouter();
  const currentUserId = useSessionStore((state) => state.user?.id);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const conversationQuery = useConversation(conversationId);
  const messagesQuery = useConversationMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const markAsRead = useMarkAsRead(conversationId);

  const conversation = conversationQuery.data;
  const messages = messagesQuery.data ?? [];

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollToEnd({ animated: false });
    }
  }, [messages.length]);

  useEffect(() => {
    markAsRead.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  function handleSend() {
    const content = draft.trim();
    if (!content || sendMessage.isPending) return;
    setDraft("");
    sendMessage.mutate(
      { content },
      {
        onSuccess: () => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }
      }
    );
  }

  if (conversationQuery.isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!conversation) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Konuşma bulunamadı.</Text>
          <AppButton label="Geri Dön" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      {/* Listing context strip */}
      {conversation.listing ? (
        <Link
          href={getListingHref(conversation.listingId, conversation.listing.type)}
          asChild
        >
          <Pressable style={styles.listingContext}>
            <View style={styles.listingContextLeft}>
              <MaterialCommunityIcons name="link-variant" size={14} color={colors.primary} />
              <Text numberOfLines={1} style={styles.listingContextText}>
                {conversation.listing.title}
              </Text>
            </View>
            <View style={styles.listingTypePill}>
              <Text style={styles.listingTypeText}>
                {listingTypeLabels[conversation.listing.type] ?? conversation.listing.type}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={16} color={colors.textSubtle} />
          </Pressable>
        </Link>
      ) : null}

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
      >
        {messagesQuery.isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === currentUserId;
            return (
              <View
                key={message.id}
                style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}
              >
                <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText]}>
                  {message.content}
                </Text>
                <View style={styles.timeContainer}>
                  <Text style={[styles.messageTime, isMe ? styles.myTime : styles.otherTime]}>
                    {formatMessageTime(message.createdAt)}
                  </Text>
                  {isMe && (
                    <MaterialCommunityIcons
                      color={message.isRead ? colors.primary : colors.primaryBorder}
                      name="check-all"
                      size={13}
                      style={{ marginLeft: 2 }}
                    />
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <View style={styles.textInputWrapper}>
          <TextInput
            multiline
            onChangeText={setDraft}
            placeholder="Mesaj yaz..."
            placeholderTextColor={colors.textTertiary}
            selectionColor={colors.primary}
            style={styles.textInput}
            value={draft}
          />
        </View>
        <Pressable
          accessibilityLabel="Gönder"
          disabled={!draft.trim() || sendMessage.isPending}
          onPress={handleSend}
          style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
        >
          {sendMessage.isPending ? (
            <ActivityIndicator color={colors.textInverse} size="small" />
          ) : (
            <MaterialCommunityIcons color={colors.textInverse} name="send" size={20} />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    alignItems: "center",
    flex: 1,
    gap: spacing.standard,
    justifyContent: "center",
    padding: spacing.large
  },
  errorText: {
    color: colors.textMuted,
    ...typography.body
  },
  inputContainer: {
    alignItems: "flex-end",
    backgroundColor: colors.surface,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: spacing.tight,
    paddingBottom: spacing.compact,
    paddingHorizontal: spacing.compact,
    paddingTop: spacing.tight
  },
  listingContext: {
    alignItems: "center",
    backgroundColor: colors.backgroundAccent,
    borderBottomColor: colors.primaryBorder,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.tight,
    paddingHorizontal: spacing.comfortable,
    paddingVertical: spacing.tight
  },
  listingContextLeft: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 5
  },
  listingContextText: {
    color: colors.primary,
    flex: 1,
    fontSize: 13,
    fontWeight: "600"
  },
  listingTypePill: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  listingTypeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "700"
  },
  loader: {
    flex: 1,
    marginTop: spacing.large
  },
  messageBubble: {
    borderRadius: radius.large,
    gap: 2,
    marginBottom: spacing.compact,
    maxWidth: "80%",
    paddingHorizontal: spacing.standard,
    paddingVertical: spacing.compact,
    ...shadows.micro
  },
  messageList: {
    backgroundColor: colors.surfaceAlt,
    flexGrow: 1,
    paddingHorizontal: spacing.comfortable,
    paddingVertical: spacing.standard
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21
  },
  messageTime: {
    fontSize: 10,
    fontWeight: "500"
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4
  },
  myText: {
    color: colors.textInverse
  },
  myTime: {
    color: colors.primaryBorder,
    textAlign: "right"
  },
  otherBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4
  },
  otherText: {
    color: colors.text
  },
  otherTime: {
    color: colors.textSubtle
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 44,
    justifyContent: "center",
    width: 44,
    ...shadows.card
  },
  sendButtonDisabled: {
    backgroundColor: colors.primarySoft
  },
  textInput: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    paddingHorizontal: spacing.tight,
    paddingVertical: spacing.tight
  },
  textInputWrapper: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xlarge,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: spacing.micro
  },
  timeContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 2
  }
});
