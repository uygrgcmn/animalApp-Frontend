import { Link, useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ModeBadge } from "../../../shared/ui/ModeBadge";
import { StickyBottomActionBar } from "../../../shared/ui/StickyBottomActionBar";
import { conversationMessages, conversations } from "../../../shared/mocks/messages";
import { getMockItemHref } from "../../../shared/utils/mockNavigation";

export function ConversationDetailScreen() {
  const params = useLocalSearchParams<{ conversationId: string }>();
  const conversation = conversations.find((item) => item.id === params.conversationId);
  const messages = conversation ? conversationMessages[conversation.id] ?? [] : [];

  if (!conversation) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <AppHeader
            description="Mesaj bulunamadi."
            showBackButton
            title="Konusma"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          description={conversation.participantRole}
          showBackButton
          title={conversation.participantName}
        />

        <ManagementItemCard
          actions={
            <Link href={getMockItemHref(conversation.listingKind, conversation.listingId)} asChild>
              <AppButton
                label="Bagli Ilani Gor"
                leftSlot={<AppIcon backgrounded={false} name="open-in-new" size={18} />}
                variant="secondary"
              />
            </Link>
          }
          description={conversation.listingType}
          pills={
            <>
              <MetaPill icon="clock-outline" label={conversation.updatedAt} tone="neutral" />
              {conversation.unreadCount > 0 ? (
                <ModeBadge label={`${conversation.unreadCount} okunmamis`} tone="warning" />
              ) : (
                <ModeBadge label="Okundu" tone="success" />
              )}
            </>
          }
          supportingText="Bu sohbet ilgili ilan baglamiyla acildi. Kullanici detay, basvuru ve iletisim akislarini buradan takip edebilir."
          title={conversation.listingTitle}
        />

        <InfoCard
          description="Mesajlar icinde cikmadan ilani, basvuru durumunu ve kaydetme aksiyonlarini gorebilirsin."
          title="Hizli aksiyonlar"
        >
          <View style={styles.quickActions}>
            <Link href={routes.app.profileApplications} asChild>
              <AppButton
                label="Basvuru Durumu"
                leftSlot={<AppIcon backgrounded={false} name="file-document-outline" size={18} />}
                variant="secondary"
              />
            </Link>
            <Link href={routes.app.profileSaved} asChild>
              <AppButton
                label="Kaydettiklerim"
                leftSlot={<AppIcon backgrounded={false} name="bookmark-outline" size={18} />}
                variant="ghost"
              />
            </Link>
          </View>
        </InfoCard>

        <View style={styles.messageList}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === "me" ? styles.myBubble : styles.otherBubble
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.sender === "me" ? styles.myText : styles.otherText
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  message.sender === "me" ? styles.myTime : styles.otherTime
                ]}
              >
                {message.time}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <StickyBottomActionBar>
        <AppButton
          label="Mesaj Yaz"
          leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="message-reply-text-outline" size={18} />}
        />
        <Link href={routes.app.explore} asChild>
          <AppButton
            label="Kesfete Don"
            leftSlot={<AppIcon backgrounded={false} name="compass-outline" size={18} />}
            variant="secondary"
          />
        </Link>
      </StickyBottomActionBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section,
    paddingBottom: spacing.large,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.standard
  },
  messageBubble: {
    borderRadius: radius.large,
    gap: spacing.tight,
    maxWidth: "84%",
    paddingHorizontal: spacing.standard,
    paddingVertical: spacing.compact
  },
  messageList: {
    gap: spacing.standard
  },
  messageText: {
    ...typography.body
  },
  messageTime: {
    fontSize: 11,
    fontWeight: "700"
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary
  },
  myText: {
    color: colors.textInverse
  },
  myTime: {
    color: "#E0E7FF",
    textAlign: "right"
  },
  otherBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1
  },
  otherText: {
    color: colors.text
  },
  otherTime: {
    color: colors.textSubtle
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.compact
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  }
});
