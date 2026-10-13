export interface GamePair {
  id: string;
  passwords: [string, string];
  saferIndex: 0 | 1;
  reason: string;
}

export const GAME_PAIRS: GamePair[] = [
  {
    id: "isim-vs-cumle",
    passwords: ["Ali123456", "Mavi!Bulut-Kiraz-47"],
    saferIndex: 1,
    reason:
      "\"Mavi!Bulut-Kiraz-47\" çok daha güvenli: uzun, birbiriyle ilgisiz kelimelerden oluşuyor ve kişisel bilgi içermiyor. \"Ali123456\" ise bir isim ile ardışık sayılardan oluşuyor; bu yüzden saniyeler içinde tahmin edilebilir.",
  },
  {
    id: "klavye-deseni",
    passwords: ["qwerty123", "T9!kşL2@zpM"],
    saferIndex: 1,
    reason:
      "\"T9!kşL2@zpM\" rastgele karakterlerden oluşuyor ve tahmin edilecek bir kalıp taşımıyor. \"qwerty123\" ise klavyede yan yana duran tuşlardan oluştuğu için saldırı listelerinde ilk sıralarda yer alır.",
  },
  {
    id: "sembol-yaniltmaci",
    passwords: ["Qwerty!2023", "Turuncu-Kaplumbağa-Uçtu91"],
    saferIndex: 1,
    reason:
      "\"Qwerty!2023\" büyük harf, sembol ve rakam içerse de içindeki klavye deseni ve yıl bilgisi onu zayıflatır — sembol kullanmak tek başına bir şifreyi güvenli yapmaz! \"Turuncu-Kaplumbağa-Uçtu91\" uzun ve rastgele kelimelerden oluştuğu için çok daha güçlüdür.",
  },
  {
    id: "yaygin-kelime",
    passwords: ["istanbul", "7xK!dQ2#mN9"],
    saferIndex: 1,
    reason:
      "\"istanbul\" yaygın bir kelime olduğu için şifre kırma listelerinin başında bulunur. \"7xK!dQ2#mN9\" rastgele karakterlerden oluştuğu için tahmin edilmesi çok daha zordur.",
  },
  {
    id: "guncel-yil",
    passwords: ["Sevgilim2024", "Deniz-Yıldız-92!Kahve"],
    saferIndex: 1,
    reason:
      "\"Sevgilim2024\" kolay tahmin edilen bir kelime ile güncel bir yılın birleşimidir. \"Deniz-Yıldız-92!Kahve\" ise birbiriyle ilgisiz kelimelerden oluşan uzun bir parola cümlesi; hem hatırlaması kolaydır hem de kırılması çok uzun sürer.",
  },
  {
    id: "tekrar-eden-karakter",
    passwords: ["111111", "Kelebek7@Masa!19"],
    saferIndex: 1,
    reason:
      "\"111111\" tamamen aynı karakterin tekrarından oluşuyor; bu tür şifreler saniyeler içinde denenir. \"Kelebek7@Masa!19\" uzunluğu ve karakter çeşitliliğiyle çok daha dayanıklıdır.",
  },
  {
    id: "klasik-kalip",
    passwords: ["Password1!", "uzakYıldızKahve42"],
    saferIndex: 1,
    reason:
      "\"Password1!\" dünyada en çok kullanılan şifre kalıplarından biridir ve saldırı listelerinde üst sıralardadır. \"uzakYıldızKahve42\" yaygın olmayan bir kelime birleşimi ve uzunluğu sayesinde daha güvenlidir.",
  },
  {
    id: "isim-dogum-yili",
    passwords: ["Mehmet1988", "tavsan-gunes-78-deniz"],
    saferIndex: 1,
    reason:
      "\"Mehmet1988\" bir isim ve doğum yılından oluşuyor; bu bilgiler sosyal medyadan kolayca öğrenilebilir. \"tavsan-gunes-78-deniz\" kişisel bilgi içermeyen, rastgele seçilmiş kelimelerden oluşan bir parola cümlesidir.",
  },
];
