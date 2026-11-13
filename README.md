# US AOURIR — Union Sport Aourir website + official shop

A static website (HTML / CSS / JavaScript, no build step, no server code) with:

| File | Purpose |
| --- | --- |
| `index.html` | Club homepage: green utility bar + two-row header over a full-width photo slider, the club (staff photo, stats, values), team photo cards (U11–U18, Minimes), "Plus qu’un club" photo gallery with full-screen viewer, featured products, partner call, social links |
| `boutique.html` | Official shop (big-club store style): scrolling promo ticker, green shop header, framed promo banner (white + green jerseys), one product row per category with page counter and "Voir tout", live jersey personaliser, photo band, category tiles, full catalogue with filter / search / sort, "Retrait au club" and group-order cards, services and FAQ. Product window with gallery, size guide and live name + number preview. |

The cart is shared on both pages (cart icon in the header). There is **no online payment**: the customer fills in name / phone / pickup or delivery, and the order is sent to the club by **WhatsApp** (0690099637), with **e-mail** (`usaourir@gmail.com`) as a second option. The club then confirms by phone. Payment is made on delivery or on pickup at the club.

## Languages

French (default), Arabic (right-to-left) and English: language menu in the header and phone menu, FR · AR · EN links in the footer. Every new visit opens in French; a language picked with the switcher is kept while browsing (until the tab is closed). A link can force a language: `?lang=ar` or `?lang=en`.

- Interface text: `js/i18n.js`
- Club content and products: `data/club.js`, written as `{ fr: "…", ar: "…", en: "…" }`

## Editing content: `data/club.js`

Everything is in this one file:

- `settings.whatsapp`: the WhatsApp number orders are sent to, in international format, currently `212690099637` (0690099637). Empty it to receive orders by e-mail only.
- `settings.deliveryFee` (0 = "to be confirmed") and `settings.printingFee` (name + number printing, default 50 MAD).
- `stats`, `teams`, `categories` (each with a tile `image`), `products`.
- `kits`: colours of the home / away / third jerseys, used by the live printing preview. A product with `customizable: true` and `kit: "home"` gets the preview.
- `sizeGuide` (indicative, check it against your supplier's chart) and `faq` (shop questions).
- Shop ticker messages: `ann.1`–`ann.4` in `js/i18n.js`. The banner's repeated word is `banner.band`.

Matches: `date: "2026-11-22T15:00"`, `home: true/false`, `opponent`. Once played, add `score: [home, away]` and the match moves to "Résultats".

`matches` is kept in the file but not displayed (the matches section was removed).

⚠️ **The stats and prices are sample data.** Replace them with the club's real information before publishing.

## Images

### Club photos (`img/team/` → `img/photos/`)

The originals in `img/team/` aren't loaded by the site. Each photo has two web versions in `img/photos/`: `<name>-md.webp` (900 px, used in the page) and `<name>-lg.webp` (1920 px, used in the hero and the full-screen viewer).

In `data/club.js`:
- `heroSlides`: the homepage slider (photo, tag, title, text, button).
- `teams`: the team cards (name + photo).
- `gallery`: the "Plus qu’un club" photos and their captions (captions are based on the file names; edit them freely).

To add a photo: create the two WebP versions with the same name (`-md` and `-lg`), then add `{ image: "name", caption: { fr, ar, en } }` to `gallery`.

### Logo and products

- `img/logo.png` is the original logo mockup (crest on a dark background). `img/logo-crest.png` is the crest cut out on a transparent background, used everywhere on the site; `img/favicon-64.png` and `img/apple-touch-icon.png` are the browser icons.
- `img/products/*.png` are the original product photos. The site doesn't load them directly; it uses web versions in `img/shop/` (square WebP crops for the cards and gallery, plus the full view), about 0.8 MB in total instead of 5.7 MB.
- To add or change a photo: put the original in `img/products/`, create the `img/shop/` versions (square, about 900 × 900 px, WebP), and list them in the product's `images` in `data/club.js`. The first image is the card picture.

## Fonts

Roboto Condensed (headings, numbers, buttons) and Roboto (text), from Google Fonts; Cairo for Arabic.

## Colours

`#0E773F` / `#10693D` green, `#E1C257` gold, `#FFFFFF` white, `#0D1B0C` night. Defined as variables at the top of `css/style.css`.

## Running locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. After changing files on the hosting, raise the `?v=` numbers in the HTML pages so browsers load the new version.
