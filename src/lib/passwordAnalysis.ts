import { COMMON_PASSWORDS, COMMON_FIRST_NAMES } from "@/data/commonPasswords";

export type StrengthTier = "cok-zayif" | "zayif" | "orta" | "iyi" | "cok-guclu";

export interface PasswordAnalysis {
  password: string;
  length: number;
  score: number;
  tier: StrengthTier;
  tierLabel: string;
  hasLower: boolean;
  hasUpper: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  diversityCount: number;
  isCommon: boolean;
  weaknesses: string[];
  suggestions: string[];
  explanation: string;
  crackTimeText: string;
  crackSeconds: number;
}

const LOWER_RE = /[a-zçğıöşü]/;
const UPPER_RE = /[A-ZÇĞİÖŞÜ]/;
const DIGIT_RE = /[0-9]/;
const SYMBOL_RE = /[^a-zA-ZçğıöşüÇĞİÖŞÜ0-9]/;
const YEAR_RE = /(19|20)\d{2}/;

const KEYBOARD_RUNS = [
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];

function hasSequentialRun(pw: string): boolean {
  const lower = pw.toLowerCase();
  for (const run of KEYBOARD_RUNS) {
    for (let i = 0; i <= run.length - 4; i++) {
      const chunk = run.slice(i, i + 4);
      const reversed = chunk.split("").reverse().join("");
      if (lower.includes(chunk) || lower.includes(reversed)) return true;
    }
  }
  return false;
}

function hasRepeatedChar(pw: string): boolean {
  return /(.)\1\1/.test(pw);
}

function hasRepeatingBlock(pw: string): boolean {
  const n = pw.length;
  for (let blockLen = 1; blockLen <= Math.floor(n / 2); blockLen++) {
    if (n % blockLen !== 0) continue;
    const block = pw.slice(0, blockLen);
    let repeated = true;
    for (let i = blockLen; i < n; i += blockLen) {
      if (pw.slice(i, i + blockLen) !== block) {
        repeated = false;
        break;
      }
    }
    if (repeated && n / blockLen >= 2) return true;
  }
  return false;
}

function isCommonPassword(pw: string): boolean {
  const lower = pw.toLowerCase();
  return COMMON_PASSWORDS.some((c) => lower === c || lower.includes(c));
}

function findCommonName(pw: string): string | null {
  const lower = pw.toLowerCase();
  return COMMON_FIRST_NAMES.find((name) => lower.includes(name)) ?? null;
}

function tierFromScore(score: number): { tier: StrengthTier; label: string } {
  if (score < 20) return { tier: "cok-zayif", label: "Çok Zayıf" };
  if (score < 40) return { tier: "zayif", label: "Zayıf" };
  if (score < 65) return { tier: "orta", label: "Orta" };
  if (score < 85) return { tier: "iyi", label: "İyi" };
  return { tier: "cok-guclu", label: "Çok Güçlü" };
}

function formatCrackTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 1) return "1 saniyeden az";
  const MIN = 60;
  const HOUR = 3600;
  const DAY = 86400;
  const MONTH = 2592000;
  const YEAR = 31536000;

  if (seconds < MIN) return `${Math.round(seconds)} saniye`;
  if (seconds < HOUR) return `${Math.round(seconds / MIN)} dakika`;
  if (seconds < DAY) return `${Math.round(seconds / HOUR)} saat`;
  if (seconds < MONTH) return `${Math.round(seconds / DAY)} gün`;
  if (seconds < YEAR) return `${Math.round(seconds / MONTH)} ay`;

  const years = seconds / YEAR;
  if (years > 1e12) return "Trilyonlarca yıl (pratikte kırılamaz)";
  if (years > 1e9) return `${Math.round(years / 1e9)} milyar yıl`;
  if (years > 1e6) return `${Math.round(years / 1e6)} milyon yıl`;
  if (years > 1000) return `${Math.round(years / 1000)} bin yıl`;
  return `${Math.round(years)} yıl`;
}

const GUESSES_PER_SECOND = 1e10;

export function analyzePassword(password: string): PasswordAnalysis {
  const length = password.length;
  const hasLower = LOWER_RE.test(password);
  const hasUpper = UPPER_RE.test(password);
  const hasDigit = DIGIT_RE.test(password);
  const hasSymbol = SYMBOL_RE.test(password);
  const diversityCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;

  let charsetSize = 0;
  if (hasLower) charsetSize += 29;
  if (hasUpper) charsetSize += 29;
  if (hasDigit) charsetSize += 10;
  if (hasSymbol) charsetSize += 33;
  if (charsetSize === 0) charsetSize = 2;

  let entropy = length > 0 ? length * Math.log2(charsetSize) : 0;

  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  const common = isCommonPassword(password);
  const commonName = findCommonName(password);
  const hasYear = YEAR_RE.test(password);
  const sequential = hasSequentialRun(password);
  const repeated = hasRepeatedChar(password) || hasRepeatingBlock(password);
  const onlyDigits = hasDigit && !hasLower && !hasUpper && !hasSymbol;
  const onlyLetters = (hasLower || hasUpper) && !hasDigit && !hasSymbol;

  if (length > 0 && length < 8) {
    entropy = Math.min(entropy, 28);
    weaknesses.push("Şifre çok kısa; 8 karakterin altındaki şifreler çok hızlı denenebilir.");
    suggestions.push("Şifreni en az 12 karaktere çıkar; her ek karakter kırılma süresini katlayarak uzatır.");
  } else if (length > 0 && length < 12) {
    suggestions.push("Şifreni 12 karakter veya daha uzun yapmayı dene.");
  }

  if (common) {
    entropy = Math.min(entropy, 10);
    weaknesses.push("Bu şifre, saldırganların deneme listelerinde ilk sıralarda yer alan, dünyada en çok kullanılan şifrelerden biri.");
    suggestions.push("Bu şifreyi hemen değiştir; çok yaygın kullanılıyor ve ilk denenen şifreler arasında.");
  }

  if (commonName) {
    entropy *= 0.6;
    weaknesses.push("İçinde yaygın bir isim var; isimler tahmin edilmesi en kolay bilgilerden biridir.");
    suggestions.push("Adını, soyadını veya yakınlarının adını şifrene ekleme.");
  }

  if (hasYear) {
    entropy *= commonName ? 0.9 : 0.85;
    if (!commonName) {
      weaknesses.push("İçinde bir yıl var; doğum yılları ve güncel yıllar kolayca denenir.");
    }
    suggestions.push("Doğum yılın gibi tahmin edilebilir sayıları şifrene ekleme.");
  }

  if (sequential) {
    entropy *= 0.5;
    weaknesses.push("1234 veya qwerty gibi sıralı ya da klavyede yan yana duran karakterler kullanılmış.");
    suggestions.push("1234 veya qwerty gibi sıralı/klavye desenlerinden kaçın.");
  }

  if (repeated) {
    entropy *= 0.5;
    weaknesses.push("Aynı karakter veya aynı kalıp art arda tekrar ediyor (örn. aaa, 1212).");
    suggestions.push("aaa veya 1212 gibi tekrar eden karakter dizilerinden kaçın.");
  }

  if (onlyDigits) {
    entropy = Math.min(entropy, 24);
    weaknesses.push("Şifre sadece sayılardan oluşuyor, bu da olası kombinasyon sayısını büyük ölçüde azaltıyor.");
  } else if (onlyLetters && length < 14) {
    weaknesses.push("Şifre sadece harflerden oluşuyor; rakam ve sembol eklemek olasılıkları artırır.");
  }

  if (!hasUpper && length > 0) suggestions.push("Büyük harf ekle (örn: A, B, C).");
  if (!hasLower && length > 0) suggestions.push("Küçük harf ekle (örn: a, b, c).");
  if (!hasDigit && length > 0) suggestions.push("Rakam ekle (örn: 4, 7, 9).");
  if (!hasSymbol && length > 0) suggestions.push("Sembol ekle (örn: !, ?, -, %).");

  entropy = Math.max(0, entropy);
  const score = length === 0 ? 0 : Math.max(0, Math.min(100, Math.round(entropy * 1.15)));
  const { tier, label } = tierFromScore(score);

  if (tier !== "cok-guclu" && length > 0) {
    suggestions.push(
      "Rastgele kelimeleri birleştirerek bir parola cümlesi dene: örneğin 'Turuncu-Kaplumbağa-Uçtu47!' gibi.",
    );
  }

  const uniqueSuggestions = Array.from(new Set(suggestions)).slice(0, 5);

  const crackSeconds = length === 0 ? 0 : Math.pow(2, entropy) / GUESSES_PER_SECOND / 2;
  const crackTimeText = length === 0 ? "—" : formatCrackTime(crackSeconds);

  let explanation: string;
  if (length === 0) {
    explanation = "Analiz görmek için yukarıya bir şifre yaz.";
  } else if (weaknesses.length > 0) {
    explanation = weaknesses.slice(0, 2).join(" ");
  } else if (tier === "cok-guclu") {
    explanation =
      "Bu şifre uzun, farklı karakter türleri içeriyor ve tahmin edilebilir bir kalıp taşımıyor; bu yüzden kırılması çok uzun zaman alır.";
  } else if (tier === "iyi") {
    explanation =
      "Bu şifre fena değil: belirgin bir zayıflık kalıbı yok, ama biraz daha uzatıp karakter çeşitliliğini artırarak daha da güçlendirebilirsin.";
  } else {
    explanation =
      "Bu şifre, karakter çeşitliliği ve uzunluk açısından geliştirilebilir; aşağıdaki önerilere göz at.";
  }

  return {
    password,
    length,
    score,
    tier,
    tierLabel: label,
    hasLower,
    hasUpper,
    hasDigit,
    hasSymbol,
    diversityCount,
    isCommon: common,
    weaknesses,
    suggestions: uniqueSuggestions,
    explanation,
    crackTimeText,
    crackSeconds,
  };
}
