import { Link } from "expo-router";
import { RefreshControl, StyleSheet, View } from "react-native";

import { colors } from "../../../core/theme/colors";
import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { useMyProfile } from "../hooks/useMyProfile";
import { useProfileSettings } from "../hooks/useProfileSettings";

export function ProfileSettingsScreen() {
  const profileQuery = useMyProfile();
  const settingsQuery = useProfileSettings();
  const settingsSections = settingsQuery.data ?? [];
  const refreshing =
    (profileQuery.isFetching || settingsQuery.isFetching) &&
    !profileQuery.isLoading &&
    !settingsQuery.isLoading;

  return (
    <ScreenContainer
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            void profileQuery.refetch();
            void settingsQuery.refetch();
          }}
          refreshing={refreshing}
          tintColor={colors.primary}
        />
      }
    >
      <ManagementItemCard
        description={profileQuery.data?.email ?? "Hesap bilgileri hazirlaniyor."}
        pills={
          <View style={styles.pills}>
            <MetaPill icon="account-circle-outline" label="Hesap ozeti" tone="primary" />
            {profileQuery.data?.profileCompletion != null ? (
              <MetaPill
                icon="progress-check"
                label={`Profil %${Math.round(profileQuery.data.profileCompletion)}`}
                tone="success"
              />
            ) : null}
          </View>
        }
        supportingText="Temel hesap bilgilerin ve backend'e bagli ayar alanlari tek listede toplanir."
        title={profileQuery.data?.fullName ?? "Hesap"}
        variant="accent"
      />

      {settingsQuery.isError ? (
        <EmptyState
          actionSlot={
            <AppButton
              label="Tekrar dene"
              onPress={() => void settingsQuery.refetch()}
              variant="secondary"
            />
          }
          description="Ayarlar listesi su an yuklenemedi. Baglantiyi yenileyip tekrar deneyebilirsin."
          icon="wifi-off"
          title="Ayarlar getirilemedi"
        />
      ) : (
        <View style={styles.list}>
          {settingsSections.map((section) => (
            <ManagementItemCard
              key={section.id}
              actions={
                <View style={styles.actions}>
                  {section.actions.map((action) =>
                    action.href ? (
                      <Link key={action.label} href={action.href} asChild>
                        <AppButton disabled={action.disabled} label={action.label} variant={action.variant} />
                      </Link>
                    ) : (
                      <AppButton
                        key={action.label}
                        disabled={action.disabled}
                        label={action.label}
                        variant={action.variant}
                      />
                    )
                  )}
                </View>
              }
              description={section.description}
              pills={
                <View style={styles.pills}>
                  {section.pills.map((pill) => (
                    <MetaPill
                      key={`${section.id}-${pill.label}`}
                      icon={pill.icon}
                      label={pill.label}
                      tone={pill.tone}
                    />
                  ))}
                </View>
              }
              supportingText={section.supportingText}
              title={section.title}
            />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.compact
  },
  list: {
    gap: spacing.compact
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  }
});
