import { COMMON_PASSWORDS, COMMON_FIRST_NAMES, COMMON_WORDS } from "@/data/commonPasswords";

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
  // keyboard columns: 1qaz 2wsx 3edc ...
  "1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol0p",
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

const LEET: Record<string, string> = { "@": "a", "4": "a", "3": "e", "1": "i", "!": "i", "0": "o", $: "s", "5": "s", "7": "t" };

function lower(pw: string): string {
  // "İ".toLowerCase() leaves a combining dot behind; drop it so "İstanbul" matches "istanbul".
  return pw.toLowerCase().replace(/\u0307/g, "");
}

// P@ssw0rd -> password: attackers undo these swaps automatically.
function undoLeet(pw: string): string {
  return lower(pw).replace(/[@431!0$57]/g, (ch) => LEET[ch]);
}

function isCommonPassword(pw: string): { common: boolean; viaLeet: boolean } {
  const raw = lower(pw);
  if (COMMON_PASSWORDS.some((c) => raw.includes(c))) return { common: true, viaLeet: false };
  const unleeted = undoLeet(pw);
  return { common: COMMON_PASSWORDS.some((c) => unleeted.includes(c)), viaLeet: true };
}

// Whole words, split on non-letters and camelCase: "Kedim.Pamuk" / "KedimPamuk" -> kedim, pamuk.
function words(pw: string): string[] {
  return (pw.match(/[A-ZÇĞİIÖŞÜ]?[a-zçğıöşü]+|[A-ZÇĞİIÖŞÜ]+(?![a-zçğıöşü])/g) ?? []).map(lower);
}

function findKnownWords(tokens: string[]): string[] {
  const unique = Array.from(new Set(tokens));
  return unique.filter((w) => COMMON_FIRST_NAMES.includes(w) || COMMON_WORDS.includes(w));
}

function findRepeatedWords(tokens: string[]): string[] {
  return tokens.filter((w, i) => w.length >= 3 && tokens.indexOf(w) !== i);
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

  const bitsPerChar = Math.log2(charsetSize);
  const { common, viaLeet } = length > 0 ? isCommonPassword(password) : { common: false, viaLeet: false };
  const tokens = words(password);
  const knownWords = findKnownWords(tokens);
  const repeatedWords = findRepeatedWords(tokens);
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
    if (viaLeet) {
      weaknesses.push(
        "Harfleri @, 0, 1 veya ! ile değiştirmek işe yaramıyor: altında saldırı listelerinde bulunan yaygın bir kelime ya da şifre var.",
      );
    } else {
      weaknesses.push("Bu şifre, saldırganların deneme listelerinde ilk sıralarda yer alan, çok yaygın bir şifre ya da kelime içeriyor.");
    }
    suggestions.push("Bu şifreyi hemen değiştir; çok yaygın kullanılıyor ve ilk denenen şifreler arasında.");
  }

  // A known word is one guess from a list, not a string of random letters (~11 bits).
  for (const word of knownWords) {
    entropy -= Math.max(0, word.length * bitsPerChar - 11);
  }
  if (knownWords.length > 0) {
    weaknesses.push(
      "İçinde bir isim, evcil hayvan adı ya da site adı var; bu tür kişisel bilgiler tahmin edilmesi en kolay şeylerdir.",
    );
    suggestions.push("Adını, yakınlarının ya da evcil hayvanının adını şifrene ekleme.");
  }

  for (const word of repeatedWords) {
    entropy -= word.length * bitsPerChar;
  }
  if (repeatedWords.length > 0) {
    weaknesses.push("Aynı kelime birden fazla kez geçiyor; tekrar, uzunluğun sağladığı gücü yok eder.");
    suggestions.push("Parola cümlende birbirinden farklı kelimeler kullan.");
  }

  if (hasYear) {
    entropy -= Math.max(0, 4 * bitsPerChar - 7);
    weaknesses.push("İçinde bir yıl var; doğum yılları ve güncel yıllar kolayca denenir.");
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
