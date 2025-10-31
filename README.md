# Narwal Creative - Astro + Sanity CMS

Modern website gebouwd met Astro en Sanity CMS, met toegankelijke componenten en een solide basis voor content management.

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

4. **Voor Sanity Studio**, kopieer `studio/.env.example` naar `studio/.env.local`:
   ```bash
   cp studio/.env.example studio/.env.local
   ```
   Vul `SANITY_STUDIO_PROJECT_ID` en `SANITY_STUDIO_DATASET` in (moeten overeenkomen met root `.env`)

### 4. Start de development server

```bash
npm run dev
```

De website draait nu op `http://localhost:4321`

### 5. Start Sanity Studio (optioneel)

In een aparte terminal:

```bash
cd studio
npm run dev
```

Sanity Studio draait nu op `http://localhost:3333`

## 📦 Beschikbare commando's

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installeert dependencies                     |
| `npm run dev`     | Start lokale dev server op `localhost:4321`  |
| `npm run build`   | Bouwt productie site naar `./dist/`         |
| `npm run preview` | Preview je build lokaal, voor deployen      |

## 🔐 Security

**BELANGRIJK**: 
- Commit **NOOIT** je `.env` bestanden
- `.env.example` is een template - kopieer en vul in met je eigen credentials
- Rotate tokens regelmatig, vooral na repository migraties

## 📦 Other Accessible Astro projects

- [Accessible Astro Dashboard](https://github.com/markteekman/accessible-astro-dashboard/)
- [Accessible Astro Components](https://github.com/markteekman/accessible-astro-components/)

## ❤️ Helping out

If you find that something isn't working right then I'm always happy to hear it to improve this starter! You can contribute in many ways and forms. Let me know by either:

1. [Filing an issue](https://github.com/markteekman/accessible-astro-starter/issues)
2. [Submitting a pull request](https://github.com/markteekman/accessible-astro-starter/pulls)
3. [Starting a discussion](https://github.com/markteekman/accessible-astro-starter/discussions)
4. [Buying me a coffee!](https://www.buymeacoffee.com/markteekman)

## ☕ Thank you!

A big thank you to the creators of the awesome Astro static site generator and to all using this starter to make the web a bit more accessible for all people around the world :)

[![buymeacoffee-button](https://user-images.githubusercontent.com/3909046/150683481-be070424-7bb0-4dd7-a3cb-43b5605163f5.png)](https://www.buymeacoffee.com/markteekman)
