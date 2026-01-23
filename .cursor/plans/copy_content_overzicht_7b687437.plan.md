---
name: Copy Content Overzicht
overview: Overzicht van alle benodigde copy/content voor de newsletter functionaliteit en cookie consent modal
todos: []
isProject: false
---

# Copy/Content Overzicht - Narwal Voice & Tone

**Voice characteristics**: Boutique, no-nonsense, hands-on, real, humanize brand stories, create cool stuff with lasting impact.

## 1. Newsletter Copy

### Formulier Velden

- **Naam veld label** (sr-only): `"Name"`
- **Naam placeholder**: `"Your name"`
- **Email veld label** (sr-only): `"Email Address"`
- **Email placeholder**: `"your@email.com"`
- **Submit button tekst**: `"Subscribe"`
- **Submit button wachttekst** (data-wait): `"Subscribing..."`

### Client-side Validatie Berichten

- **Leeg email veld**: `"Please enter your email address."`
- **Ongeldig email formaat**: `"Please enter a valid email address."`

### Server-side Error Berichten (uit `newsletter.ts`)

- **Al geregistreerd**: `"This email is already subscribed to our newsletter."`
- **Ongeldig email (Invalid Resource)**: `"Invalid email address. Please check and try again."`
- **Generieke fout**: `"Something went wrong. Please try again later."`
- **Server verbindingsfout**: `"Connection error. Please try again later."`
- **Server configuratie fout**: `"Server configuration error. Please contact support."`
- **Ongeldige aanvraag data**: `"Invalid request data."`
- **Gelieve geldig email**: `"Please enter a valid email address."`
- **Onverwachte fout**: `"An unexpected error occurred. Please try again later."`
- **Method not allowed**: `"Method not allowed"` (technisch)

### Success Berichten

- **Succesvol aangemeld**: `"You're in! Thanks for subscribing."`
- **Fallback success** (in component): `"Thanks! We've received your subscription."`

### Error Berichten (in component)

- **Fallback error**: `"Something went wrong. Please try again."`
- **JSON parse error**: `"Something went wrong. Please try again later."`

### ARIA Labels

- **Form aria-label**: `"Newsletter subscription form"`
- **Success region aria-label**: `"Newsletter subscription success message"`
- **Error region aria-label**: `"Newsletter subscription error message"`

---

## 2. Cookie Consent Copy

### Consent Modal (Eerste popup)

- **Label**: `"Cookie Preferences"`
- **Titel**: `"Let's talk cookies"`
- **Beschrijving**: `"We use essential cookies to keep things running smoothly, and optional tracking cookies to understand how you use our site. The optional ones only get set with your consent."`
- **Accept All Button**: `"Accept all"`
- **Accept Necessary Button**: `"Necessary only"`
- **Show Preferences Button**: `"Customize"`
- **Close Icon Label**: `"Close and reject all"`
- **Footer links**: `"<a href="#privacy">Privacy Policy</a><a href="#terms">Terms</a>"`

### Preferences Modal (Voorkeuren Centrum)

- **Titel**: `"Cookie Preferences"`
- **Accept All Button**: `"Accept all"`
- **Accept Necessary Button**: `"Necessary only"`
- **Save Preferences Button**: `"Save preferences"`
- **Close Icon Label**: `"Close"`
- **Service Counter Label**: `"Service|Services"` (singular|plural)

### Preferences Modal Sections

#### Section 1: Introductie

- **Titel**: `"About these cookies"`
- **Beschrijving**: `"We use cookies to make our site work better and to understand how you use it. Simple as that."`

#### Section 2: Noodzakelijke Cookies

- **Titel**: `"Essential cookies <span class="pm__badge">Always on</span>"`
- **Beschrijving**: `"These cookies are essential for the site to function. We can't turn them off, and neither can you."`
- **Linked Category**: `"necessary"`

#### Section 3: Analytische Cookies

- **Titel**: `"Analytics cookies"`
- **Beschrijving**: `"These help us understand how visitors use our site by collecting anonymous information."`
- **Linked Category**: `"analytics"`

#### Cookie Tabel Headers (Analytics)

- **Cookie kolom**: `"Cookie"`
- **Service kolom**: `"Service"`
- **Beschrijving kolom**: `"What it does"`

#### Cookie Tabel Body (Analytics)

- **im_youtube cookie**:
- **Naam**: `"im_youtube"`
- **Service**: `"Youtube Embed"`
- **Beschrijving**: `"Remembers if you've accepted YouTube embeds on this site."`
- **im_vimeo cookie**:
- **Naam**: `"im_vimeo"`
- **Service**: `"Vimeo Embed"`
- **Beschrijving**: `"Remembers if you've accepted Vimeo embeds on this site."`

#### Section 4: Advertentie Cookies

- **Titel**: `"Advertising cookies"`
- **Beschrijving**: `"These cookies help us show you ads that are relevant to your interests."`
- **Linked Category**: `"ads"`

#### Section 5: Meer Informatie

- **Titel**: `"Questions?"`
- **Beschrijving**: `"Got questions about our cookie policy? <a class="cc__link" href="#contact">Get in touch</a>."`

### Service Labels (in config)

- **Youtube Embed**: `"Youtube Embed"`
- **Vimeo Embed**: `"Vimeo Embed"`

---

## Voice & Tone Rationale

### Newsletter

- **Direct en persoonlijk**: "You're in!" in plaats van "Successfully subscribed"
- **To the point**: Korte, duidelijke berichten zonder onnodige woorden
- **Vriendelijk maar professioneel**: "Thanks for subscribing" voelt authentiek

### Cookie Consent

- **Conversational**: "Let's talk cookies" in plaats van formele titels
- **No-nonsense**: "Simple as that" - direct en eerlijk
- **Real**: "We can't turn them off, and neither can you" - transparant en direct
- **Boutique feel**: "Customize" in plaats van "Manage preferences" - korter en moderner

### Algemene principes

- Vermijd corporate jargon
- Gebruik actieve taal
- Houd het kort en krachtig
- Wees transparant en eerlijk
- Behoud professionele toon zonder stijf te zijn

## Implementatie Notities

1. **Newsletter**: Update alle error berichten in `newsletter.ts` en `Newsletter.astro` met de nieuwe copy
2. **Cookie Consent**: Update `CookieConsentConfig.ts` met de nieuwe Engelse teksten (verwijder NL vertalingen indien niet meer nodig)
3. **Links**: Controleer of #privacy, #terms, #contact naar de juiste pagina's verwijzen
4. **Consistentie**: Zorg dat de tone consistent is door alle teksten heen
