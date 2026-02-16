# Preloader Blueprint - NarwalCreative (Astro)

## 1. Korte samenvatting van de huidige preloader

De preloader bestaat uit een full-screen overlay met progressbar en percentage (`src/components/Preloader.astro`) die wordt aangestuurd door `public/js/preloader.js`.

- Eerste paginalaad:
  - Alleen bij een echte first navigation (`navigate`) en zolang `sessionStorage.preloader-shown !== "true"`.
  - `DefaultLayout.astro` zet vroeg `preloader-active` op `<html>`, waardoor overige body-content tijdelijk verborgen is.
  - Script bouwt progress in stappen op (`5 -> 30 -> 30..70 via images -> 100`) met smoothing.
  - Na `window.load` + minimum zichtduur wordt overlay verborgen en `preloader-shown` opgeslagen.
- Interne Astro-transities:
  - Geen full overlay meer, alleen top progressbar (`is-bar-only`).
  - Bar start op `astro:before-preparation`/`astro:before-swap` en eindigt op `astro:after-swap`/`astro:page-load`.
  - Bij `prefers-reduced-motion: reduce` wordt deze transition-bar niet gestart.

## 2. Requirements

### Functioneel

- Toon full overlay alleen op eerste paginalaad binnen sessie.
- Toon bij interne routewissels alleen een topbar (geen overlay).
- Houd progress monotonic (nooit visueel teruglopen).
- Verwijder loader pas nadat:
  - werk klaar is (`window.load` of swap klaar),
  - minimum display-tijd verstreken is.

### Timing en drempels (huidige implementatie)

- `minDisplay`: `500ms` (`data-min-display` in `Preloader.astro`).
- `transitionDelay`: `0ms` (wel aanwezig als config, momenteel niet gebruikt).
- `transitionMax`: `2000ms` (fallback timeout voor transition bar).
- `completeHold`: `140ms` voor visuele afronding rond 100%.
- Hide cleanup delay: `220ms`.

### UX/a11y

- Progress UI:
  - bar met `role="progressbar"` en `aria-valuenow/min/max`.
  - percentage tekst zichtbaar bij overlay, verborgen bij bar-only.
- Reduced motion:
  - Transition-bar wordt overgeslagen bij `prefers-reduced-motion: reduce`.
  - Initiale first-load overlay wordt momenteel niet expliciet op reduced-motion uitgezet.

## 3. Componenten en verantwoordelijkheden

### `src/layouts/DefaultLayout.astro`

- Preloader gating vóór eerste render:
  - Zet `preloader-active` op `<html>` bij first navigation.
  - CSS onderdrukt tijdelijk alle body children behalve `#preloader`.
- Mount globale componenten:
  - `<Preloader />` plus `ViewTransitions`.

### `src/components/Preloader.astro`

- Levert DOM-structuur:
  - `#preloader`, `.preloader__bar`, `.preloader__percent`.
- Exporteert runtime configuratie via `data-*` attributen.
- Laadt `public/js/preloader.js`.

### `public/js/preloader.js`

- Centrale state-machine en animatiecontroller:
  - `current`, `target`, `setTarget`, `tick()` smoothing.
- First-load flow:
  - `showOverlay()`, `trackImages()`, `hideOverlay()`.
- Transition flow:
  - `showTransitionBar()`, `hideTransitionBar()`.
- Integratie met Astro events:
  - `astro:before-preparation`, `astro:before-swap`, `astro:after-swap`, `astro:page-load`.
- Session flags:
  - `preloader-shown`, `preloader-transition-pending`.

### `public/css/preloader.css`

- Basestyles voor overlay/bar/percent.
- Utility states:
  - `.is-hidden` (opacity/pointer events),
  - `.is-bar-only` (transparante achtergrond, geen percentage).

## 4. Logica/states/transities

### States

- `hidden`: preloader staat uit (`is-hidden` + vaak `is-bar-only`).
- `overlay-loading`: full overlay actief (eerste load).
- `bar-transition-loading`: alleen topbar actief (navigatie/transitie).
- `ready-to-hide`: target op `100`, wacht op hold/cleanup.

### Transitieflow (eerste load)

1. Gate:
  - Alleen als `shouldShowInitial === true`.
2. Start:
  - `showOverlay()` zet zichtbaar, reset progress, target `5`.
3. Voortgang:
  - `DOMContentLoaded` -> target `30`.
  - `trackImages()` verhoogt target naar `30..70` op basis van image load ratio.
4. Afronding:
  - Op `window.load`: `hideOverlay()`.
  - Forceer `100%`, wacht resterende `minDisplay`, daarna `completeHold`.
  - Verwijder `preloader-active`, zet hidden/bar-only, reset.
  - Schrijf `sessionStorage.preloader-shown = true`.

### Transitieflow (interne navigatie)

1. Trigger:
  - `astro:before-preparation` of `astro:before-swap` of click op interne link.
2. Start bar:
  - `showTransitionBar()`, progress loopt tijdgebaseerd naar max `transitionMax` (of langer bij pending wait-for-load).
3. Einde:
  - `astro:after-swap`/`astro:page-load` -> `hideTransitionBar()`.
  - Zet target `100`, wacht tot `current >= 99.5`, daarna hide/reset.

### Guards

- Monotonic target:
  - `setTarget()` gebruikt `target = Math.max(target, value)`.
- First-load alleen 1x per sessie:
  - `sessionStorage.preloader-shown`.
- Geen transitie-loader in reduced-motion:
  - vroegtijdige return in `showTransitionBar()`.
- Navigation type filtering:
  - alleen echte `navigate` voor initial overlay.

## 5. Astro.js toepassing en aandachtspunten

### Huidige aanpak

- Framework-onafhankelijk clientscript met Astro component wrapper.
- Werkt goed met Astro View Transitions via lifecycle events.
- Geen React-island nodig voor deze loader.

### Aanbevolen standaardisatie voor andere Astro-projecten

- Behoud dezelfde state-machine:
  - gescheiden first-load overlay en route-transition bar.
- Houd triggers event-gedreven:
  - Astro transition events + lokale click fallback.
- Houd progress monotonic en gesmoothed:
  - vermijd schokkerige jumps of terugval.
- Houd minimum zichtduur expliciet en configureerbaar (`data-min-display`).
- Houd reduced-motion gedrag consistent voor alle loader-modi.

### Concrete aandachtspunten in dit project

- `transitionDelay` wordt wel gelezen maar nu niet toegepast; verwijder of implementeer om verwarring te voorkomen.
- `progressbar` ARIA-attributen staan op een element met `aria-hidden="true"`; kies ofwel:
  - echt screenreader-visible progress semantics, of
  - puur decoratief zonder progressbar-rol.
- Overweeg reduced-motion guard ook voor initiale overlay-animatie als volledige motion-reductie gewenst is.

