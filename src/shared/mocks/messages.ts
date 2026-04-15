export const conversations = [
  {
    archived: false,
    id: "conv-1",
    lastMessage: "Yarin sabah 09:00 gibi uygun olabilirim, dilersen detaylari netlestirelim.",
    listingId: "cg-1",
    listingKind: "caregiver-listing",
    listingTitle: "Deneyimli evde bakici",
    listingType: "Bakici Ilani",
    participantName: "Ece Demir",
    participantRole: "Evcil hayvan sahibi",
    unreadCount: 2,
    updatedAt: "Bugun 14:20"
  },
  {
    archived: false,
    id: "conv-2",
    lastMessage: "Kampanya detaylarina baktim, teslimat secenekleri icin bilgi alabilir miyim?",
    listingId: "ps-1",
    listingKind: "petshop-campaign",
    listingTitle: "Premium mama bahar kampanyasi",
    listingType: "Petshop Kampanyasi",
    participantName: "Pati Market",
    participantRole: "Magaza hesabi",
    unreadCount: 0,
    updatedAt: "Dun 18:05"
  },
  {
    archived: false,
    id: "conv-3",
    lastMessage: "Iki kedi icin 10 gunluk destek ihtiyaci halen gecerli, donusunu bekliyorum.",
    listingId: "ow-2",
    listingKind: "owner-request",
    listingTitle: "Iki kediye gunluk kontrol",
    listingType: "Bakici Ariyorum",
    participantName: "Mert Aydin",
    participantRole: "Ilan sahibi",
    unreadCount: 1,
    updatedAt: "Pzt 11:10"
  },
  {
    archived: true,
    id: "conv-4",
    lastMessage: "Topluluk mama destegi tamamlandi, ilgin icin tekrar tesekkur ederiz.",
    listingId: "cm-1",
    listingKind: "community-post",
    listingTitle: "Barinak icin ucretsiz mama destegi",
    listingType: "Topluluk Paylasimi",
    participantName: "Pati Dayanisma Agi",
    participantRole: "Topluluk gonullusu",
    unreadCount: 0,
    updatedAt: "Gecen hafta"
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
      text: "Merhaba, ilaninizla ilgileniyorum. Hafta ici yarim gun bakim icin halen musait misiniz?",
      time: "13:40"
    },
    {
      id: "m-2",
      sender: "me",
      text: "Merhaba, evet. Deneyim detaylarimi ve uygun gunlerimi paylasabilirim.",
      time: "13:48"
    },
    {
      id: "m-3",
      sender: "other",
      text: "Yarin sabah 09:00 gibi uygun olabilirim, dilersen detaylari netlestirelim.",
      time: "14:20"
    }
  ],
  "conv-2": [
    {
      id: "m-4",
      sender: "me",
      text: "Kampanyaya dahil urunlerin stok durumu hakkinda bilgi alabilir miyim?",
      time: "17:40"
    },
    {
      id: "m-5",
      sender: "other",
      text: "Tabii, stokta mevcut. Ayni gun teslimat seceneklerimiz de var.",
      time: "18:05"
    }
  ],
  "conv-3": [
    {
      id: "m-6",
      sender: "other",
      text: "Iki kedi icin 10 gunluk destek ihtiyaci halen gecerli, donusunu bekliyorum.",
      time: "11:10"
    }
  ]
};
