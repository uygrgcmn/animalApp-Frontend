import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../../../core/theme/colors";
import { radius, spacing, typography, shadows } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { conversationMessages, conversations } from "../../../shared/mocks/messages";
import { getMockItemHref } from "../../../shared/utils/mockNavigation";

export function ConversationDetailScreen() {
  const params = useLocalSearchParams<{ conversationId: string }>();
  const router = useRouter();
  const conversation = conversations.find((item) => item.id === params.conversationId);
  const messages = conversation ? conversationMessages[conversation.id] ?? [] : [];

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
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Listing context strip */}
      <Link href={getMockItemHref(conversation.listingKind, conversation.listingId)} asChild>
        <Pressable style={styles.listingContext}>
          <View style={styles.listingContextLeft}>
            <MaterialCommunityIcons name="link-variant" size={14} color={colors.primary} />
            <Text numberOfLines={1} style={styles.listingContextText}>
              {conversation.listingTitle}
            </Text>
          </View>
          <View style={styles.listingTypePill}>
            <Text style={styles.listingTypeText}>{conversation.listingType}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={16} color={colors.textSubtle} />
        </Pressable>
      </Link>

      {/* Messages */}
      <ScrollView
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => {
          const isMe = message.sender === "me";
          return (
            <View
              key={message.id}
              style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}
            >
              <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText]}>
                {message.text}
              </Text>
              <View style={styles.timeContainer}>
                <Text style={[styles.messageTime, isMe ? styles.myTime : styles.otherTime]}>
                  {message.time}
                </Text>
                {isMe && (
                  <MaterialCommunityIcons
                    name="check-all"
                    size={13}
                    color={colors.primaryBorder}
                    style={{ marginLeft: 2 }}
                  />
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <Pressable accessibilityLabel="Ek gönder" style={styles.attachmentButton}>
          <MaterialCommunityIcons name="plus" size={22} color={colors.primary} />
        </Pressable>
        <View style={styles.textInputWrapper}>
          <TextInput
            multiline
            placeholder="Mesaj yaz..."
            placeholderTextColor={colors.textTertiary}
            selectionColor={colors.primary}
            style={styles.textInput}
          />
          <Pressable accessibilityLabel="Emoji seç" style={styles.emojiButton}>
            <MaterialCommunityIcons name="emoticon-outline" size={22} color={colors.textSubtle} />
          </Pressable>
        </View>
        <Pressable accessibilityLabel="Gönder" style={styles.sendButton}>
          <MaterialCommunityIcons name="send" size={20} color={colors.textInverse} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  attachmentButton: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.full,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  emojiButton: {
    padding: spacing.micro
  },
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

