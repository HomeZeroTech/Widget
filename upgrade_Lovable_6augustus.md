# HomeZero Widget — upgrade 6 augustus 2026

Instructies voor het **Lovable widget-generator project**. Dit document beschrijft uitsluitend wat er
op 6 augustus 2026 aan de widget is veranderd en wat de generator daarvoor moet aanpassen.

De volledige referentie van alle bestaande capabilities staat in **`LOVABLE_GENERATOR.md`**; alles
wat daar staat en hieronder niet genoemd wordt, blijft ongewijzigd.

**Samenvatting.** Vier nieuwe attributen (`data-name-required`, `data-firstname-placeholder`,
`data-lastname-placeholder`, `data-cta-text-color`), één uitgebreid attribuut (`data-show-name` werkt
nu in alle modi), één nieuwe waarde (`data-tile-display="none"`), en gewijzigd gedrag rond het
kleurverloop, de tekstkleur, het trimmen van waarden en het lettertype.

---

## 1. Naamvelden in alle modi — `data-show-name`

`data-show-name="true"` bestond al maar werkte **alleen in brochure-modus**. Vanaf nu werkt het in
alle vier de modi: `scan`, `classic`, `booking` en `brochure`. Bestaande brochure-widgets veranderen
niet.

Voornaam en achternaam zijn **altijd één paar**: ze worden samen getoond, naast elkaar in één rij, en
zijn niet los aan of uit te zetten. Bouw in de configurator dus **één toggle**, geen twee.

**Positie in het formulier:**

| Modus | Positie | Label als níet verplicht |
|---|---|---|
| `scan` | ná de adresvelden, vóór telefoon/e-mail | `(Optioneel)` |
| `booking` | bovenaan (geen adres), vóór telefoon/e-mail | `(Optioneel)` |
| `classic` | ná het adres, vóór telefoon/e-mail | geen achtervoegsel |
| `brochure` | bovenaan, vóór e-mail | geen achtervoegsel |

Het achtervoegsel volgt per modus wat de overige labels in dat formulier al doen — scan en booking
zetten `(Optioneel)` achter niet-verplichte velden, classic en brochure niet.

**In de preview:** het naampaar blijft op mobiel **naast elkaar** staan, net als huisnummer en
toevoeging in de adresrij. Het paar telefoon/e-mail stapelt op smalle schermen wél, want een
e-mailadres heeft de volle breedte nodig.

---

## 2. Naamvelden verplicht maken — `data-name-required` *(nieuw)*

`data-name-required="true"` maakt **beide** naamvelden verplicht en geeft beide labels een `*`.
Zonder dit attribuut zijn ze optioneel en mag de gebruiker ze leeg laten. Het werkt alleen in
combinatie met `data-show-name="true"`; los heeft het geen effect.

Laat de bezoeker beide velden leeg, dan meldt de widget ze in één keer allebei — niet één voor één.
Alleen spaties invullen telt als leeg.

```html
data-show-name="true"
data-name-required="true"
```

**Doorgifte van de ingevulde namen:**

| Route | Parameters |
|---|---|
| `scan` + `classic` → leadflow-URL | `Firstname` / `Lastname` — **exact deze hoofdletters** |
| Externe agenda (`data-pass-to-url="true"`, CTA2 `action="booking"`) | `firstname` / `lastname` (kleine letters) |
| Pico-payload (CTA2 quick contact, brochure) | `Firstname` / `Lastname` |

---

## 3. Placeholders van de naamvelden *(nieuw)*

| Attribuut | Default |
|---|---|
| `data-firstname-placeholder` | taalafhankelijk: `Jan` (nl), `John` (en), `Max` (de) |
| `data-lastname-placeholder` | taalafhankelijk: `de Vries` (nl), `Smith` (en), `Müller` (de) |

Zelfde regel als de bestaande placeholders: een **expliciet gezet** attribuut overschrijft de
standaard, een **afwezig** attribuut behoudt hem, en een leeg gezet attribuut
(`data-firstname-placeholder=""`) maakt de placeholder bewust leeg.

Toon in de configurator de taalstandaard als grijze hint in het lege invoerveld, en werk die bij als
de taal wisselt. Labels en foutmeldingen liggen vast en zijn niet instelbaar.

---

## 4. Tegelkiezer verbergen — `data-tile-display="none"` *(nieuwe waarde)*

Voor een partner met één maatregel heeft de bezoeker niets te kiezen en is de kiezer alleen ruis.
Scan-modus kende daar geen attribuut voor, waardoor de generator er CSS naast zette
(`hz-embed [data-tile-selector]{display:none!important;}`). **Verwijder die CSS-injectie** en emit in
plaats daarvan `data-tile-display="none"`. De waarde `"false"` werkt hetzelfde.

De tegel blijft bestaan en bepaalt het CTA-doel. Zonder `data-tiles-default` selecteert de widget
automatisch de eerste tegel, dus de knop werkt hoe dan ook. `Tiles` en `PrimaryTile` gaan
onveranderd mee naar de leadflow-URL. `data-tiles-label` en `data-tiles-max-select` hebben bij `none`
geen effect meer.

> **Let op — verkeerde attribuutnaam in de huidige uitvoer.** De generator emit in scan-modus
> `data-show-tiles`, maar dat attribuut leest de widget **alleen in booking-modus**. In scan heet het
> `data-tile-display`. Dat valt nu niet op omdat `large` toevallig ook de standaard is, maar zodra
> een partner `tags`, `dropdown` of `none` kiest, gebeurt er niets. Scan → `data-tile-display`,
> booking → `data-show-tiles`, met dezelfde waardes.

---

## 5. Maatregelnamen zijn vrij instelbaar

De namen van de maatregelen liggen **niet** in de widget vast. Elke maatregel heeft twee gescheiden
dingen:

- de **key** — technisch: die vormt de attribuutnamen (`data-tile-{key}-url`), kiest het ingebouwde
  icoon, en is wat de leadflow ontvangt in `Tiles=` en `PrimaryTile=`. Beperkt tot `[a-z0-9]+`, en
  hoort niet zichtbaar te zijn in de configurator.
- de **weergavenaam** — vrije tekst via `data-tile-{key}-title`, en het enige wat de bezoeker leest.

Een partner mag dus afwijken van jullie terminologie zonder dat het icoon of de leadflow verandert:

```html
data-tile-solarboiler-url="https://configurator.homezero.nl/..."
data-tile-solarboiler-title="Zonnestroomboiler"
```

**Wat de generator moet toevoegen:** per gekozen maatregel een tekstveld "Weergavenaam", voorgevuld
met de standaardnaam, dat `data-tile-{key}-title` emit. Wijzig nooit de key om een naam te
veranderen — dan valt het icoon terug op het generieke exemplaar en ontvangt de leadflow een
onbekende waarde.

Ontbreekt het title-attribuut, dan toont de widget de **ruwe key** (`solarboiler`). Emit hem dus
altijd.

> **Standaardnaam gewijzigd:** `solarboiler` heet vanaf nu **Zonnestroomboiler** in plaats van
> Zonneboiler. Werk die default in de generator bij.

> **Let op — er zijn geen aliassen.** Het icoon wordt op de exacte key gezocht. Keys als `ems`,
> `meterkast`, `zon`, `airco`, `batterij`, `laadpaal` of `advies` hebben géén eigen icoon en vallen
> terug op het generieke. Lever daar zelf een `data-tile-{key}-icon-svg` bij. De iconenlijst in
> `LOVABLE_GENERATOR.md` is bijgewerkt met de keys die er wél een hebben.

---

## 6. Kleurverloop werkt nu overal

**Beide stops zijn verplicht.** De widget controleert op `data-gradient-from` **en**
`data-gradient-to`. Emit ze als paar of geen van beide — één stop alleen wordt genegeerd en levert
stilzwijgend geen verloop op. De huidige generator emit ze onafhankelijk van elkaar; dat moet
alles-of-niets worden.

**Waar het verloop op werkt.** Voorheen alleen op de achtergrond van een geselecteerde tegel. Nu op:

- de **primaire CTA-knop**
- de **tag-chips**
- de **geselecteerde tegel** (large)
- de **geselecteerde dropdown-regel**

De secundaire CTA blijft transparant met een rand, en het vinkje in de checkbox en het
bevestigingsicoon blijven op de egale `data-color` staan.

```html
data-color="#E5007D"
data-gradient-from="#E5007D"
data-gradient-to="#F39332"
```

---

## 7. Tekstkleur op de primaire kleur — `data-cta-text-color` *(nieuw)*

De widget berekent automatisch of de tekst zwart-blauw (`#132039`) of wit (`#ffffff`) moet zijn, en
zet die als `--contrast-color`. Die ene kleur wordt gebruikt voor de CTA-tekst en het CTA-icoon, de
tag-chips, de geselecteerde tegel, de geselecteerde dropdown-regel, het vinkje in de checkbox en het
bevestigingsicoon.

**De berekening kijkt naar het slechtste geval, niet naar het gemiddelde.** Omdat één kleur op
meerdere achtergronden landt — de egale primaire kleur én beide uiteinden van het verloop — wordt het
contrast tegen alle drie doorgerekend en wint de optie waarvan de **laagste** ratio het hoogst is.
Een kleur die alleen in het midden van een verloop leesbaar is, valt aan de randen weg.

De CTA-tekst is 16px bij `font-weight: 500`. Dat telt niet als WCAG "large text", dus de AA-drempel
is **4.5:1**.

**De widget waarschuwt hier niet over.** Is 4.5:1 niet haalbaar, dan past hij stil de best
beschikbare kleur toe. Het signaleren daarvan hoort in de **configurator**: toon de berekende ratio
naast de kleurkiezers en waarschuw daar zodra die onder 4.5:1 komt. De berekening staat in
`LOVABLE_GENERATOR.md`.

**Handmatig overschrijven.** `data-cta-text-color` met een geldige CSS-kleur slaat de automatische
berekening volledig over. De widget controleert een handmatig opgegeven kleur niet op contrast; die
verantwoordelijkheid ligt dan bij de partner. Is de waarde geen geldige kleur, dan negeert de widget
hem en valt terug op automatisch.

```html
data-cta-text-color="#ffffff"
```

Bied dit aan als een geavanceerd veld "Tekstkleur op knop", standaard leeg (= automatisch).

> **Praktijkvoorbeeld.** Bij het verloop `#E5007D` → `#F39332` haalt geen enkele tekstkleur de norm:
> wit komt uit op 2.33:1 op de oranje kant, donker op 3.58:1 op de magenta kant. Een verloop binnen
> één tint, bijvoorbeeld `#E5007D` → `#b8005f`, haalt de norm wel. Laat dit in de configurator zien
> vóórdat de partner de code kopieert.

---

## 8. Ingevulde waarden worden getrimd

Spaties aan begin en eind gaan eraf voordat een waarde in de leadflow- of agenda-URL belandt, en een
veld met alleen spaties telt als leeg en wordt weggelaten. Er verschijnt dus nooit een lege
`Firstname=` of `Email=` in de URL. Dit geldt sinds deze release ook voor het e-mailveld in scan,
classic en booking, dat voorheen ongetrimd werd doorgegeven. Het telefoonnummer wordt zoals altijd
volledig van spaties ontdaan (`06 12 34 56 78` → `0612345678`).

Laat de URL-preview in de configurator hetzelfde doen.

---

## 9. Lettertype van invoervelden en knoppen

De widget bevat geen enkele `font-family`-declaratie: alle tekst erft het lettertype van de
partnerpagina. Invoervelden en knoppen erfden dat echter niet, omdat browsers daar hun eigen
UI-lettertype op zetten. Dat is nu rechtgezet met `font-family: inherit` op `input`, `button`,
`select` en `textarea` binnen de widget.

Gevolg voor de preview: laat invoervelden en knoppen het lettertype van de omringende pagina erven in
plaats van een eigen font op te leggen. Grootte en gewicht blijven per element geregeld.

---

## 10. Regels voor de embed-uitvoer

**Eén element, geen CSS ernaast.** De gegenereerde code bestaat altijd uit precies twee dingen: één
`<hz-embed>`-element met data-attributen en het gedeelde `<script defer>`-tag. Geen `<style>`-blok,
geen inline `style`-attribuut, geen wrapper-div. Moet de generator CSS injecteren om iets te
verbergen of te verschuiven, dan ontbreekt er een attribuut in de widget — meld dat, in plaats van
het met CSS op te lossen. Geïnjecteerde CSS hangt aan interne class- en attribuutnamen die zonder
waarschuwing kunnen wijzigen.

**Lege waarden: weglaten of expliciet leeg?** Dit verschilt per attribuut en dat is bewust.

- **Weglaten** bij alles wat tekst of een URL is: `data-title`, `data-subtitle`,
  `data-consent-text`, `data-checkbox-title`, `data-context`, `data-installer` en de CTA-teksten. De
  widget controleert op een lege waarde en rendert dan niets — een lege `data-title` levert geen lege
  kop en geen extra witruimte op. Emit `data-title=""` dus niet.
- **Expliciet leeg meesturen** bij de placeholders (`data-firstname-placeholder`,
  `data-email-placeholder`, en de rest) en bij `data-tiles-label`. Daar betekent afwezig "gebruik de
  standaard" en leeg "toon bewust niets".

Vuistregel: alleen bij placeholders en `data-tiles-label` is de lege string een betekenisvolle
waarde. Overal anders hoort een leeg configuratieveld helemaal niet in de embed-code.

---

## 11. Checklist voor de generator

- [ ] Per maatregel een veld "Weergavenaam" dat `data-tile-{key}-title` emit; key nooit wijzigen.
      Standaardnaam voor `solarboiler` is nu "Zonnestroomboiler".
- [ ] Eén toggle "Naamvelden" die `data-show-name="true"` emit, met sub-toggle "Verplicht" →
      `data-name-required="true"`. Beschikbaar in alle modi, niet alleen brochure.
- [ ] Twee geavanceerde placeholder-velden voor voornaam en achternaam, met de taalstandaard als
      hint en respect voor de expliciet-lege waarde.
- [ ] `data-tile-display="none"` bij één maatregel, en het `<style>`-blok verwijderd uit de uitvoer.
- [ ] In scan-modus `data-tile-display` emitten in plaats van `data-show-tiles`.
- [ ] Gradiënt-attributen alles-of-niets emitten.
- [ ] Preview: verloop op CTA, tag-chips, geselecteerde tegel en geselecteerde dropdown-regel.
- [ ] Contrastberekening op het slechtste van primaire kleur + beide stops, met een zichtbare
      waarschuwing onder 4.5:1.
- [ ] Veld "Tekstkleur op knop" → `data-cta-text-color`, standaard leeg.
- [ ] Waarden trimmen in de URL-preview.
- [ ] Preview-CSS raakt geen kale `h2`/`p` binnen het previewvlak, en legt geen eigen lettertype op
      aan invoervelden en knoppen.
