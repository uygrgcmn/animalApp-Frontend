import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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

import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { formatMessageTime } from "../../../shared/utils/formatDate";
import { useSessionStore } from "../../auth/store/sessionStore";
import { useConversationMessages, useSendMessage } from "../hooks/useMessages";

export function ConversationDetailScreen() {
  const { conversationId: peerId } = useLocalSearchParams<{ conversationId: string }>();
  const router = useRouter();
  const currentUserId = useSessionStore((state) => state.user?.id);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const messagesQuery = useConversationMessages(peerId);
  const sendMessage = useSendMessage();
  const messages = messagesQuery.data ?? [];

  const peerName = useMemo(() => {
    const msg = messages.find(
      (m) => m.senderId !== currentUserId || m.receiverId !== currentUserId
    );
    if (!msg) return "Kullanıcı";
    const peer = msg.senderId === currentUserId ? msg.receiver : msg.sender;
    return peer?.fullName ?? "Kullanıcı";
  }, [messages, currentUserId]);

  const initials = peerName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollToEnd({ animated: false });
    }
  }, [messages.length]);

  function handleSend() {
    const content = draft.trim();
    if (!content || sendMessage.isPending) return;
    setDraft("");
    sendMessage.mutate(
      { receiverId: peerId, content },
      {
        onSuccess: () => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }
      }
    );
  }

  if (messagesQuery.isLoading && messages.length === 0) {
    return (
      <View style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      {/* WhatsApp style Header */}
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable hitSlop={10} onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons color={colors.text} name="arrow-left" size={24} />
          </Pressable>
          
          <Pressable style={styles.headerInfo}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>{initials}</Text>
            </View>
            <View style={styles.headerNameWrapper}>
              <Text numberOfLines={1} style={styles.headerName}>{peerName}</Text>
              <Text style={styles.headerStatus}>çevrimiçi</Text>
            </View>
          </Pressable>

          <View style={styles.headerActions}>
            <Pressable style={styles.headerActionBtn}>
              <MaterialCommunityIcons name="video-outline" size={24} color={colors.text} />
            </Pressable>
            <Pressable style={styles.headerActionBtn}>
              <MaterialCommunityIcons name="phone-outline" size={22} color={colors.text} />
            </Pressable>
            <Pressable style={styles.headerActionBtn}>
              <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.text} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateLabel}>
          <Text style={styles.dateLabelText}>BUGÜN</Text>
        </View>

        {messages.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Henüz mesaj yok. İlk mesajı sen gönder.</Text>
          </View>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === currentUserId;
            return (
              <View
                key={message.id}
                style={[styles.bubbleWrapper, isMe ? styles.myBubbleWrapper : styles.otherBubbleWrapper]}
              >
                <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
                  <Text style={[styles.bubbleText, isMe ? styles.myText : styles.otherText]}>
                    {message.content}
                  </Text>
                  <View style={styles.timeRow}>
                    <Text style={[styles.timeText, isMe ? styles.myTime : styles.otherTime]}>
                      {formatMessageTime(message.createdAt)}
                    </Text>
                    {isMe && (
                      <MaterialCommunityIcons
                        color={message.readAt ? "#34B7F1" : colors.textSubtle}
                        name={message.readAt ? "check-all" : "check"}
                        size={15}
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* WhatsApp style Input Bar */}
      <SafeAreaView edges={["bottom"]}>
        <View style={styles.inputBar}>
          <View style={styles.inputContainer}>
            <Pressable style={styles.inputIcon}>
              <MaterialCommunityIcons name="emoticon-outline" size={24} color={colors.textSubtle} />
            </Pressable>
            
            <TextInput
              multiline
              onChangeText={setDraft}
              placeholder="Mesaj"
              placeholderTextColor={colors.textSubtle}
              selectionColor={colors.primary}
              style={styles.input}
              value={draft}
            />

            <Pressable style={styles.inputIcon}>
              <MaterialCommunityIcons name="paperclip" size={24} color={colors.textSubtle} />
            </Pressable>

            {!draft.trim() && (
              <Pressable style={styles.inputIcon}>
                <MaterialCommunityIcons name="camera" size={24} color={colors.textSubtle} />
              </Pressable>
            )}
          </View>

          <Pressable
            disabled={sendMessage.isPending}
            onPress={handleSend}
            style={styles.sendBtn}
          >
            {sendMessage.isPending ? (
              <ActivityIndicator color={colors.textInverse} size="small" />
            ) : (
              <MaterialCommunityIcons 
                color={colors.textInverse} 
                name={draft.trim() ? "send" : "microphone"} 
                size={24} 
              />
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#E4DDD6", // WhatsApp background color
    flex: 1
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: colors.surface,
    ...shadows.card,
    zIndex: 10,
  },
  headerContent: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  backBtn: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSubtle,
  },
  headerNameWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  headerStatus: {
    fontSize: 11,
    color: colors.textSubtle,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerActionBtn: {
    padding: 8,
  },
  messageList: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  dateLabel: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginVertical: 16,
    ...shadows.micro,
  },
  dateLabelText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSubtle,
  },
  bubbleWrapper: {
    marginBottom: 4,
    width: "100%",
  },
  myBubbleWrapper: {
    alignItems: "flex-end",
  },
  otherBubbleWrapper: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "85%",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    ...shadows.micro,
  },
  myBubble: {
    backgroundColor: "#E7FFDB", // WhatsApp self bubble color
    borderTopRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 2,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
  },
  myText: {},
  otherText: {},
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    marginTop: 2,
    marginLeft: 8,
  },
  timeText: {
    fontSize: 10,
    color: colors.textSubtle,
  },
  myTime: {},
  otherTime: {},
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 8,
    gap: 6,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
    ...shadows.micro,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
    color: colors.text,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.card,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    color: colors.textSubtle,
    fontSize: 14,
    textAlign: "center",
  }
});
