# Make Finance private — Google sign-in + a database that refuses everyone else

The Finance page is public HTML: anyone can fetch it and read its code. That is fine, and normal.
What must never be reachable is your **data** — and that is protected by a rule inside the database,
not by anything in the page. The login screen is the door. The database policy is the lock.

About 25 minutes, once. You need three browser tabs: Supabase, Google Cloud, and cPanel.

> Until you finish Step 7, the page shows the login screen and says private mode is not configured.
> Nothing is broken — it is refusing to open, which is the correct behaviour.

---

## Step 1 — Create the Supabase project
1. Go to **https://supabase.com** → sign in → **New project**.
2. Name it `finance`, set a database password (save it in your password manager — you will not need
   it again for this), pick the region closest to you.
3. Wait about two minutes.

## Step 2 — Copy your two public values
1. In the project: **Settings (gear) → API**.
2. Copy **Project URL** — looks like `https://abcdefgh.supabase.co`
3. Copy the **anon public** key — a long string.

Both are safe in a public page. The anon key grants nothing on its own: every table denies by
default, and the policies you install in Step 5 only ever return rows belonging to the signed-in
user. **Never** copy the `service_role` key — that one bypasses every rule. It stays in Supabase.

## Step 3 — Create the Google sign-in credentials
1. Go to **https://console.cloud.google.com** → create a project (any name, e.g. `jesus-loves-you`).
2. **APIs & Services → OAuth consent screen**:
   - User type **External** → Create.
   - App name: `Finance`. User support email: yours. Developer contact: yours. → Save and continue.
   - Scopes: skip → Save and continue.
   - Test users: **add your own Google address** → Save and continue.
   - You may leave the app in **Testing**. That is an advantage: only the test users you list can
     even complete Google sign-in.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**. Name: `Finance web`.
   - **Authorised JavaScript origins** → Add: `https://jesus-lovesyou.ca`
   - **Authorised redirect URIs** → Add: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
     (take the host from your Project URL in Step 2)
   - Create. Copy the **Client ID** and **Client secret**.

## Step 4 — Give Google to Supabase
1. Supabase → **Authentication → Providers → Google** → enable it.
2. Paste the **Client ID** and **Client secret** from Step 3. Save.
   The secret lives here, in Supabase. It must never go into the repository or the page.
3. Supabase → **Authentication → URL Configuration**:
   - **Site URL**: `https://jesus-lovesyou.ca/finance.html`
   - **Redirect URLs** → add the same: `https://jesus-lovesyou.ca/finance.html`

## Step 5 — Install the lock
1. Supabase → **SQL Editor → New query**.
2. Open `finance-schema.sql` from this repository, paste **everything** in, press **Run**.
3. You should see "Success". This creates two tables and the policies that do the actual protecting.

## Step 6 — Check the tables are closed
Still in the SQL editor, run:
```sql
select tablename, rowsecurity from pg_tables
where schemaname = 'public' and tablename in ('finance_plan','app_access');
```
Both rows must show `rowsecurity = true`. If either says false, stop — do not upload the page yet.

## Step 7 — Put your two public values into the page
Open `finance.html` and find, near the top:
```js
window.FINANCE_CONFIG = {
  supabaseUrl:     "",
  supabaseAnonKey: ""
};
```
Paste the two values from Step 2 between the quotes. Save.

## Step 8 — Upload
cPanel → **File Manager** → `public_html` → upload `finance.html` (overwrite the old one).

## Step 9 — Sign in once, then authorise yourself
1. Open `https://jesus-lovesyou.ca/finance.html` → **Continue with Google** → sign in.
2. You will land on **"This Finance space is private."** That is correct: you have authenticated,
   but nobody is authorised yet.
3. Supabase → **SQL Editor**, and run this with your own address:
```sql
insert into public.app_access (user_id, role)
select id, 'owner' from auth.users where email = 'your.address@gmail.com'
on conflict (user_id) do nothing;

select a.role, u.email from public.app_access a join auth.users u on u.id = a.user_id;
```
   The second statement should return exactly one row — you.
4. Reload the Finance page. It opens.

## Step 10 — Keep it out of search results
In cPanel, edit `public_html/robots.txt` (create it if missing) and add:
```
User-agent: *
Disallow: /finance.html
```
The page also sends `noindex, nofollow`. Neither is security — they are politeness to crawlers.
The lock is Step 5.

## Step 11 — HTTPS
cPanel → **SSL/TLS Status** → make sure AutoSSL covers the domain, and that
`https://jesus-lovesyou.ca` loads with a padlock. Google sign-in will refuse plain http anyway.

---

# The twelve tests

Run these before you trust it with anything real. Tests 5 and 6 are the ones that actually matter —
they check the lock rather than the door.

| # | Do this | Expect |
|---|---|---|
| 1 | Open `/finance.html` signed out | Login screen only. No figures. |
| 2 | Sign in with a different Google account | "This Finance space is private." Nothing else. |
| 3 | Sign in with your account | Finance opens with your plan. |
| 4 | Refresh the page | Still signed in, no second login. |
| 5 | Signed out, run the `anon` snippet at the bottom of `finance-schema.sql` | 0 rows, or an error. |
| 6 | Run the "stranger UID" snippet at the bottom of `finance-schema.sql` | `0` — this is the real proof. |
| 7 | Sign out | Figures disappear at once. |
| 8 | DevTools → Network, load the page signed out | No request for `finance_plan` at all. |
| 9 | `git log -p \| grep -i salary` in the repo | Nothing. No plan file, no T4. |
| 10 | Open the page in a private window | Login required. |
| 11 | Sign out, then press Back | Login screen, not your data. |
| 12 | In DevTools → Application → Local Storage, delete the auth entry, reload | Back to the login screen. |

**Test 8 in detail.** Open DevTools before loading the page, go to the Network tab, filter on
`supabase`. Signed out you should see no request to `finance_plan` whatsoever — not a failed one, not
an empty one. The app does not ask for the plan until it has both a session and an `app_access` row.

---

# If something goes wrong

**"This Finance space is private" and you are sure it is you.** The `app_access` insert in Step 9
did not match. Run `select id, email from auth.users;` and insert by `id` directly.

**Locked out entirely.** Add `#local` to the URL — `finance.html#local` — and the page runs on this
device only, out of the database, exactly as it did before this change. Nothing in the cloud is
touched. It is not a way in to your data; it is an empty local app.

**Revoke access to yourself or anyone else.** One line:
```sql
delete from public.app_access where user_id = 'THE-UID';
```
The next request that account makes returns nothing.

**Someone got hold of the anon key.** It is public by design; it does not matter. What matters is the
`service_role` key and your Google client secret — if either of those ever leaks, rotate it in
Supabase and Google Cloud immediately.

---

# What is deliberately not built

**Document upload (T4, payslips).** The Pad has a place to type T4 figures in by hand and says
plainly that reading the slip itself is not built. Storing a tax document properly needs private
authenticated storage with its own access rules; until that exists, no file is uploaded anywhere.
Do not put a T4 in `public_html`.

**Multi-user.** The schema is already per-user — every row is scoped to a UID and no policy can
return another person's row — but there is no sign-up flow. Adding someone is one `insert` into
`app_access`, deliberately manual.

**A server of your own.** Everything above works on plain static hosting because the enforcement
happens in Postgres. If you ever move to a host that can run code, nothing here needs to change.
