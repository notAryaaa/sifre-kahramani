# Setting up results storage (Google Sheets)

Players' names, game scores, times, and badges are saved to a private Google
Sheet in your Drive. Teachers view them at
`https://notaryaaa.github.io/sifre-kahramani/sonuclar/` behind a teacher
password. Nobody needs to open the sheet itself.

1. Create a new Google Sheet (e.g. "Şifre Kahramanı Sonuçları").
2. **Extensions → Apps Script.** Delete the sample code and paste in `Code.gs`.
3. Pick `setup` in the function dropdown and click **Run**. Approve the
   permissions prompt. This creates the **Sonuçlar** (raw data) and
   **Sıralama** (ranking) tabs.
4. Set the teacher password: in Apps Script, click **⚙ Project Settings →
   Script properties → Add script property**:
   - Property: `TEACHER_PASSWORD`
   - Value: a password only teachers know (at least 10 characters; it's a
     password site, so practise what we preach!)
5. **Deploy → New deployment →** type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   Copy the web app URL (ends in `/exec`).
6. In the GitHub repo: **Settings → Secrets and variables → Actions →
   Variables → New repository variable**, name `RESULTS_URL`, value = the URL.
   Then re-run the deploy workflow (or push to `main`).

## Who can see what

- Players can only **add** their own result. They can't read anyone else's.
- The results page returns data only when the teacher password matches.
  Google checks the password, so it never appears in the website's code.
- Wrong passwords are slowed down to make guessing impractical.

To change the password, edit the script property; no redeploy needed.

If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit →
New version** so the URL stays the same.

For local testing, put `NEXT_PUBLIC_RESULTS_URL=<url>` in `.env.local`.
