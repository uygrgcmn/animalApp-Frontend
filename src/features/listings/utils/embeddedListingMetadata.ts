const METADATA_START = "[[ANIMAL_APP_META]]";
const METADATA_END = "[[/ANIMAL_APP_META]]";
const METADATA_PATTERN = /\[\[ANIMAL_APP_META\]\]([\s\S]*?)\[\[\/ANIMAL_APP_META\]\]/;

export type EmbeddedListingMetadata = {
  availabilityLabel?: string;
  campaignLabel?: string;
  careNeedLabels?: string[];
  city?: string;
  contactPreferenceLabel?: string;
  datePlan?: string;
  deadlineLabel?: string;
  discountLabel?: string;
  district?: string;
  experience?: string;
  mediaUrls?: string[];
  petType?: string;
  priceLabel?: string;
  serviceLabels?: string[];
  supportWindow?: string;
  version: 1;
  visualLabel?: string;
};

function removeEmptyValues(metadata: EmbeddedListingMetadata) {
  return Object.fromEntries(
    Object.entries(metadata).filter(([, value]) => {
      if (value == null) {
        return false;
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      if (typeof value === "string") {
        return value.trim().length > 0;
      }

      return true;
    })
  ) as EmbeddedListingMetadata;
}

export function embedListingMetadata(
  description: string,
  metadata: Omit<EmbeddedListingMetadata, "version">
) {
  const cleanDescription = description.trim();
  const serializedMetadata = removeEmptyValues({
    ...metadata,
    version: 1
  });

  if (Object.keys(serializedMetadata).length === 1) {
    return cleanDescription;
  }

  const metadataBlock = `${METADATA_START}${JSON.stringify(serializedMetadata)}${METADATA_END}`;
  return cleanDescription ? `${cleanDescription}\n\n${metadataBlock}` : metadataBlock;
}

export function parseEmbeddedListingMetadata(rawDescription: string | null | undefined) {
  const source = rawDescription?.trim() ?? "";
  const match = source.match(METADATA_PATTERN);

  if (!match) {
    return {
      description: source,
      metadata: { version: 1 } satisfies EmbeddedListingMetadata
    };
  }

  const description = source.replace(METADATA_PATTERN, "").trim();
  const metadataPayload = match[1];

  if (!metadataPayload) {
    return {
      description,
      metadata: { version: 1 } satisfies EmbeddedListingMetadata
    };
  }

  try {
    const parsed = JSON.parse(metadataPayload) as Partial<EmbeddedListingMetadata>;
    return {
      description,
      metadata: {
        ...parsed,
        version: 1
      } satisfies EmbeddedListingMetadata
    };
  } catch {
    return {
      description: source,
      metadata: { version: 1 } satisfies EmbeddedListingMetadata
    };
  }
}

export function getPrimaryMediaUrl(metadata: EmbeddedListingMetadata) {
  return metadata.mediaUrls?.[0];
}
