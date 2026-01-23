---
name: Preloader Implementatie
overview: Implementeer een preloader component die 0-100% toont tijdens de eerste page load, met smooth animaties en integratie met het bestaande design system. De preloader verschijnt alleen bij initial page load, niet bij Astro view transitions.
todos:
  - id: create-preloader-component
    content: Maak Preloader.astro component met full-screen overlay, progress bar, en loading tracking JavaScript
    status: pending
  - id: implement-progress-tracking
    content: Implementeer progress tracking voor DOMContentLoaded, images, en window.load events
    status: pending
  - id: add-sessionstorage-logic
    content: Voeg sessionStorage logica toe om eerste load te detecteren en view transitions te skippen
    status: pending
  - id: integrate-in-defaultlayout
    content: Voeg Preloader component toe aan DefaultLayout.astro direct na opening body tag
    status: pending
  - id: style-preloader
    content: Style preloader met bestaande CSS variabelen en dark mode support
    status: pending
  - id: add-fade-animations
    content: Implementeer fade-out animatie wanneer loading compleet is (0.5s ease-out)
    status: pending
isProject: false
---

# Preloader Implementatie Plan

## Overzicht

Implementeer een preloader die de initial page load (0-100%) toont. De preloader verschijnt alleen bij de eerste page load en verdwijnt wanneer de pagina volledig is geladen. Bij Astro view transitions (navigatie tussen pagina's) verschijnt de preloader niet.

## Architectuur

```
Initial Page Load
  → Check: Is dit eerste load? (sessionStorage)
  → Preloader verschijnt (0%)
  → Track loading progress (DOM, images, fonts, resources)
  → Update progress bar (0 → 100%)
  → Minimum display tijd: 500ms
  → Hide preloader wanneer complete
  → Fade out animatie (0.5s ease-out)
  → Verwijder uit DOM na animatie
```

## Implementatie Details

### 1. Preloader Component

**Bestand**: `src/components/Preloader.astro`

**Structuur**:

- Full-screen overlay met `position: fixed`
- Progress bar bovenaan viewport (2-3px hoog)
- Optionele percentage indicator centraal
- Z-index: 9999 (boven alle content)

**Styling**:

- Gebruik CSS variabelen uit `default.css`:
  - `--white` / `--black` voor background (dark mode support via `data-theme`)
  - `--primary` voor progress bar kleur
  - `--easing-easeOutExpo` voor animaties
- Background: `var(--white)` in light mode, `var(--black)` in dark mode
- Progress bar: `var(--primary)` kleur
- Smooth transitions met `transition: width 0.3s var(--easing-easeOutExpo)`

**JavaScript Functionaliteit**:

- Track loading progress via:
  - `DOMContentLoaded` event (~30%)
  - Image loading (alle `<img>` tags op pagina) (~70%)
  - `window.load` event (100%)
- Simuleer progress als fallback voor snelle loads
- Update progress bar real-time met `requestAnimationFrame`
- Minimum display tijd: 500ms voor UX
- Gebruik `sessionStorage` om te tracken of preloader al is getoond

**View Transitions Compatibiliteit**:

- Check `sessionStorage.getItem('preloader-shown')` - als true, skip preloader
- Luister naar `astro:page-load` om te bevestigen dat het geen eerste load is
- Alleen tonen bij `window.performance.navigation.type === 'navigate'` (niet bij reload/back-forward)

### 2. Integratie in DefaultLayout

**Bestand**: `src/layouts/DefaultLayout.astro`

**Wijzigingen**:

- Import Preloader component bovenaan (na andere imports)
- Voeg `<Preloader />` toe direct na opening `<body>` tag (voor SiteNavigation)
- Positionering: Preloader moet als eerste element in body staan

**Code locatie**:

```astro
<body>
  <Preloader />
  <SiteNavigation menu={primaryMenu} generalSettings={generalSettings} />
  ...
</body>
```

### 3. Loading Progress Tracking

**Progress berekening strategie**:

1. Start bij 0% wanneer preloader wordt getoond
2. `DOMContentLoaded`: verhoog naar 30%
3. Track alle images: tel loaded images, update progress naar 70% wanneer alle images geladen zijn
4. `window.load`: verhoog naar 100%
5. Minimum tijd: wacht minstens 500ms voordat je naar 100% gaat (ook als alles al geladen is)

**Image tracking**:

- Selecteer alle `<img>` tags op de pagina
- Luister naar `load` event op elke image
- Update progress proportioneel: `(loadedImages / totalImages) * 40% + 30%`
- Als geen images: spring direct naar 70% na DOMContentLoaded

**Font loading**:

- Typekit fonts worden geladen via externe stylesheet
- Gebruik `document.fonts.ready` Promise om fonts te tracken (optioneel)

### 4. Accessibility & Performance

**Accessibility**:

- Voeg `aria-hidden="true"` toe aan preloader container
- Geen focusable elements tijdens loading
- Screen reader vriendelijk - preloader verbergt geen belangrijke content

**Performance**:

- Gebruik `requestAnimationFrame` voor smooth progress updates
- Debounce progress updates indien nodig (max 60fps)
- Cleanup event listeners na completion
- Verwijder preloader uit DOM na fade-out animatie

**Browser Support**:

- Modern browsers (ES6+)
- Fallback: als `sessionStorage` niet beschikbaar is, toon preloader altijd (maar skip bij view transitions via Astro events)

## Bestanden die worden aangemaakt/gewijzigd

1. **Nieuw**: `src/components/Preloader.astro` - Preloader component met progress bar en loading tracking
2. **Wijzig**: `src/layouts/DefaultLayout.astro` - Voeg Preloader component toe na opening body tag

## Design Specificaties

**Progress Bar**:

- Position: `fixed`, `top: 0`, `left: 0`
- Width: `0%` → `100%` (via inline style of CSS variable)
- Height: `3px`
- Background: `var(--primary)`
- Transition: `width 0.3s var(--easing-easeOutExpo)`
- Z-index: 10000 (boven overlay)

**Overlay**:

- Position: `fixed`, full viewport (`top: 0`, `left: 0`, `width: 100%`, `height: 100%`)
- Background: `var(--white)` (light mode) / `var(--black)` (dark mode)
- Z-index: 9999
- Opacity: `1` → `0` bij fade-out
- Transition: `opacity 0.5s var(--easing-easeOutExpo)`
- Pointer-events: `none` na completion (of verwijder uit DOM)

**Percentage Display** (optioneel - kan later worden toegevoegd):

- Position: `absolute`, gecentreerd
- Font size: groot, licht
- Color: `var(--black)` (light mode) / `var(--white)` (dark mode)
- Fade out samen met overlay

## Technical Implementation Details

**SessionStorage Logic**:

```javascript
// Check bij mount
const preloaderShown = sessionStorage.getItem('preloader-shown');
if (preloaderShown === 'true') {
  // Skip preloader - dit is niet de eerste load
  return;
}

// Na completion
sessionStorage.setItem('preloader-shown', 'true');
```

**Progress Update Pattern**:

```javascript
let progress = 0;
const updateProgress = (newProgress) => {
  progress = Math.min(100, Math.max(progress, newProgress));
  progressBar.style.width = `${progress}%`;
  requestAnimationFrame(() => {
    // Smooth update
  });
};
```

**Image Loading Tracking**:

```javascript
const images = document.querySelectorAll('img');
let loadedCount = 0;
images.forEach(img => {
  if (img.complete) {
    loadedCount++;
  } else {
    img.addEventListener('load', () => {
      loadedCount++;
      updateProgress(30 + (loadedCount / images.length) * 40);
    });
  }
});
```

## Styling Variabelen (uit default.css)

- `--white`: #fdfdfa (light mode background)
- `--black`: rgb(12, 12, 12) (dark mode background)
- `--primary`: #020303 (light mode) / #ff851b (dark mode) - progress bar kleur
- `--easing-easeOutExpo`: cubic-bezier(0.19, 1, 0.22, 1) - animatie easing

## Testing Checklist

- Test op verschillende netwerk snelheden (slow 3G, fast)
- Test met veel images op pagina
- Test dark mode toggle tijdens preloader
- Test view transitions (preloader moet niet verschijnen)
- Test browser refresh (preloader moet verschijnen)
- Test direct navigation (preloader moet niet verschijnen na eerste load)
- Test op verschillende browsers (Chrome, Firefox, Safari)