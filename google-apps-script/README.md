# Sonuç tablosu kurulumu (Google Sheets)

Players' names, game scores, times, and badges are saved to a private Google
Sheet. Only people you share the sheet with can see it.

1. Create a new Google Sheet (e.g. "Şifre Kahramanı Sonuçları").
2. **Extensions → Apps Script.** Delete the sample code and paste in `Code.gs`.
3. Pick `setup` in the function dropdown and click **Run**. Approve the
   permissions prompt. This creates two tabs:
   - **Sonuçlar**: one row per game (raw data)
   - **Sıralama**: everyone ranked by most correct answers, then fastest time
4. **Deploy → New deployment →** type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   Copy the web app URL (ends in `/exec`).
5. In the GitHub repo: **Settings → Secrets and variables → Actions →
   Variables → New repository variable**, name `RESULTS_URL`, value = the URL.
   Then re-run the deploy workflow (or push to `main`).
6. Share the Sheet (not the script) with your advisor.

"Anyone" access only lets visitors *add* rows through `doPost`. They can't
read the sheet.

For local testing, put `NEXT_PUBLIC_RESULTS_URL=<url>` in `.env.local`.

If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit →
New version** so the URL stays the same.
