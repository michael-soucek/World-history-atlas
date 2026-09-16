# Monetization — Borders of Time

Written after implementing the monetization foundation described below. Business
context, not a technical spec — the code itself documents the "how."

## What was implemented

A monetization *foundation*, not monetization itself — everything ships off by
default and adds zero visual or performance footprint until you flip an env var
or paste in a real link. Specifically:

- **Support link.** `SupportButton` in the footer ("Support this project") and on
  `/about`, plus a dedicated `/support` page explaining what support money pays
  for (hosting, the data pipeline, time spent on corrections). Set
  `NEXT_PUBLIC_SUPPORT_URL` to your Ko-fi/Buy Me a Coffee page and every instance
  starts linking there in a new tab; leave it unset and they link to `/support`
  instead, which is honest that direct tipping isn't wired up yet.
- **Affiliate-ready "Further reading & viewing" blocks.** A `RelatedResources`
  component appears on person, place, event, culture, tour, and explorer pages
  when that entity has entries in `src/data/resources.ts`. Six real entities are
  seeded now (Genghis Khan, Alexander the Great, the Roman Empire, Ancient Egypt,
  the Mongol tour, James Cook) with genuine, well-known books/documentaries/
  museum resources — real content recommendations, not filler. Every
  `affiliateUrl` is `undefined` on purpose; until you paste a real Amazon
  Associates/Bookshop.org/museum-partner link in, the card renders inert with a
  "Suggested — link coming soon" badge instead of a dead or fake link.
- **A reusable `AdSlot` component.** Renders nothing at all unless
  `NEXT_PUBLIC_ADS_ENABLED=true`. Two call sites exist today (homepage
  mid-content, entity-page sidebar) so that wiring in Mediavine, another network,
  or a direct-sponsor image later is a one-file change, not a site-wide
  redesign. No ad network is integrated yet, and nothing resembling an ad
  appears on the live site by default.
- **`/pro` — the Borders of Time Pro concept page.** States plainly that nothing
  is built or for sale. Lays out five candidate paid features (saved
  places/custom maps, custom map themes, high-res exports, classroom tools,
  ad-free browsing) and asks visitors to say which they'd pay for, via email.
  No signup, no payment, no gating of anything that exists today.
- **Trust pages ad networks and search engines expect:** `/contact`, `/privacy`,
  `/terms` (with an explicit FTC-style affiliate disclosure section), and the
  `/support` and `/pro` pages above — all in the existing About-page shell and
  voice, all added to `sitemap.ts`.

Nothing about the map, timeline, tour player, or entity page layouts changed.
No new dependencies were added.

## What to activate now

- **The support link — genuinely one env var.** Create a Ko-fi or Buy Me a
  Coffee page (takes ~10 minutes, free) and set `NEXT_PUBLIC_SUPPORT_URL` in
  Vercel. At 20 visitors/day this won't produce much revenue, but it costs
  nothing to turn on and it's the one channel where "brand new, low-traffic
  site" isn't a blocker — a few engaged visitors are enough.
- **Nothing else, yet.** Ads and affiliate links are built but intentionally
  left off. See below for why.

## What should wait until traffic is higher

- **Display ads (Mediavine, Ezoic, AdSense, etc.).** Every serious network has a
  minimum-traffic bar — Mediavine requires 50,000 sessions/month, Raptive
  (formerly AdThrive) is similar, and even AdSense (which has already rejected
  you) wants a track record of consistent, policy-compliant traffic. At ~600
  visitors/month today, none of these will accept you, and a rejected
  application is wasted effort. Ezoic has no hard minimum and is worth applying
  to once you're past a few thousand monthly visitors, as a bridge network.
- **Affiliate links.** The infrastructure is there, but real Amazon Associates
  links require Amazon approval, which requires a small trickle of qualifying
  sales within your first 180 days of enrollment — applying before you have
  enough traffic to plausibly generate a sale or two risks the account being
  closed for inactivity before it's useful. Bookshop.org's affiliate program
  has no traffic minimum and pays a flat 10% with no sales-window requirement,
  making it the better first affiliate program to enroll in even at low
  traffic — do that whenever you're ready to fill in real URLs, but there's no
  urgency.
- **Borders of Time Pro as an actual product.** Don't build payment
  infrastructure until `/pro` has collected real signal (a handful of emails
  saying "I'd pay for X") or traffic is high enough that even a low conversion
  rate is meaningful. Building Stripe integration, auth, and saved-state
  infrastructure for a paid tier before you know anyone wants it is the
  classic way solo projects burn time on the wrong thing.

## Realistic monetization at scale

Figures are directional, not guarantees — actual results depend heavily on
niche (history/education content monetizes reasonably well, mid-range RPMs),
geography of your audience, and session depth (which you already have going
for you — multi-page sessions per visitor).

| Monthly visitors | Support links | Affiliate | Display ads | Pro subscriptions | Realistic total/mo |
|---|---|---|---|---|---|
| **1,000** | $0–10 (maybe one tip) | Near $0 — not enough volume for a sale | Not eligible anywhere worthwhile | Pre-launch; gathering interest | **~$0–10** |
| **10,000** | $10–40 | $10–50 (Bookshop/Amazon, if links are live) | Ezoic viable: roughly $20–80 (RPMs vary a lot by niche/geo) | Maybe a soft-launch waitlist, no revenue yet | **~$50–150** |
| **50,000** | $30–100 | $50–200 | Mediavine now qualifies: $200–600+ depending on RPM and session depth | Possible small paid cohort if Pro has shipped: $50–300 | **~$400–1,200** |
| **100,000** | $50–150 | $150–500 | $500–1,500+ | $200–1,000+ if Pro has real features and retention | **~$1,000–3,000+** |

The jump from 10k→50k is the one that matters most: it's the point where
Mediavine (or a comparable premium network) becomes reachable, and premium
networks typically pay several times what Ezoic-tier networks do for the same
traffic. Everything below that is really about building the audience and
trust signals (which this work does), not extracting revenue yet.

## Strongest commercial potential, by section

1. **Tour and explorer pages** — the most narrative and curated content on the
   site, and the place a "want to go deeper?" prompt feels most natural rather
   than tacked on. These are also the pages most likely to convert on
   affiliate book/documentary links, since a reader who just finished the
   Mongol conquest tour is primed to want Weatherford's book.
2. **Person and place pages** — the volume play. These are what search engines
   will send the most traffic to over time (long-tail queries like "Genghis
   Khan empire map" or "Roman Empire extent 200 CE"), and at scale, volume is
   what display-ad revenue is built on.
3. **The map itself** — deliberately left ad-free and paywall-free. It's the
   product's core differentiator and the reason people come back; degrading it
   for a few cents of CPM would cost far more in retention and word-of-mouth
   than it would earn. If a Pro tier ever gates anything, it should be
   *additive* map features (exports, saved pins, themes), never the base map
   experience.
4. **A future classroom/education angle** — worth watching. Teachers linking to
   specific years/places for lesson plans is a plausible organic growth loop
   this site is well-positioned for, and it's also the most concrete of the
   `/pro` ideas (worksheets, a student view, shareable map states) — genuinely
   worth paying for institutionally in a way individual "ad-free" tiers
   usually aren't.
