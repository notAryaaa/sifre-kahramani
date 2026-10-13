import type { IconName } from "@/components/sifre/Icon";

export interface LearnCard {
  id: string;
  icon: IconName;
  title: string;
  body: string;
  example: string;
}

export const LEARN_CARDS: LearnCard[] = [
  {
    id: "uzunluk",
    icon: "ruler",
    title: "Kısa şifreler neden kolay kırılır?",
    body: "Kısa bir şifrenin olası kombinasyon sayısı çok azdır. Bilgisayarlar saniyede milyarlarca kombinasyon deneyebilir; bu yüzden 4-6 karakterlik bir şifre genellikle çok kısa sürede bulunur.",
    example: "Örnek: \"12345\" birkaç saniyede denenebilir, ama 16 karakterlik bir parola cümlesi yüzyıllar sürebilir.",
  },
  {
    id: "kisisel-bilgi",
    icon: "idcard",
    title: "Adını, doğum yılını veya 123456 kullanmak neden riskli?",
    body: "Saldırganlar önce en yaygın şifreleri ve sosyal medyadan öğrenebilecekleri kişisel bilgileri dener. İsmin, doğum yılın ya da \"123456\" gibi klasikler bu listelerin en başında yer alır.",
    example: "Örnek: \"Ayşe1995\" gibi bir şifre, sosyal medya profilinden kolayca tahmin edilebilir.",
  },
  {
    id: "ayni-sifre",
    icon: "repeat",
    title: "Aynı şifreyi her yerde kullanmak neden tehlikeli?",
    body: "Bir sitede şifren çalınırsa, saldırganlar aynı şifreyi diğer tüm hesaplarında dener. Buna \"kimlik bilgisi doldurma\" denir ve tek bir sızıntı tüm hesaplarını tehlikeye atabilir.",
    example: "Örnek: Oyun hesabının şifresi sızarsa ve aynısını e-postanda da kullanıyorsan, e-postan da risk altına girer.",
  },
  {
    id: "farkli-sifre",
    icon: "grid",
    title: "Her hesap için neden farklı bir şifre gerekir?",
    body: "Farklı şifreler kullandığında, bir hesabın ele geçirilmesi diğerlerini etkilemez. Bu, evinin her kapısına aynı anahtarı takmamak gibidir.",
    example: "Örnek: Okul, e-posta ve oyun hesaplarının her biri için ayrı bir şifre belirle.",
  },
  {
    id: "parola-yoneticisi",
    icon: "vault",
    title: "Parola yöneticileri nasıl yardımcı olur?",
    body: "Bir parola yöneticisi, senin için uzun ve rastgele şifreler üretir, bunları güvenle saklar ve gerektiğinde otomatik doldurur. Tek bir güçlü ana şifreyi ezberlemen yeterlidir.",
    example: "Örnek: Onlarca farklı hesabın için onlarca farklı şifreyi tek tek ezberlemek zorunda kalmazsın.",
  },
  {
    id: "mfa",
    icon: "shieldcheck",
    title: "Çok faktörlü kimlik doğrulama (MFA) neden önemlidir?",
    body: "MFA, şifrenin yanında telefonuna gelen bir kod veya parmak izi gibi ikinci bir doğrulama ister. Şifren çalınsa bile saldırgan bu ikinci adımı geçemediği için hesabın korunur.",
    example: "Örnek: Şifreni bilen biri giriş yapmaya çalışsa da, telefonuna gelen tek seferlik kodu giremediği için içeri giremez.",
  },
  {
    id: "parola-cumlesi",
    icon: "puzzle",
    title: "Parola cümleleri neden hem akılda kalıcı hem de güçlüdür?",
    body: "Birbiriyle ilgisiz birkaç kelimeyi birleştirerek oluşturduğun bir parola cümlesi, hem senin için hatırlaması kolaydır hem de bilgisayarlar için tahmin etmesi çok zordur; çünkü hem uzundur hem de öngörülebilir bir kalıp taşımaz.",
    example: "Örnek: \"Turuncu-Kaplumbağa-Uçtu47!\" gibi bir cümle, \"Ahmet1990\" gibi bir şifreden kat kat güçlüdür.",
  },
];
