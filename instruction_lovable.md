# HomeZero Widget — Embed-instructies (Lovable Widget Generator)

Dit document beschrijft **alle features die in deze branch zijn toegevoegd/gewijzigd** en hoe je ze
aanstuurt via de embed-code. Het is bedoeld als referentie/promptbron voor het Lovable
widget-generator project, zodat de generator geldige `<hz-embed>` embed-codes kan produceren.

> Alle configuratie gebeurt via `data-*` attributen op het `<hz-embed>` element. Er is geen JS-API nodig.
> Onbekende/lege attributen worden veilig genegeerd. Tekst wordt XSS-veilig gerenderd; SVG-iconen
> komen uit een vertrouwde (operator-)config en worden als base64 meegegeven.

---

## 1. Basis embed-code

```html
<!-- 1. Eenmalig: het script laden -->
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
vanaf dezelfde map als waar `embed.js` staat.

---

## 2. Algemene attributen

| Attribuut | Beschrijving | Voorbeeld |
|---|---|---|
| `data-mode` | Widget-modus (bv. `scan`). | `scan` |
| `data-color` | Primaire kleur (knoppen, accenten, hover). | `#16a34a` |
| `data-title` | Koptekst boven de widget. | `Grip op jouw energie` |
| `data-subtitle` | Subtekst onder de titel. | `Waar heb je interesse in?` |
| `data-button-radius` | Border-radius van de CTA-knoppen. | `12px` |
| `data-open-new-tab` | Doelpagina in nieuw tabblad openen (`true`/`false`). | `true` |
| `data-tile-display` | Tegel-weergave: standaard of groot. | `large` |
| `data-address-format` | Adresformaat, bv. `dutch`. | `dutch` |
| `data-show-phone` / `data-show-email` | Telefoon-/e-mailveld tonen (`true`/`false`). | `true` |

> Dit zijn de meest gebruikte velden; de onderstaande secties beschrijven specifiek de **nieuwe**
> functionaliteit van deze branch.

---

## 3. Tegels (measures)

Elke maatregel ("tile") wordt gedefinieerd met `data-tile-<key>-*` attributen. `<key>` is een vrije
sleutel zoals `heatpump`, `solarpanels`, `carcharger`, `homebattery`.

| Attribuut | Beschrijving |
|---|---|
| `data-tile-<key>-title` | Titel/label van de tegel. |
| `data-tile-<key>-url` | Doel-URL bij selectie van deze tegel. |
| `data-tile-<key>-icon-svg` | **Base64** van de SVG voor het tegel-icoon (zie §7). |
| `data-tile-<key>-booking-url` | Optionele boekings-URL voor deze tegel. |
| `data-tiles-default` | Komma-gescheiden lijst van standaard-geselecteerde tegels, bv. `heatpump,solarpanels`. |

Voorbeeld:

```html
data-tile-heatpump-title="Warmtepomp"
data-tile-heatpump-url="https://homezero-accp.mendixcloud.com/link/start?id=warmtepomp-advies"
data-tile-heatpump-icon-svg="<base64-svg>"
```

---

## 4. CTA's per maatregel, combinatie en globaal  *(NIEUW)*

De widget heeft twee CTA-knoppen: **CTA1** (primair) en **CTA2** (secundair). Teksten, iconen en
(voor CTA2) URL's kunnen per tegel, per combinatie én globaal worden gezet. De widget kiest
automatisch de juiste waarde op basis van wat de bezoeker selecteert.

### 4.1 Per-maatregel CTA's

| Attribuut | Beschrijving |
|---|---|
| `data-tile-<key>-cta1-text` | CTA1-tekst wanneer (alleen) deze tegel geselecteerd is. |
| `data-tile-<key>-cta2-text` | CTA2-tekst voor deze tegel. |
| `data-tile-<key>-cta2-url` | CTA2-doel-URL voor deze tegel. |
| `data-tile-<key>-cta1-icon-svg` | Base64 SVG-icoon voor CTA1 bij deze tegel. |
| `data-tile-<key>-cta2-icon-svg` | Base64 SVG-icoon voor CTA2 bij deze tegel. |

### 4.2 Combinatie-CTA's (meerdere tegels geselecteerd)

| Attribuut | Beschrijving |
|---|---|
| `data-cta1-combo-text` / `data-cta1-combo-url` | CTA1 tekst/URL bij een combinatie. |
| `data-cta2-combo-text` / `data-cta2-combo-url` | CTA2 tekst/URL bij een combinatie. |
| `data-cta1-combo-icon-svg` / `data-cta2-combo-icon-svg` | Base64 SVG-iconen bij een combinatie. |

### 4.3 Globale fallback-CTA's

| Attribuut | Beschrijving |
|---|---|
| `data-cta1-text` / `data-cta2-text` | Generieke teksten (fallback). |
| `data-cta1-icon-svg` / `data-cta2-icon-svg` | Generieke base64 SVG-iconen (fallback). |
| `data-cta2-show` | CTA2 tonen (`true`/`false`). |
| `data-cta2-action` | Actie van CTA2, bv. `flow`. |

### 4.4 Keuze-volgorde (precedence)

De widget bepaalt tekst én icoon met dezelfde logica, afhankelijk van het aantal geselecteerde tegels:

- **Meerdere tegels geselecteerd** → combinatie-waarde, met terugval op de globale waarde.
  `combo` → `global`
- **Exact één tegel geselecteerd** → de per-tegel-waarde, met terugval op de globale waarde.
  `tile` → `global`
- **Geen specifieke selectie** → de globale waarde.

> Iconen verschijnen **alleen** als ze geconfigureerd zijn; er is geen standaard-icoon. Een CTA zonder
> icoon toont enkel de tekst.

---

## 5. Checkbox met inline link (privacyverklaring)  *(NIEUW)*

Met `data-checkbox-title` toon je een verplicht/optioneel akkoord-vinkje. De tekst ondersteunt
**inline markdown-links** in de vorm `[label](url)`, die worden omgezet naar echte links
(class `embed-checkbox-link`).

| Attribuut | Beschrijving |
|---|---|
| `data-checkbox-title` | Labeltekst, mag `[tekst](url)` bevatten. |
| `data-checkbox-required` | Verplicht akkoord (`true`/`false`). |

```html
data-checkbox-title="Ik ga akkoord met de [privacyverklaring](https://homezero.nl/privacy)"
data-checkbox-required="true"
```

---

## 6. Blok-styling (achtergrond, rand, hoeken, padding)  *(NIEUW)*

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

> **Border-stijl:** alleen `solid` en `none` worden in de test-playground aangeboden
> (`dashed`/`dotted` zijn bewust verwijderd). In `data-block-border` kun je technisch elke geldige
> CSS-border meegeven, maar houd je aan `solid`/`none` voor consistentie.

---

## 7. SVG-iconen aanleveren (base64)

Alle `*-icon-svg` attributen verwachten de **base64-encoded ruwe `<svg>`-markup**.

Richtlijnen voor de SVG zelf:

- Gebruik een `viewBox` (bv. `viewBox="0 0 24 24"`) en **géén** vaste `width`/`height` — de widget
  bepaalt de grootte via CSS. (Eventueel aanwezige `width`/`height` worden verwijderd bij rendering.)
- Gebruik `stroke="currentColor"` / `fill="currentColor"` zodat het icoon de knopkleur volgt.
- De waarde moet beginnen met `<svg` na het base64-decoderen, anders wordt het genegeerd.

Encoden (voorbeeld):

```js
// Browser
const base64 = btoa('<svg viewBox="0 0 24 24" ...>...</svg>');
```
```bash
# CLI
printf '%s' '<svg viewBox="0 0 24 24" ...>...</svg>' | base64
```

---

## 8. Invoerveld-placeholders  *(NIEUW)*

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

> Een lege toevoeging-placeholder uitzetten: `data-toevoeging-placeholder=""`.

---

## 9. Volledig voorbeeld (alle nieuwe features samen)

```html
<hz-embed
  data-mode="scan" data-color="#16a34a" data-button-radius="12px" data-open-new-tab="true"
  data-title="Grip op jouw eigen energie"
  data-subtitle="Waar heb je interesse in? Meer opties mogelijk"
  data-tile-display="large"

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
  data-cta2-icon-svg="<base64-svg>"

  data-tiles-default="heatpump"

  data-bg-color="#ffffff" data-bg-opacity="0.9"
  data-block-radius="18px" data-block-padding="24px"
  data-block-border="1px solid #16a34a"

  data-checkbox-title="Ik ga akkoord met de [privacyverklaring](https://homezero.nl/privacy)"
  data-checkbox-required="true"

  data-postcode-placeholder="Bijv. 1011AB"
  data-toevoeging-placeholder=""

  data-address-format="dutch" data-show-phone="false" data-show-email="true"
></hz-embed>
```

---

## 10. Samenvatting nieuw in deze branch

- **Per-maatregel CTA's**: eigen tekst/icoon (en CTA2-URL) per tegel.
- **Combinatie-CTA's**: aparte tekst/icoon/URL wanneer meerdere tegels geselecteerd zijn.
- **Globale CTA-fallbacks** + duidelijke keuze-volgorde (`combo`/`tile` → `global`).
- **CTA-iconen** als base64 SVG, grootte bepaald door de stylesheet.
- **Checkbox-link**: inline markdown `[tekst](url)` in `data-checkbox-title`.
- **Blok-styling**: `data-bg-color`, `data-bg-opacity`, `data-block-radius`, `data-block-padding`, `data-block-border`.
- **Aanpasbare placeholders** voor alle invoervelden.
- Test-playground: border-stijl beperkt tot `solid`/`none`.
