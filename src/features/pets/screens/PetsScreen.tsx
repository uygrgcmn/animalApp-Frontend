import { router } from "expo-router";
import { RefreshControl, StyleSheet, Text, View } from "react-native";

import { useToast } from "../../../core/providers/ToastProvider";
import { routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { useDeletePet, usePets } from "../hooks/usePets";

const speciesIcons: Record<string, React.ComponentProps<typeof AppIcon>["name"]> = {
  kedi: "cat",
  köpek: "dog-side",
  cat: "cat",
  dog: "dog-side",
  kuş: "bird",
  tavşan: "rabbit"
};

function getSpeciesIcon(species: string): React.ComponentProps<typeof AppIcon>["name"] {
  const key = species.toLowerCase();
  return speciesIcons[key] ?? "paw-outline";
}

export function PetsScreen() {
  const { data: pets = [], isLoading, isError, isFetching, refetch } = usePets();
  const toast = useToast();
  const deletePet = useDeletePet({
    onSuccess: () => toast.success("Hayvan profili silindi."),
    onError: () => toast.error("Silinemedi, lütfen tekrar dene.")
  });
  const refreshing = isFetching && !isLoading;

  return (
    <ScreenContainer
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          onRefresh={() => void refetch()}
          refreshing={refreshing}
          tintColor={colors.primary}
        />
      }
    >
      <AppButton
        label="Yeni Hayvan Ekle"
        leftSlot={
          <AppIcon backgrounded={false} color="#FFFFFF" name="plus-circle-outline" size={18} />
        }
        onPress={() => router.push(routes.app.petNew)}
      />

      {isError ? (
        <EmptyState
          actionSlot={
            <AppButton
              label="Tekrar dene"
              onPress={() => void refetch()}
              variant="secondary"
            />
          }
          description="Hayvanlar şu an yüklenemedi."
          icon="wifi-off"
          title="Yüklenemedi"
        />
      ) : pets.length === 0 && !isLoading ? (
        <EmptyState
          description="Hayvan profillerini buraya ekleyerek ilanlarda ve başvurularda kolayca referans gösterebilirsin."
          icon="paw-outline"
          title="Henüz hayvan eklenmemiş"
        />
      ) : (
        <View style={styles.list}>
          {pets.map((pet) => (
            <View key={pet.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.petIcon}>
                  <AppIcon
                    backgrounded={false}
                    color={colors.primary}
                    name={getSpeciesIcon(pet.species)}
                    size={22}
                  />
                </View>
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petMeta}>
                    {pet.species}
                    {pet.breed ? ` · ${pet.breed}` : ""}
                    {pet.age ? ` · ${pet.age} yaşında` : ""}
                  </Text>
                </View>
              </View>

              <View style={styles.pillRow}>
                {pet.healthStatus ? (
                  <MetaPill icon="heart-pulse" label={pet.healthStatus} tone="success" />
                ) : null}
                {pet.microchipId ? (
                  <MetaPill icon="chip" label="Mikroçip var" tone="primary" />
                ) : null}
              </View>

              {pet.description ? (
                <Text numberOfLines={2} style={styles.petDescription}>
                  {pet.description}
                </Text>
              ) : null}

              <View style={styles.cardActions}>
                <AppButton
                  label="Düzenle"
                  leftSlot={
                    <AppIcon backgrounded={false} name="pencil-outline" size={16} />
                  }
                  onPress={() => router.push(routes.app.petEdit(pet.id))}
                  size="sm"
                  variant="secondary"
                />
                <AppButton
                  label="Sil"
                  leftSlot={
                    <AppIcon
                      backgrounded={false}
                      color={colors.error}
                      name="trash-can-outline"
                      size={16}
                    />
                  }
                  loading={deletePet.isPending}
                  onPress={() => deletePet.mutate(pet.id)}
                  size="sm"
                  variant="danger"
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    gap: spacing.compact,
    padding: spacing.standard
  },
  cardActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.compact,
    marginTop: spacing.micro
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.standard
  },
  content: {
    gap: spacing.section
  },
  list: {
    gap: spacing.compact
  },
  petDescription: {
    ...typography.body,
    color: colors.textMuted
  },
  petIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.large,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  petInfo: {
    flex: 1
  },
  petMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2
  },
  petName: {
    ...typography.bodyStrong,
    color: colors.text
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  }
});
