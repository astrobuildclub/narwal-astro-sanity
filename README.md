# Narwal Creative - Astro + Sanity CMS

Modern, toegankelijke website gebouwd met [Astro](https://astro.build) en [Sanity CMS](https://www.sanity.io). Dit project combineert de kracht van static site generation met een flexibel headless CMS voor optimale performance en content management.

## ✨ Features

### 🎨 Content Management

- **Sanity CMS** integratie voor headless content management
- **11 verschillende content blocks**: Text, Image, Video, Columns, Services, Team, Testimonials, Clients, Color blocks, Embed en Text Grid
- **Dynamische pagina types**: Homepage, Work Overview, Project Detail, en reguliere pagina's
- **Portable Text** rendering voor rijke content formatting
- **Sanity Studio** voor content editors

### 🎬 Media & Embedding

- **GDPR-compliant video embeds** (YouTube/Vimeo) met cookie consent
- **MP4 upload** ondersteuning voor directe video hosting
- **Custom poster images** voor alle video types
- **Responsive image handling** met Sanity CDN optimalisatie

### 🎯 Design & Layout

- **Breakout Grid System** met 5 niveau's (full, page, feature, popout, content)
- **Dark Mode** met localStorage persistentie
- **View Transitions** voor smooth page navigatie
- **Responsive typography** met Utopia type scale
- **SCSS modules** voor gestructureerde styling

### 🚀 Performance

- Static site generation met Astro
- Optimized image delivery via Sanity CDN
- Code splitting en lazy loading
- Netlify deployment ready

## ♿ (Accessibility) Features

- Astro 4.0
- Tailwind CSS support
- Prettier integration with `prettier-plugin-astro` and `prettier-plugin-tailwind`
- ESLint integration with strict accessibility settings for `eslint-plugin-jsx-a11y`
- Markdown and MDX support with examples included in the theme
- Uses the awesome `astro-icon` package for the icons
- Excellent Lighthouse/PageSpeed scores
- Accessible landmarks such as `header`, `main`, `footer`, `section` and `nav`
- Outline focus indicator which works on dark and light backgrounds
- Several `aria` attributes which provide a better experience for screen reader users
- `[...page].astro` and `[post].astro` demonstrate the use of dynamic routes and provide a basic blog with breadcrumbs and pagination
- `404.astro` provides a custom 404 error page which you can adjust to your needs
- `Header.astro` component included in the `DefaultLayout.astro` layout
- `Footer.astro` component included in the `DefaultLayout.astro` layout
- `SkipLinks.astro` component to skip to either the main menu or the main content
- `Navigation.astro` component with keyboard accessible (dropdown) navigation (arrow keys, escape key)
- `ResponsiveToggle.astro` component with an accessible responsive toggle button for the mobile navigation
- `DarkMode.astro` component toggle with accessible button and a user system preferred color scheme setting
- `SiteMeta.astro` SEO component for setting custom meta data on different pages
- `.sr-only` utility class for screen reader only text content (hides text visually)
- `prefers-reduced-motion` disables animations for users that have this preference turned on
- Ships with many components such as Accordions, Breadcrumbs, Modals, Pagination [and many more](https://accessible-astro.dev/accessible-components)
- A collection of utility classes such as breakpoints, button classes, font settings, resets and outlines in `src/assets/scss/base`
- View Transitions (⚠️ see [astro-docs](https://docs.astro.build/en/guides/view-transitions/#accessibility) for accessibility considerations)

## 🚀 Getting started

### 1. Clone de repository

```bash
git clone https://github.com/astrobuildclub/narwal-astro-sanity.git
cd narwal-astro-sanity
```

### 2. Installeer dependencies

```bash
npm install
```

### 3. Sanity CMS Setup

1. **Maak een Sanity project aan** op [sanity.io](https://www.sanity.io)
2. **Kopieer `.env.example` naar `.env`** en vul de waarden in:
   ```bash
   cp .env.example .env
   ```
3. **Vul je Sanity credentials in** in `.env`:
   - `PUBLIC_SANITY_PROJECT_ID`: Je Sanity Project ID (vind je in [Sanity Manage](https://www.sanity.io/manage))
   - `PUBLIC_SANITY_DATASET`: Meestal `"production"` of `"development"`
   - `PUBLIC_SANITY_API_VERSION`: API versie (standaard: `"2025-01-28"`)
   - `SANITY_API_READ_TOKEN`: Alleen nodig voor Visual Editing (optioneel)

4. **Vul je Mailchimp credentials in** in `.env`:
   - `MAILCHIMP_API_KEY`: Je Mailchimp API key (vind je in Account → Extras → API keys)
   - `MAILCHIMP_LIST_ID`: Je Mailchimp Audience/List ID (vind je in Audience → Settings → Audience name and defaults → Audience ID)

5. **Voor Sanity Studio**, kopieer `studio/.env.example` naar `studio/.env.local`:
   ```bash
   cp studio/.env.example studio/.env.local
   ```
   Vul `SANITY_STUDIO_PROJECT_ID` en `SANITY_STUDIO_DATASET` in (moeten overeenkomen met root `.env`)

**Tip – Afbeeldingen:** Upload afbeeldingen bij voorkeur in hoge resolutie (bijv. 1920px breed of groter voor full-width). De site optimaliseert ze automatisch via Astro Image (responsive srcset, AVIF).

### 6. Start de development server

```bash
npm run dev
```

De website draait nu op `http://localhost:4321`

### 7. Start Sanity Studio (optioneel)

In een aparte terminal:

```bash
cd studio
npm run dev
```

Sanity Studio draait nu op `http://localhost:3333`

## 📦 Beschikbare commando's

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Installeert dependencies                    |
| `npm run dev`     | Start lokale dev server op `localhost:4321` |
| `npm run build`   | Bouwt productie site naar `./dist/`         |
| `npm run preview` | Preview je build lokaal, voor deployen      |
| `npm run format`  | Format alle bestanden met Prettier          |

## 📐 Content Blocks

Het project bevat 11 verschillende content blocks die je in Sanity Studio kunt gebruiken:

| Block                | Beschrijving                                         |
| -------------------- | ---------------------------------------------------- |
| **TextBlock**        | Rijke tekst content met Portable Text                |
| **ImageBlock**       | Afbeeldingen met optionele captions en sizing        |
| **VideoBlock**       | YouTube/Vimeo embeds (GDPR-compliant) of MP4 uploads |
| **ColumnsBlock**     | 2-4 kolommen met geneste content blocks              |
| **ServicesBlock**    | Service overzicht met optionele beschrijvingen       |
| **TeamBlock**        | Team member presentatie                              |
| **TestimonialBlock** | Klant testimonials met foto's                        |
| **ClientsBlock**     | Client logos overzicht                               |
| **ColorBlock**       | Volledige breedte kleur blokken                      |
| **EmbedBlock**       | Custom embed code                                    |
| **TextGridBlock**    | Grid layout voor tekst content                       |

Alle blocks ondersteunen verschillende size opties (content, popout, feature, page, full) voor flexibele layout controle.

## 🎨 Layout System

Het project gebruikt een **Breakout Grid System** met 5 niveau's:

- **full**: Volledige viewport breedte
- **page**: Max breedte met consistente padding
- **feature**: Breed content gebied
- **popout**: Medium content gebied
- **content**: Standaard leesbare breedte

Blocks kunnen deze sizes gebruiken voor responsieve, flexibele layouts.

## 🔄 Navigatie & Page Transitions

De site gebruikt **Astro's `ClientRouter`** (`astro:transitions`, zie `src/components/SiteMeta.astro`) als navigatiemechanisme: een same-document implementatie van de browser View Transitions API met een JS-router. Bij een interne link-klik fetcht de router de nieuwe pagina, swapt de DOM binnen een `document.startViewTransition()`, en valt op browsers zonder View Transitions-support terug op een gewone, ongeanimeerde DOM-swap (`fallback="swap"` — geen animatie, wel altijd een werkende pagina). Dit is bewust géén native *cross-document* view transition (`@view-transition { navigation: auto }`): die werkt alleen in Chromium, zonder polyfill, en zou de bestaande prefetching en persisted elements (zie hieronder) kosten zonder visueel iets toe te voegen.

**Belangrijkste onderdelen:**

| Onderdeel | Bestand | Rol |
| --- | --- | --- |
| Router | `src/components/SiteMeta.astro` | `<ClientRouter fallback="swap" />`, site-wide via `DefaultLayout.astro` |
| Prefetch | `astro.config.mjs` | `viewport`-strategie: links prefetchen zodra ze in beeld scrollen, zodat swaps meestal instant aanvoelen |
| Preloader / progress bar | `src/components/Preloader.astro` + `public/js/preloader.js` | Dunne topbar tijdens navigatie (`mode-nav`) + volledig scherm bij eerste page load (`mode-initial`); `transition:persist` zodat hij navigatie overleeft |
| Vertrek-feedback | `src/layouts/DefaultLayout.astro` (CSS vars `--nav-transition-*`) + `preloader.js` (`startNav`) | Subtiele dim/blur op de oude pagina, ~60ms gedebounced zodat snelle/geprefetchte navigatie niet flitst |
| Crossfade | `src/layouts/DefaultLayout.astro` (`::view-transition-old/new(page-main)`) | Named view transition op `<main>`, canonieke plek voor deze CSS (niet dupliceren in `global.css`) |
| Coördinatie-event | `preloader.js` → `document.dispatchEvent(new CustomEvent('preloader:nav-complete'))` | Signaal dat de preloader écht klaar is; overige systemen wachten hierop i.p.v. meteen bij de DOM-swap te reageren |
| Content reveal | `src/layouts/DefaultLayout.astro` (`initImageFadeInOnView`, `initStaggerOnView`, `initRevealOnView`) + `global.css` (`.fade-on-view`, `.stagger-on-view-item`, `.reveal-on-view`) | IntersectionObserver-gedreven fade/slide-in; content die al in beeld is bij binnenkomst wacht op `preloader:nav-complete` voor die reveal, met een safety-timeout zodat niets permanent onzichtbaar kan blijven |
| Project thumbs | `src/components/ProjectCard.astro` (`data-reveal-children`) | Gebruikt hetzelfde reveal-systeem als hierboven — geen aparte animatie-library meer voor de thumbs |

**Volgorde bij een klik:** vertrek-feedback (dim/blur, gedebounced) → progress bar → DOM-swap + crossfade → preloader rondt af → pas dán animeert de nieuwe content (bv. de thumbs) in, in plaats van gelijktijdig met de preloader.

**Toegankelijkheid:** alle bovenstaande animaties (dim/blur, crossfade, reveal-on-view) respecteren `prefers-reduced-motion: reduce` en tonen content dan direct zonder transitie. De ingebouwde route-announcer van `ClientRouter` blijft ongemoeid voor screenreader-gebruikers.

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) 5.15.1
- **CMS**: [Sanity](https://www.sanity.io) 4.11.0
- **Styling**: SCSS + Tailwind CSS
- **Type Safety**: TypeScript
- **Image Optimization**: @sanity/image-url
- **Video Embeds**: @orestbida/iframemanager + vanilla-cookieconsent
- **Navigatie**: Astro `ClientRouter` (View Transitions API) — zie [Navigatie & Page Transitions](#-navigatie--page-transitions)
- **Animaties**: `motion` (filter-interacties) + CSS/IntersectionObserver reveal-systeem (scroll- en page-reveals)
- **Deployment**: Netlify

## 🔐 Security

**BELANGRIJK**:

- ⚠️ Commit **NOOIT** je `.env` bestanden
- 📝 `.env.example` is een template - kopieer en vul in met je eigen credentials
- 🔄 Rotate tokens regelmatig, vooral na repository migraties
- 🔒 Alle gevoelige data is uit git history verwijderd

## 📁 Project Structuur

```
narwal-astro-sanity/
├── src/
│   ├── components/
│   │   ├── blocks/          # Content block components
│   │   ├── templates/        # Page templates
│   │   └── ...               # Overige components
│   ├── layouts/              # Astro layouts
│   ├── pages/                # Route pages
│   ├── sanity/               # Sanity configuratie
│   └── assets/               # Styles en assets
├── studio/                   # Sanity Studio
│   ├── schemas/              # Sanity schemas
│   └── sanity.config.ts
└── public/                   # Static assets
```

## 🚢 Deployment

### Netlify

Het project is geconfigureerd voor Netlify deployment:

1. **Environment Variables** instellen in Netlify dashboard:
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_SANITY_DATASET`
   - `PUBLIC_SANITY_API_VERSION`
   - `MAILCHIMP_API_KEY` (markeer als "Secret" voor beveiliging)
   - `MAILCHIMP_LIST_ID`

2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Andere platforms

Het project kan ook gedeployed worden naar andere static hosting providers zoals Vercel, Cloudflare Pages, of GitHub Pages.

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Studio Guide](https://www.sanity.io/docs/structure-builder-introduction)
