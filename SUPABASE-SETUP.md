# Turn on the shared wall (free) — Supabase

This makes the notes and candles **shared across everyone** who visits the site. It's free, takes
about 5 minutes, and the code is already built into `index.html` — you just create a project,
paste two values, and run one SQL snippet. Do this **before** you upload to GoDaddy.

---

## Step 1 — Create a free Supabase project
1. Go to **https://supabase.com** → sign in (GitHub or email) → **New project**.
2. Give it a name (e.g. `jesus-loves-you`), set a database password, pick the closest region.
3. Wait ~2 minutes for it to finish setting up.

## Step 2 — Copy your two keys
1. In the project: **Settings (gear) → API**.
2. Copy these two values:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - **anon public** key (a long string — this one is safe to put in a public web page)

## Step 3 — Paste them into index.html
Near the top of the `<script>` in `index.html`, fill in:
```js
const SUPA = { url: "https://abcdxyz.supabase.co", key: "YOUR-ANON-PUBLIC-KEY" };
```
Save the file. (That's the only code change you make.)

## Step 4 — Create the tables (one click)
1. In Supabase: **SQL Editor → New query**.
2. Paste **everything** below and click **Run**:

```sql
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(text) between 1 and 600),
  author text check (char_length(author) <= 80),
  tag text check (char_length(tag) <= 20),
  created_at timestamptz default now()
);
create table if not exists public.candles (
  id uuid primary key default gen_random_uuid(),
  name text check (char_length(name) <= 80),
  type text check (char_length(type) <= 20),
  intention text check (char_length(intention) <= 600),
  created_at timestamptz default now()
);

alter table public.notes  enable row level security;
alter table public.candles enable row level security;

create policy "public read notes"    on public.notes   for select using (true);
create policy "public insert notes"   on public.notes   for insert with check (true);
create policy "public read candles"  on public.candles for select using (true);
create policy "public insert candles" on public.candles for insert with check (true);

-- a few notes so the wall isn't empty on launch day
insert into public.notes (text, author, tag) values
('Thank You, Lord, for another sunrise and a quiet house before the day begins.','Ruth K.','Gratitude'),
('Praying for Mom''s surgery on Thursday. Peace over fear, in Jesus'' name.','Dani','Prayer'),
('He did it again. The job came through right when we''d run out of options.','Samuel O.','Praise'),
('Found the exact verse I needed the very morning I needed it.','Aimee','Hope');

insert into public.candles (name, type, intention) values
('Grace','Prayer','For everyone who feels alone tonight.'),
('Lydia','Praise','He answered — the surgery went well!'),
('','Gratitude','Thank You for our healthy baby.');
```

## Step 5 — Upload and go live
Upload the edited `index.html` to GoDaddy (see `PUBLISH-GoDaddy.md`). Open the site on your phone
and your computer — pin a note on one, refresh the other, and you'll see the **same** wall. 🎉

---

### Good to know
- The **anon public** key is meant to be visible in a web page — access is controlled by the
  rules in the SQL above. Those rules allow anyone to **read** the wall and **add** a note or
  candle, but **not** edit or delete other people's — exactly what a public prayer wall wants.
- If the site can't reach the database for any reason, it quietly falls back to the visitor's own
  browser so it never looks broken.
- Free tier is generous (plenty for a community wall). If it ever grows huge, Supabase will email
  you about upgrading — no surprise charges.
- Want to guard against spam later? I can add a simple rate-limit or a gentle word filter — just ask.
