# Jesus Loves You — deploy & go live

This is your complete, working site. It runs **right now** with no setup: open `index.html`
in any browser and everything works — write notes, light candles, drag stickers, start notes
from Bible verses. Notes and candles are saved in the visitor's own browser.

To make the wall + candles **shared across everyone** (a true community wall) and put it on your
own domain, follow the steps below on **your own computer** (the secure assistant workspace
can't reach Wix's servers, so these final steps are yours to run — they take ~10 minutes).

---

## What's in this folder
- `index.html` — the entire site (single file, no build step)
- `hero-jesus.svg` — the hero illustration (also embedded inside `index.html`)
- `setup-wix-collections.sh` — optional helper to create the two cloud collections
- `DEPLOY.md` — this guide

---

## 1. Try it locally first
Double-click `index.html`. That's it. Use it, show it to family — it's fully functional offline.

---

## 2. Publish it live on Wix Headless

You'll need [Node.js](https://nodejs.org) installed and a free Wix account.

```bash
cd jesus-loves-you

# a) Log in to Wix (opens your browser)
npx @wix/cli@latest login

# b) Create a Wix Headless project in this folder (follow the prompts;
#    choose "Headless" and an existing or new site)
npm create @wix/new@latest

# c) Tell Wix the site root is THIS folder, not ./dist
#    Open wix.config.json and set:  "outputDirectory": "."

# d) Publish — copy the live URL it prints ("Site published on https://…")
npx @wix/cli@latest release
```

Your site is now live on a free `…wix-site-host.com` URL. Share it anywhere.

---

## 3. (Optional) Turn on the SHARED cloud wall

By default each visitor sees their own notes/candles. To make one wall everyone shares:

1. **Install Wix CMS (Wix Data)** on your site from the Wix dashboard → *Add Apps* → *CMS*.
2. **Create two collections** (dashboard → CMS → *Create Collection*), each **public read /
   visitor write**:
   - **`Notes`** — fields: `text` (text), `author` (text), `tag` (text)
   - **`Candles`** — fields: `name` (text), `intention` (text)
   *(Wix adds `_createdDate` automatically — the wall sorts on it.)*
   You can also run `./setup-wix-collections.sh` after login to create these via the API.
3. **Find your Client ID:** Wix dashboard → *Settings → Headless Settings → OAuth apps*
   (it's also `appId` inside your `wix.config.json`).
4. **Paste it into `index.html`** — near the top of the `<script>`:
   ```js
   const WIX = { clientId: "PASTE-YOUR-CLIENT-ID-HERE" };
   ```
5. **Re-publish:** `npx @wix/cli@latest release`

Now every note pinned and every candle lit is shared by the whole community. If the cloud is
ever unreachable, the site automatically falls back to local storage — it never breaks.

> Note: because there are no logins (you chose an open public wall), the cloud wall is shared
> by all visitors, not private per person. Perfect for a community prayer wall.

---

## 4. Your domain

`jesuslovesyou.org` is already registered by someone else (so are `.com`, `.app`, `.love`).
Good available alternatives:

- **jesuslovesyou.faith** — exact match, available
- jesuslovesyou.world · jesuslovesyou.life *(check)* · jesuslovesyou.today · jesuslovesyou.one

To use one: in the Wix dashboard → *Settings → Domains → Connect a domain* → buy it through Wix
(it auto-connects), or buy it from any registrar and point it at Wix. Domain purchase happens in
your own Wix account — I can't buy it for you, but the dashboard walks you through it in a couple
of clicks.

---

## Need a hand?
Come back and tell me which step you're on (or paste any error) and I'll get you unstuck.
You are loved. 🕊️
