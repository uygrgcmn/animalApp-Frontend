export const caregiverListings = [
  {
    id: "cg-1",
    avatarLabel: "DA",
    caretakerName: "Derya Acar",
    title: "Deneyimli evde bakıcı",
    city: "Istanbul",
    schedule: "Hafta içi yarım gün",
    summary: "Kedi ve köpek bakımında deneyimli profil ilanı. Asılı takip ve günlük raporlama sunuyor.",
    budget: "5.000 - 7.500 TL",
    badge: "Güvenilir profil",
    availability: "Hafta içi",
    verificationState: "verified" as const
  },
  {
    id: "cg-2",
    avatarLabel: "BT",
    caretakerName: "Baris Tan",
    title: "Yatılı bakım desteği",
    city: "Ankara",
    schedule: "Haftalık",
    summary: "Uzun süreli seyahatlerde yatılı bakım, ilaç takibi ve oyun rutini odaklı profil ilanı.",
    budget: "8.000 - 12.000 TL",
    badge: "Hızlı dönüş",
    availability: "Esnek",
    verificationState: "pending" as const
  },
  {
    id: "cg-3",
    avatarLabel: "SY",
    caretakerName: "Selin Yalcin",
    title: "Kedi odaklı günlük ziyaret",
    city: "Izmir",
    schedule: "Günlük kontrol",
    summary: "Kediler için mama, su, kum takibi ve fotoğraf raporu sunan sakin bakım profili.",
    budget: "2.400 - 3.200 TL",
    badge: "Aynı gün dönüş",
    availability: "Hafta sonu",
    verificationState: "verified" as const
  }
];

export const ownerRequests = [
  {
    id: "ow-1",
    title: "Golden için hafta sonu bakıcı arıyorum",
    city: "Izmir",
    petType: "Köpek",
    dateLabel: "26-27 Nisan",
    schedule: "Cumartesi-Pazar",
    summary: "Enerjik köpeğim için gezdirme ve temel beslenme desteği arıyorum.",
    budget: "3.500 TL",
    distanceLabel: "2,4 km"
  },
  {
    id: "ow-2",
    title: "İki kediye günlük kontrol",
    city: "Bursa",
    petType: "Kedi",
    dateLabel: "10 günlük plan",
    schedule: "10 gün",
    summary: "Mama, su, kum temizliği ve kısa oyun seansları için destek ihtiyacı.",
    budget: "2.200 TL",
    distanceLabel: "5,1 km"
  },
  {
    id: "ow-3",
    title: "Muhabbet kuşu için günlük ziyaret",
    city: "Istanbul",
    petType: "Kuş",
    dateLabel: "Bu hafta",
    schedule: "5 gün",
    summary: "Sabah yem değişimi ve kısa kafes temizliği için deneyimli destek arıyorum.",
    budget: "1.200 TL",
    distanceLabel: "1,1 km"
  }
];

export const communityPosts = [
  {
    id: "cm-1",
    title: "Barınak için ücretsiz mama desteği",
    categoryKey: "ucretsiz-mama",
    category: "Ücretsiz mama",
    city: "Eskisehir",
    district: "Tepebaşı",
    summary: "Acil kuru mama ihtiyacı bulunan geçici bakım evi için destek çağrısı.",
    status: "Başvuruya açık",
    author: "Pati Dayanisma Agi",
    authorRole: "Gönüllü topluluk",
    dateLabel: "Bugun",
    imageUri: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=1200&q=80",
    visualLabel: "Mama destek noktası",
    supportWindow: "Bu hafta sonuna kadar",
    quickActionLabel: "Destek Ol",
    trustState: "verified" as const,
    trustLabel: "Topluluk tarafından doğrulandı",
    description: [
      "Geçici bakım evinde aynı anda birden fazla köpek ve kedi için destek veriliyor. Kuru mama stokları beklenenden hızlı tükendiği için kısa süreli ama acil bir destek çağrısı açıldı.",
      "Teslimat doğrudan topluluk sorumlusu ile koordine ediliyor. İstenirse mesaj üzerinden hangi ürünlerin daha öncelikli olduğu da paylaşılıyor."
    ],
    trustNotes: [
      "Teslim noktası ve iletişim bilgisi doğrulanmış.",
      "Daha önce aynı topluluk içinde tamamlanmış destek paylaşımları var.",
      "İhtiyaç listesi güncel tutuluyor."
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
    summary: "Aşıları tamamlanmış 6 aylık tekir için kalıcı yuva aranıyor.",
    status: "Görüşmeler sürüyor",
    author: "Gonul Aslan",
    authorRole: "Bireysel paylasim",
    dateLabel: "Dun",
    imageUri: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80",
    visualLabel: "Sakin ev ortamı",
    supportWindow: "Bu hafta görüşmeler açık",
    quickActionLabel: "Başvur",
    trustState: "verified" as const,
    trustLabel: "Aşı ve temel sağlık bilgileri paylaşıldı",
    description: [
      "6 aylık tekir, ev ortamına alışık ve insanla iletişimi güçlü. Kalıcı yuva arayışında sakin, güvenli ve uzun vadeli bir eşleşme hedefleniyor.",
      "İlk görüşmeler mesaj üzerinden yapılıyor. Uygun görülen kişilerle yuva koşulları ve teslim süreci detaylı konuşuluyor."
    ],
    trustNotes: [
      "Aşı kartı ve temel veteriner bilgisi mevcut.",
      "Sahiplendirme süreci kontrollü görüşmelerle ilerliyor.",
      "Fotoğraflar ve karakter notları düzenli paylaşılıyor."
    ],
    similarIds: ["cm-4", "cm-3"]
  },
  {
    id: "cm-3",
    title: "Mahalle kedileri için kuru mama paylaşımı",
    categoryKey: "ucretsiz-mama",
    category: "Ücretsiz mama",
    city: "Izmir",
    district: "Bornova",
    summary: "Düzenli besleme noktası için paketli mama desteği bekleniyor.",
    status: "Mesaja açık",
    author: "Sokak Dostlari Ekibi",
    authorRole: "Mahalle dayanışması",
    dateLabel: "2 gün önce",
    imageUri: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80",
    visualLabel: "Açık besleme noktası",
    supportWindow: "Hafta içi teslim alınabilir",
    quickActionLabel: "Destek Ol",
    trustState: "pending" as const,
    trustLabel: "Yeni topluluk paylasimi",
    description: [
      "Mahallede sabit iki besleme noktası için düzenli mama desteği aranıyor. Paketli kuru mama tercih ediliyor ve haftalık planlama yapılıyor.",
      "Teslim alınacak ürünler önceden mesajlaşma ile netleştiriliyor. İhtiyaç dengeli ilerlediği için parçalı destek de kabul ediliyor."
    ],
    trustNotes: [
      "Teslimat sorumlusu bilgisi mevcut.",
      "Yeni açılan bir paylaşım olduğu için topluluk geri bildirimi toplanmaya devam ediyor.",
      "İhtiyaç durumu haftalık güncelleniyor."
    ],
    similarIds: ["cm-1", "cm-4"]
  },
  {
    id: "cm-4",
    title: "Sakin bir ev arayan yetişkin köpek",
    categoryKey: "sahiplendirme",
    category: "Sahiplendirme",
    city: "Ankara",
    district: "Cankaya",
    summary: "Ev ortamına uyumlu, temel eğitimi olan köpek için kalıcı yuva aranıyor.",
    status: "Değerlendirme sürüyor",
    author: "Mina Kose",
    authorRole: "Koruyucu aile",
    dateLabel: "3 gün önce",
    imageUri: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    visualLabel: "Ev uyumlu profil",
    supportWindow: "Bu ay içinde teslim planlanabilir",
    quickActionLabel: "Başvur",
    trustState: "verified" as const,
    trustLabel: "Karakter notlari detayli paylasildi",
    description: [
      "Yetişkin köpek ev hayatına uyumlu, temel komutları biliyor ve insanlarla iletişimi sakin. Yoğun olmayan, stabil bir ev ortamı hedefleniyor.",
      "Görüşmeler önce mesaj ile başlıyor, uygun durumda tanışma randevusu ayarlanıyor. Ev koşulları ve zaman planı önceden konuşuluyor."
    ],
    trustNotes: [
      "Temel eğitim ve rutin notları paylaşıldı.",
      "Koruyucu aile aktif geri dönüş sağlıyor.",
      "Eşleşme sürecinde kontrollü ilerleniyor."
    ],
    similarIds: ["cm-2", "cm-1"]
  },
  {
    id: "cm-5",
    title: "Veteriner sonrası geçici taşıma desteği",
    categoryKey: "diger",
    category: "Diğer",
    city: "Bursa",
    district: "Nilüfer",
    summary: "Kısa süreli taşıma ve refakat desteği aranıyor.",
    status: "Bugün öncelikli",
    author: "Pelin Yildiz",
    authorRole: "Topluluk çağrısı",
    dateLabel: "Bugun",
    imageUri: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
    visualLabel: "Kısa süreli destek",
    supportWindow: "Aksam saatlerine kadar",
    quickActionLabel: "Mesaj Gönder",
    trustState: "pending" as const,
    trustLabel: "Hızlı yardım çağrısı",
    description: [
      "Veteriner çıkışı sonrasında hayvanı güvenli şekilde eve ulaştırmak için kısa süreli refakat desteği aranıyor.",
      "Konum ve saat bilgisi net olduğu için hızlı mesajlaşma ile plan yapmak öncelikli."
    ],
    trustNotes: [
      "Saat ve konum bilgisi net girildi.",
      "Hızlı organize olunması gereken bir yardım talebi.",
      "Mesajlaşma ile detaylar anında paylaşılıyor."
    ],
    similarIds: ["cm-3", "cm-1"]
  }
];


