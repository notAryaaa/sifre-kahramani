// Şifre Kahramanı — sonuç kaydı (Google Apps Script)
//
// Kurulum: google-apps-script/README.md dosyasına bak.

const RESULTS_SHEET = "Sonuçlar";
const RANKING_SHEET = "Sıralama";
const HEADERS = ["Tarih", "Kimlik", "Ad", "Soyad", "Doğru", "Toplam", "Süre (sn)", "Rozet"];
const BADGE_COLUMN = HEADERS.indexOf("Rozet") + 1;

// Run once from the editor to create both tabs.
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let results = ss.getSheetByName(RESULTS_SHEET);
  if (!results) results = ss.insertSheet(RESULTS_SHEET);
  results.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
  results.setFrozenRows(1);

  let ranking = ss.getSheetByName(RANKING_SHEET);
  if (!ranking) ranking = ss.insertSheet(RANKING_SHEET);
  ranking.clear();
  ranking
    .getRange(1, 1, 1, 6)
    .setValues([["Sıra", "Ad", "Soyad", "Doğru", "Süre (sn)", "Rozet"]])
    .setFontWeight("bold");
  ranking.setFrozenRows(1);
  // Most correct answers first, then fastest time.
  const col = (c) => "'" + RESULTS_SHEET + "'!" + c + "2:" + c;
  ranking
    .getRange("B2")
    .setFormula(
      "=IFERROR(SORT(FILTER({" +
        [col("C"), col("D"), col("E"), col("G"), col("H")].join(", ") +
        "}, " + col("B") + "<>\"\"), 3, FALSE, 4, TRUE), \"\")"
    );
  ranking.getRange("A2").setFormula('=ARRAYFORMULA(IF(B2:B<>"", ROW(B2:B)-1, ""))');
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RESULTS_SHEET);

    if (data.action === "game") {
      sheet.appendRow([
        new Date(),
        clean(data.id, 64),
        clean(data.firstName, 40),
        clean(data.lastName, 40),
        toNumber(data.correct),
        toNumber(data.total),
        toNumber(data.seconds),
        "",
      ]);
    } else if (data.action === "badge") {
      const id = clean(data.id, 64);
      const ids = sheet.getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
      for (let i = ids.length - 1; i >= 0; i--) {
        if (ids[i][0] === id) {
          sheet.getRange(i + 2, BADGE_COLUMN).setValue(clean(data.badge, 40));
          break;
        }
      }
    }
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}

// The results page (/sonuclar) reads everything through here. The password lives in
// Project Settings → Script properties as TEACHER_PASSWORD, so it is checked on
// Google's side and never appears in the website's code.
function doGet(e) {
  const expected = PropertiesService.getScriptProperties().getProperty("TEACHER_PASSWORD");
  const given = (e && e.parameter && e.parameter.key) || "";
  if (!expected) return json({ ok: false, error: "no-password-set" });
  if (given !== expected) {
    Utilities.sleep(1500); // slow down password guessing
    return json({ ok: false, error: "wrong-password" });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RESULTS_SHEET);
  const lastRow = sheet.getLastRow();
  const values = lastRow < 2 ? [] : sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const rows = values
    .filter((r) => r[1] !== "")
    .map((r) => ({
      date: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
      firstName: String(r[2]).replace(/^'/, ""),
      lastName: String(r[3]).replace(/^'/, ""),
      correct: Number(r[4]) || 0,
      total: Number(r[5]) || 0,
      seconds: Number(r[6]) || 0,
      badge: String(r[7] || ""),
    }));
  return json({ ok: true, rows: rows });
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// Trim, cap length, and stop names like "=HYPERLINK(...)" from running as formulas.
function clean(value, maxLength) {
  const text = String(value == null ? "" : value).trim().slice(0, maxLength);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function toNumber(value) {
  const n = Number(value);
  return isFinite(n) ? n : "";
}
