export interface GamePair {
  id: string;
  passwords: [string, string];
  saferIndex: 0 | 1;
  reason: string;
}

// Every pair is a trap: the weaker password looks strong (symbols, length, "random"
// characters) or both look alike and the difference is subtle. The game shuffles
// question order and which side each password appears on.
export const GAME_PAIRS: GamePair[] = [
  {
    id: "leet-tuzagi",
    passwords: ["P@ssw0rd2024!", "dolap-limon-bisiklet"],
    saferIndex: 1,
    reason:
      "\"P@ssw0rd2024!\" karmaşık görünüyor ama aslında \"password\" kelimesi; harfleri @ ve 0 ile değiştirmek saldırganların ilk denediği numaralardandır. \"dolap-limon-bisiklet\" ise birbiriyle ilgisiz üç kelimeden oluşan uzun bir parola cümlesi.",
  },
  {
    id: "takim-ve-yil",
    passwords: ["Galatasaray1905!", "kM7#pX2q!v"],
    saferIndex: 1,
    reason:
      "\"Galatasaray1905!\" 16 karakter ama bir takım adı ve kuruluş yılından oluşuyor; bu tür şifreler saldırı listelerinde hazır bekler. \"kM7#pX2q!v\" daha kısa olsa da tamamen rastgele, tahmin edilecek bir kalıbı yok.",
  },
  {
    id: "klavye-sutunu",
    passwords: ["1qaz2wsx3edc", "pazar-sabahi-mor-semsiye"],
    saferIndex: 1,
    reason:
      "\"1qaz2wsx3edc\" rastgele görünüyor ama klavyede yukarıdan aşağı inen sütunlar: 1-q-a-z, 2-w-s-x, 3-e-d-c. Klavye desenleri saldırganların bildiği bir hiledir. \"pazar-sabahi-mor-semsiye\" uzun ve öngörülemez.",
  },
  {
    id: "evcil-hayvan",
    passwords: ["Kedim.Pamuk.2019", "Tencere.Ufuk.Kaktus.38"],
    saferIndex: 1,
    reason:
      "\"Kedim.Pamuk.2019\" kedinin adı ve sahiplenme yılı; sosyal medyada paylaştığın bir fotoğraf bu şifreyi ele verebilir. \"Tencere.Ufuk.Kaktus.38\" seninle hiçbir bağlantısı olmayan kelimelerden oluşuyor.",
  },
  {
    id: "sembol-mu-uzunluk-mu",
    passwords: ["Tr!stanbul34", "gecebulutkalemsu"],
    saferIndex: 1,
    reason:
      "Sadece küçük harf olması \"gecebulutkalemsu\"yu zayıf göstermesin: 16 karakter ve dört ilgisiz kelime. \"Tr!stanbul34\" ise şehir adı ve plaka kodu; ! ile i'yi değiştirmek saldırganı durdurmaz. Uzunluk, sembolden daha önemlidir!",
  },
  {
    id: "sarki-sozu",
    passwords: ["H@yat1mBen1m", "lamba-ceviz-tren-karpuz"],
    saferIndex: 1,
    reason:
      "\"H@yat1mBen1m\" bilinen bir söz kalıbı (\"Hayatım benim\") ve harf-rakam değişimleri tahmin edilebilir. Saldırganlar şarkı sözü ve deyim listeleri de kullanır. \"lamba-ceviz-tren-karpuz\" rastgele kelimelerden oluşuyor.",
  },
  {
    id: "site-adi",
    passwords: ["Instagram_Ece2024", "Kuzgun!Simit*Bulut42"],
    saferIndex: 1,
    reason:
      "\"Instagram_Ece2024\" sitenin adı, senin adın ve yıl: biri bu kalıbı çözerse diğer hesaplarındaki şifreleri de tahmin eder (Twitter_Ece2024...). \"Kuzgun!Simit*Bulut42\" hiçbir siteye ya da kişiye bağlı değil.",
  },
  {
    id: "tekrar-eden-kelime",
    passwords: ["deniz-deniz-deniz-deniz", "deniz-kirpi-mantar-ayna"],
    saferIndex: 1,
    reason:
      "İkisi de aynı uzunlukta parola cümlesi gibi duruyor, ama \"deniz-deniz-deniz-deniz\" aslında tek bir kelime. Tekrar, uzunluğun sağladığı gücü sıfırlar. \"deniz-kirpi-mantar-ayna\" dört farklı kelimeden oluşuyor.",
  },
  {
    id: "unlu-isim",
    passwords: ["Mustafa.Kemal.1881", "Sarı.Fil.Uçar.1881"],
    saferIndex: 1,
    reason:
      "Yapıları neredeyse aynı! Ama \"Mustafa.Kemal.1881\" herkesin bildiği bir isim ve tarih; saldırgan listelerinde ünlü isimler ve tarihler ilk sıralarda yer alır. \"Sarı.Fil.Uçar.1881\" anlamsız, rastgele bir cümle.",
  },
  {
    id: "tekrar-eden-blok",
    passwords: ["aZ9!aZ9!aZ9!", "aZ9!kP4@rT7#"],
    saferIndex: 1,
    reason:
      "İki şifre de aynı karakter türlerini kullanıyor ve 12 karakter. Fark şu: \"aZ9!aZ9!aZ9!\" aynı dört karakteri üç kez tekrar ediyor, yani gerçekte sadece 4 karakter kadar güçlü. \"aZ9!kP4@rT7#\" baştan sona rastgele.",
  },
];
