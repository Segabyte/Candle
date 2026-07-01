# Feature Spec — Candle-Linked Focus Timer (for study & prayer)

**Feature ID:** CFT · **Target version:** JLU v1.2 · **Status:** 🟢 v1 DRAFT BUILT in `index.next.html` — awaiting your feedback (live site untouched)
**Related:** `FUNCTIONAL-SPEC.md` (will receive FR-CFT-# on approval), `ROADMAP.md` item 1.2a,
`ARCHITECTURE.md` (storage-adapter pattern to reuse).

> This document is filled in two passes:
> 1. **You** provide requirements in a functional format (below, section 4).
> 2. **I** turn them into numbered FR-CFT-# requirements, a UX flow, a data model, and acceptance
>    criteria — then build it in a **versioned copy** so the live site is unaffected until you approve.

---

## 1. Summary / intent
Let a visitor **light a candle and start a focused study/prayer session**. While the session runs,
the candle "burns" for that time; when the session ends, the candle gently completes. The goal is to
turn lighting a candle into a calming ritual that anchors focused study and prayer.

*(This is a first-draft understanding — your requirements in §4 are the source of truth.)*

## 2. Goals & non-goals
**Goals (draft):**
- A gentle, distraction-light way to time a study/prayer session tied to a candle.
- Fits the existing warm design and tone.
- No login required.

**Non-goals (draft — confirm):**
- No account/sync across devices in v1.2 (that's the v2 auth milestone).
- Not a full productivity suite — one calm timer, not task lists.

## 3. User stories (draft — refine in §4)
- As a student, I want to light a candle and start a 25/50-minute focus session so my prayer and
  study have a defined, calm container.
- As a visitor, I want to see the candle "burning" while I focus, and a gentle signal when time's up.

---

## 4. YOUR REQUIREMENTS (functional format) — *paste here*
> Give me whatever you have — bullet points, "as a user I want…", or a table. Helpful things to cover:
> - **Durations:** fixed presets (e.g. 25 / 50 min) and/or custom? default?
> - **Start flow:** does it reuse the "Light a candle" modal, or a new "Start a session" button?
>   Does starting a session also post a candle to the shared wall, or is it private/local only?
> - **During the session:** what does the user see? (a countdown, the candle burning down, a verse,
>   ambient/quiet mode, pause/stop?) Should other site interactions be dimmed ("focus mode")?
> - **End of session:** what happens? (a chime/gentle sound, a message, a verse, mark the candle
>   "completed", offer to start another, log a streak?)
> - **Persistence:** is anything saved? (a private study streak in the browser, total minutes,
>   sessions count) — local-only or shared?
> - **Break timer?** (e.g. 5-min break after 25) — yes/no.
> - **Sound:** on/off, which moments.
> - **Where it lives:** a new section on the page? a dedicated "focus" view? a nav link?
> - **Mobile behavior:** should it keep running if the screen sleeps / tab is backgrounded?

**Captured from your message (2026-06-30):**
- Add a **"God mode" toggle** to the page.
- When God mode is on, the page becomes a **study page with a study booth** — a quiet space where
  "you and God are there," so you're studying together.
- There is a **set of small toggles at the top** the user can turn on.
- Once in study mode (inside God mode), a **candle appears and a timer starts**.
- The user **sets the session length** (e.g. 30 minutes or 1 hour); the **candle burns for exactly
  that duration**.
- Keep a **counter/timer that is NOT physical pressure** — quiet and pleasant, for people (especially
  introverts) spending peaceful time with God and studying.
- The candle simply burns and **indicates how much time has passed** — e.g. a **gentle clock on the
  side**, or a creative gentle indicator of time within the session.
- Deliver a **version first**, then iterate on feedback.

**Design decisions taken for this draft (confirm/adjust):**
- Default length **30 min**; presets 15 / 30 / 60 + custom (5–180).
- **Private by default** — a session is personal; a *private, local* tally of minutes/sessions is
  kept. An **optional** toggle also lights a public candle on the shared wall.
- **Chime off by default** (silent, gentle). The burning candle + soft halo are the main indicator;
  a calm line shows "N minutes with God" and "about M remain" (updated ~every 20s, no ticking seconds).

---

## 5. Functional requirements (v1 draft — implemented in index.next.html)
- **FR-CFT-1** A **"God mode" toggle** in the top nav enters/exits a full-screen study booth.
- **FR-CFT-2** The booth is a calm, **dim, sacred space** ("just you and God") that covers the site.
- **FR-CFT-3** **Top toggles:** session length (15 / 30 / 60 / custom), gentle chime on/off, and
  "also light a candle on the wall" on/off.
- **FR-CFT-4** Starting a session **lights a candle** and begins timing for the chosen duration.
- **FR-CFT-5** The candle **visibly burns down over exactly the session length** (wax height ∝ time
  remaining), reaching a low stub as the session ends.
- **FR-CFT-6** **No-pressure time cues:** no ticking seconds. A soft line shows "N minutes with God"
  and "about M minutes remain, quietly," refreshed ~every 20s; the flame + halo are the primary cue.
- **FR-CFT-7** **"End gently"** at any time returns to idle and logs the elapsed minutes.
- **FR-CFT-8** On completion the **flame gently goes out**, a kind message appears ("Your time with
  God is complete"), an optional soft chime plays, and the user may **begin again** or **leave gently**.
- **FR-CFT-9** A random **KJV verse** is shown for quiet reflection during the session.
- **FR-CFT-10** **Private by default:** a local, private tally (`jlu_study_min`, `jlu_study_sess`) is
  kept; optionally the user may also light a public candle on the shared wall.
- **FR-CFT-11** **Esc** or "Leave gently" exits God mode and restores the normal page (scroll re-enabled).

## 6. UX / interaction flow
```
IDLE      candle unlit · pick length · "Light the candle & begin"
   │ begin
RUNNING   flame lit · candle slowly burns down · halo glows · verse shown
          gentle lines: "12 minutes with God" / "about 18 remain, quietly"
          control: "End gently"
   │ time reaches 0                         │ user ends early
COMPLETE  flame out · "Your time with God    └─▶ back to IDLE (elapsed logged)
          is complete" · chime (opt) ·
          "Begin again" / "Leave gently"
```

## 7. Data model impact
- **No backend change required.** Session state is in-memory; the private tally uses `localStorage`
  keys `jlu_study_min` (cumulative minutes) and `jlu_study_sess` (count).
- The optional public candle reuses the **existing `candles` table** (no schema change), via the
  same storage adapter — so existing data is untouched.

## 8. Acceptance criteria (v1)
1. Toggling "God mode" opens/closes the booth; **Esc** closes it; the homepage underneath is unchanged.
2. Choosing 30 min and beginning **lights the candle**, which **burns down over 30 min** and the
   flame goes out at completion with the completion message.
3. Time cues update **without seconds** and never read as a stressful countdown.
4. **"End gently"** returns to idle and adds the elapsed minutes to the private tally.
5. With "also light a candle on the wall" checked, a candle appears on the **public wall**; unchecked,
   the session stays **private**.
6. Nothing in God mode alters existing notes/candles or the live homepage layout.

---

## 9. Versioning & safe rollout plan (protects the live site)

The live site at **jesus-lovesyou.life** serves `index.html`. We will **not touch it** during
development. Instead:

1. **Snapshot the current live version** → keep a copy `index.v1.1.html` (or `index.backup.html`)
   as a known-good rollback.
2. **Build the feature in a working copy** → `index.next.html`. All timer work happens here.
   The live page is unaffected because that file isn't served.
3. **Preview & test** `index.next.html` locally (just open it) and, if you like, upload it to a
   non-index path (e.g. `public_html/preview.html`) so you can test it on the real domain at
   `https://jesus-lovesyou.life/preview.html` **without** changing the homepage.
4. **Approve** → when you're happy, promote it: rename the live `index.html` to
   `index.v1.1-archived.html` (rollback), then rename/upload `index.next.html` as `index.html`.
   Because it's the same single-file, no-build architecture, promotion is just a file swap.
5. **Instant rollback** → if anything looks off, re-upload the archived `index.v1.1-archived.html`
   as `index.html`. Seconds to revert.
6. **Update the specs** → move the finalized FR-CFT-# into `FUNCTIONAL-SPEC.md`, bump it to v1.2,
   and note the release in `PROJECT-LOG.md`.

> Data safety: the feature reuses the existing Supabase project. If it adds any table/column, we do
> it with `create table if not exists` / `add column if not exists` so existing notes & candles are
> never disturbed.

---

## 10. Open questions
- Should a study session also appear on the **public** candle wall (so friends see you're praying/
  studying), or stay **private** to your browser?
- Preferred default duration and preset options?
- Sound on by default, or off (silent chime/visual only)?
