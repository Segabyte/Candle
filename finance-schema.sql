-- ============================================================================
-- Finance App — private schema and the policies that do the actual protecting.
--
-- Run this once in Supabase → SQL Editor → New query → Run.
-- Everything denies by default; the policies below only ever let a signed-in
-- user reach rows carrying their own user id. No application code is trusted.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Who is allowed into this Finance space at all.
--    One row per authorised person. There is no policy that lets the app
--    write to this table: rows are added here, by you, in the SQL editor.
-- ---------------------------------------------------------------------------
create table if not exists public.app_access (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'owner',
  created_at timestamptz not null default now()
);

alter table public.app_access enable row level security;

drop policy if exists "read own access row" on public.app_access;
create policy "read own access row"
  on public.app_access for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 2. The plan itself: one row per person, holding that person's whole plan.
--    Every policy is scoped to auth.uid(), and additionally requires an
--    app_access row, so a stray Google sign-up cannot store anything either.
-- ---------------------------------------------------------------------------
create table if not exists public.finance_plan (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  plan       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.finance_plan enable row level security;

drop policy if exists "read own plan"   on public.finance_plan;
drop policy if exists "insert own plan" on public.finance_plan;
drop policy if exists "update own plan" on public.finance_plan;
drop policy if exists "delete own plan" on public.finance_plan;

create policy "read own plan"
  on public.finance_plan for select
  using (auth.uid() = user_id
         and exists (select 1 from public.app_access a where a.user_id = auth.uid()));

create policy "insert own plan"
  on public.finance_plan for insert
  with check (auth.uid() = user_id
              and exists (select 1 from public.app_access a where a.user_id = auth.uid()));

create policy "update own plan"
  on public.finance_plan for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id
              and exists (select 1 from public.app_access a where a.user_id = auth.uid()));

create policy "delete own plan"
  on public.finance_plan for delete
  using (auth.uid() = user_id);

-- Belt and braces: the anonymous role has no business here at all.
revoke all on public.finance_plan, public.app_access from anon;

-- ---------------------------------------------------------------------------
-- 3. Provision yourself — run AFTER you have signed in once with Google,
--    so that your account exists. Put your own address in, run it, then
--    reload the Finance page.
-- ---------------------------------------------------------------------------
-- insert into public.app_access (user_id, role)
-- select id, 'owner' from auth.users where email = 'you@example.com'
-- on conflict (user_id) do nothing;

-- Check it took (should return exactly one row):
-- select a.user_id, a.role, u.email from public.app_access a join auth.users u on u.id = a.user_id;

-- ---------------------------------------------------------------------------
-- 4. Prove the lock holds — this is TEST 6, runnable right here.
--    Pretend to be a different signed-in account and try to read the plan.
--    Expected result: 0 rows. If it ever returns 1, stop and fix the policy.
-- ---------------------------------------------------------------------------
-- begin;
--   set local role authenticated;
--   set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000000","role":"authenticated"}';
--   select count(*) as rows_a_stranger_can_see from public.finance_plan;   -- expect 0
--   select count(*) as access_rows_visible     from public.app_access;     -- expect 0
-- rollback;

-- And as the anonymous role, the one the website itself uses before sign-in:
-- begin;
--   set local role anon;
--   select count(*) as rows_anon_can_see from public.finance_plan;         -- expect 0 or an error
-- rollback;
