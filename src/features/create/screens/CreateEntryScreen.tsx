import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import {
  Controller,
  useForm,
  type Control,
  type FieldErrors,
  type SubmitHandler
} from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { caregiverServiceOptions } from "../../caregiver/schemas";
import { useSessionStore } from "../../auth/store/sessionStore";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { FilterChip } from "../../../shared/ui/FilterChip";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { StickyBottomActionBar } from "../../../shared/ui/StickyBottomActionBar";
import { TextField } from "../../../shared/ui/TextField";
import { UploadBox } from "../../../shared/ui/UploadBox";
import {
  communityCategoryOptions,
  communityContactPreferenceOptions,
  createTypeMeta,
  createWizardSchema,
  defaultCreateWizardValues,
  ownerCareNeedOptions,
  ownerPetTypeOptions,
  petshopCampaignTypeOptions,
  type CreateListingType,
  type CreateWizardValues
} from "../schemas";

const wizardSteps = [
  "Icerik tipi",
  "Temel bilgiler",
  "Detaylar",
  "Medya",
  "Onizleme"
] as const;

const caregiverServiceLabels: Record<(typeof caregiverServiceOptions)[number], string> = {
  "evde-bakim": "Evde bakim",
  "geceli-bakim": "Geceli bakim",
  "gunluk-ziyaret": "Gunluk ziyaret",
  "ilac-takibi": "Ilac takibi",
  "kopek-gezdirme": "Kopek gezdirme"
};

const caregiverAvailabilityLabels: Record<
  "esnek" | "hafta-ici" | "hafta-sonu",
  string
> = {
  esnek: "Esnek",
  "hafta-ici": "Hafta ici",
  "hafta-sonu": "Hafta sonu"
};

const ownerNeedLabels: Record<(typeof ownerCareNeedOptions)[number], string> = {
  "gece-konaklama": "Gece konaklama",
  "gunluk-rutin": "Gunluk rutin",
  "ilac-takibi": "Ilac takibi",
  "kopek-gezdirme": "Kopek gezdirme"
};

const communityCategoryLabels: Record<(typeof communityCategoryOptions)[number], string> = {
  diger: "Diger",
  sahiplendirme: "Sahiplendirme",
  "ucretsiz-mama": "Ucretsiz mama"
};

const communityContactLabels: Record<
  (typeof communityContactPreferenceOptions)[number],
  string
> = {
  mesaj: "Mesaj",
  telefon: "Telefon",
  yorum: "Yorum"
};

const petshopCampaignTypeLabels: Record<(typeof petshopCampaignTypeOptions)[number], string> = {
  aksesuar: "Aksesuar",
  bakim: "Bakim",
  mama: "Mama",
  saglik: "Saglik"
};

type CreateFieldName = keyof CreateWizardValues;

export function CreateEntryScreen() {
  const params = useLocalSearchParams<{ listingType?: CreateListingType }>();
  const user = useSessionStore((state) => state.user);
  const createDrafts = useSessionStore((state) => state.createDrafts);
  const saveCreateDraft = useSessionStore((state) => state.saveCreateDraft);
  const clearCreateDraft = useSessionStore((state) => state.clearCreateDraft);
  const [currentStep, setCurrentStep] = useState(0);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "info" | "success";
    title: string;
  } | null>(null);

  const initialValues = useMemo(
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
    trigger,
    watch,
    formState: { errors }
  } = useForm<CreateWizardValues>({
    defaultValues: initialValues,
    resolver: zodResolver(createWizardSchema)
  });

  const values = watch();
  const selectedType = values.listingType;
  const activeDraft = selectedType ? createDrafts[selectedType] : undefined;
  const media = values.media ?? [];

  const handleSelectType = useCallback(
    (type: CreateListingType) => {
      const draft = createDrafts[type];

      if (draft) {
        reset({
          ...initialValues,
          ...draft.values,
          listingType: type
        });
        setCurrentStep(Math.min(Math.max(draft.currentStep, 0), wizardSteps.length - 1));
        setFeedback({
          message: "Kayitli taslak geri yuklendi. Kaldigin yerden devam edebilirsin.",
          title: "Taslak geri geldi",
          tone: "info"
        });
        return;
      }

      reset({
        ...initialValues,
        listingType: type
      });
      setCurrentStep(0);
      setFeedback({
        message: "Tip secildi. Adim adim ilerleyerek formu daha rahat tamamlayabilirsin.",
        title: createTypeMeta[type].shortLabel,
        tone: "info"
      });
    },
    [createDrafts, initialValues, reset]
  );

  useEffect(() => {
    if (
      params.listingType &&
      (params.listingType === "caregiver-listing" ||
        params.listingType === "owner-request" ||
        params.listingType === "community-post" ||
        params.listingType === "petshop-campaign") &&
      !selectedType
    ) {
      handleSelectType(params.listingType);
    }
  }, [handleSelectType, params.listingType, selectedType]);

  const handlePickMedia = async () => {
    setPickerError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setPickerError("Gorsel eklemek icin galeri izni gerekiyor.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    setValue("media", [...media, result.assets[0].uri], {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const handleSaveDraft = () => {
    if (!selectedType) {
      setFeedback({
        message: "Once hangi tur icerik olusturacagini sec.",
        title: "Icerik tipi gerekli",
        tone: "info"
      });
      return;
    }

    saveCreateDraft(selectedType, getValues(), currentStep);
    setFeedback({
      message: "Bu tip icin mevcut alanlarin kaydedildi. Daha sonra ayni ekrana donup devam edebilirsin.",
      title: "Taslak kaydedildi",
      tone: "success"
    });
  };

  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
      return;
    }

    setCurrentStep((previous) => previous - 1);
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!selectedType) {
        setFeedback({
          message: "Wizard'i baslatmak icin once bir ilan tipi sec.",
          title: "Tip secimi gerekiyor",
          tone: "info"
        });
        return;
      }

      setCurrentStep(1);
      return;
    }

    const fields = getStepFields(selectedType, currentStep);
    const isValid = await trigger(fields, { shouldFocus: true });

    if (!isValid) {
      return;
    }

    setCurrentStep((previous) => Math.min(previous + 1, wizardSteps.length - 1));
  };

  const onSubmit: SubmitHandler<CreateWizardValues> = (submittedValues) => {
    if (!submittedValues.listingType) {
      return;
    }

    clearCreateDraft(submittedValues.listingType);
    reset(initialValues);
    setCurrentStep(0);
    setFeedback({
      message: `${createTypeMeta[submittedValues.listingType].shortLabel} icin onizleme onaylandi. Akis yayina alinmaya hazir olarak tamamlandi.`,
      title: "Icerik hazir",
      tone: "success"
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          description="Uzun tek sayfa formlar yerine adim adim ilerleyen profesyonel bir olusturma merkezi."
          showBackButton
          title="Ilan Olustur"
        />

        <InfoCard
          description="Tip secimi, dinamik alanlar, medya ve onizleme tek wizard omurgasinda toplandi."
          title="Wizard durumu"
          variant="accent"
        >
          <View style={styles.metaWrap}>
            <MetaPill
              icon="shape-plus-outline"
              label={selectedType ? createTypeMeta[selectedType].shortLabel : "Tip secilmedi"}
              tone="primary"
            />
            <MetaPill
              icon="progress-pencil"
              label={`${currentStep + 1}/${wizardSteps.length} adim`}
              tone="neutral"
            />
            <MetaPill
              icon="content-save-outline"
              label={`${Object.keys(createDrafts).length} taslak`}
              tone="success"
            />
          </View>
        </InfoCard>

        {feedback ? (
          <InfoCard
            description={feedback.message}
            title={feedback.title}
            variant={feedback.tone === "success" ? "accent" : "default"}
          />
        ) : null}

        <StepIndicator currentStep={currentStep} />

        {currentStep === 0 ? (
          <InfoCard
            description="Her tip farkli bir form akisi acar. Taslak varsa secim karti uzerinden geri yuklenir."
            title="1. Icerik tipini sec"
          >
            <View style={styles.typeGrid}>
              {(Object.keys(createTypeMeta) as CreateListingType[]).map((type) => {
                const draft = createDrafts[type];
                const selected = selectedType === type;

                return (
                  <Pressable
                    key={type}
                    onPress={() => {
                      handleSelectType(type);
                    }}
                    style={[
                      styles.typeCard,
                      selected ? styles.typeCardActive : null
                    ]}
                  >
                    <View style={styles.typeCardHeader}>
                      <View style={styles.typeIcon}>
                        <AppIcon name={createTypeMeta[type].icon} size={22} />
                      </View>
                      {draft ? (
                        <MetaPill
                          icon="content-save-outline"
                          label="Taslak var"
                          tone="success"
                        />
                      ) : null}
                    </View>
                    <View style={styles.typeTexts}>
                      <Text style={styles.typeTitle}>{createTypeMeta[type].label}</Text>
                      <Text style={styles.typeDescription}>
                        {createTypeMeta[type].description}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            {errors.listingType?.message ? (
              <Text style={styles.error}>{errors.listingType.message}</Text>
            ) : null}
          </InfoCard>
        ) : null}

        {currentStep === 1 ? (
          <InfoCard
            description="Tum tiplerde ortak olan temel alanlari once toplayip formu sade tutuyoruz."
            title="2. Temel bilgileri gir"
          >
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <FieldBlock helper="Kartta ve onizlemede once bu baslik gorunur. Kisa ama ayirt edici olsun.">
                  <TextField
                    error={errors.title?.message}
                    label="Baslik"
                    onChangeText={field.onChange}
                    placeholder="Orn. Deneyimli evde bakici"
                    value={field.value}
                  />
                </FieldBlock>
              )}
            />
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <FieldBlock helper="Kesif ve yakinindakiler bloklarinda kullanilir.">
                      <TextField
                        error={errors.city?.message}
                        label="Sehir"
                        onChangeText={field.onChange}
                        placeholder="Istanbul"
                        value={field.value}
                      />
                    </FieldBlock>
                  )}
                />
              </View>
              <View style={styles.gridItem}>
                <Controller
                  control={control}
                  name="district"
                  render={({ field }) => (
                    <FieldBlock helper="Daha net konum hissi vermek icin kullanilir.">
                      <TextField
                        error={errors.district?.message}
                        label="Ilce"
                        onChangeText={field.onChange}
                        placeholder="Kadikoy"
                        value={field.value}
                      />
                    </FieldBlock>
                  )}
                />
              </View>
            </View>
          </InfoCard>
        ) : null}

        {currentStep === 2 && selectedType ? (
          <DynamicDetailStep
            control={control}
            errors={errors}
            values={values}
          />
        ) : null}

        {currentStep === 3 ? (
          <InfoCard
            description="Ilk gorsel kart kapainda kullanilir; ek gorseller premium his ve guven katar."
            title="4. Medya ekle"
          >
            <FieldBlock helper="Galeriden en az bir gorsel sec. Gorseller kart ve detay ekranlarinda kullanilacak.">
              <UploadBox
                description={
                  media.length > 0
                    ? `${media.length} gorsel secildi`
                    : "Kapak gorseli ve gerekiyorsa ek destekleyici gorseller yukle."
                }
                error={pickerError ?? errors.media?.message}
                imageUri={media[0]}
                label="Gorsel ekle"
                onPress={handlePickMedia}
              />
            </FieldBlock>
            {media.length > 0 ? (
              <View style={styles.mediaList}>
                {media.map((item, index) => (
                  <Pressable
                    key={`${item}-${index}`}
                    onPress={() => {
                      setValue(
                        "media",
                        media.filter((_, mediaIndex) => mediaIndex !== index),
                        { shouldDirty: true, shouldValidate: true }
                      );
                    }}
                    style={styles.mediaPill}
                  >
                    <Text style={styles.mediaPillText}>
                      {index === 0 ? "Kapak gorseli" : `Ek gorsel ${index}`}
                    </Text>
                    <AppIcon backgrounded={false} name="close" size={14} />
                  </Pressable>
                ))}
              </View>
            ) : null}
          </InfoCard>
        ) : null}

        {currentStep === 4 && selectedType ? (
          <PreviewStep selectedType={selectedType} values={values} activeDraft={activeDraft?.updatedAt} />
        ) : null}
      </ScrollView>

      <StickyBottomActionBar>
        <View style={styles.footerGrid}>
          <AppButton
            label={currentStep === 0 ? "Vazgec" : "Geri"}
            onPress={handleBack}
            variant="secondary"
          />
          <AppButton
            disabled={!selectedType}
            label="Taslagi Kaydet"
            leftSlot={<AppIcon backgrounded={false} name="content-save-outline" size={18} />}
            onPress={handleSaveDraft}
            variant="ghost"
          />
        </View>
        <AppButton
          label={currentStep === wizardSteps.length - 1 ? "Onizlemeyi Onayla" : "Ileri"}
          leftSlot={
            <AppIcon
              backgrounded={false}
              color="#FFFFFF"
              name={currentStep === wizardSteps.length - 1 ? "check-bold" : "arrow-right"}
              size={18}
            />
          }
          onPress={
            currentStep === wizardSteps.length - 1
              ? handleSubmit(onSubmit)
              : handleNext
          }
        />
      </StickyBottomActionBar>
    </SafeAreaView>
  );
}

function DynamicDetailStep({
  control,
  errors,
  values
}: {
  control: Control<CreateWizardValues>;
  errors: FieldErrors<CreateWizardValues>;
  values: CreateWizardValues;
}) {
  if (values.listingType === "caregiver-listing") {
    return (
      <>
        <InfoCard
          description="Hizmet kapsamini ve uygunluk bilgisini netlestirerek daha guvenilir bir profil ciz."
          title="3. Bakici ilani detaylari"
        >
          <FieldBlock helper="Aldigin hizmet turlerini sec. Kartta rozet olarak one cikarilir.">
            <Controller
              control={control}
              name="caregiverServiceTypes"
              render={({ field }) => (
                <View style={styles.optionGrid}>
                  {caregiverServiceOptions.map((option) => {
                    const selectedValues = field.value ?? [];
                    const selected = selectedValues.includes(option);

                    return (
                      <FilterChip
                        key={option}
                        icon={selected ? "check-circle-outline" : "briefcase-outline"}
                        label={caregiverServiceLabels[option]}
                        onPress={() => {
                          field.onChange(
                            selected
                              ? selectedValues.filter((item) => item !== option)
                              : [...selectedValues, option]
                          );
                        }}
                        selected={selected}
                      />
                    );
                  })}
                </View>
              )}
            />
            {errors.caregiverServiceTypes?.message ? (
              <Text style={styles.error}>{errors.caregiverServiceTypes.message}</Text>
            ) : null}
          </FieldBlock>

          <FieldBlock helper="Musaitlik algisini guclu gostermek icin tek secim yeterli.">
            <Controller
              control={control}
              name="caregiverAvailability"
              render={({ field }) => (
                <SegmentedTabs
                  onChange={field.onChange}
                  options={[
                    { label: "Hafta ici", value: "hafta-ici" },
                    { label: "Hafta sonu", value: "hafta-sonu" },
                    { label: "Esnek", value: "esnek" }
                  ]}
                  value={field.value}
                />
              )}
            />
          </FieldBlock>

          <Controller
            control={control}
            name="caregiverRate"
            render={({ field }) => (
              <FieldBlock helper="Marketplace kartinda fiyat bilgisi olarak gorunur.">
                <TextField
                  error={errors.caregiverRate?.message}
                  label="Ucret beklentisi"
                  onChangeText={field.onChange}
                  placeholder="Orn. Gunluk 900 TL"
                  value={field.value}
                />
              </FieldBlock>
            )}
          />

          <Controller
            control={control}
            name="caregiverExperience"
            render={({ field }) => (
              <FieldBlock helper="Kisa ve güven veren bir deneyim ozeti yaz.">
                <TextField
                  error={errors.caregiverExperience?.message}
                  label="Deneyim ozeti"
                  multiline
                  onChangeText={field.onChange}
                  placeholder="Rutin takibi, ilac kullanimi veya onceki deneyimlerini ozetle."
                  value={field.value}
                />
              </FieldBlock>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <FieldBlock helper="Detay ekranindaki aciklama bolumu icin kullanilir.">
                <TextField
                  error={errors.description?.message}
                  label="Ilan aciklamasi"
                  multiline
                  onChangeText={field.onChange}
                  placeholder="Hangi hayvanlar icin, nasil bir bakim sundugunu anlat."
                  value={field.value}
                />
              </FieldBlock>
            )}
          />
        </InfoCard>
      </>
    );
  }

  if (values.listingType === "owner-request") {
    return (
      <InfoCard
        description="Bakici arayan kullanicinin beklentisi ne kadar netse eslesme kalitesi o kadar yukselir."
        title="3. Bakici ariyorum detaylari"
      >
        <FieldBlock helper="Evcil hayvan turu kartta ilk gorunen rozetlerden biri olur.">
          <Controller
            control={control}
            name="ownerPetType"
            render={({ field }) => (
              <SegmentedTabs
                onChange={field.onChange}
                options={ownerPetTypeOptions.map((item) => ({ label: item, value: item }))}
                value={field.value}
              />
            )}
          />
        </FieldBlock>

        <Controller
          control={control}
          name="ownerDatePlan"
          render={({ field }) => (
            <FieldBlock helper="Tarih araligi, hafta sonu veya duzenli plan gibi bir ifade kullanabilirsin.">
              <TextField
                error={errors.ownerDatePlan?.message}
                label="Bakim tarihi / plan"
                onChangeText={field.onChange}
                placeholder="Orn. 26-27 Nisan hafta sonu"
                value={field.value}
              />
            </FieldBlock>
          )}
        />

        <Controller
          control={control}
          name="ownerBudget"
          render={({ field }) => (
            <FieldBlock helper="Net butce bilgisi dogru basvuru kalitesini artirir.">
              <TextField
                error={errors.ownerBudget?.message}
                label="Butce"
                onChangeText={field.onChange}
                placeholder="Orn. 3.500 TL"
                value={field.value}
              />
            </FieldBlock>
          )}
        />

        <FieldBlock helper="Bakim ihtiyacini birden fazla secimle netlestirebilirsin.">
          <Controller
            control={control}
            name="ownerCareNeeds"
            render={({ field }) => (
              <View style={styles.optionGrid}>
                {ownerCareNeedOptions.map((option) => {
                  const selectedValues = field.value ?? [];
                  const selected = selectedValues.includes(option);

                  return (
                    <FilterChip
                      key={option}
                      icon={selected ? "check-circle-outline" : "paw-outline"}
                      label={ownerNeedLabels[option]}
                      onPress={() => {
                        field.onChange(
                          selected
                            ? selectedValues.filter((item) => item !== option)
                            : [...selectedValues, option]
                        );
                      }}
                      selected={selected}
                    />
                  );
                })}
              </View>
            )}
          />
          {errors.ownerCareNeeds?.message ? (
            <Text style={styles.error}>{errors.ownerCareNeeds.message}</Text>
          ) : null}
        </FieldBlock>

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <FieldBlock helper="Hayvanin rutini, beklentiler ve dikkat edilmesi gerekenleri yaz.">
              <TextField
                error={errors.description?.message}
                label="Talep aciklamasi"
                multiline
                onChangeText={field.onChange}
                placeholder="Beslenme, yuruyus, ilac veya gunluk rutin detaylarini belirt."
                value={field.value}
              />
            </FieldBlock>
          )}
        />
      </InfoCard>
    );
  }

  if (values.listingType === "community-post") {
    return (
      <InfoCard
        description="Topluluk paylasimlari sicak ama duzenli kalmali; kategori ve iletisim sekli bunu belirler."
        title="3. Topluluk paylasimi detaylari"
      >
        <FieldBlock helper="Feed rozetini belirleyecek kategori secimi.">
          <Controller
            control={control}
            name="communityCategory"
            render={({ field }) => (
              <SegmentedTabs
                onChange={field.onChange}
                options={communityCategoryOptions.map((item) => ({
                  label: communityCategoryLabels[item],
                  value: item
                }))}
                value={field.value}
              />
            )}
          />
        </FieldBlock>

        <FieldBlock helper="Insanlarin sana nasil ulasmasini istedigini belirle.">
          <Controller
            control={control}
            name="communityContactPreference"
            render={({ field }) => (
              <SegmentedTabs
                onChange={field.onChange}
                options={communityContactPreferenceOptions.map((item) => ({
                  label: communityContactLabels[item],
                  value: item
                }))}
                value={field.value}
              />
            )}
          />
        </FieldBlock>

        <Controller
          control={control}
          name="communitySupportWindow"
          render={({ field }) => (
            <FieldBlock helper="Paylasimin ne kadar sure acik kalacagini veya ne zaman teslim alinacagini belirt.">
              <TextField
                error={errors.communitySupportWindow?.message}
                label="Paylasim suresi / teslim plani"
                onChangeText={field.onChange}
                placeholder="Orn. Bu hafta sonuna kadar"
                value={field.value}
              />
            </FieldBlock>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <FieldBlock helper="Destek cagrisi, sahiplendirme detayi veya topluluk notunu acik yaz.">
              <TextField
                error={errors.description?.message}
                label="Paylasim aciklamasi"
                multiline
                onChangeText={field.onChange}
                placeholder="Ne paylastigini, kimin icin uygun oldugunu ve iletisim detayini ozetle."
                value={field.value}
              />
            </FieldBlock>
          )}
        />
      </InfoCard>
    );
  }

  return (
    <InfoCard
      description="Kampanya detaylari net ve kurumsal gorundugunde daha guvenilir bir magaza deneyimi olusur."
      title="3. Petshop kampanyasi detaylari"
    >
      <Controller
        control={control}
        name="petshopStoreName"
        render={({ field }) => (
          <FieldBlock helper="Magaza profilinde ve kampanya kartinda gorunur.">
            <TextField
              error={errors.petshopStoreName?.message}
              label="Magaza adi"
              onChangeText={field.onChange}
              placeholder="Orn. Pati Market"
              value={field.value}
            />
          </FieldBlock>
        )}
      />

      <FieldBlock helper="Kampanyayi kategori bazli ayirmak icin kullanilir.">
        <Controller
          control={control}
          name="petshopCampaignType"
          render={({ field }) => (
            <SegmentedTabs
              onChange={field.onChange}
              options={petshopCampaignTypeOptions.map((item) => ({
                label: petshopCampaignTypeLabels[item],
                value: item
              }))}
              value={field.value}
            />
          )}
        />
      </FieldBlock>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Controller
            control={control}
            name="petshopDiscount"
            render={({ field }) => (
              <FieldBlock helper="Rozet ve fiyat satirinda kullanilir.">
                <TextField
                  error={errors.petshopDiscount?.message}
                  label="Indirim"
                  onChangeText={field.onChange}
                  placeholder="%20"
                  value={field.value}
                />
              </FieldBlock>
            )}
          />
        </View>
        <View style={styles.gridItem}>
          <Controller
            control={control}
            name="petshopPrice"
            render={({ field }) => (
              <FieldBlock helper="Net fiyat veya kampanya etiketi.">
                <TextField
                  error={errors.petshopPrice?.message}
                  label="Fiyat"
                  onChangeText={field.onChange}
                  placeholder="799 TL"
                  value={field.value}
                />
              </FieldBlock>
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="petshopDeadline"
        render={({ field }) => (
          <FieldBlock helper="Son tarih veya sure sinirini belirt.">
            <TextField
              error={errors.petshopDeadline?.message}
              label="Son tarih"
              onChangeText={field.onChange}
              placeholder="Orn. 3 gun kaldi"
              value={field.value}
            />
          </FieldBlock>
        )}
      />

      <Controller
        control={control}
        name="petshopCampaignBadge"
        render={({ field }) => (
          <FieldBlock helper="Kart uzerinde kampanyayi one cikaracak kisa rozet.">
            <TextField
              error={errors.petshopCampaignBadge?.message}
              label="Kampanya rozeti"
              onChangeText={field.onChange}
              placeholder="Bahar firsati"
              value={field.value}
            />
          </FieldBlock>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <FieldBlock helper="Stok, teslimat ve avantaj bilgisini kisa ama guven veren sekilde anlat.">
            <TextField
              error={errors.description?.message}
              label="Kampanya aciklamasi"
              multiline
              onChangeText={field.onChange}
              placeholder="Urun kapsami, teslimat ve kampanya kosullarini acikla."
              value={field.value}
            />
          </FieldBlock>
        )}
      />
    </InfoCard>
  );
}

function PreviewStep({
  activeDraft,
  selectedType,
  values
}: {
  activeDraft?: string;
  selectedType: CreateListingType;
  values: CreateWizardValues;
}) {
  return (
    <>
      <InfoCard
        description="Yayina almadan once kart mantigi ve detay ozeti bir arada gorunur."
        title="5. Onizleme"
        variant="accent"
      >
        <View style={styles.previewHeader}>
          <View style={styles.previewIcon}>
            <AppIcon name={createTypeMeta[selectedType].icon} size={22} />
          </View>
          <View style={styles.previewTexts}>
            <Text style={styles.previewTitle}>
              {values.title || createTypeMeta[selectedType].label}
            </Text>
            <Text style={styles.previewDescription}>
              {createTypeMeta[selectedType].description}
            </Text>
          </View>
        </View>

        <View style={styles.metaWrap}>
          <MetaPill icon="map-marker-outline" label={`${values.city} / ${values.district}`} tone="neutral" />
          {selectedType === "caregiver-listing" ? (
            <>
              <MetaPill
                icon="cash"
                label={values.caregiverRate || "Ucret belirtilmedi"}
                tone="success"
              />
              <MetaPill
                icon="calendar-range"
                label={caregiverAvailabilityLabels[values.caregiverAvailability ?? "esnek"]}
                tone="primary"
              />
            </>
          ) : null}
          {selectedType === "owner-request" ? (
            <>
              <MetaPill
                icon="paw-outline"
                label={values.ownerPetType ?? "Kopek"}
                tone="primary"
              />
              <MetaPill icon="cash" label={values.ownerBudget || "Butce"} tone="success" />
            </>
          ) : null}
          {selectedType === "community-post" ? (
            <>
              <MetaPill
                icon="shape-outline"
                label={communityCategoryLabels[values.communityCategory ?? "diger"]}
                tone="primary"
              />
              <MetaPill
                icon="message-text-outline"
                label={communityContactLabels[values.communityContactPreference ?? "mesaj"]}
                tone="success"
              />
            </>
          ) : null}
          {selectedType === "petshop-campaign" ? (
            <>
              <MetaPill
                icon="sale-outline"
                label={values.petshopDiscount || "Indirim"}
                tone="warning"
              />
              <MetaPill
                icon="storefront-outline"
                label={values.petshopStoreName || "Magaza"}
                tone="primary"
              />
            </>
          ) : null}
        </View>
      </InfoCard>

      <InfoCard
        description="Detay ekraninda kullanilacak aciklama metni."
        title="Aciklama ozeti"
      >
        <Text style={styles.previewBody}>{values.description}</Text>
      </InfoCard>

      <InfoCard
        description="Wizard boyunca girdigin dinamik alanlar burada toplu gorunur."
        title="Hizli kontrol"
      >
        <View style={styles.previewChecklist}>
          {selectedType === "caregiver-listing"
            ? (values.caregiverServiceTypes ?? []).map((item) => (
                <MetaPill
                  icon="check-circle-outline"
                  key={item}
                  label={caregiverServiceLabels[item]}
                  tone="success"
                />
              ))
            : null}
          {selectedType === "owner-request"
            ? (values.ownerCareNeeds ?? []).map((item) => (
                <MetaPill
                  icon="check-circle-outline"
                  key={item}
                  label={ownerNeedLabels[item]}
                  tone="success"
                />
              ))
            : null}
          {selectedType === "community-post" ? (
            <MetaPill
              icon="clock-outline"
              label={values.communitySupportWindow || "Sure bilgisi"}
              tone="warning"
            />
          ) : null}
          {selectedType === "petshop-campaign" ? (
            <>
              <MetaPill
                icon="tag-outline"
                label={values.petshopCampaignBadge || "Kampanya rozeti"}
                tone="warning"
              />
              <MetaPill
                icon="clock-outline"
                label={values.petshopDeadline || "Son tarih"}
                tone="neutral"
              />
            </>
          ) : null}
          <MetaPill
            icon="image-outline"
            label={`${(values.media ?? []).length} gorsel eklendi`}
            tone="neutral"
          />
          {activeDraft ? (
            <MetaPill
              icon="content-save-outline"
              label="Kayitli taslak bulundu"
              tone="success"
            />
          ) : null}
        </View>
      </InfoCard>
    </>
  );
}

function FieldBlock({
  children,
  helper
}: {
  children: React.ReactNode;
  helper: string;
}) {
  return (
    <View style={styles.fieldBlock}>
      {children}
      <Text style={styles.helper}>{helper}</Text>
    </View>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <InfoCard
      description="Nerede oldugunu ve siradaki adimi net gormen icin wizard ilerleyisi burada."
      title="Adim gostergesi"
    >
      <View style={styles.stepRow}>
        {wizardSteps.map((step, index) => {
          const active = index === currentStep;
          const completed = index < currentStep;

          return (
            <View key={step} style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  completed ? styles.stepDotCompleted : null,
                  active ? styles.stepDotActive : null
                ]}
              >
                <Text
                  style={[
                    styles.stepDotLabel,
                    active || completed ? styles.stepDotLabelActive : null
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  active ? styles.stepLabelActive : null
                ]}
              >
                {step}
              </Text>
              {index < wizardSteps.length - 1 ? (
                <View
                  style={[
                    styles.stepLine,
                    completed ? styles.stepLineCompleted : null
                  ]}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </InfoCard>
  );
}

function getStepFields(
  listingType: CreateListingType | undefined,
  currentStep: number
): CreateFieldName[] {
  if (!listingType) {
    return ["listingType"];
  }

  if (currentStep === 1) {
    return ["title", "city", "district"];
  }

  if (currentStep === 2) {
    if (listingType === "caregiver-listing") {
      return [
        "description",
        "caregiverServiceTypes",
        "caregiverAvailability",
        "caregiverRate",
        "caregiverExperience"
      ];
    }

    if (listingType === "owner-request") {
      return [
        "description",
        "ownerPetType",
        "ownerDatePlan",
        "ownerBudget",
        "ownerCareNeeds"
      ];
    }

    if (listingType === "community-post") {
      return [
        "description",
        "communityCategory",
        "communityContactPreference",
        "communitySupportWindow"
      ];
    }

    return [
      "description",
      "petshopStoreName",
      "petshopCampaignType",
      "petshopDiscount",
      "petshopPrice",
      "petshopDeadline",
      "petshopCampaignBadge"
    ];
  }

  if (currentStep === 3) {
    return ["media"];
  }

  return [];
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section,
    paddingBottom: spacing.large,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.standard
  },
  error: {
    color: colors.error,
    ...typography.caption
  },
  fieldBlock: {
    gap: spacing.tight
  },
  footerGrid: {
    flexDirection: "row",
    gap: spacing.compact
  },
  grid: {
    flexDirection: "row",
    gap: spacing.compact
  },
  gridItem: {
    flex: 1
  },
  helper: {
    color: colors.textSubtle,
    ...typography.caption
  },
  mediaList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  mediaPill: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.tight,
    paddingHorizontal: spacing.standard,
    paddingVertical: spacing.tight
  },
  mediaPillText: {
    color: colors.textMuted,
    ...typography.caption
  },
  metaWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  previewBody: {
    color: colors.textMuted,
    ...typography.body
  },
  previewChecklist: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  previewDescription: {
    color: colors.textMuted,
    ...typography.body
  },
  previewHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  },
  previewIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.large,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  previewTexts: {
    flex: 1,
    gap: spacing.micro
  },
  previewTitle: {
    color: colors.text,
    ...typography.h3
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  stepDot: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  stepDotActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderWidth: 1
  },
  stepDotCompleted: {
    backgroundColor: colors.primary
  },
  stepDotLabel: {
    color: colors.textSubtle,
    ...typography.caption
  },
  stepDotLabelActive: {
    color: colors.textInverse
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
    gap: spacing.tight
  },
  stepLabel: {
    color: colors.textSubtle,
    textAlign: "center",
    ...typography.caption
  },
  stepLabelActive: {
    color: colors.text,
    fontWeight: "700"
  },
  stepLine: {
    backgroundColor: colors.border,
    height: 2,
    position: "absolute",
    right: "-50%",
    top: 16,
    width: "100%"
  },
  stepLineCompleted: {
    backgroundColor: colors.primary
  },
  stepRow: {
    flexDirection: "row"
  },
  typeCard: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    gap: spacing.standard,
    padding: spacing.comfortable
  },
  typeCardActive: {
    backgroundColor: colors.backgroundAccent,
    borderColor: colors.primaryBorder
  },
  typeCardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  typeDescription: {
    color: colors.textMuted,
    ...typography.body
  },
  typeGrid: {
    gap: spacing.compact
  },
  typeIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.large,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  typeTexts: {
    gap: spacing.tight
  },
  typeTitle: {
    color: colors.text,
    ...typography.h3
  }
});
