# Publish "Jesus Loves You" on GoDaddy → jesuslovesyou.faith

Your site is a single static page (`index.html`), so GoDaddy's **Web Hosting** (Linux/cPanel)
plan is the right product — it lets you upload your own HTML. Total time ~15 minutes.

> I can't do the purchase or login steps for you (they need your payment and password), so those
> are yours — but every click is spelled out below.

---

## Step 1 — Register the domain
1. Go to: **https://www.godaddy.com/domainsearch/find?domainToCheck=jesuslovesyou.faith**
2. Add **jesuslovesyou.faith** to your cart and check out.

## Step 2 — Get GoDaddy Web Hosting
1. GoDaddy → **Web Hosting** → choose a **Linux / cPanel** plan (the "Economy" plan is plenty).
   - Make sure it's *Web Hosting* (cPanel), **not** "Websites + Marketing" — that builder
     doesn't let you upload raw HTML.
2. During setup, set the **primary domain** to **jesuslovesyou.faith**.
3. Wait for the hosting to finish provisioning (you'll get a "your account is ready" email).

## Step 3 — Upload the site
1. GoDaddy → **My Products → Web Hosting → Manage** → open **cPanel**.
2. In cPanel, open **File Manager**.
3. Go into the **`public_html`** folder.
4. Delete any default placeholder files there (e.g. a default `index.html`, `default.html`).
5. Click **Upload** and add these two files from your `jesus-loves-you` folder:
   - `index.html`
   - `hero-jesus.svg` *(optional — the illustration is also built into index.html)*
6. Back in File Manager, confirm `public_html/index.html` exists.

## Step 4 — Turn on HTTPS and visit
1. cPanel usually issues a free SSL certificate automatically within an hour. If you see an
   **SSL/TLS Status** tool, click **Run AutoSSL**.
2. Open **https://jesuslovesyou.faith** — your site is live. 🕊️

*(DNS/SSL can take up to a few hours to fully propagate the first time — if it's not instant,
give it a little while.)*

---

## One thing to know about the wall + candles
On plain GoDaddy hosting, the notes people write and the candles they light are saved in **each
visitor's own browser** — so the site is fully functional and beautiful, but the wall isn't yet
**shared** between different people.

To make it a true shared community wall (everyone sees the same notes and candles), you need a
small backend/database behind it. Two easy ways:
- **Easiest:** I can wire it to a free hosted database (e.g. Supabase) — you'd paste one key into
  `index.html`, re-upload, and the wall becomes shared. Just ask and I'll set it up.
- **Or** use the Wix Headless path in `DEPLOY.md`, which has the shared CMS built in.

Either way, the site you upload today works and looks complete from minute one.

---

## Quick checklist
- [ ] Registered jesuslovesyou.faith
- [ ] Bought GoDaddy **Web Hosting (cPanel)**, primary domain = jesuslovesyou.faith
- [ ] Uploaded `index.html` to `public_html`
- [ ] Ran AutoSSL / confirmed https works
- [ ] Visited https://jesuslovesyou.faith 🎉

Stuck on any step? Tell me where you are (or paste the screen) and I'll walk you through it.
