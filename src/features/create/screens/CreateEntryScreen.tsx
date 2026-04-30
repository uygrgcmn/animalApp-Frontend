import { zodResolver } from "@hookform/resolvers/zod";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Controller,
  useForm,
  type Control,
  type FieldErrors,
  type SubmitHandler
} from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { FilterChip } from "../../../shared/ui/FilterChip";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { TextField } from "../../../shared/ui/TextField";
import { UploadBox } from "../../../shared/ui/UploadBox";
import { useSessionStore } from "../../auth/store/sessionStore";
import { caregiverServiceOptions } from "../../caregiver/schemas";
import { usePublishListing } from "../hooks/usePublishListing";
import {
  MAX_CREATE_MEDIA_COUNT,
  communityCategoryOptions,
  communityContactPreferenceOptions,
  createListingTypeOptions,
  createWizardSchema,
  defaultCreateWizardValues,
  ownerCareNeedOptions,
  ownerPetTypeOptions,
  petshopCampaignTypeOptions,
  type CreateListingType,
  type CreateWizardValues
} from "../schemas";
import {
  getPetshopActionLabel,
  getPetshopModePresentation
} from "../../profile/utils/modeStatus";

type IconName = React.ComponentProps<typeof AppIcon>["name"];

const TYPES: { description: string; icon: IconName; label: string; value: CreateListingType }[] = [
  {
    description: "Hizmet, ücret ve deneyim bilgisiyle bakım ilanı yayınla.",
    icon: "shield-account-outline",
    label: "Bakıcı ilanı",
    value: "caregiver-listing"
  },
  {
    description: "Evcil hayvanın için tarih, bütçe ve ihtiyaçları paylaş.",
    icon: "paw-outline",
    label: "Bakıcı arıyorum",
    value: "owner-request"
  },
  {
    description: "Sahiplendirme, destek veya topluluk çağrısı oluştur.",
    icon: "hand-heart-outline",
    label: "Topluluk paylaşımı",
    value: "community-post"
  },
  {
    description: "Mağazan için fiyat, indirim ve görselle kampanya yayınla.",
    icon: "storefront-outline",
    label: "Petshop kampanyası",
    value: "petshop-campaign"
  }
];

const LISTING_TYPES = TYPES.filter((item) => item.value === "caregiver-listing" || item.value === "owner-request");
const CHANNEL_TYPES = TYPES.filter((item) => item.value === "community-post" || item.value === "petshop-campaign");

const SERVICE_LABELS = {
  "evde-bakim": "Evde bakım",
  "geceli-bakim": "Geceli bakım",
  "gunluk-ziyaret": "Günlük ziyaret",
  "ilac-takibi": "İlaç takibi",
  "kopek-gezdirme": "Köpek gezdirme"
} as const;

const NEED_LABELS = {
  "gece-konaklama": "Gece konaklama",
  "gunluk-rutin": "Günlük rutin",
  "ilac-takibi": "İlaç takibi",
  "kopek-gezdirme": "Köpek gezdirme"
} as const;

const CATEGORY_LABELS = {
  diger: "Diğer",
  sahiplendirme: "Sahiplendirme",
  "ucretsiz-mama": "Ücretsiz mama"
} as const;

const CONTACT_LABELS = {
  mesaj: "Mesaj",
  telefon: "Telefon",
  yorum: "Yorum"
} as const;

const CAMPAIGN_LABELS = {
  aksesuar: "Aksesuar",
  bakim: "Bakım",
  mama: "Mama",
  saglik: "Sağlık"
} as const;

const availabilityOptions = [
  { label: "Hafta içi", value: "hafta-ici" },
  { label: "Hafta sonu", value: "hafta-sonu" },
  { label: "Esnek", value: "esnek" }
] as const;

function isCreateListingType(value: unknown): value is CreateListingType {
  return typeof value === "string" && (createListingTypeOptions as readonly string[]).includes(value);
}

function errorText(message: unknown) {
  return typeof message === "string" ? message : undefined;
}

function mergeMediaUris(current: string[], incoming: string[]) {
  return Array.from(new Set([...current, ...incoming].filter(Boolean))).slice(
    0,
    MAX_CREATE_MEDIA_COUNT
  );
}

export function CreateEntryScreen() {
  const params = useLocalSearchParams<{ listingType?: string }>();
  const tabBarHeight = useBottomTabBarHeight();
  const user = useSessionStore((state) => state.user);
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const createDrafts = useSessionStore((state) => state.createDrafts);
  const saveCreateDraft = useSessionStore((state) => state.saveCreateDraft);
  const clearCreateDraft = useSessionStore((state) => state.clearCreateDraft);
  const publishMutation = usePublishListing();
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; tone: "info" | "success"; title: string } | null>(null);

  const initialValues = useMemo<CreateWizardValues>(
    () => ({
      ...defaultCreateWizardValues,
      city: user?.city ?? "",
      district: user?.district ?? "",
      petshopStoreName: user?.fullName ? `${user.fullName} Store` : ""
    }),
    [user?.city, user?.district, user?.fullName]
  );

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateWizardValues>({
    defaultValues: initialValues,
    resolver: zodResolver(createWizardSchema)
  });

  const values = watch();
  const selectedType = values.listingType;
  const media = values.media ?? [];
  const selectedMeta = TYPES.find((item) => item.value === selectedType);
  const petshopPresentation = getPetshopModePresentation(petshopStatus);
  const isPetshopPublishLocked =
    selectedType === "petshop-campaign" && petshopStatus !== "active";

  const selectType = useCallback(
    (type: CreateListingType) => {
      const draft = createDrafts[type];

      reset({
        ...initialValues,
        ...(draft?.values ?? {}),
        listingType: type
      });

      setPickerError(null);
      setFeedback(
        draft
          ? {
              message: "Kaydedilmiş taslak yüklendi. Eksik alanları tamamlayıp devam edebilirsin.",
              title: "Taslak yüklendi",
              tone: "info"
            }
          : null
      );
    },
    [createDrafts, initialValues, reset]
  );

  useEffect(() => {
    if (isCreateListingType(params.listingType) && selectedType !== params.listingType) {
      selectType(params.listingType);
    }
  }, [params.listingType, selectType, selectedType]);

  async function handlePickMedia() {
    setPickerError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setPickerError("Görsel eklemek için galeri izni gerekiyor.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ["images"],
      quality: 0.85,
      selectionLimit: 10
    });

    if (result.canceled || !result.assets.length) return;

    const nextMedia = mergeMediaUris(
      media,
      result.assets.map((asset) => asset.uri)
    );
    const skippedMediaCount = media.length + result.assets.length - nextMedia.length;

    setValue("media", nextMedia, {
      shouldDirty: true,
      shouldValidate: true
    });

    if (skippedMediaCount > 0) {
      setFeedback({
        message: `Aynı görseller tekrar eklenmedi ve toplam en fazla ${MAX_CREATE_MEDIA_COUNT} görsel saklandı.`,
        title: "Görseller düzenlendi",
        tone: "info"
      });
      return;
    }

    setFeedback(null);
  }

  function saveDraft() {
    if (!selectedType) {
      setFeedback({
        message: "Taslak kaydetmeden önce bir içerik tipi seç.",
        title: "İçerik tipi gerekli",
        tone: "info"
      });
      return;
    }

    saveCreateDraft(selectedType, getValues(), 0);
    setFeedback({
      message: "Alanlar taslak olarak kaydedildi.",
      title: "Taslak kaydedildi",
      tone: "success"
    });
  }

  const onSubmit: SubmitHandler<CreateWizardValues> = async (submittedValues) => {
    if (!submittedValues.listingType) return;

    if (submittedValues.listingType === "petshop-campaign" && petshopStatus !== "active") {
      setFeedback({
        message: "Petshop kampanyası yayınlamak için mağaza başvurunu tamamlayıp hesabını aktifleştirmen gerekiyor.",
        title: `${petshopPresentation.label} mağaza modu`,
        tone: "info"
      });
      return;
    }

    try {
      const newListing = await publishMutation.publish(submittedValues);
      clearCreateDraft(submittedValues.listingType);
      reset(initialValues);

      if (!newListing) return;

      if (submittedValues.listingType === "caregiver-listing") {
        router.replace(routeBuilders.caregiverListingDetail(newListing.id));
        return;
      }
      if (submittedValues.listingType === "owner-request") {
        router.replace(routeBuilders.ownerRequestDetail(newListing.id));
        return;
      }
      if (submittedValues.listingType === "petshop-campaign") {
        router.replace(routeBuilders.petshopCampaignDetail(newListing.id));
        return;
      }
      router.replace(routeBuilders.communityPostDetail(newListing.id));
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : "İlan yayınlanırken bir hata oluştu.",
        title: "Yayınlanamadı",
        tone: "info"
      });
    }
  };

  const primaryLabel = publishMutation.isPending ? "Yayınlanıyor..." : "Yayınla";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + spacing.large }]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.composeShell}>
          <View style={styles.composeIntro}>
            <View style={styles.composeIntroText}>
              <Text style={styles.eyebrow}>İçerik oluştur</Text>
              <Text style={styles.composeTitle}>{selectedMeta ? selectedMeta.label : "Ne paylaşmak istiyorsun?"}</Text>
              <Text style={styles.composeDescription}>
                {selectedMeta ? selectedMeta.description : "İçerik tipini seç, ardından tek ekranda gerekli alanları tamamla."}
              </Text>
            </View>
            <View style={styles.composeStats}>
              <MetaPill icon="file-document-edit-outline" label={`${Object.keys(createDrafts).length} taslak`} tone="neutral" />
              <MetaPill icon="image-outline" label={`${media.length} görsel`} tone="primary" />
            </View>
          </View>

          <View style={styles.typeRailHeader}>
            <Text style={styles.typeRailTitle}>İlan tipi</Text>
            <Text style={styles.typeRailHint}>{selectedType ? "Yatay menüden değiştir" : "Yatay menüden seç"}</Text>
          </View>
          <ScrollView
            horizontal
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            style={styles.typeRail}
            contentContainerStyle={styles.typeRailContent}
          >
            {LISTING_TYPES.map((item) => {
              const selected = selectedType === item.value;

              return (
                <Pressable
                  key={item.value}
                  onPress={() => selectType(item.value)}
                  style={[styles.typePill, selected ? styles.typePillSelected : null]}
                >
                  <View style={[styles.typePillIcon, selected ? styles.typePillIconSelected : null]}>
                    <AppIcon
                      backgrounded={false}
                      color={selected ? colors.textInverse : colors.primary}
                      name={item.icon}
                      size={18}
                    />
                  </View>
                  <View style={styles.typePillText}>
                    <Text style={[styles.typePillTitle, selected ? styles.typePillTitleSelected : null]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.typePillMeta, selected ? styles.typePillMetaSelected : null]}>
                      {createDrafts[item.value] ? (selected ? "Taslak yüklü" : "Taslak var") : selected ? "Seçili" : "Seç"}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.channelBlock}>
            <View style={styles.channelHeader}>
              <Text style={styles.channelTitle}>Topluluk ve mağaza</Text>
              <Text style={styles.channelHint}>Paylaşım veya kampanya</Text>
            </View>
            <View style={styles.channelOptions}>
              {CHANNEL_TYPES.map((item) => {
                const selected = selectedType === item.value;

                return (
                  <Pressable
                    key={item.value}
                    onPress={() => selectType(item.value)}
                    style={[styles.channelOption, selected ? styles.channelOptionSelected : null]}
                  >
                    <View style={[styles.channelIcon, selected ? styles.channelIconSelected : null]}>
                      <AppIcon
                        backgrounded={false}
                        color={selected ? colors.textInverse : colors.accent}
                        name={item.icon}
                        size={18}
                      />
                    </View>
                    <View style={styles.channelText}>
                      <Text style={[styles.channelOptionTitle, selected ? styles.channelOptionTitleSelected : null]}>
                        {item.label}
                      </Text>
                      <Text style={[styles.channelOptionDescription, selected ? styles.channelOptionDescriptionSelected : null]}>
                        {item.description}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
          {errors.listingType?.message ? <Text style={styles.error}>{errors.listingType.message}</Text> : null}
        </View>

        {selectedType && selectedMeta ? (
          <View style={styles.editorPanel}>
            <View style={styles.editorTop}>
              <View style={styles.editorIcon}>
                <AppIcon name={selectedMeta.icon} size={24} />
              </View>
              <View style={styles.editorTopText}>
                <Text style={styles.editorTitle}>{selectedMeta.label}</Text>
                <Text style={styles.editorDescription}>{selectedMeta.description}</Text>
              </View>
            </View>

            <View style={styles.editorMetaRow}>
              <MetaPill icon="map-marker-outline" label={values.city && values.district ? `${values.city} / ${values.district}` : "Konum"} tone="neutral" />
              <MetaPill icon="image-outline" label={`${media.length} görsel`} tone="primary" />
              {createDrafts[selectedType] ? <MetaPill icon="content-save-outline" label="Taslak yüklü" tone="success" /> : null}
            </View>

              {feedback ? <FeedbackBanner {...feedback} /> : null}
              {isPetshopPublishLocked ? (
                <FeedbackBanner
                  message="Petshop kampanyaları sadece aktif mağaza hesabı ile yayınlanır. İstersen taslak kaydedip başvuru adımını tamamlayabilirsin."
                  title={`${petshopPresentation.label} mağaza modu`}
                  tone="info"
                />
              ) : null}

            <CommonFields control={control} errors={errors} />
            <Details control={control} errors={errors} selectedType={selectedType} />
            <Section description="İlk görsel kartlarda kapak olarak kullanılır. Birden fazla seçilebilir." title="Görsel">
              <UploadBox
                description={media.length > 0 ? `${media.length} görsel eklendi` : "Galeriden birden fazla görsel seçebilirsin."}
                error={pickerError ?? errorText(errors.media?.message)}
                imageUri={media[0]}
                label={media.length > 0 ? "Görsel ekle" : "Görsel seç"}
                onPress={handlePickMedia}
              />
              {media.length > 0 ? (
                <View style={styles.chipRow}>
                  {media.map((item, index) => (
                    <FilterChip
                      key={`${item}-${index}`}
                      icon="image-outline"
                      label={index === 0 ? "Kapak görseli" : `Görsel ${index + 1}`}
                      onPress={() => {
                        setValue(
                          "media",
                          media.filter((_, mediaIndex) => mediaIndex !== index),
                          { shouldDirty: true, shouldValidate: true }
                        );
                      }}
                      selected
                    />
                  ))}
                </View>
              ) : null}
            </Section>
          </View>
        ) : (
          <StartPanel draftCount={Object.keys(createDrafts).length} />
        )}

        {selectedType ? (
          <View style={styles.embeddedActions}>
            <AppButton label="Taslak Kaydet" onPress={saveDraft} variant="secondary" />
            {isPetshopPublishLocked ? (
              <AppButton
                label={getPetshopActionLabel(petshopStatus)}
                leftSlot={
                  <AppIcon
                    backgrounded={false}
                    color={colors.textInverse}
                    name="store-edit-outline"
                    size={18}
                  />
                }
                onPress={() => {
                  router.push(routes.app.petshopActivation);
                }}
              />
            ) : (
              <AppButton
                disabled={publishMutation.isPending}
                label={primaryLabel}
                leftSlot={
                  <AppIcon
                    backgrounded={false}
                    color={colors.textInverse}
                    name="check-bold"
                    size={18}
                  />
                }
                onPress={handleSubmit(onSubmit)}
              />
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function CommonFields({
  control,
  errors
}: {
  control: Control<CreateWizardValues>;
  errors: FieldErrors<CreateWizardValues>;
}) {
  return (
    <Section description="Kartlarda ve arama sonuçlarında görünen temel bilgiler." title="Temel bilgiler">
      <View style={styles.formStack}>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <TextField
              error={errorText(errors.title?.message)}
              label="Başlık"
              onChangeText={field.onChange}
              placeholder="Kısa ve net bir başlık"
              value={field.value}
            />
          )}
        />
        <View style={styles.row}>
          <View style={styles.flex}>
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <TextField
                  error={errorText(errors.city?.message)}
                  label="Şehir"
                  onChangeText={field.onChange}
                  placeholder="İstanbul"
                  value={field.value}
                />
              )}
            />
          </View>
          <View style={styles.flex}>
            <Controller
              control={control}
              name="district"
              render={({ field }) => (
                <TextField
                  error={errorText(errors.district?.message)}
                  label="İlçe"
                  onChangeText={field.onChange}
                  placeholder="Kadıköy"
                  value={field.value}
                />
              )}
            />
          </View>
        </View>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextField
              error={errorText(errors.description?.message)}
              label="Açıklama"
              multiline
              onChangeText={field.onChange}
              placeholder="İhtiyacı, koşulları ve beklentiyi sade şekilde anlat."
              value={field.value}
            />
          )}
        />
      </View>
    </Section>
  );
}

function Details({
  control,
  errors,
  selectedType
}: {
  control: Control<CreateWizardValues>;
  errors: FieldErrors<CreateWizardValues>;
  selectedType: CreateListingType;
}) {
  if (selectedType === "caregiver-listing") {
    return (
      <Section description="Bakıcı ilanı için karar vermeyi kolaylaştıran kısa bilgiler." title="Bakıcı detayı">
        <View style={styles.formStack}>
          <Controller
            control={control}
            name="caregiverServiceTypes"
            render={({ field }) => (
              <FieldGroup error={errorText(errors.caregiverServiceTypes?.message)} label="Hizmetler">
                <Chips
                  items={caregiverServiceOptions.map((item) => ({
                    icon: "briefcase-outline" as IconName,
                    label: SERVICE_LABELS[item],
                    value: item
                  }))}
                  onChange={field.onChange}
                  selectedValues={field.value ?? []}
                />
              </FieldGroup>
            )}
          />
          <Controller
            control={control}
            name="caregiverAvailability"
            render={({ field }) => (
              <FieldGroup label="Müsaitlik">
                <SegmentedTabs onChange={field.onChange} options={[...availabilityOptions]} value={field.value} />
              </FieldGroup>
            )}
          />
          <View style={styles.row}>
            <View style={styles.flex}>
              <Controller
                control={control}
                name="caregiverRate"
                render={({ field }) => (
                  <TextField
                    error={errorText(errors.caregiverRate?.message)}
                    label="Ücret"
                    onChangeText={field.onChange}
                    placeholder="Günlük 900 TL"
                    value={field.value}
                  />
                )}
              />
            </View>
            <View style={styles.flex}>
              <Controller
                control={control}
                name="caregiverExperience"
                render={({ field }) => (
                  <TextField
                    error={errorText(errors.caregiverExperience?.message)}
                    label="Deneyim"
                    onChangeText={field.onChange}
                    placeholder="3 yıl deneyim"
                    value={field.value}
                  />
                )}
              />
            </View>
          </View>
        </View>
      </Section>
    );
  }

  if (selectedType === "owner-request") {
    return (
      <Section description="Bakıcıların hızlı karar verebilmesi için gerekli alanlar." title="Bakım ihtiyacı">
        <View style={styles.formStack}>
          <Controller
            control={control}
            name="ownerPetType"
            render={({ field }) => (
              <FieldGroup label="Hayvan türü">
                <SegmentedTabs
                  onChange={field.onChange}
                  options={ownerPetTypeOptions.map((item) => ({
                    label: item === "Kopek" ? "Köpek" : item === "Diger" ? "Diğer" : item,
                    value: item
                  }))}
                  value={field.value}
                />
              </FieldGroup>
            )}
          />
          <Controller
            control={control}
            name="ownerCareNeeds"
            render={({ field }) => (
              <FieldGroup error={errorText(errors.ownerCareNeeds?.message)} label="İhtiyaçlar">
                <Chips
                  items={ownerCareNeedOptions.map((item) => ({
                    icon: "check-circle-outline" as IconName,
                    label: NEED_LABELS[item],
                    value: item
                  }))}
                  onChange={field.onChange}
                  selectedValues={field.value ?? []}
                />
              </FieldGroup>
            )}
          />
          <View style={styles.row}>
            <View style={styles.flex}>
              <Controller
                control={control}
                name="ownerDatePlan"
                render={({ field }) => (
                  <TextField
                    error={errorText(errors.ownerDatePlan?.message)}
                    label="Tarih / plan"
                    onChangeText={field.onChange}
                    placeholder="Bu hafta sonu"
                    value={field.value}
                  />
                )}
              />
            </View>
            <View style={styles.flex}>
              <Controller
                control={control}
                name="ownerBudget"
                render={({ field }) => (
                  <TextField
                    error={errorText(errors.ownerBudget?.message)}
                    label="Bütçe"
                    onChangeText={field.onChange}
                    placeholder="3.500 TL"
                    value={field.value}
                  />
                )}
              />
            </View>
          </View>
        </View>
      </Section>
    );
  }

  if (selectedType === "community-post") {
    return (
      <Section description="Topluluk paylaşımını kategorisi ve iletişim yöntemiyle netleştir." title="Topluluk detayı">
        <View style={styles.formStack}>
          <Controller
            control={control}
            name="communityCategory"
            render={({ field }) => (
              <FieldGroup label="Kategori">
                <SegmentedTabs
                  onChange={field.onChange}
                  options={communityCategoryOptions.map((item) => ({
                    label: CATEGORY_LABELS[item],
                    value: item
                  }))}
                  value={field.value}
                />
              </FieldGroup>
            )}
          />
          <Controller
            control={control}
            name="communityContactPreference"
            render={({ field }) => (
              <FieldGroup label="İletişim">
                <SegmentedTabs
                  onChange={field.onChange}
                  options={communityContactPreferenceOptions.map((item) => ({
                    label: CONTACT_LABELS[item],
                    value: item
                  }))}
                  value={field.value}
                />
              </FieldGroup>
            )}
          />
          <Controller
            control={control}
            name="communitySupportWindow"
            render={({ field }) => (
              <TextField
                error={errorText(errors.communitySupportWindow?.message)}
                label="Geçerlilik / zaman"
                onChangeText={field.onChange}
                placeholder="Bu hafta sonuna kadar"
                value={field.value}
              />
            )}
          />
        </View>
      </Section>
    );
  }

  return (
    <Section
      description="Mağaza profiline bağlı kampanya için fiyat, indirim ve görsel bilgilerini tamamla."
      title="Kampanya detayı"
    >
      <View style={styles.formStack}>
        <Controller
          control={control}
          name="petshopCampaignType"
          render={({ field }) => (
            <FieldGroup label="Kategori">
              <SegmentedTabs
                onChange={field.onChange}
                options={petshopCampaignTypeOptions.map((item) => ({
                  label: CAMPAIGN_LABELS[item],
                  value: item
                }))}
                value={field.value}
              />
            </FieldGroup>
          )}
        />
        <View style={styles.row}>
          <View style={styles.flex}>
            <Controller
              control={control}
              name="petshopDiscount"
              render={({ field }) => (
                <TextField
                  error={errorText(errors.petshopDiscount?.message)}
                  label="İndirim"
                  onChangeText={field.onChange}
                  placeholder="%20"
                  value={field.value}
                />
              )}
            />
          </View>
          <View style={styles.flex}>
            <Controller
              control={control}
              name="petshopPrice"
              render={({ field }) => (
                <TextField
                  error={errorText(errors.petshopPrice?.message)}
                  label="Fiyat"
                  onChangeText={field.onChange}
                  placeholder="799 TL"
                  value={field.value}
                />
              )}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Controller
              control={control}
              name="petshopDeadline"
              render={({ field }) => (
                <TextField
                  error={errorText(errors.petshopDeadline?.message)}
                  label="Son tarih"
                  onChangeText={field.onChange}
                  placeholder="3 gün kaldı"
                  value={field.value}
                />
              )}
            />
          </View>
          <View style={styles.flex}>
            <Controller
              control={control}
              name="petshopCampaignBadge"
              render={({ field }) => (
                <TextField
                  error={errorText(errors.petshopCampaignBadge?.message)}
                  label="Rozet"
                  onChangeText={field.onChange}
                  placeholder="Bahar fırsatı"
                  value={field.value}
                />
              )}
            />
          </View>
        </View>
      </View>
    </Section>
  );
}

function StartPanel({ draftCount }: { draftCount: number }) {
  return (
    <View style={styles.startPanel}>
      <View style={styles.startIcon}>
        <AppIcon name="cursor-default-click-outline" size={26} />
      </View>
      <View style={styles.startTexts}>
        <Text style={styles.startTitle}>Bir içerik tipi seç</Text>
        <Text style={styles.startDescription}>
          Bakıcı ilanı, bakım talebi, topluluk paylaşımı veya petshop kampanyası için alanlar seçimine göre açılır.
        </Text>
      </View>
      <View style={styles.metaRow}>
        <MetaPill icon="content-save-outline" label={`${draftCount} taslak`} tone="neutral" />
        <MetaPill icon="form-select" label="Tek ekran form" tone="primary" />
      </View>
    </View>
  );
}

function Section({
  children,
  description,
  title
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>
      {children}
    </View>
  );
}

function Chips<T extends string>({
  items,
  onChange,
  selectedValues
}: {
  items: { icon: IconName; label: string; value: T }[];
  onChange: (value: T[]) => void;
  selectedValues: T[];
}) {
  return (
    <View style={styles.chipRow}>
      {items.map((item) => {
        const selected = selectedValues.includes(item.value);

        return (
          <FilterChip
            key={item.value}
            icon={selected ? "check-circle-outline" : item.icon}
            label={item.label}
            onPress={() => {
              onChange(
                selected
                  ? selectedValues.filter((value) => value !== item.value)
                  : [...selectedValues, item.value]
              );
            }}
            selected={selected}
          />
        );
      })}
    </View>
  );
}

function FieldGroup({
  children,
  error,
  label
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function FeedbackBanner({
  message,
  tone,
  title
}: {
  message: string;
  tone: "info" | "success";
  title: string;
}) {
  return (
    <View style={[styles.feedback, tone === "success" ? styles.feedbackSuccess : styles.feedbackInfo]}>
      <AppIcon
        backgrounded={false}
        name={tone === "success" ? "check-circle-outline" : "information-outline"}
        size={18}
        tone={tone === "success" ? "success" : "primary"}
      />
      <View style={styles.feedbackTexts}>
        <Text style={styles.feedbackTitle}>{title}</Text>
        <Text style={styles.feedbackMessage}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  channelBlock: {
    borderTopColor: colors.divider,
    borderTopWidth: 1,
    gap: spacing.compact,
    paddingTop: spacing.standard
  },
  channelHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  channelHint: {
    color: colors.textSubtle,
    ...typography.caption,
    letterSpacing: 0
  },
  channelIcon: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: radius.sm,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  channelIconSelected: {
    backgroundColor: "rgba(255,255,255,0.18)"
  },
  channelOption: {
    alignItems: "flex-start",
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: spacing.tight,
    minWidth: 180,
    padding: spacing.compact
  },
  channelOptionDescription: {
    color: colors.textMuted,
    ...typography.caption,
    letterSpacing: 0
  },
  channelOptionDescriptionSelected: {
    color: colors.textInverse
  },
  channelOptionSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent
  },
  channelOptionTitle: {
    color: colors.text,
    ...typography.label,
    letterSpacing: 0
  },
  channelOptionTitleSelected: {
    color: colors.textInverse
  },
  channelOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  channelText: {
    flex: 1,
    gap: spacing.nano,
    minWidth: 0
  },
  channelTitle: {
    color: colors.text,
    ...typography.label,
    letterSpacing: 0
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  composeDescription: {
    color: colors.textMuted,
    ...typography.body,
    letterSpacing: 0
  },
  composeIntro: {
    gap: spacing.compact
  },
  composeIntroText: {
    gap: spacing.micro
  },
  composeShell: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    gap: spacing.standard,
    padding: spacing.standard
  },
  composeStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  composeTitle: {
    color: colors.text,
    ...typography.h2,
    letterSpacing: 0
  },
  content: {
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.standard
  },
  editorDescription: {
    color: colors.textMuted,
    ...typography.body,
    letterSpacing: 0
  },
  editorIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  editorMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  editorPanel: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    gap: spacing.xl,
    padding: spacing.standard
  },
  editorTitle: {
    color: colors.text,
    ...typography.h3,
    letterSpacing: 0
  },
  editorTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.standard
  },
  editorTopText: {
    flex: 1,
    gap: spacing.micro
  },
  embeddedActions: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    gap: spacing.compact,
    padding: spacing.standard
  },
  error: {
    color: colors.error,
    ...typography.caption,
    letterSpacing: 0
  },
  eyebrow: {
    color: colors.primary,
    ...typography.overline
  },
  feedback: {
    alignItems: "flex-start",
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.tight,
    padding: spacing.standard
  },
  feedbackInfo: {
    backgroundColor: colors.infoSoft,
    borderColor: colors.border
  },
  feedbackMessage: {
    color: colors.textMuted,
    ...typography.body,
    letterSpacing: 0
  },
  feedbackSuccess: {
    backgroundColor: colors.successSoft,
    borderColor: colors.border
  },
  feedbackTexts: {
    flex: 1,
    gap: spacing.micro
  },
  feedbackTitle: {
    color: colors.text,
    ...typography.bodyStrong,
    letterSpacing: 0
  },
  fieldGroup: {
    gap: spacing.tight
  },
  fieldLabel: {
    color: colors.text,
    ...typography.label,
    letterSpacing: 0
  },
  flex: {
    flex: 1,
    minWidth: 140
  },
  formStack: {
    gap: spacing.standard
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.compact
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  section: {
    borderTopColor: colors.divider,
    borderTopWidth: 1,
    gap: spacing.standard,
    paddingTop: spacing.standard
  },
  sectionDescription: {
    color: colors.textMuted,
    ...typography.body,
    letterSpacing: 0
  },
  sectionHeader: {
    gap: spacing.micro
  },
  sectionTitle: {
    color: colors.text,
    ...typography.subheading,
    letterSpacing: 0
  },
  startDescription: {
    color: colors.textMuted,
    ...typography.body,
    letterSpacing: 0
  },
  startIcon: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  startPanel: {
    ...shadows.card,
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    gap: spacing.standard,
    padding: spacing.lg
  },
  startTexts: {
    gap: spacing.micro
  },
  startTitle: {
    color: colors.text,
    ...typography.h2,
    letterSpacing: 0
  },
  typePill: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.tight,
    minWidth: 168,
    paddingHorizontal: spacing.compact,
    paddingVertical: spacing.tight
  },
  typePillIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  typePillIconSelected: {
    backgroundColor: "rgba(255,255,255,0.18)"
  },
  typePillMeta: {
    color: colors.textSubtle,
    ...typography.caption,
    letterSpacing: 0
  },
  typePillMetaSelected: {
    color: colors.textInverse
  },
  typePillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  typePillText: {
    flex: 1,
    gap: spacing.nano,
    minWidth: 0
  },
  typePillTitle: {
    color: colors.text,
    ...typography.label,
    letterSpacing: 0
  },
  typePillTitleSelected: {
    color: colors.textInverse
  },
  typeRail: {
    marginHorizontal: -spacing.standard
  },
  typeRailContent: {
    gap: spacing.tight,
    paddingHorizontal: spacing.standard
  },
  typeRailHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  typeRailHint: {
    color: colors.textSubtle,
    ...typography.caption,
    letterSpacing: 0
  },
  typeRailTitle: {
    color: colors.text,
    ...typography.label,
    letterSpacing: 0
  }
});
