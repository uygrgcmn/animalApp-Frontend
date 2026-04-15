export const caregiverListings = [
  {
    id: "cg-1",
    avatarLabel: "DA",
    caretakerName: "Derya Acar",
    title: "Deneyimli evde bakici",
    city: "Istanbul",
    schedule: "Hafta ici yarim gun",
    summary: "Kedi ve kopek bakiminda deneyimli profil ilani. Asili takip ve gunluk raporlama sunuyor.",
    budget: "5.000 - 7.500 TL",
    badge: "Guvenilir profil",
    availability: "Hafta ici",
    verificationState: "verified" as const
  },
  {
    id: "cg-2",
    avatarLabel: "BT",
    caretakerName: "Baris Tan",
    title: "Yatili bakim destegi",
    city: "Ankara",
    schedule: "Haftalik",
    summary: "Uzun sureli seyahatlerde yatili bakim, ilac takibi ve oyun rutini odakli profil ilani.",
    budget: "8.000 - 12.000 TL",
    badge: "Hizli donus",
    availability: "Esnek",
    verificationState: "pending" as const
  },
  {
    id: "cg-3",
    avatarLabel: "SY",
    caretakerName: "Selin Yalcin",
    title: "Kedi odakli gunluk ziyaret",
    city: "Izmir",
    schedule: "Gunluk kontrol",
    summary: "Kediler icin mama, su, kum takibi ve foto raporu sunan sakin bakim profili.",
    budget: "2.400 - 3.200 TL",
    badge: "Ayni gun donus",
    availability: "Hafta sonu",
    verificationState: "verified" as const
  }
];

export const ownerRequests = [
  {
    id: "ow-1",
    title: "Golden icin hafta sonu bakici ariyorum",
    city: "Izmir",
    petType: "Kopek",
    dateLabel: "26-27 Nisan",
    schedule: "Cumartesi-Pazar",
    summary: "Enerjik kopegim icin gezdirme ve temel beslenme destegi ariyorum.",
    budget: "3.500 TL",
    distanceLabel: "2,4 km"
  },
  {
    id: "ow-2",
    title: "Iki kediye gunluk kontrol",
    city: "Bursa",
    petType: "Kedi",
    dateLabel: "10 gunluk plan",
    schedule: "10 gun",
    summary: "Mama, su, kum temizligi ve kisa oyun seanslari icin destek ihtiyaci.",
    budget: "2.200 TL",
    distanceLabel: "5,1 km"
  },
  {
    id: "ow-3",
    title: "Muhabbet kusu icin gunluk ziyaret",
    city: "Istanbul",
    petType: "Kus",
    dateLabel: "Bu hafta",
    schedule: "5 gun",
    summary: "Sabah yem degisimi ve kisa kafes temizligi icin deneyimli destek ariyorum.",
    budget: "1.200 TL",
    distanceLabel: "1,1 km"
  }
];

export const communityPosts = [
  {
    id: "cm-1",
    title: "Barinak icin ucretsiz mama destegi",
    categoryKey: "ucretsiz-mama",
    category: "Ucretsiz mama",
    city: "Eskisehir",
    district: "Tepebasi",
    summary: "Acil kuru mama ihtiyaci bulunan gecici bakim evi icin destek cagrisi.",
    status: "Basvuruya acik",
    author: "Pati Dayanisma Agi",
    authorRole: "Gonullu topluluk",
    dateLabel: "Bugun",
    imageUri: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=1200&q=80",
    visualLabel: "Mama destek noktasi",
    supportWindow: "Bu hafta sonuna kadar",
    quickActionLabel: "Destek Ol",
    trustState: "verified" as const,
    trustLabel: "Topluluk tarafindan dogrulandi",
    description: [
      "Gecici bakim evinde ayni anda birden fazla kopek ve kedi icin destek veriliyor. Kuru mama stoklari beklenenden hizli tukendigi icin kisa sureli ama acil bir destek cagrisi acildi.",
      "Teslimat dogrudan topluluk sorumlusu ile koordine ediliyor. Istenirse mesaj uzerinden hangi urunlerin daha oncelikli oldugu da paylasiliyor."
    ],
    trustNotes: [
      "Teslim noktasi ve iletisim bilgisi dogrulanmis.",
      "Daha once ayni topluluk icinde tamamlanmis destek paylasimlari var.",
      "Ihtiyac listesi guncel tutuluyor."
    ],
    similarIds: ["cm-3", "cm-4"]
  },
  {
    id: "cm-2",
    title: "Yuva arayan tekir",
    categoryKey: "sahiplendirme",
    category: "Sahiplendirme",
    city: "Istanbul",
    district: "Besiktas",
    summary: "Asilari tamamlanmis 6 aylik tekir icin kalici yuva araniyor.",
    status: "Gorusturmeler suruyor",
    author: "Gonul Aslan",
    authorRole: "Bireysel paylasim",
    dateLabel: "Dun",
    imageUri: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80",
    visualLabel: "Sakin ev ortami",
    supportWindow: "Bu hafta gorusmeler acik",
    quickActionLabel: "Basvur",
    trustState: "verified" as const,
    trustLabel: "Asi ve temel saglik bilgileri paylasildi",
    description: [
      "6 aylik tekir, ev ortamina alisik ve insanla iletisimi guclu. Kalici yuva arayisinda sakin, guvenli ve uzun vadeli bir eslesme hedefleniyor.",
      "Ilk gorusmeler mesaj uzerinden yapiliyor. Uygun gorulen kisilerle yuva kosullari ve teslim sureci detayli konusuluyor."
    ],
    trustNotes: [
      "Asi karti ve temel veteriner bilgisi mevcut.",
      "Sahiplendirme sureci kontrollu gorusmelerle ilerliyor.",
      "Fotograflar ve karakter notlari duzenli paylasiliyor."
    ],
    similarIds: ["cm-4", "cm-3"]
  },
  {
    id: "cm-3",
    title: "Mahalle kedileri icin kuru mama paylasimi",
    categoryKey: "ucretsiz-mama",
    category: "Ucretsiz mama",
    city: "Izmir",
    district: "Bornova",
    summary: "Duzenli besleme noktasi icin paketli mama destegi bekleniyor.",
    status: "Mesaja acik",
    author: "Sokak Dostlari Ekibi",
    authorRole: "Mahalle dayanismasi",
    dateLabel: "2 gun once",
    imageUri: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80",
    visualLabel: "Acik besleme noktasi",
    supportWindow: "Hafta ici teslim alinabilir",
    quickActionLabel: "Destek Ol",
    trustState: "pending" as const,
    trustLabel: "Yeni topluluk paylasimi",
    description: [
      "Mahallede sabit iki besleme noktasi icin duzenli mama destegi araniyor. Paketli kuru mama tercih ediliyor ve haftalik planlama yapiliyor.",
      "Teslim alinacak urunler onceden mesajlasma ile netlestiriliyor. Ihtiyac dengeli ilerledigi icin parcali destek de kabul ediliyor."
    ],
    trustNotes: [
      "Teslimat sorumlusu bilgisi mevcut.",
      "Yeni acilan bir paylasim oldugu icin topluluk geri bildirimi toplanmaya devam ediyor.",
      "Ihtiyac durumu haftalik guncelleniyor."
    ],
    similarIds: ["cm-1", "cm-4"]
  },
  {
    id: "cm-4",
    title: "Sakin bir ev arayan yetiskin kopek",
    categoryKey: "sahiplendirme",
    category: "Sahiplendirme",
    city: "Ankara",
    district: "Cankaya",
    summary: "Ev ortamina uyumlu, temel egitimi olan kopek icin kalici yuva araniyor.",
    status: "Degerlendirme suruyor",
    author: "Mina Kose",
    authorRole: "Koruyucu aile",
    dateLabel: "3 gun once",
    imageUri: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    visualLabel: "Ev uyumlu profil",
    supportWindow: "Bu ay icinde teslim planlanabilir",
    quickActionLabel: "Basvur",
    trustState: "verified" as const,
    trustLabel: "Karakter notlari detayli paylasildi",
    description: [
      "Yetiskin kopek ev hayatina uyumlu, temel komutlari biliyor ve insanlarla iletisimi sakin. Yogun olmayan, stabil bir ev ortami hedefleniyor.",
      "Gorusmeler once mesaj ile basliyor, uygun durumda tanisma randevusu ayarlaniyor. Ev kosullari ve zaman plani onceden konusuluyor."
    ],
    trustNotes: [
      "Temel egitim ve rutin notlari paylasildi.",
      "Koruyucu aile aktif geri donus sagliyor.",
      "Eslesme surecinde kontrollu ilerleniyor."
    ],
    similarIds: ["cm-2", "cm-1"]
  },
  {
    id: "cm-5",
    title: "Veteriner sonrasi gecici tasima destegi",
    categoryKey: "diger",
    category: "Diger",
    city: "Bursa",
    district: "Nilufer",
    summary: "Kisa sureli tasima ve refakat destegi araniyor.",
    status: "Bugun oncelikli",
    author: "Pelin Yildiz",
    authorRole: "Topluluk cagrisi",
    dateLabel: "Bugun",
    imageUri: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
    visualLabel: "Kisa sureli destek",
    supportWindow: "Aksam saatlerine kadar",
    quickActionLabel: "Mesaj Gonder",
    trustState: "pending" as const,
    trustLabel: "Hizli yardim cagrisi",
    description: [
      "Veteriner cikisi sonrasinda hayvani guvenli sekilde eve ulastirmak icin kisa sureli refakat destegi aranıyor.",
      "Konum ve saat bilgisi net oldugu icin hizli mesajlasma ile plan yapmak oncelikli."
    ],
    trustNotes: [
      "Saat ve konum bilgisi net girildi.",
      "Hizli organize olunmasi gereken bir yardim talebi.",
      "Mesajlasma ile detaylar aninda paylasiliyor."
    ],
    similarIds: ["cm-3", "cm-1"]
  }
];

export const petshopCampaigns = [
  {
    id: "ps-1",
    storeId: "store-1",
    title: "Premium mama bahar kampanyasi",
    city: "Istanbul",
    priceLabel: "799 TL",
    summary: "Yetiskin kedi mamalarinda kampanyali paketler ve ayni gun teslimat.",
    discount: "%20 indirim",
    storeName: "Pati Market",
    deadline: "3 gun kaldi",
    campaignLabel: "Bahar kampanyasi",
    visualLabel: "Kedi + kopek mama serisi"
  },
  {
    id: "ps-2",
    storeId: "store-2",
    title: "Tasma ve oyuncak seti",
    city: "Ankara",
    priceLabel: "549 TL",
    summary: "Kopekler icin kampanyali aksesuar paketi, stoklarla sinirli.",
    discount: "%15 indirim",
    storeName: "Miyav Store",
    deadline: "Hafta sonuna kadar",
    campaignLabel: "Yeni sezon",
    visualLabel: "Aksesuar seckisi"
  },
  {
    id: "ps-3",
    storeId: "store-3",
    title: "Mini irk kuru mama paketi",
    city: "Izmir",
    priceLabel: "459 TL",
    summary: "Mini irk kopekler icin ozel formullu mama paketinde stok temizleme kampanyasi.",
    discount: "%10 indirim",
    storeName: "Dost Petshop",
    deadline: "Son 48 saat",
    campaignLabel: "Stok firsati",
    visualLabel: "Mini irk secimi"
  }
];

