# Handmatig Projecten Ordenen in Sanity

De `@sanity/orderable-document-list` plugin is succesvol geïmplementeerd! Dit maakt het mogelijk om projecten handmatig te ordenen via drag-and-drop in Sanity Studio.

## Wat is er geïmplementeerd?

### 1. Plugin Installatie
- `@sanity/orderable-document-list` is geïnstalleerd

### 2. Desk Structure (`src/sanity/deskStructure.ts`)
- Nieuwe desk structure gemaakt met een orderable projects lijst
- De "Projects" lijst ondersteunt nu drag-and-drop ordering
- Andere document types zijn ook toegevoegd aan de structure

### 3. Work Schema Update (`src/sanity/schemaTypes/documents/work.ts`)
- `orderRank` veld toegevoegd voor het opslaan van de volgorde
- `orderRankOrdering` toegevoegd voor use in andere document lijsten

### 4. Query Update (`src/sanity/lib/queries.ts`)
- `ALL_PROJECTS_QUERY` sorteert nu op `orderRank` in plaats van `_createdAt`
- Dit betekent dat projecten in het werk-overzicht worden getoond in de handmatig ingestelde volgorde

### 5. Sanity Config Update (`sanity.config.ts`)
- De nieuwe desk structure wordt nu gebruikt in de Sanity Studio

## Hoe te gebruiken

### Stap 1: Initialiseer de volgorde
1. Open Sanity Studio (`/studio`)
2. Ga naar "Projects" in de linker navigatie
3. Klik op de drie puntjes (menu) rechtsboven
4. Klik op "Reset Order"
   - Dit genereert initiële orderRank waarden voor alle bestaande projecten
   - Je hoeft dit maar één keer te doen

### Stap 2: Projecten herordenen
1. Open de "Projects" lijst in Sanity Studio
2. Selecteer een project door erop te klikken
3. Sleep het project naar de gewenste positie
4. De wijziging wordt automatisch opgeslagen

### Geavanceerde functies
- **Meerdere projecten selecteren**: Houd `Shift` ingedrukt en klik op een tweede item
- **Selectie aan/uitzetten**: Houd `Command` (Mac) of `Control` (Windows) ingedrukt en klik op items
- **Meerdere projecten tegelijk verplaatsen**: Selecteer meerdere projecten en sleep ze samen

## Impact op de Website

### Work Overview Pagina
- Projecten op de werk-overzicht pagina worden nu getoond in de volgorde die je instelt in Sanity
- De handmatige volgorde wordt ALLEEN gebruikt voor het werk-overzicht (niet de homepage)

### Homepage
- De homepage gebruikt nog steeds de handmatig geselecteerde "Featured Projects"
- Deze volgorde wordt gecontroleerd via de `featuredProjects` array in de homepage instellingen

## Technische Details

De plugin gebruikt Lexorank om de volgorde bij te houden. Dit betekent:
- Snelle performance - alleen de verplaatste items worden geüpdatet
- Nieuwe projecten krijgen automatisch een orderRank waarde
- De volgorde blijft behouden zelfs als je nieuwe projecten toevoegt

## Belangrijke Opmerkingen

⚠️ **Let op**: Als je projecten hebt die nog geen `orderRank` waarde hebben, zullen ze ONDER aan de lijst verschijnen. Gebruik "Reset Order" om dit op te lossen.

✅ **Tip**: Nieuwe projecten die je aanmaakt worden automatisch onderaan de lijst geplaatst. Je kunt ze daarna verslepen naar de gewenste positie.
