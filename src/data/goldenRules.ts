import type { IconName } from "@/components/sifre/Icon";

export interface GoldenRule {
  icon: IconName;
  text: string;
}

export const GOLDEN_RULES: GoldenRule[] = [
  { icon: "ruler", text: "Uzun şifreler tercih et." },
  { icon: "grid", text: "Her hesap için farklı bir şifre kullan." },
  { icon: "idcard", text: "Kişisel bilgilerini şifrene ekleme." },
  { icon: "vault", text: "Güvenilir bir parola yöneticisi kullan." },
  { icon: "shieldcheck", text: "Mümkün olduğunda çok faktörlü kimlik doğrulamayı aç." },
];
