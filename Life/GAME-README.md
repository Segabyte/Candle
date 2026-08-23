# LifeQuest — playable prototype

`lifequest.html` is a complete, self-contained game. **Open it in any browser** —
no build step, no server, no network. Double-click the file and play.

It is the first build of the design in
[`LIFEQUEST-AI-PROMPT.md`](LIFEQUEST-AI-PROMPT.md).

---

## How to play

1. Choose how many humans (1–6) and how many computer players (0–3).
   Solo play always gets at least one computer opponent.
2. Each player picks their **own** learning topic — the board is shared, the
   lessons are not. Pick a preset, or choose *Custom topic…* and type anything
   ("Teach me astronomy").
3. Pick a difficulty. **Adaptive** watches how you answer and moves the level
   up or down as you go.
4. **Roll the dice** — click the button, or press **R** or **Space**.
5. Every space you land on gives you something: a question on your topic, a
   choice with consequences, an event, a risk, a reflection, or a lesson.
6. After the last round, the **Life Score** decides it.

### Controls

| Key | Action |
|---|---|
| `R` or `Space` | Roll the dice |
| `1`–`6` | Pick an option on the open card |
| `Enter` | Continue past a card |
| `◐` button | Light / dark |

## The dice

Two dice by default, one if you prefer (set it before starting). They animate
on the roll and land on a real value. **Doubles give you another turn** — once
per turn, plus 🚀 +1 Growth.

The **Risk** spaces roll a separate single die in front of you: four or higher
pays off, three or lower costs you. You can always walk away instead.

## Winning

Not by money, and not by finishing first. Six dimensions are tracked:

❤️ Wellbeing · 🧠 Knowledge · 💰 Wealth · 🤝 Relationships · 🚀 Growth · 🌍 Contribution

```
Life Score  =  weighted total  ×  balance
weighted total = Knowledge 20% + Wellbeing 20% + Relationships, Wealth, Growth, Contribution 15% each
balance        = your weakest dimension ÷ your strongest
```

The multiplier is what makes the game mean anything. Pour everything into one
dimension and it collapses: at an equal points total, the balanced player beats
the specialist every time. A tall tower loses to a broad foundation. That rule
is the point of the game, so it is enforced by the arithmetic rather than by
the cards telling you to be well-rounded.

Achievements are awarded separately: Most Knowledgeable, Best Wellbeing, Best
Problem Solver, Most Helpful Player, Greatest Growth, Best Financial Decisions,
Greatest Contribution.

At the end, every human player gets a **What you learned** recap — every
takeaway they collected, plus their own reflection answers.

## The board

44 spaces around the perimeter. `Start` plus three milestone corners
(Explore, Build Skills, Contribute), and forty spaces of fourteen kinds:
Learn, Life Choice, Challenge, Opportunity, Reflection, Surprise, Money,
Career, Health, Relationship, Community, Innovation, Risk, Wisdom.

There are no empty spaces. Every landing produces a learning moment.

---

## Adding your own content

Open the console on the page, or add a `<script>` after the content block:

```js
LIFEQUEST.addPack('astronomy', 'Astronomy', [
  {
    id: 'as1', type: 'question', level: 'beginner',
    title: 'Scale',
    body: 'Light from the Sun takes roughly how long to reach Earth?',
    options: ['8 seconds', '8 minutes', '8 hours', '8 days'],
    answer: 1,
    explain: 'About 8 minutes and 20 seconds at 150 million km.',
    takeaway: 'You never see the Sun as it is now — only as it was 8 minutes ago.'
  }
]);
```

Card types: `question`, `choice`, `event`, `wisdom`, `challenge`, `reflection`.
Effects use `fx: {well, know, wealth, rel, growth, contrib}` with positive or
negative integers — on the card itself, or per option.

## Wiring up a live AI

The game ships fully playable offline. To generate cards live for any topic —
including the custom "teach me anything" ones — set one hook:

```js
LIFEQUEST.generator = async ({ player, kind, topic }) => {
  // kind is 'question' | 'choice' | 'event' | 'wisdom' | 'challenge' | 'reflection'
  // return a card object in the schema above, or null to use the offline pack
  const res = await fetch('/your-endpoint', {
    method: 'POST',
    body: JSON.stringify({ topic, kind, level: player.diff })
  });
  return (await res.json()).card;
};
```

If the hook is missing, throws, or returns `null`, the game silently falls back
to the offline pack. **It never blocks on the network.** Do not put an API key
in this file — call your own backend endpoint and keep the key there.

## What is stored

The game state is saved to `localStorage` after each turn, so a refresh offers
to resume. Reflection answers are part of that save. Nothing leaves the
browser. "Discard" on the setup screen clears it.

## Known limits

- Custom topics fall back to general Life Skills questions plus templated
  study prompts until the AI generator is wired up — the offline file cannot
  invent questions about arbitrary subjects on its own.
- Computer opponents answer using a fixed accuracy per personality; they do not
  reason about the question.
- Content packs are a starter set, not the 40-per-topic the design calls for.
