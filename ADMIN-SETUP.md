# JLU · Admin page — setup & security

The admin page (`admin.html`) lets you **govern** the wall (view, search, flag, delete notes &
candles, export a backup) and is **protected** by real security, not a fake password.

## Why this is secure
- The public site key in `admin.html` is the **publishable** key — safe to expose; it can only read
  and insert, never delete.
- **Deleting requires a real login** (Supabase Auth). Only you, signed in, can delete — enforced by
  the database, not the page. Even if someone opens `admin.html`, they can do nothing without your
  password.
- Optional second lock: a **cPanel directory password** on the `/admin` folder.
- 🚫 **Never** put the `service_role` / secret key in `admin.html` or any web page — it bypasses all
  security. The admin page does **not** use it, and neither should you.

---

## Step 1 — Create your admin login (Supabase)
1. Supabase dashboard → **Authentication → Users → Add user**.
2. Enter your email + a strong password. **Check “Auto Confirm User”** so you can sign in immediately.
3. (Recommended) **Turn off public sign-ups** so no one else can ever get an account:
   **Authentication → Sign In / Providers → Email →** disable **“Allow new users to sign up.”**
   With sign-ups off, your admin account is the *only* account that can exist → only you can delete.

## Step 2 — Allow the admin to moderate (run this SQL)
Supabase → **SQL Editor → New query** → paste → **Run**:
```sql
drop policy if exists "admin delete notes"   on public.notes;
drop policy if exists "admin update notes"   on public.notes;
drop policy if exists "admin delete candles" on public.candles;
drop policy if exists "admin update candles" on public.candles;

create policy "admin delete notes"   on public.notes   for delete to authenticated using (true);
create policy "admin update notes"   on public.notes   for update to authenticated using (true) with check (true);
create policy "admin delete candles" on public.candles for delete to authenticated using (true);
create policy "admin update candles" on public.candles for update to authenticated using (true) with check (true);
```
This grants delete/edit **only to a signed-in (authenticated) user** — i.e. you. The public site is
unaffected (it stays read + insert only). Safe to re-run.

## Step 3 — Upload the admin page (protected folder)
1. cPanel → **File Manager → `public_html`** → **+ Folder** → name it **`admin`**.
2. Go into `admin` → **Upload** `admin.html`.
3. **Lock the folder with a password (recommended):** cPanel → **Directory Privacy** → open
   `public_html/admin` → tick **“Password protect this directory”**, save → **create a user**
   (username + password). Now the browser asks for this password before the page even loads.
4. Your admin URL is: **https://jesus-lovesyou.life/admin/admin.html**
   *(Tip: rename `admin.html` to `index.html` inside the folder to use the cleaner
   **https://jesus-lovesyou.life/admin/**.)*

## Step 4 — Sign in and govern
Open the admin URL → (directory password if set) → sign in with your Supabase email + password.
You’ll see:
- **Stats:** notes, candles, new today, and how many “need a look.”
- **Notes / Candles tabs**, **search**, and a **“only ones that need a look”** filter (flags posts
  containing links or watch-list words).
- **Delete** (single or bulk, with confirmation) — reflects on the live wall immediately.
- **Export backup** — downloads all notes + candles as JSON. Do this regularly.

---

## Notes & troubleshooting
- **“permission denied for table …” when deleting** → Step 2 SQL hasn’t been run (or the policies
  were removed). Re-run it.
- **Can’t sign in / “Invalid API key”** → your project may still use the **legacy** key format. Open
  `admin.html`, and set `SUPABASE_KEY` to the **anon public** key from
  **Settings → API Keys → Legacy API Keys**, then re-upload.
- **Can’t sign in / “Email not confirmed”** → re-add the user with **Auto Confirm** checked.
- The admin page carries `noindex` so search engines won’t list it; the directory password keeps it
  private regardless.
- The admin page is completely separate from `index.html` — adding it does **not** change your live
  site.

## Future hardening (optional)
- Soft-hide instead of delete (add an `is_hidden` column + hide it on the public wall).
- A “settings” table so the public spam word-list is editable from admin (currently it’s in
  `index.html`).
- Per-action audit log. Ask and I’ll add these to the spec + build them.
