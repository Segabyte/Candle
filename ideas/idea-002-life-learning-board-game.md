# Idea 002 — "Life" learning board game

**Captured:** 2026-08-22
**Status:** Raw capture + ready-to-use AI prompts
**Tags:** game, education, retro board game, single-player vs AI

---

## The idea in one line

A board game that looks and feels like the classic 1990s Indian family board
game (pastel litho board, dice, plastic tokens, currency notes, corner
squares, Chance / Community Chest decks) — but where **every move teaches the
player something about life**, on a default topic or on a topic each player
picks for themselves. Single player plays against the computer.

## Reference

The visual reference is a vintage Indian "Business"-style board: a square
board with a ring of ~40 tiles, colour-banded property strips (pink, blue,
yellow, green), four corner squares, two diamond-shaped card decks in the
middle, dice, plastic tokens and printed currency notes. That is the *look*
to evoke — an original board with original tile names, not a reproduction of
any existing branded game.

## The twist

- **Learn on every move.** Landing on a tile always surfaces something —
  an insight, a choice with consequences, a quick question, or a dilemma.
- **Topic is a setting, not a fixed theme.** A sensible default ("Life
  Skills") plus a picker: money, health & safety, career, relationships,
  emotional intelligence, civics, environment, faith, or a custom topic.
- **Per-player topics.** Each player can choose their own topic, so the card
  drawn depends on *whose turn it is*. Two people can play the same board and
  learn different things.
- **Single player = play the computer.** AI opponents with distinct play
  styles, so a solo player still gets a real game.
- **Winning isn't only money.** Progress is tracked across life dimensions,
  not just cash, so the scoring itself carries the lesson.

## Possible tie-in

A "Faith / Scripture" topic pack would connect this directly to Candle,
without the game being limited to it.

---

# Prompt A — build the playable game

> Paste this into an AI coding assistant (Claude, Cursor, etc.) to generate
> the game. Trim the sections you don't need.

```text
Build a complete, playable digital board game called "LIFE — the learning
board game".

## The feel

Recreate the look and warmth of a 1990s Indian family board game printed on
folded card: a square board, a ring of 40 tiles around the edge, colour-banded
tile groups in dusty pastels (rose pink, sky blue, butter yellow, mint green,
lilac), four large corner squares, two diamond-shaped card decks angled in the
middle of the board, a soft-cream centre panel carrying the game title in a
chunky retro serif, thin dark keylines around every tile, and slight
off-register print texture. Include chunky plastic-looking player tokens, two
dice, and printed play-money notes.

This must be an ORIGINAL board — original tile names, original deck names,
original title treatment. Do not reproduce Monopoly, Business, The Game of
Life, or any other existing branded board, logo, or trademarked tile names.
Take only the era and the printing style.

## Core concept

Every single move teaches the player something about life. There is no "dead"
tile — landing anywhere always produces a learning moment.

## Topics

- A default topic pack, "Life Skills", is used if nothing is chosen.
- At setup, EACH player independently picks a topic. Built-in packs:
  Money & Finance, Health & Safety, Career & Work, Relationships,
  Emotional Intelligence, Civic Sense, Environment, Faith & Values,
  Study Skills. Plus "Custom topic" where the player types anything.
- Cards are drawn from the topic of the player whose turn it is — so two
  players on the same board learn different subjects at the same time.
- Each pack has an age/reading-level setting: Kids (8-12), Teen, Adult.

## Players

- 2 to 4 players.
- Any seat can be Human or Computer.
- Single player = 1 human + up to 3 computer opponents.
- Computer opponents have named personalities with different risk appetites
  and answer accuracy (e.g. Cautious, Bold, Balanced) and three difficulty
  levels. The AI must visibly "think" briefly, then narrate its choice in one
  line so the human learns from watching it too.

## Board layout (40 tiles)

Four corners:
1. START — collect your salary and a fresh goal for the round.
2. SETBACK — a life setback; miss a turn unless a card lets you recover.
3. REST STOP — free space, draw a Reflection card.
4. CROSSROADS — go to SETBACK, or pay a price to avoid it.

The 36 edge tiles are drawn from these types:
- LIFE STAGE tiles (the coloured groups) — the equivalent of properties, but
  invested in rather than bought: School, First Job, Savings, Health Habits,
  Friendship, Family, Skills, Community, Purpose. Investing in a tile raises
  the matching life dimension; landing on another player's invested tile
  triggers a shared learning exchange rather than a rent payment.
- LESSON tiles — draw a topic card from the current player's topic.
- CHOICE tiles — a scenario with 2-3 options and real consequences.
- QUICK CHECK tiles — a single question on the player's topic.
- DILEMMA tiles — no right answer; the player states their reasoning and gets
  the perspectives back.
- FORTUNE and COMMUNITY decks — the two diamond decks in the centre, in the
  spirit of Chance / Community Chest but original.
- TAX / DUES tiles.

## Cards

Card types and required shape:

- INSIGHT: title, 1-2 sentence fact or principle, one "try this" takeaway.
- QUESTION: prompt, 3-4 options, correct index, explanation shown either way.
  A wrong answer must never feel punishing — always explain.
- CHOICE: scenario, 2-3 options, per-option consequence text plus effects on
  the life dimensions. No option is purely correct; each has a trade-off.
- DILEMMA: scenario, no scoring, shows 2-3 perspectives after the player
  commits to a view.
- REFLECTION: a single question the player answers for themselves; recorded
  in the end-of-game recap.

Every card must be short enough to read in under 15 seconds. Plain language.
No lecturing. No moralising.

## Scoring — four life dimensions

Track four meters per player instead of money alone:
Health, Wealth, Relationships, Growth.
Also track Wisdom Points, earned for engaging with cards (correct answers,
thoughtful choices, completing reflections).

Winning: the game ends after a set number of rounds (default 12) or when a
player reaches a target. The winner is the player with the best BALANCE —
highest total with the smallest gap between their four meters. A player who
maxes Wealth while their Health and Relationships sit at the floor should
lose, and the end screen should say why. That rule is the point of the game.

## Turn loop

1. Roll two dice, animate the token around the ring.
2. Resolve the tile: draw from the active player's topic pack.
3. Present the card; player acts.
4. Apply effects, animate the meters, show a one-line takeaway.
5. Doubles roll again; three doubles sends you to SETBACK.
6. Pass to the next player.

## End of game

An end screen showing: final meters, the winner and the balance reasoning,
"what you learned" — a scrollable list of every insight and takeaway that
player collected — and their reflection answers. Make this recap shareable
and worth reading; it is the real product of a session.

## Content

- Ship offline JSON content packs so the game is fully playable with no
  network. Minimum 40 cards per topic pack per age level.
- Card JSON schema:
  {
    "id": "money-014",
    "topic": "money",
    "level": "teen",
    "type": "question",
    "title": "...",
    "body": "...",
    "options": [{"text": "...", "consequence": "...",
                 "effects": {"health": 0, "wealth": -1,
                             "relationships": 0, "growth": 2}}],
    "answer": 1,
    "explain": "...",
    "takeaway": "..."
  }
- OPTIONAL live generation: if an API key is configured, generate fresh cards
  for a custom topic at runtime using the same schema, validate against the
  schema before use, and fall back silently to the offline pack on any error.
  The game must never block on the network.

## Tech

- Single self-contained HTML file: HTML + CSS + vanilla JS, no build step, no
  external requests, no CDN. Everything inline, including any SVG art.
- The board is rendered with CSS grid / SVG, not an image file.
- Responsive: full board on desktop; on mobile the board scales down and the
  active card takes over the lower half of the screen.
- Works offline. Game state saved to localStorage so a session survives a
  refresh, wrapped in try/catch.
- Accessible: keyboard playable, ARIA labels on tiles and cards, visible focus
  rings, colour never the only signal, contrast AA in both light and dark.
- Respects prefers-reduced-motion for the token and meter animations.
- Sound optional and off by default.

## Deliverables

1. The single playable HTML file.
2. The content pack JSON for at least three topics (Life Skills, Money,
   Health & Safety) at Teen level.
3. A short README: how to play, how to add a topic pack, how to swap in your
   own card content.

Start by showing me the board layout — all 40 tiles with names and types —
and wait for my approval before writing the full game.
```

---

# Prompt B — generate the board artwork

> For an image model (Midjourney / DALL·E / Firefly), if you want the board
> art as a picture rather than rendered in code.

```text
A vintage 1990s Indian family board game photographed flat from directly
above, lying on a table. Square folding card board with a visible centre
crease. A ring of forty rectangular tiles runs around the edge, each with a
coloured header band in dusty pastel rose pink, sky blue, butter yellow, mint
green and lilac, thin dark keylines, small naive spot illustrations, and tiny
condensed capital lettering. Four large square corner tiles. Two
diamond-shaped card decks angled in the middle of the board. A soft cream
centre field carrying the word "LIFE" in a chunky retro serif with a drop
shadow. Two white dice, a few chunky pastel plastic tokens, small stacks of
pastel printed play-money notes, and a small stack of instruction cards resting
on the board. Slightly faded offset-litho printing, gentle off-register colour,
soft paper texture, warm natural daylight, mild vignette.
Original artwork — no existing brand names, logos or trademarked tile names.
--ar 1:1
```

## Notes / Refinements

- **2026-08-22** — Idea taken forward as **LifeQuest**, with its own working
  folder at [`Life/`](../Life/). The full design prompt lives in
  [`Life/LIFEQUEST-AI-PROMPT.md`](../Life/LIFEQUEST-AI-PROMPT.md) and
  supersedes Prompt A and Prompt B above: it expands the concept to six life
  dimensions, named AI opponents, per-player topics with a custom "teach me
  anything" option, adaptive difficulty, and a companion-app path for a
  physical edition.
