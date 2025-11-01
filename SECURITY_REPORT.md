# Security en Update Check Rapport

**Datum**: 2025-01-28  
**Project**: Narwal Creative - Astro + Sanity CMS

## 1. Dependency Security Audit

### Root Directory (`/`)

**Totaal**: 24 vulnerabilities
- **Low**: 12
- **Moderate**: 12
- **High**: 0
- **Critical**: 0

#### Belangrijkste vulnerabilities:

1. **@astrojs/react** (Moderate)
   - Via: vite
   - Fix beschikbaar: ✅

2. **@sanity/astro** (Moderate)
   - Via: @sanity/visual-editing, sanity
   - Fix beschikbaar: ✅ (update naar 3.2.0)

3. **esbuild** (Moderate)
   - Via: vite
   - CVSS: 5.3
   - Fix beschikbaar: ✅

4. **vite** (Moderate)
   - Via: esbuild
   - Fix beschikbaar: ✅

5. **prismjs** (Moderate)
   - Via: refractor
   - CVSS: 4.9
   - Fix beschikbaar: ✅ (via @sanity/astro update)

### Studio Directory (`/studio`)

**Totaal**: 18 vulnerabilities
- **Low**: 11
- **Moderate**: 7
- **High**: 0
- **Critical**: 0

#### Belangrijkste vulnerabilities:

1. **sanity-plugin-link-field** (Moderate)
   - Via: @sanity/ui, sanity
   - Fix beschikbaar: ❌ (afhankelijk van plugin update)

2. **sanity-plugin-seo** (Moderate)
   - Via: @sanity/ui, sanity
   - Fix beschikbaar: ❌ (afhankelijk van plugin update)

3. **prismjs** (Moderate)
   - Via: refractor
   - Fix beschikbaar: ❌ (afhankelijk van plugin updates)

## 2. Dependency Updates Check

### Root Directory - Belangrijkste updates:

#### Minor/Patch Updates (Aanbevolen):
- `@astrojs/check`: 0.9.4 → 0.9.5
- `@astrojs/mdx`: 4.3.8 → 4.3.9
- `@astrojs/partytown`: 2.1.1 → 2.1.4
- `astro`: 5.15.1 → 5.15.3
- `astro-compress`: 2.2.28 → 2.3.8
- `sanity`: 4.11.0 → 4.12.0
- `sass`: 1.77.6 → 1.93.3
- `tailwindcss`: 3.4.4 → 3.4.18
- `swiper`: 11.1.4 → 11.2.10

#### Major Updates (Voorzichtig evalueren):
- `@astrojs/react`: 3.6.3 → 4.4.1 (major update)
- `@types/react`: 18.3.26 → 19.2.2 (major update)
- `react`: 18.3.1 → 19.2.0 (major update)
- `react-dom`: 18.3.1 → 19.2.0 (major update)
- `eslint`: 8.57.0 → 9.39.0 (major update)
- `tailwindcss`: 3.4.4 → 4.1.16 (major update)

### Studio Directory - Updates:

- `sanity`: 4.11.0 → 4.12.0
- `@sanity/vision`: 4.11.0 → 4.12.0

## 3. Security Code Review

### ✅ Goed:

1. **Environment Variables**
   - `.env` bestanden zijn correct uitgesloten in `.gitignore`
   - `PUBLIC_SANITY_*` variabelen zijn correct als public (normaal voor Sanity)

2. **Remote Image Patterns**
   - `astro.config.mjs` beperkt remote images tot specifieke domains
   - Geen open wildcards die security risico's vormen

3. **Error Handling**
   - Error handling voorkomt informatie lekken in productie
   - Development-only logging wordt correct gebruikt

### ⚠️ Issues Gevonden:

1. ✅ **Hardcoded Sanity Credentials** (HIGH PRIORITY) - **OPGELOST**
   - **Locatie**: `sanity.config.ts` (root) en `studio/sanity.config.ts`
   - **Issue**: `projectId: 'q178y836'` en `dataset: 'production'` waren hardcoded
   - **Status**: Nu gebruik van environment variables met fallback naar PUBLIC_* variabelen
   - **Risico**: Opgelost - flexibele configuratie per omgeving mogelijk

2. ✅ **Oude WordPress API Code** (MEDIUM PRIORITY) - **OPGELOST**
   - **Locaties**: `src/lib/api.js`, `src/lib/original_api.js` (verwijderd)
   - **Issue**: Code verwees naar `WPGRAPHQL_URL` maar werd niet meer gebruikt
   - **Status**: Bestanden verwijderd, code opgeruimd
   - **Risico**: Opgelost - geen verwarring meer

3. **SANITY_API_READ_TOKEN in Client-Side** (LOW PRIORITY)
   - **Locatie**: `src/sanity/lib/load-query.ts`, `src/sanity/lib/sanity-client.ts`
   - **Status**: Wordt alleen gebruikt wanneer `visualEditingEnabled === true`
   - **Nota**: Dit is acceptabel voor Sanity Visual Editing functionaliteit
   - **Risico**: Laag, maar token moet alleen gebruikt worden voor read-only operaties

## 4. Aanbevolen Acties

### High Priority

1. ✅ **Hardcoded projectId/dataset vervangen door environment variables** - **VOLTOOID**
   - ✅ `sanity.config.ts` bijgewerkt om environment variables te gebruiken
   - ✅ `studio/sanity.config.ts` bijgewerkt om environment variables te gebruiken
   - Gebruikt nu `SANITY_STUDIO_PROJECT_ID` / `PUBLIC_SANITY_PROJECT_ID` en `SANITY_STUDIO_DATASET` / `PUBLIC_SANITY_DATASET`
   - Error handling toegevoegd voor ontbrekende project ID

2. ✅ **Oude WordPress API code opruimen** - **VOLTOOID**
   - ✅ `src/lib/api.js` verwijderd
   - ✅ `src/lib/original_api.js` verwijderd
   - ✅ `replaceUrls` functie in `src/lib/utils.js` gemarkeerd als deprecated

3. **Security vulnerabilities oplossen**
   - Voer `npm audit fix` uit voor automatisch oplosbare issues
   - Update `@sanity/astro` naar 3.2.0 indien mogelijk (major update)
   - Update `vite` en `esbuild` voor development server security

### Medium Priority

1. **Dependency updates**
   - Update minor/patch versions voor betere security
   - Evalueer major updates (React 19, Tailwind 4) in aparte branch

2. **SANITY_API_READ_TOKEN beveiliging**
   - Verifieer dat token alleen read-only permissions heeft in Sanity dashboard
   - Overweeg token rotation na code review

### Low Priority

1. **Code cleanup**
   - Verwijder ongebruikte imports
   - Verwijder commented-out code in `original_api.js`

## 5. Conclusie

Het project heeft een redelijk goede security baseline, maar er zijn enkele verbeterpunten:

- **Dependency vulnerabilities**: Vooral low/moderate severity, meeste zijn oplosbaar via updates
- **Code security**: Hardcoded credentials moeten worden vervangen door environment variables
- **Code hygiene**: Oude WordPress code kan worden opgeruimd

De meeste issues zijn relatief eenvoudig op te lossen en vormen geen directe bedreiging voor de productie omgeving.

