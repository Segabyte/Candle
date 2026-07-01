# Publish FREE on Netlify → jesus-lovesyou.life

Your site is one static file, so it hosts free in minutes. We'll put it on Netlify (free), then
point your GoDaddy domain at it. Total ~10–15 minutes.

---

## Before you start
Make sure your Supabase key is already pasted into `index.html`:
```js
const SUPA = { url: "https://yfneguzcuisfwebzyrun.supabase.co", key: "sb_publishable_...your key..." };
```
Save the file. (Deploy *after* this is in, so the shared wall works from minute one.)

---

## Step 1 — Put the site online (free)
1. Go to **https://app.netlify.com/drop**.
2. Sign up free (Google, GitHub, or email) — this keeps the site so you can add your domain.
3. **Drag your whole `jesus-loves-you` folder** onto the drop zone (the folder that contains
   `index.html`).
4. It deploys instantly and gives you a live URL like `https://gentle-grace-1234.netlify.app`.
   Open it — your site is already on the internet. 🎉

## Step 2 — Attach jesus-lovesyou.life
1. In Netlify: **Site configuration → Domain management → Add a domain**.
2. Type **jesus-lovesyou.life** → **Verify** → **Add domain**.
3. Netlify will say the domain uses an external DNS provider (GoDaddy). Leave this tab open —
   it shows the records you need. Netlify will also auto-issue a free HTTPS certificate once DNS
   points correctly.

## Step 3 — Point the domain from GoDaddy
1. In GoDaddy: **Domain → jesus-lovesyou.life → Manage DNS** (DNS records).
2. Make these two records (edit the existing ones if they already exist):

   | Type  | Name | Value                         |
   |-------|------|-------------------------------|
   | A     | @    | `75.2.60.5`                   |
   | CNAME | www  | `YOUR-SITE.netlify.app`       |

   - Replace `YOUR-SITE.netlify.app` with the Netlify URL from Step 1.
   - If GoDaddy already has an **A record for `@`** (a "Parked" one), **edit it** to `75.2.60.5`
     rather than adding a second.
   - If there's a **Forwarding / parked** setting on the domain, turn it **off**.
3. **Save.**

## Step 4 — Wait a bit, then visit
DNS usually updates within 15–60 minutes (sometimes a few hours the first time). Netlify turns
on HTTPS automatically once it sees the records. Then open:

### **https://jesus-lovesyou.life** 🕊️

---

## Confirm the shared wall works
Open the live site on your **phone** and your **computer**. Pin a note on one, refresh the other
— the same note shows up on both. That's your shared community wall, live for the world.

## Updating the site later
Changed something in `index.html`? Go to your Netlify site → **Deploys** → drag the folder on
again (or the single `index.html`). It redeploys in seconds; the domain stays the same.

---

### If anything sticks
- "Site not secure" right after pointing DNS → just the SSL certificate still issuing; give it
  up to an hour.
- Domain still shows a GoDaddy parked page → the `@` A record wasn't changed to `75.2.60.5`, or
  forwarding is still on.
- Send me a screenshot and I'll pinpoint it.
