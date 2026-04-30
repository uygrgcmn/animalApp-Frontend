import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { useCreateApplication } from "../hooks/useApplicationMutation";

type ApplyModalProps = {
  listingId: string;
  onClose: () => void;
  onSuccess: () => void;
  visible: boolean;
};

export function ApplyModal({ listingId, onClose, onSuccess, visible }: ApplyModalProps) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const mutation = useCreateApplication(listingId);

  function handleSubmit() {
    if (!message.trim()) return;
    mutation.mutate(
      { message: message.trim() },
      {
        onSuccess: () => {
          setMessage("");
          onSuccess();
        }
      }
    );
  }

  function handleClose() {
    if (mutation.isPending) return;
    setMessage("");
    mutation.reset();
    onClose();
  }

  return (
    <Modal animationType="slide" onRequestClose={handleClose} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <Pressable onPress={handleClose} style={StyleSheet.absoluteFillObject} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <AppIcon backgrounded={false} color={colors.primary} name="send-outline" size={22} />
            </View>
            <View style={styles.headerTexts}>
              <Text style={styles.title}>Başvuru Mesajı</Text>
              <Text style={styles.subtitle}>
                Deneyimini ve uygunluğunu kısaca anlat
              </Text>
            </View>
          </View>

          <Text style={styles.description}>
            İlan sahibine mesajınla başvurunu ilet. Hayvanlara yaklaşımını ve neden doğru kişi
            olduğunu belirt.
          </Text>

          <View>
            <TextInput
              editable={!mutation.isPending}
              maxLength={500}
              multiline
              onBlur={() => setIsFocused(false)}
              onChangeText={setMessage}
              onFocus={() => setIsFocused(true)}
              placeholder="Merhaba, bu ilana başvurmak istiyorum..."
              placeholderTextColor={colors.textSubtle}
              style={[
                styles.input,
                isFocused && styles.inputFocused,
                mutation.isPending && styles.inputDisabled
              ]}
              value={message}
            />
            <View style={styles.charRow}>
              <Text style={[styles.charCount, message.length > 450 && styles.charCountWarning]}>
                {message.length}/500
              </Text>
            </View>
          </View>

          {mutation.isError ? (
            <View style={styles.errorRow}>
              <AppIcon backgrounded={false} name="alert-circle-outline" size={16} tone="warning" />
              <Text style={styles.errorText}>Başvuru gönderilemedi. Lütfen tekrar dene.</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.actions}>
            <AppButton
              disabled={!message.trim() || mutation.isPending}
              label={mutation.isPending ? "Gönderiliyor..." : "Başvur"}
              leftSlot={
                mutation.isPending ? (
                  <ActivityIndicator color={colors.textInverse} size="small" />
                ) : (
                  <AppIcon backgrounded={false} color={colors.textInverse} name="send-outline" size={18} />
                )
              }
              onPress={handleSubmit}
            />
            <AppButton
              disabled={mutation.isPending}
              label="İptal"
              onPress={handleClose}
              variant="ghost"
            />
          </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.compact
  },
  scrollContent: {
    gap: spacing.standard,
    paddingBottom: spacing.compact
  },
  charCount: {
    color: colors.textSubtle,
    ...typography.caption
  },
  charCountWarning: {
    color: colors.warning
  },
  charRow: {
    alignItems: "flex-end",
    marginTop: spacing.tight
  },
  description: {
    color: colors.textMuted,
    ...typography.body
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1
  },
  errorRow: {
    alignItems: "center",
    backgroundColor: colors.warningSoft,
    borderColor: colors.accentBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.compact,
    paddingHorizontal: spacing.standard,
    paddingVertical: spacing.compact
  },
  errorText: {
    color: colors.textMuted,
    flex: 1,
    ...typography.body
  },
  handle: {
    alignSelf: "center",
    backgroundColor: colors.borderStrong,
    borderRadius: radius.pill,
    height: 4,
    width: 40
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.standard
  },
  headerTexts: {
    flex: 1,
    gap: spacing.nano
  },
  iconContainer: {
    ...shadows.micro,
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderRadius: radius.lg,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    color: colors.text,
    minHeight: 120,
    padding: spacing.standard,
    textAlignVertical: "top",
    ...typography.body
  },
  inputDisabled: {
    opacity: 0.6
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 1.5
  },
  overlay: {
    backgroundColor: "#0F172A80",
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    ...shadows.floating,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg
  },
  subtitle: {
    color: colors.textSubtle,
    ...typography.caption
  },
  title: {
    color: colors.text,
    ...typography.h2
  }
});

