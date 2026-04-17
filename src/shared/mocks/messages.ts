export const conversations = [
  {
    archived: false,
    id: "conv-1",
    lastMessage: "Yarın sabah 09:00 gibi uygun olabilirim, dilersen detayları netleştirelim.",
    listingId: "cg-1",
    listingKind: "caregiver-listing",
    listingTitle: "Deneyimli evde bakıcı",
    listingType: "Bakıcı İlanı",
    participantName: "Ece Demir",
    participantRole: "Evcil hayvan sahibi",
    unreadCount: 2,
    updatedAt: "Bugün 14:20"
  },
  {
    archived: false,
    id: "conv-2",
    lastMessage: "Kampanya detaylarına baktım, teslimat seçenekleri için bilgi alabilir miyim?",
    listingId: "ps-1",
    listingKind: "petshop-campaign",
    listingTitle: "Premium mama bahar kampanyası",
    listingType: "Petshop Kampanyası",
    participantName: "Pati Market",
    participantRole: "Mağaza hesabı",
    unreadCount: 0,
    updatedAt: "Dün 18:05"
  },
  {
    archived: false,
    id: "conv-3",
    lastMessage: "İki kedi için 10 günlük destek ihtiyacı halen geçerli, dönüşünü bekliyorum.",
    listingId: "ow-2",
    listingKind: "owner-request",
    listingTitle: "İki kediye günlük kontrol",
    listingType: "Bakıcı Arıyorum",
    participantName: "Mert Aydın",
    participantRole: "İlan sahibi",
    unreadCount: 1,
    updatedAt: "Pzt 11:10"
  },
  {
    archived: true,
    id: "conv-4",
    lastMessage: "Topluluk mama desteği tamamlandı, ilgin için tekrar teşekkür ederiz.",
    listingId: "cm-1",
    listingKind: "community-post",
    listingTitle: "Barınak için ücretsiz mama desteği",
    listingType: "Topluluk Paylaşımı",
    participantName: "Pati Dayanışma Ağı",
    participantRole: "Topluluk gönüllüsü",
    unreadCount: 0,
    updatedAt: "Geçen hafta"
  }
] as const;

export const conversationMessages: Record<
  string,
  {
    id: string;
    sender: "me" | "other";
    text: string;
    time: string;
  }[]
> = {
  "conv-1": [
    {
      id: "m-1",
      sender: "other",
      text: "Merhaba, ilanınızla ilgileniyorum. Hafta içi yarım gün bakım için halen müsait misiniz?",
      time: "13:40"
    },
    {
      id: "m-2",
      sender: "me",
      text: "Merhaba, evet. Deneyim detaylarımı ve uygun günlerimi paylaşabilirim.",
      time: "13:48"
    },
    {
      id: "m-3",
      sender: "other",
      text: "Yarın sabah 09:00 gibi uygun olabilirim, dilersen detayları netleştirelim.",
      time: "14:20"
    }
  ],
  "conv-2": [
    {
      id: "m-4",
      sender: "me",
      text: "Kampanyaya dahil ürünlerin stok durumu hakkında bilgi alabilir miyim?",
      time: "17:40"
    },
    {
      id: "m-5",
      sender: "other",
      text: "Tabii, stokta mevcut. Aynı gün teslimat seçeneklerimiz de var.",
      time: "18:05"
    }
  ],
  "conv-3": [
    {
      id: "m-6",
      sender: "other",
      text: "İki kedi için 10 günlük destek ihtiyacı halen geçerli, dönüşünü bekliyorum.",
      time: "11:10"
    }
  ]
};
