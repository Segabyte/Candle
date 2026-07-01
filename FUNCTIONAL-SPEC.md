# JLU — "Jesus Loves You" · Functional Specification

**Version:** 1.0 · **Date:** 2026-06-29 · **Status:** Built (v1 live-ready)
**Purpose:** A precise, implementation-ready description of the site for specs-driven development
and future AI-assisted iteration. Requirements are individually numbered (FR-#, NFR-#) for traceability.

---

## 1. Product overview

JLU is a warm, handwritten-style faith web application where visitors write prayers and gratitude
notes, light prayer candles, draw encouragement from Bible verses, and pin their words to a shared
community wall. The experience is intentionally gentle and welcoming to all ages (children to
elders). It is delivered as a **single self-contained static HTML page** with no build step, backed
by a lightweight cloud database for shared data.

**Vision statement:** Help anyone — believer or seeker — feel the unconditional love of Jesus and
participate in a living, shared act of prayer and gratitude.

**Product principles**
1. Pleasant and calming above all — soft colors, handwriting fonts, playful micro-interactions.
2. Zero friction — no login required to read or participate.
3. Works everywhere — a single file, hostable on any static host.
4. Graceful — never breaks; degrades to local storage if the backend is unavailable.

---

## 2. Users & personas

| Persona | Goal | Notes |
|---|---|---|
| Visitor (writer) | Post a prayer/gratitude note, light a candle | Anonymous, no account |
| Visitor (reader) | Read the community wall, feel encouraged | Anonymous |
| Owner/admin | Publish, moderate content, maintain the site | Via Supabase dashboard + host |

There is **no per-user authentication** in v1. All contributions are anonymous and shared publicly.

---

## 3. Scope

**In scope (v1):** hero illustration, draggable stickers, flip cards, note composer with
flip-to-verse, community wall with filters, prayer candles with types + reveal, KJV verse templates,
shared persistence, light spam guard, responsive layout, offline fallback.

**Out of scope (v1):** user accounts / login, per-user private walls, edit/delete of others' posts,
moderation UI, image uploads, notifications/email, multi-language, analytics, payments.

---

## 4. Information architecture

Single page with anchored sections (top-nav links scroll to them):

1. **Nav bar** — brand (JLU) + links: Candles, Verses, The Wall, "Write a note" (CTA).
2. **Hero** — headline "Jesus loves you.", intro copy, two CTAs, live chips, blessing line,
   gratitude-book illustration + flip cards, draggable stickers overlay.
3. **Candles** — light-a-candle CTA + wall of lit candles.
4. **How it works** — three steps.
5. **Verses** — filterable KJV verse cards ("start a note").
6. **Write a note** — note composer form.
7. **The Wall** — community wall with tag filters.
8. **Footer** — closing verse + brand + blessing.

---

## 5. Functional requirements

### 5.1 Navigation & layout
- **FR-1** Sticky top nav with brand and anchor links; links smooth-scroll to their sections.
- **FR-2** Fully responsive; on narrow screens the hero stacks vertically and secondary nav links
  may hide, leaving the primary CTA.

### 5.2 Hero illustration (gratitude book)
- **FR-3** Display an SVG illustration of an open handwritten book: left page "Daily Gratitude List"
  (bulleted items), right page "Prayer for Grace" (handwritten prayer), warm radial light.
- **FR-4** A white dove carrying an olive branch sits above the book with a gentle idle animation.
- **FR-5** The whole illustration has a slow floating animation.

### 5.3 Draggable stickers
- **FR-6** Render a set of stickers (words: amen, grace, blessed, pray; glyphs: ✝, ♥, ✧) positioned
  around the hero.
- **FR-7** Each sticker is draggable via pointer events (mouse + touch); on drag it scales up and
  raises z-index/shadow; on release it settles.
- **FR-8** Stickers must not block interaction with underlying content when not being dragged.

### 5.4 Flip cards (hero)
- **FR-9** Three polaroid-style cards layered over the book. Front shows a sample note + author +
  "tap to flip"; back shows the Bible verse it is "pinned to".
- **FR-10** Clicking a card flips it 180° (3D) and back, preserving its resting rotation.

### 5.5 Prayer candles
- **FR-11** "Light a candle" opens a modal with: **type** (Prayer / Gratitude / Praise / Hope),
  **name** (optional), **intention** (optional free text).
- **FR-12** On submit, the candle is prepended to the candle wall and persisted (§7).
- **FR-13** Each rendered candle shows: a **type label above** the flame (color-coded by type), an
  animated flame (randomized flicker delay), and the name below.
- **FR-14** **Clicking a candle reveals its prayer** in a popover above the flame (type in bold,
  intention text, name). Clicking elsewhere or another candle closes it.
- **FR-15** A live count line reads "N candles are burning right now."
- **FR-16** Newest candles first; render cap 60 for performance.

### 5.6 Bible verse note cards (templates)
- **FR-17** Display KJV verse cards (see §11) filterable by theme: All, Love, Peace, Strength, Hope,
  Guidance.
- **FR-18** Clicking a verse card pre-fills the note composer with the quoted verse + reference and
  a sensible default tag, then scrolls to and focuses the composer.

### 5.7 Note composer + flip-to-verse
- **FR-19** Composer fields: **note text** (required), **name** (optional), **tag**
  (Gratitude / Prayer / Praise / Hope).
- **FR-20** On submit (valid): prepend to the wall, persist (§7), reset the form.
- **FR-21** On submit, show a **flip celebration**: a polaroid shows the user's note, then flips to a
  **matching KJV verse** ("A word for you") chosen by tag, then dismisses and scrolls to the wall.
- **FR-22** Empty note text shows an inline gentle validation message and blocks submit.

### 5.8 Community wall
- **FR-23** Masonry-style column layout of note cards; newest first.
- **FR-24** Tag filter tabs: All, Gratitude, Prayer, Praise, Hope. Selecting one filters the wall.
- **FR-25** Each card shows the note text (preserving line breaks), author ("— Name"/"A friend"),
  and a tag chip; background tinted by tag.
- **FR-26** Empty state (no notes for a filter): a gentle "be the first to pin one" message.

### 5.9 Live hero chips
- **FR-27** Beside the hero CTAs, show a bobbing chip for the **latest note** (truncated text +
  first name) and the **latest candle** (type + intention/name).
- **FR-28** Chips update immediately when a new note/candle is added; clicking a chip scrolls to the
  relevant section.

### 5.10 Spam guard (client-side, kind)
- **FR-29** Cooldown: block a new post if the last post was < 8s ago.
- **FR-30** Duplicate: block posting text identical to the immediately previous post.
- **FR-31** No links: block text containing URLs (`http(s)://`, `www.`) or common `word.tld` patterns.
- **FR-32** Length cap: block text longer than 600 characters.
- **FR-33** Gentle word filter: block a small configurable list of spam/inappropriate terms.
- **FR-34** All blocks show a kind, encouraging message; guards apply to both notes and candle
  intentions.

### 5.11 Persistence & fallback
- **FR-35** If a Supabase config is present, read/write notes + candles from Supabase (§7).
- **FR-36** If Supabase is absent or unreachable, transparently fall back to browser `localStorage`
  (seeded with sample content) so the app always functions.
- **FR-37** Support two key formats: legacy JWT anon key (sends `Authorization: Bearer`) and new
  `sb_publishable_` key (sends `apikey` only).

---

## 6. Configuration

Two config objects near the top of the `<script>` in `index.html`:
```js
const WIX  = { clientId: "" };            // optional: Wix Headless CMS path (unused in prod)
const SUPA = { url: "", key: "" };        // shared wall via Supabase; url + anon/publishable key
```
- When `SUPA.url` and `SUPA.key` are set → shared cloud wall. When blank → per-browser storage.
- Precedence: Supabase → Wix → localStorage.

---

## 7. Data model (Supabase / Postgres)

### `notes`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| text | text | not null, 1–600 chars |
| author | text | ≤ 80 chars |
| tag | text | ≤ 20 chars (Gratitude/Prayer/Praise/Hope) |
| created_at | timestamptz | default now() |

### `candles`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| name | text | ≤ 80 chars |
| type | text | ≤ 20 chars (Prayer/Gratitude/Praise/Hope) |
| intention | text | ≤ 600 chars |
| created_at | timestamptz | default now() |

**Row-level security:** RLS enabled on both tables. Policies: public **select** (read) and public
**insert** = allowed; **update/delete** = not allowed (visitors cannot edit or remove others' posts).

**Access model:** anonymous visitor key only. Because there is no per-user identity, all data is
shared/public — this is intentional for a community wall.

---

## 8. Integration contract (Supabase REST)

- Base: `${SUPA.url}/rest/v1`
- Read: `GET /{table}?select=*&order=created_at.desc&limit=300`
- Insert: `POST /{table}` with a JSON array body and header `Prefer: return=minimal`
- Headers: `apikey: <key>` always; add `Authorization: Bearer <key>` only when key is a JWT (`eyJ…`).
- Every call is wrapped in try/catch; on failure the app falls back to localStorage for that operation.
- Field mapping: DB `created_at` → app `_createdDate`; other fields map 1:1.

---

## 9. UX & design system

- **Palette:** cream `#FAF4E9`, cream2 `#F1E7D6`, paper `#FFFCF6`, rose `#C98B89`, rose-deep
  `#B06D6B`, ink `#42382F`, ink-soft `#7C6F63`, sage `#9FAE94`, gold `#EFC878`. (CSS variables.)
- **Type:** Caveat (display/handwriting), Kalam (handwritten body), Lora (serif body).
- **Tone of copy:** warm, gentle, inclusive of all ages; never harsh, even in errors.
- **Micro-interactions:** floating hero, flickering candles, bobbing chips, flip animations,
  draggable stickers, scroll-reveal on sections.
- **Tag colors:** Gratitude→rose-tint, Prayer→sage-tint, Praise→cream2, Hope→warm gold tint.
- **Candle type colors:** Prayer→sage, Gratitude→rose, Praise→gold, Hope→rose-deep.

---

## 10. Non-functional requirements

- **NFR-1 Performance:** single file; only external requests are Google Fonts and (at runtime)
  Supabase REST. Candle render capped at 60, wall query limited to 300.
- **NFR-2 Availability/resilience:** never white-screen; all network calls degrade to localStorage.
- **NFR-3 Security/privacy:** only the public anon/publishable key ships to the client; RLS enforces
  read + insert only; no secrets in the page; no PII required (name is optional/freeform).
- **NFR-4 Accessibility:** semantic headings, `aria-label`s on the illustration and icon-only
  controls, sufficient contrast, keyboard-operable buttons/forms.
- **NFR-5 Responsiveness:** works on phones, tablets, desktops; hero stacks on small screens.
- **NFR-6 Browser support:** current evergreen browsers (Chrome, Edge, Firefox, Safari) desktop+mobile.
- **NFR-7 Portability:** deployable on any static host (GoDaddy cPanel, Netlify, Cloudflare Pages, etc.).
- **NFR-8 Maintainability:** all content data (verses, seed notes/candles, stickers, flip cards) held
  in clearly-labeled JS arrays/objects for easy editing.

---

## 11. Content — KJV verse set (v1)

John 3:16, Matthew 11:28, Psalm 23:1, Philippians 4:13, Jeremiah 29:11, Romans 8:28, Proverbs 3:5-6,
Isaiah 41:10, Psalm 46:10, Joshua 1:9, 2 Timothy 1:7, Philippians 4:6-7, Isaiah 40:31, Matthew 6:25,
Matthew 6:27, Matthew 6:33, 1 Corinthians 13:4, 1 John 4:8, Romans 5:8, Ephesians 2:8, Psalm 118:24,
Psalm 119:105, Micah 6:8, Galatians 5:22-23, 1 Thessalonians 5:18, Luke 15:10. (All KJV, public domain.)

Tag→verse mapping for the note flip: Gratitude→1 Thessalonians 5:18, Prayer→Philippians 4:6-7,
Praise→Luke 15:10, Hope→Jeremiah 29:11.

---

## 12. Deployment

- **Domain:** jesus-lovesyou.life (GoDaddy).
- **Host:** GoDaddy cPanel Web Hosting → upload `index.html` to `public_html` (must be named exactly
  `index.html`) → enable AutoSSL.
- **DB:** Supabase project `JLU`; run the SQL in `SUPABASE-SETUP.md`; paste URL + publishable key
  into `index.html`.
- Alternative static hosts documented in `PUBLISH-Free.md`.

---

## 13. Acceptance criteria (v1)

1. Opening `index.html` with no config renders fully and lets a user post a note/candle (stored locally).
2. With `SUPA` configured, a note posted on device A appears on device B after refresh.
3. Lighting a candle shows its type label; tapping it reveals its intention.
4. Clicking a verse card pre-fills and focuses the note composer.
5. Submitting a note shows the flip-to-verse animation, then the note is on the wall.
6. Wall and candle filters correctly narrow the displayed items.
7. Spam guard blocks: a 2nd post within 8s, an identical repeat, a message with a URL, and a >600-char
   message — each with a friendly message.
8. With the network/database blocked, the app still works via localStorage (no errors surfaced to user).
9. Layout is usable and legible on a 375px-wide phone and a desktop.

---

## 14. Future enhancements (backlog)

- Member accounts + private/per-user walls (requires auth backend).
- Moderation dashboard (approve/hide/delete), report-a-post.
- Server-side rate limiting / captcha for stronger spam defense.
- Prayer "amen"/react counts on notes and candles.
- Categories/search on the wall; pagination / infinite scroll.
- Email digest or "someone prayed for you" notifications.
- Multi-language (verse sets per language), theme switcher.
- Image/photo attachments; shareable note links.
- Analytics (privacy-respecting) for engagement.

---

## 15. Glossary

- **Note** — a user-written prayer/gratitude message pinned to the wall.
- **Candle** — a lit prayer with a type and optional intention.
- **Wall** — the shared, public collection of notes.
- **Tag** — category of a note (Gratitude/Prayer/Praise/Hope).
- **Publishable/anon key** — the client-safe Supabase API key; RLS governs what it can do.
