# HomeZero Widget — Embed-instructies (Lovable Widget Generator)

Dit document is de **definitieve referentie** van alle capabilities die op dit moment in de widget
(`Acceptance/embed.js` + `Acceptance/embed-styles.css`) zitten, en hoe je ze aanstuurt via de
embed-code. Het is bedoeld als promptbron/specificatie voor het Lovable widget-generator project,
zodat de generator geldige `<hz-embed>` embed-codes kan produceren **en veelgemaakte fouten
vermijdt** (zie §13).

> Laatst bijgewerkt: **6 juli 2026** — synchroon met de code na de dropdown- en CTA-styling-release
> van 1–2 juli. Startpunt van dit document was de branch-samenvatting van 30 juni; alle wijzigingen
> daarna zijn hierin verwerkt.

> **Kernprincipes**
> - Alle configuratie gebeurt via `data-*` attributen op het `<hz-embed>` element. Er is geen JS-API.
> - Onbekende/lege attributen worden veilig genegeerd; de widget degradeert netjes en gooit nooit.
> - Tekst wordt XSS-veilig gerenderd (`textContent`); SVG-iconen komen uit een vertrouwde
>   (operator-)config en worden als **base64** meegegeven.
> - Ongeldige of niet-`http(s)` URL's worden geweigerd (interne `isSafeUrl`-check).

---

## 1. Basis embed-code

```html
<!-- 1. Eenmalig: het script laden (laadt zelf zijn stylesheet vanaf dezelfde map) -->
<script defer src="https://<jouw-host>/embed.js"></script>

<!-- 2. Eén of meerdere widgets plaatsen -->
<hz-embed
  data-mode="scan"
  data-color="#16a34a"
  data-title="Grip op jouw eigen energie"
  data-subtitle="Waar heb je interesse in?"
></hz-embed>
```

Het script laadt zelf zijn stylesheet (`embed-styles.min.css`, met fallback naar `embed-styles.css`)
vanaf dezelfde map als waar `embed.js` staat. Je mag meerdere `<hz-embed>` elementen op één pagina
plaatsen; elk wordt onafhankelijk geïnitialiseerd.

---

## 2. Widget-modi (`data-mode`)

De widget kent vier modi. **De generator produceert vrijwel altijd `scan`** (dit document is daarop
gericht). De andere modi bestaan in de code en worden hier volledigheidshalve genoemd.

| Modus | `data-mode` | Beschrijving |
|---|---|---|
| **Scan** | `scan` | Aanbevolen. Tegels/maatregelen + adres/contact + één of twee CTA's naar een HomeZero-leadflow, boeking of quick-contact. Alle features uit dit document horen bij deze modus. |
| Classic | `classic` (default als `data-mode` ontbreekt) | Legacy single-dropdown + adresformulier. |
| Booking | `booking` | Directe boekingsstroom. |
| Brochure | `brochure` | E-mail-brochure aanvragen via de Pico-API (`data-success-message`, `data-pass-to-url`). |

> **Let op:** ontbreekt `data-mode`, dan valt de widget terug op **`classic`**, niet op `scan`. De
> generator moet `data-mode="scan"` dus altijd expliciet meegeven.

---

## 3. Algemene attributen (scan-modus)

| Attribuut | Beschrijving | Default |
|---|---|---|
| `data-mode` | Widget-modus. Zet altijd `scan`. | `classic` |
| `data-color` | Primaire kleur (knoppen, accenten, hover). Ongeldige waarde → default. | `#2A6DF4` |
| `data-gradient-from` / `data-gradient-to` | Optioneel kleurverloop voor knoppen (beide nodig). | — |
| `data-title` | Koptekst boven de widget. | — |
| `data-subtitle` | Subtekst onder de titel. | — |
| `data-button-radius` | Border-radius van de CTA-knoppen. | `10px` |
| `data-open-new-tab` | Doelpagina in nieuw tabblad openen (`true`/`false`). | `false` |
| `data-language` | Interface-taal: `nl`, `en`, `de`. Onbekend → `nl`. | `nl` |
| `data-country` | Landcode voor adresvalidatie, bv. `nl`, `be`, `de`. | `nl` |
| `data-address-format` | Adresformaat: `dutch` (postcode+huisnr) of anders straat/huisnr/postcode/plaats. | `dutch` |
| `data-google-search` | Google Places-autocomplete voor het adres (`true`/`false`). | `false` |
| `data-show-phone` / `data-show-email` | Telefoon-/e-mailveld tonen (`true`/`false`). | `false` |
| `data-phone-required` / `data-email-required` | Bijbehorend veld verplicht maken (`true`/`false`). | `false` |
| `data-installer` | Installer-ID dat als `InstallerID` wordt meegestuurd. | — |
| `data-context` | Vrije context-string, meegestuurd als `context`. | — |
| `data-tile-display` | Tegel-weergave: `large`, `dropdown` of `tags` (zie §4). | `large` |
| `data-tiles-label` | Label boven de tegel-/dropdown-selectie. | `Producten` |
| `data-tiles-max-select` | Max. aantal selecteerbare tegels (`0` = onbeperkt). Bij `dropdown` altijd `1`. | `0` |
| `data-tiles-default` | Komma-gescheiden lijst van voorgeselecteerde tegels, bv. `heatpump,solarpanels`. | — |

> Deze tabel dekt scan-modus. Modus-specifieke attributen (`data-pico-*`, `data-success-message`,
> `data-pass-to-url`, `data-contact-skip-address`) staan bij de betreffende feature.

---

## 4. Tegels (measures)

Elke maatregel ("tile") wordt gedefinieerd met `data-tile-<key>-*` attributen. `<key>` is een vrije
sleutel zoals `heatpump`, `solarpanels`, `carcharger`, `homebattery`.

### 4.1 Regels voor tegels *(belangrijk voor de generator)*

- Een tegel bestaat **alleen** als `data-tile-<key>-url` aanwezig is. Zonder `-url` wordt de hele
  tegel genegeerd (ook al zijn er wel titel/icoon/cta-attributen).
- `<key>` moet **kleine letters en cijfers** zijn: regex `[a-z0-9]+`. **Geen hoofdletters, koppel-
  tekens of underscores** — `data-tile-warmte_pomp-url` of `data-tile-Heatpump-url` worden niet
  herkend.
- Er worden **maximaal 4 tegels** gerenderd (de rest wordt afgekapt).
- Ontbreekt `data-tile-<key>-title`, dan wordt de `<key>` zelf als label getoond.

| Attribuut | Beschrijving |
|---|---|
| `data-tile-<key>-url` | **Verplicht.** Doel-URL (HomeZero-leadflow) bij selectie van deze tegel. |
| `data-tile-<key>-title` | Titel/label van de tegel. |
| `data-tile-<key>-icon-svg` | **Base64** van de SVG voor het tegel-icoon (zie §9). Optioneel — zie ingebouwde iconen. |
| `data-tile-<key>-booking-url` | Optionele boekings-URL; als gezet wordt CTA1 voor deze tegel een boekingsknop. |
| `data-tile-<key>-cta1-text` | CTA1-tekst wanneer (alleen) deze tegel geselecteerd is. |
| `data-tile-<key>-cta2-text` | CTA2-tekst voor deze tegel. |
| `data-tile-<key>-cta2-url` | CTA2-doel-URL voor deze tegel. |
| `data-tile-<key>-cta1-icon-svg` | Base64 SVG-icoon voor CTA1 bij deze tegel. |
| `data-tile-<key>-cta2-icon-svg` | Base64 SVG-icoon voor CTA2 bij deze tegel. |

### 4.2 Weergavevormen (`data-tile-display`)

- `large` *(default)* — grote tegels in een grid (2×2 op mobiel, full-width bij één rij).
- `dropdown` — één keuzemenu. **Altijd single-select**: `data-tiles-max-select` wordt geforceerd
  naar `1`. Sinds 1 juli sluit de dropdown automatisch zodra je een optie kiest en blijft de hoogte
  van de trigger stabiel (geen "sprong") tussen lege en gekozen staat.
- `tags` — selecteerbare chips.

### 4.3 Ingebouwde iconen (geen base64 nodig)

Heeft een tegel géén `data-tile-<key>-icon-svg`, dan zoekt de widget een **ingebouwd icoon** op basis
van de `<key>`. Matcht de key één van onderstaande namen, dan verschijnt automatisch dat icoon; anders
valt de widget terug op een generiek icoon (`general`).

Beschikbare ingebouwde keys:

```
advicescan, solarpanels, heatpump, airconditioning, homebattery, carcharger,
floorinsulation, wallinsulation, roofinsulation, glassinsulation,
advisormodule, solarboiler, gasboiler, general
```

> **Tip voor de generator:** kies waar mogelijk een `<key>` uit deze lijst, dan is er geen base64-SVG
> nodig. Voor een eigen maatregel zonder ingebouwd icoon: lever een `data-tile-<key>-icon-svg` aan,
> anders krijgt de tegel het generieke icoon. (Het `solarboiler`-icoon is op 1 juli gecorrigeerd naar
> een echte boiler-illustratie.)

Voorbeeld:

```html
data-tile-heatpump-title="Warmtepomp"
data-tile-heatpump-url="https://homezero-accp.mendixcloud.com/link/start?id=warmtepomp-advies"
```

---

## 5. CTA's per maatregel, combinatie en globaal

De widget heeft twee CTA-knoppen: **CTA1** (primair) en **CTA2** (secundair). Teksten, iconen en
(voor CTA2) URL's kunnen per tegel, per combinatie én globaal worden gezet. De widget kiest
automatisch de juiste waarde op basis van wat de bezoeker selecteert.

### 5.1 Per-maatregel CTA's
Zie §4.1 (`data-tile-<key>-cta1-text`, `-cta2-text`, `-cta2-url`, `-cta1-icon-svg`, `-cta2-icon-svg`).

### 5.2 Combinatie-CTA's (meerdere tegels geselecteerd)

| Attribuut | Beschrijving |
|---|---|
| `data-cta1-combo-text` / `data-cta1-combo-url` | CTA1 tekst/URL bij een combinatie. |
| `data-cta2-combo-text` / `data-cta2-combo-url` | CTA2 tekst/URL bij een combinatie. |
| `data-cta1-combo-icon-svg` / `data-cta2-combo-icon-svg` | Base64 SVG-iconen bij een combinatie. |

### 5.3 Globale fallback-CTA's

| Attribuut | Beschrijving | Default (tekst) |
|---|---|---|
| `data-cta1-text` | Generieke CTA1-tekst (fallback). | `Bereken wat je bespaart` |
| `data-cta1-text-booking` | CTA1-tekst als de geselecteerde tegel een `booking-url` heeft. | `Plan een gratis adviesgesprek` |
| `data-cta2-text` | Generieke CTA2-tekst. | `Direct contact (30 sec)` |
| `data-cta1-icon-svg` / `data-cta2-icon-svg` | Generieke base64 SVG-iconen (fallback). | — |
| `data-cta2-show` | CTA2 tonen (`true`/`false`). | `false` |
| `data-cta2-action` | Actie van CTA2 (zie §5.4). | `pico` |
| `data-cta2-url` | Globale CTA2-doel-URL (bij `flow`/`booking`). | — |

> `data-cta1-text-scan` is de oude naam van `data-cta1-text` en wordt nog geaccepteerd
> (backward-compat), maar gebruik `data-cta1-text`.

### 5.4 CTA2-actie (`data-cta2-action`)

| Waarde | Gedrag | Vereist |
|---|---|---|
| `pico` *(default)* | Snelle contact-aanvraag via de Pico-API (30-seconden-formulier). | `data-pico-key`, optioneel `data-pico-env` (`production` (default) / `acceptance`), `data-pico-flow-id`, `data-contact-skip-address`. |
| `flow` | Tweede HomeZero-leadflow (aparte URL). | Een CTA2-URL: per-tile `-cta2-url`, `data-cta2-combo-url` of `data-cta2-url`. |
| `booking` | Externe agenda/boeking openen in nieuw tabblad. | Een boekings-URL via dezelfde CTA2-URL-bronnen. |
| `ai-chat` | **Verouderd.** Wordt automatisch omgezet naar de losse AI-chat-link (§6) en logt een waarschuwing. Gebruik `data-ai-chat-show`. | — |

### 5.5 Keuze-volgorde (precedence)

De widget bepaalt **tekst, icoon én doel-URL** met dezelfde logica, afhankelijk van het aantal
geselecteerde tegels:

- **Meerdere tegels geselecteerd** → combinatie-waarde, met terugval op de globale waarde:
  `combo → global`. (CTA1 zonder combo-URL valt terug op de URL van de eerste tegel.)
- **Exact één tegel geselecteerd** → de per-tegel-waarde, met terugval op de globale waarde:
  `tile → global`. (Heeft de tegel een `booking-url`, dan gebruikt CTA1 automatisch
  `data-cta1-text-booking`.)
- **Geen selectie** → de globale waarde.

CTA2 wordt **automatisch verborgen** wanneer er voor de huidige selectie geen geldig doel is.

> Iconen verschijnen **alleen** als ze geconfigureerd zijn; er is geen standaard CTA-icoon. Een CTA
> zonder icoon toont enkel de tekst.

---

## 6. AI-chat-link *(los van CTA2)*

Een tekstlink (geen knop) naar de AI-adviseur. Verschijnt alleen als de chat-widget (`window.ChatWidget`)
op de pagina aanwezig is.

| Attribuut | Beschrijving | Default |
|---|---|---|
| `data-ai-chat-show` | AI-chat-link tonen (`true`/`false`). | `false` |
| `data-ai-chat-text` | Tekst van de link. | `Of chat met onze AI adviseur` |

---

## 7. Toestemming: checkbox en vrije tekstregel (met inline link)

Er zijn twee onafhankelijke manieren om toestemming/voorwaarden te tonen. Beide ondersteunen
dezelfde **inline markdown-links** `[label](url)`, die veilig worden omgezet naar echte links
(openen in nieuw tabblad, `rel="noopener noreferrer"`). Een ongeldige of onveilige URL — alles
buiten `http(s)` — wordt als platte tekst getoond in plaats van als link.

### 7a. Checkbox (actief aanvinken)

Met `data-checkbox-title` toon je een verplicht/optioneel akkoord-vinkje (link-class
`embed-checkbox-link`).

| Attribuut | Beschrijving |
|---|---|
| `data-checkbox-title` | Labeltekst, mag `[tekst](url)` bevatten. Bepaalt of de checkbox getoond wordt. |
| `data-checkbox-required` | Verplicht akkoord (`true`/`false`). |
| `data-checkbox-shorttitle` | Korte titel die als `checkboxtitle` naar de leadflow-URL wordt meegestuurd. |

```html
data-checkbox-title="Ik ga akkoord met de [privacyverklaring](https://homezero.nl/privacy)"
data-checkbox-required="true"
```

### 7b. Statische toestemmingstekst (passief akkoord)

Met `data-consent-text` plaats je een vaste tekstregel **onder de checkbox en direct boven de
CTA-knop** — voor het "door verder te gaan gaat u akkoord"-patroon, waarbij de gebruiker niets hoeft
aan te vinken. Puur informatief: er wordt niets gevalideerd en niets naar de leadflow-URL
meegestuurd.

| Attribuut | Beschrijving |
|---|---|
| `data-consent-text` | Tekstregel boven de CTA, mag `[tekst](url)` bevatten. Leeg/afwezig = niet gerenderd. |

```html
data-consent-text="Door hieronder door te gaan accepteert u onze [algemene voorwaarden](https://homezero.nl/voorwaarden)."
```

Details voor de generator:

- **Werkt in alle modi**: `scan`, `classic`, `booking` en `brochure`.
- **Combineerbaar**: checkbox en tekstregel kunnen los of samen gebruikt worden; de checkbox staat
  altijd boven de tekstregel.
- **Meerdere links** in één tekst zijn toegestaan (bv. voorwaarden *en* privacyverklaring).
- **Opmaak**: 12px, `font-weight: 500`, `line-height: 150%`, kleur `#132039`, `margin-bottom: 16px` —
  dezelfde tekstgrootte als de invoerlabels ("Postcode", "E-mail"). Links krijgen de primaire
  widgetkleur met onderstreping (class `embed-consent-link`).
- **Host-proof**: de widget neutraliseert `border` en `padding` op titel, subtitel en
  toestemmingstekst met `!important`, zodat CSS van de host-pagina (bijvoorbeeld een thema met
  `h2 { border-bottom: 1px solid }`) geen ongewenste grijze streep in de widget trekt.

---

## 8. Blok-styling (achtergrond, rand, hoeken, padding)

Hiermee geef je de widget zijn eigen "kaart"-uiterlijk.

| Attribuut | Beschrijving |
|---|---|
| `data-bg-color` | Achtergrondkleur (geldige CSS-kleur). |
| `data-bg-opacity` | Transparantie **alleen van de achtergrond**, `0`–`1` (via `color-mix`). Tekst/knoppen blijven volledig dekkend. |
| `data-block-radius` | Hoekafronding, bv. `18px`. |
| `data-block-padding` | Binnenmarge, bv. `24px` (default `20px` wanneer een achtergrond is gezet). |
| `data-block-border` | Volledige CSS-border-shorthand, bv. `1px solid #16a34a`. Gebruik `none` voor geen rand. |

```html
data-bg-color="#ffffff"
data-bg-opacity="0.9"
data-block-radius="18px"
data-block-padding="24px"
data-block-border="1px solid #16a34a"
```

> **Border-stijl:** in de test-playground worden alleen `solid` en `none` aangeboden
> (`dashed`/`dotted` zijn bewust verwijderd). In `data-block-border` kun je technisch elke geldige
> CSS-border meegeven, maar houd je aan `solid`/`none` voor consistentie.

---

## 9. SVG-iconen aanleveren (base64)

Alle `*-icon-svg` attributen verwachten de **base64-encoded ruwe `<svg>`-markup**.

Richtlijnen voor de SVG zelf:

- Gebruik een `viewBox` (bv. `viewBox="0 0 24 24"`) en **géén** vaste `width`/`height` — de widget
  bepaalt de grootte via CSS. (Eventueel aanwezige `width`/`height` worden bij rendering verwijderd.)
- Gebruik `stroke="currentColor"` / `fill="currentColor"` zodat het icoon de knop-/accentkleur volgt.
- De waarde moet ná het base64-decoderen beginnen met `<svg`, anders wordt het genegeerd.

Encoden (voorbeeld):

```js
// Browser
const base64 = btoa('<svg viewBox="0 0 24 24" ...>...</svg>');
```
```bash
# CLI
printf '%s' '<svg viewBox="0 0 24 24" ...>...</svg>' | base64
```

> Voor standaard-maatregelen is base64 vaak overbodig: kies een `<key>` uit de ingebouwde-iconenlijst
> (§4.3).

---

## 10. Invoerveld-placeholders

Elke placeholder kan worden overschreven. Een **expliciet gezet** attribuut (ook leeg `""`) overschrijft
de standaard; een **afwezig** attribuut behoudt de default.

| Attribuut | Default |
|---|---|
| `data-address-placeholder` | taalafhankelijk |
| `data-postcode-placeholder` | `1234AB` |
| `data-huisnummer-placeholder` | `1` |
| `data-toevoeging-placeholder` | `A` |
| `data-street-placeholder` | taalafhankelijk |
| `data-housenumber-placeholder` | taalafhankelijk |
| `data-zipcode-placeholder` | taalafhankelijk |
| `data-city-placeholder` | taalafhankelijk |
| `data-phone-placeholder` | `0612345678` |
| `data-email-placeholder` | `jandevries@gmail.com` |

> Een toevoeging-placeholder leegmaken: `data-toevoeging-placeholder=""`.

---

## 11. Volledig voorbeeld (alle scan-features samen)

```html
<hz-embed
  data-mode="scan" data-color="#16a34a" data-button-radius="12px" data-open-new-tab="true"
  data-language="nl" data-country="nl"
  data-title="Grip op jouw eigen energie"
  data-subtitle="Waar heb je interesse in? Meer opties mogelijk"
  data-tile-display="large" data-tiles-label="Producten" data-tiles-max-select="0"

  data-tile-heatpump-title="Warmtepomp"
  data-tile-heatpump-url="https://homezero-accp.mendixcloud.com/link/start?id=warmtepomp-advies"
  data-tile-heatpump-cta1-text="Warmtepomp advies"
  data-tile-heatpump-cta2-url="https://homezero-accp.mendixcloud.com/link/start?id=warmtepomp-check"
  data-tile-heatpump-cta2-text="Warmtepomp check"

  data-tile-solarpanels-title="Zonnepanelen"
  data-tile-solarpanels-url="https://homezero-accp.mendixcloud.com/link/start?id=zon-advies"
  data-tile-solarpanels-cta1-text="Zonnepanelen advies"
  data-tile-solarpanels-cta2-url="https://homezero-accp.mendixcloud.com/link/start?id=zon-check"
  data-tile-solarpanels-cta2-text="Zonnepanelen check"

  data-tile-carcharger-title="Laadpaal"
  data-tile-carcharger-url="https://homezero-accp.mendixcloud.com/link/start?id=laadpaal-advies"

  data-cta1-combo-url="https://homezero-accp.mendixcloud.com/link/start?id=combi-advies"
  data-cta1-combo-text="Combinatie advies"
  data-cta2-combo-url="https://homezero-accp.mendixcloud.com/link/start?id=combi-berekening"
  data-cta2-combo-text="Combinatie berekening"

  data-cta1-text="Start advies"
  data-cta1-icon-svg="<base64-svg>"
  data-cta2-show="true" data-cta2-action="flow" data-cta2-text="Start berekening"
  data-cta2-url="https://homezero-accp.mendixcloud.com/link/start?id=berekening"
  data-cta2-icon-svg="<base64-svg>"

  data-tiles-default="heatpump"

  data-bg-color="#ffffff" data-bg-opacity="0.9"
  data-block-radius="18px" data-block-padding="24px"
  data-block-border="1px solid #16a34a"

  data-checkbox-title="Ik ga akkoord met de [privacyverklaring](https://homezero.nl/privacy)"
  data-checkbox-required="true"
  data-consent-text="Door hieronder door te gaan accepteert u onze [algemene voorwaarden](https://homezero.nl/voorwaarden)."

  data-postcode-placeholder="Bijv. 1011AB"
  data-toevoeging-placeholder=""

  data-address-format="dutch" data-show-phone="false" data-show-email="true"
></hz-embed>
```

---

## 12. Minimaal geldige embed-code

De kleinst mogelijke, correct werkende scan-widget:

```html
<hz-embed
  data-mode="scan"
  data-title="Grip op jouw energie"
  data-tile-heatpump-title="Warmtepomp"
  data-tile-heatpump-url="https://homezero-accp.mendixcloud.com/link/start?id=warmtepomp-advies"
></hz-embed>
```

---

## 13. Wat te voorkomen (veelgemaakte fouten / valkuilen)

De generator moet deze fouten actief vermijden:

1. **`data-mode` vergeten.** Zonder `data-mode="scan"` valt de widget terug op `classic` en verschijnen
   de scan-features (tegels, dual-CTA, blok-styling) niet.
2. **Tegel zonder `-url`.** Een tegel bestaat pas als `data-tile-<key>-url` aanwezig is. Losse
   `-title`/`-icon-svg`/`-cta*`-attributen zonder `-url` doen niets.
3. **Ongeldige tegel-`<key>`.** Alleen `[a-z0-9]+` (kleine letters + cijfers). Geen hoofdletters,
   koppeltekens, underscores of spaties. `data-tile-warmte-pomp-url` en `data-tile-Heatpump-url`
   worden niet herkend.
4. **Meer dan 4 tegels.** Alles boven de eerste 4 wordt afgekapt. Genereer maximaal 4.
5. **Niet-`http(s)` URL's.** Doel-URL's moeten geldige `http(s)`-URL's zijn; anders weigert de widget
   ze (interne veiligheidscheck) en blijft de knop verborgen/inactief.
6. **`data-cta2-show="true"` zonder doel.** CTA2 blijft verborgen als er geen CTA2-URL is (per-tile
   `-cta2-url`, `data-cta2-combo-url` of `data-cta2-url`) bij `action="flow"`/`"booking"`. De widget
   logt hierover een waarschuwing.
7. **Multi-select zonder combo-URL.** Bij `data-tiles-max-select` ≠ 1 zonder `data-cta1-combo-url`
   valt CTA1 bij meerdere selecties terug op de URL van de éérste tegel — meestal niet gewenst. Zet
   een `data-cta1-combo-url` (en `-combo-text`).
8. **`dropdown` + multi-select.** `data-tile-display="dropdown"` is altijd single-select;
   `data-tiles-max-select` wordt geforceerd naar `1`. Wil je meerdere keuzes toestaan, gebruik dan
   `large` of `tags`.
9. **`data-cta2-action="ai-chat"`.** Verouderd. Gebruik `data-ai-chat-show="true"` +
   `data-ai-chat-text`.
10. **`data-cta2-action="pico"` zonder `data-pico-key`.** De standaard-CTA2-actie is `pico`; zonder
    geldige `data-pico-key` kan het quick-contact-formulier niet indienen. Óf lever een pico-key, óf
    zet een expliciete `data-cta2-action="flow"`/`"booking"`, óf laat CTA2 uit (`data-cta2-show`
    weglaten).
11. **Ruwe SVG i.p.v. base64.** Alle `*-icon-svg` attributen verwachten **base64**. Ruwe `<svg …>`
    markup wordt genegeerd. Voor standaard-maatregelen: gebruik liever een ingebouwde `<key>` (§4.3).
12. **SVG met vaste `width`/`height` of vaste kleur.** Gebruik `viewBox` + `currentColor`; vaste
    afmetingen worden verwijderd en een vaste kleur volgt de knopkleur niet.
13. **`data-block-border` met `dashed`/`dotted`.** Houd je aan `solid`/`none` voor visuele
    consistentie.
14. **Verwarring lege vs. afwezige placeholder.** Een leeg attribuut (`data-…-placeholder=""`) maakt
    de placeholder bewust leeg; wil je de default behouden, laat het attribuut dan wég.
15. **Verplichte velden zonder tonen.** `data-phone-required="true"` heeft alleen effect als
    `data-show-phone="true"` (idem e-mail).

---

## 14. Wijzigingen sinds 30 juni (changelog)

- **1 juli** — `solarboiler`-icoon gecorrigeerd (was per abuis een kopie van `advisormodule`; nu een
  echte boiler-illustratie).
- **1 juli** — `dropdown` (single-select) sluit nu automatisch zodra een optie gekozen wordt.
- **2 juli** — Dropdown-trigger houdt een stabiele hoogte (`min-height: 32px`) tussen de lege
  (alleen tekst) en gekozen (met icoon-badge) staat, zodat de layout niet meer "springt".
- **2 juli** — CTA2 wordt betrouwbaar verborgen/getoond: de inline `display` wordt nu met
  `!important` gezet omdat `.embed-cta-secondary` in CSS `display: inline-flex !important` heeft.
- **2 juli** — Feature-branch `widget-cta-styling-enhancements` samengevoegd en naar productie
  gereleased; test-pagina (`test-combinatie.html`) toegevoegd.
- **5 augustus** — Nieuw attribuut `data-consent-text`: statische toestemmingsregel onder de
  checkbox en boven de CTA, met dezelfde veilige inline markdown-links als `data-checkbox-title`.
  Werkt in alle modi (zie §7b).
- **5 augustus** — Titel, subtitel en toestemmingstekst forceren nu `border: 0` en `padding: 0`,
  zodat CSS van de host-pagina (thema's die kale `h2`/`p` stylen) geen grijze streep of extra
  witruimte in de widget kan veroorzaken.

## 15. Samenvatting van alle capabilities

- **Modi**: `scan` (aanbevolen), plus `classic`, `booking`, `brochure`.
- **Tegels (max 4)**: per-maatregel titel, URL, boeking-URL, iconen; keys `[a-z0-9]+`; ingebouwde
  iconen of eigen base64-SVG.
- **Weergavevormen**: `large` (grid), `dropdown` (single-select, auto-sluit), `tags` (chips).
- **Selectielimiet**: `data-tiles-max-select` (`0` = onbeperkt); voorselectie via `data-tiles-default`.
- **Dual-CTA**: CTA1 + optionele CTA2, met per-maatregel / combinatie / globale tekst, icoon en URL,
  en heldere precedence (`combo` / `tile` → `global`).
- **CTA2-acties**: `pico` (quick contact), `flow` (tweede leadflow), `booking` (externe agenda),
  `ai-chat` (verouderd).
- **AI-chat-link**: losstaande tekstlink (`data-ai-chat-show`/`-text`).
- **Checkbox-link**: veilige inline markdown `[tekst](url)` in `data-checkbox-title` (+ required +
  shorttitle).
- **Toestemmingstekst**: statische regel boven de CTA via `data-consent-text`, zelfde inline
  markdown-links, geen validatie (passief akkoord).
- **Blok-styling**: `data-bg-color`, `data-bg-opacity`, `data-block-radius`, `data-block-padding`,
  `data-block-border`.
- **Adres & contact**: `dutch`/internationaal formaat, Google Places, telefoon/e-mail (optioneel of
  verplicht), volledig aanpasbare placeholders.
- **Meertalig**: `nl`, `en`, `de`.
- **Styling**: primaire kleur + optioneel kleurverloop, knop-radius, WCAG-contrastkleur automatisch.
- **Veiligheid**: XSS-veilige tekst, base64-SVG uit vertrouwde config, `http(s)`-URL-validatie,
  graceful degradation met console-waarschuwingen bij misconfiguratie.
