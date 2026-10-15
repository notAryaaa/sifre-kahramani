import type { StrengthTier } from "@/lib/passwordAnalysis";

export interface Badge {
  title: string;
  message: string;
}

export const BADGES: Record<StrengthTier, Badge> = {
  "cok-zayif": {
    title: "Kalkan Adayı",
    message: "Her kahraman bir yerden başlar! Şifreni uzatıp tahmin edilemez kelimeler ekleyerek rozetini yükselt.",
  },
  zayif: {
    title: "Bronz Kalkan",
    message: "İyi bir adım! Biraz daha uzun ve kişisel bilgi içermeyen bir şifreyle bir üst rozete ulaşabilirsin.",
  },
  orta: {
    title: "Gümüş Kalkan",
    message: "Fena değil! Birkaç rastgele kelime daha eklersen şifren çok daha dayanıklı olur.",
  },
  iyi: {
    title: "Altın Kalkan",
    message: "Harika bir şifre! Elmas Kalkan'a sadece bir adım kaldı.",
  },
  "cok-guclu": {
    title: "Elmas Kalkan",
    message: "Efsane! Gerçek bir Şifre Kahramanısın. Bu bilgiyi ailen ve arkadaşlarınla da paylaş!",
  },
};
