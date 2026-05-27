# HomeZero Widget Generator — Lovable Build Instructions

## Project Brief

Build a **widget configuration tool** that allows HomeZero partners to visually configure embeddable lead-capture widgets and copy the resulting HTML embed code. The tool generates `<hz-embed>` tag configurations with all required `data-*` attributes. A live preview panel shows exactly how the widget will look on a partner's website as they configure it.

This tool replaces the "Pico Widget Generator" prototype at `flowmatchwidgetgenerator.lovable.app`. It must have a significantly more complete configuration surface and an accurate live preview.

---

## Tech Stack

- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State:** React useState / useReducer (no external state library needed)
- **Fonts:** Inter (Google Fonts)
- **Icons:** Lucide React
- **No backend required** — everything is client-side

---

## Application Layout

The application has a **three-column layout**:

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: "HomeZero Widget Generator"  [logo]                │
├──────────┬──────────────────────────┬───────────────────────┤
│          │                          │                       │
│  LEFT    │    CONFIG PANEL          │   LIVE PREVIEW        │
│ SIDEBAR  │    (scrollable)          │   (sticky)            │
│          │                          │                       │
│ Widget   │  ┌──────────────────┐    │  ┌─────────────────┐  │
│ type     │  │ Section 1        │    │  │                 │  │
│ selector │  │ Section 2        │    │  │  Widget preview │  │
│          │  │ Section 3        │    │  │  (pixel-perfect)│  │
│          │  └──────────────────┘    │  └─────────────────┘  │
│          │                          │                       │
│          │  [GENERATE EMBED CODE]   │  [Embed code output]  │
│          │                          │                       │
└──────────┴──────────────────────────┴───────────────────────┘
```

**Column widths:**
- Left sidebar: `240px` fixed
- Config panel: flexible, `min-width: 340px`, `max-width: 520px`
- Live preview: flexible, fills remaining space, `min-width: 360px`

**On mobile (< 768px):** Stack vertically — config panel on top, preview below, sidebar collapses to a horizontal tab bar.

---

## Left Sidebar

### Widget Type Selector

Shows 4 widget types as clickable cards. Active type has a primary-colored border. Clicking a type switches the config panel and updates the live preview.

```
┌─────────────────────┐
│  Widget type        │
├─────────────────────┤
│ ▣  Postcodeflow     │  ← "scan" mode
│ 📅  Afspraak plannen │  ← "booking" mode
│ 📄  Brochure         │  ← "brochure" mode
│ ▤  Klassiek         │  ← "classic" mode (advanced)
└─────────────────────┘
```

Each card shows:
- Icon (use Lucide icons)
- Name
- One-line description

Widget type definitions:

| Type key | Name | Description | Icon |
|---|---|---|---|
| `scan` | Postcodeflow | Tegels + adres → scan starten | `MapPin` |
| `booking` | Afspraak plannen | Afspraak inplannen via externe tool | `Calendar` |
| `brochure` | Brochure download | E-mailadres → brochure per mail | `FileText` |
| `classic` | Klassiek (geavanceerd) | Bestaande widget configuratie | `Settings` |

---

## Config Panel

The config panel is divided into collapsible **sections** using accordion components. Each section has a header and toggles open/closed. All sections are open by default on first load.

The sections differ per widget type:

### Sections for all types: `scan`, `booking`, `brochure`

1. **Stijl** (Style)
2. **Inhoud** (Content — title, subtitle)
3. **Producten** (Products/tiles) — shown for scan; optional toggle for booking/brochure
4. **Velden** (Form fields)
5. **Knoppen** (Buttons/CTAs)
6. **Geavanceerd** (Advanced — installer, context, tracking)

Classic mode shows a simplified view with raw attribute editing.

---

## Config Panel — Section Details

### Section 1: Stijl (Style)

| Field | Component | Notes |
|---|---|---|
| Primaire kleur | Color picker + hex input | Default: `#2A6DF4`. Shows a color swatch. On change updates preview in real-time |
| Kleurverloop (gradient) | Toggle + two color pickers | When enabled, shows "Van kleur" and "Naar kleur" inputs. Adds `data-gradient-from` / `data-gradient-to` |
| Knop afronding | Slider (0–24px) + label "px" | Default: 10. Updates `data-button-radius` |
| Taal | Segmented control: NL / EN / FR / DE | Default: NL. Updates `data-language` |
| Link openen | Toggle: "In nieuw tabblad" | Default: off. Updates `data-open-new-tab` |

### Section 2: Inhoud (Content)

| Field | Component | Notes |
|---|---|---|
| Titel | Text input | Optional. `data-title` |
| Subtitel | Text input | Optional. `data-subtitle` |

### Section 3: Producten (Products)

This section is the most complex. It allows the partner to build their tile grid.

**Header:** "Productopties" with a toggle to enable/disable the entire section. When disabled, no tiles are shown and the widget goes straight to the address field.

**Weergave-stijl** (tile display style) — radio button group shown at top of section:

| Value | Label | Description |
|---|---|---|
| `tiles` | Tegels (standaard) | Grid of icon tiles — classic look |
| `dropdown` | Dropdown | Multi-select dropdown list |
| `tags` | Tags / chips | Chip multi-select — selected items appear as colored pills with icon + name + × |

Generated as: `data-tile-display="tiles|dropdown|tags"` (omit attribute when `tiles` — it is the default).

**Label veld:** Text input for the label shown above the selector. Default: "Producten". Generated as `data-tiles-label="..."`.

**Max. selecties:** Number input (0 = unlimited). Generated as `data-tiles-max-select="N"` (omit when 0).

**Tile list:**

Show a list of configurable tiles. Each row:
```
[drag handle] [icon preview] [name field] [URL field] [booking URL toggle] [delete]
```

- Maximum: 6 tiles
- Minimum: 1 tile (when section enabled)
- **Add tile button:** opens a modal to pick from the supported icon types

**Add tile modal:**
Shows a grid of all supported product icons with their Dutch labels. Partner clicks one to add it to the list. Pre-configures `data-tile-{key}-title` with the default Dutch label.

**Per-tile configuration (expanded row):**

| Field | Component | Notes |
|---|---|---|
| Label | Text input | Tile display name |
| Scan URL | URL input | `data-tile-{key}-url` |
| Booking URL | URL input (collapsible) | `data-tile-{key}-booking-url`. Show toggle "Afwijkende booking URL" that reveals this field. When set, shows a calendar icon indicator on the tile preview |
| Standaard geselecteerd | Checkbox | Adds key to `data-tiles-default` |
| Aangepast icoon | File upload + AI button | Uploads or generates a custom SVG icon. Stored as base64 in `data-tile-{key}-icon-svg`. See "AI Iconen Genereren" section below. |

**Supported icon types** (show in add modal with icons):

```
solarpanels    → Zonnepanelen
heatpump       → Warmtepomp
airconditioning → Airco
homebattery    → Thuisbatterij / Batterij
carcharger     → Laadpaal
floorinsulation → Vloerisolatie
wallinsulation → Spouwmuurisolatie
roofinsulation → Dakisolatie
glassinsulation → Glas / HR++
gasboiler      → CV-Ketel
ems            → EMS
adviescan      → Advies scan
advisormodule  → Adviseur / Advies
solarboiler    → Zonneboiler
meterkast      → Meterkast
general        → Algemeen
```

### Multi-tegel URL gedrag (CTA 1)

Wanneer een gebruiker meerdere tegels selecteert, werkt de redirect als volgt:

- **Redirect URL**: altijd de URL van de **primaire tegel** (eerste geselecteerde tegel)
- **Meegegeven als URL-params**:
  - `Tiles=solarpanels,homebattery` — komma-gescheiden lijst van alle geselecteerde keys
  - `PrimaryTile=solarpanels` — de primaire tegel
  - `Phone`, `Email`, `ReferralURL`, adresparams, etc.

Dit betekent: **elke tegel heeft zijn eigen leadflow URL** (`data-tile-{key}-url`), en de primaire tegel bepaalt welke flow wordt geopend. Alle geselecteerde tegels worden als metadata meegestuurd zodat de leadflow ze kan verwerken.

**Configuratietip voor de generator:** Toon een note als `data-tiles-max-select` niet op 1 staat: *"Bij meerdere geselecteerde producten gaat de gebruiker naar de leadflow van het eerste geselecteerde product. Zorg dat de URL's per tegel correct zijn ingesteld."*

**Booking URL per tegel:** Als een tegel een `data-tile-{key}-booking-url` heeft én geselecteerd is als primaire tegel, opent CTA 1 direct de booking URL (bijv. Calendly) i.p.v. de scan leadflow. De knoptekst wisselt dan automatisch van `data-cta1-text-scan` naar `data-cta1-text-booking`.

### Section 4: Velden (Form fields)

The available fields differ by widget type:

**Scan mode fields:**

| Toggle | Label | Attribuut | Sub-opties |
|---|---|---|---|
| Adresveld | Adresveld (altijd aan) | — | Format: "Nederlands" (`data-address-format="dutch"`, standaard) / "Internationaal" (`data-address-format="international"`) / "Google autocomplete" (`data-google-search="true"` + `data-country="nl"`). Google autocomplete vervangt postcode+huisnummer door een Google Places zoekveld — handig voor internationale klanten. |
| Mobielveld | Mobiel nummer | `data-show-phone="true"` | Sub-toggle: "Verplicht" → `data-phone-required="true"` |
| E-mailveld | E-mailadres | `data-show-email="true"` | Sub-toggle: "Verplicht" → `data-email-required="true"`. Optioneel = veld zichtbaar maar niet verplicht. |
| Toestemmingsvak | Toestemming checkbox | `data-checkbox-title="..."` | Sub-toggle: "Verplicht" → `data-checkbox-required="true"`. Verkorte sleutel: `data-checkbox-shorttitle="..."` (wordt meegestuurd als URL-param `checkboxtitle`). |

**Booking mode fields:**

| Toggle | Label | Sub-options |
|---|---|---|
| Mobielveld | Mobiel nummer | Sub-toggle: "Verplicht" (default on) |
| E-mailveld | E-mailadres | Sub-toggle: "Verplicht" |
| Doorgeven aan booking URL | Velden meesturen | Adds `data-pass-to-url="true"` |

**Brochure mode fields:**

| Toggle | Label | Sub-options |
|---|---|---|
| Naamvelden | Voor- en achternaam | `data-show-name="true"` |
| Mobielveld | Mobiel nummer | `data-show-phone="true"` |
| E-mailveld | E-mailadres (altijd aan) | Always required in brochure mode |

### Section 5: Knoppen (Buttons/CTAs)

#### Scan mode — 3-laags CTA systeem

**CTA 1 (hoofd — altijd zichtbaar):**

| Field | Component | Notes |
|---|---|---|
| Knoptekst (scan flow) | Text input | Default: "Bereken wat je bespaart". `data-cta1-text-scan` |
| Knoptekst (adviesgesprek) | Text input | Default: "Plan een gratis adviesgesprek". `data-cta1-text-booking`. Wordt automatisch gebruikt als de geselecteerde tegel een `booking-url` heeft |

**CTA 2 (secundair — optioneel):**

Toggle "Secundaire CTA" enables a second button. When enabled, show:

| Field | Component | Notes |
|---|---|---|
| CTA 2 tekst | Text input | Default: "Direct contact (30 sec)". `data-cta2-text` |
| CTA 2 actie | Segmented control | "Direct contact (Pico)" / "AI chat widget". `data-cta2-action` |
| ↳ Adres overslaan | Toggle (alleen bij Pico) | Submit zonder adres. `data-contact-skip-address` |
| ↳ Pico API key | Password input (alleen bij Pico) | Verplaatst naar Section 6 maar toon waarschuwing hier als leeg. `data-pico-key` |

**`data-cta2-action` waarden:**
- `"pico"` (default): verstuurt direct-contact lead via de Pico API. Vereist `data-pico-key`.
- `"ai-chat"`: opent de AI chat widget op de pagina (`window.ChatWidget.open()`). **Geen Pico key nodig.** De knop is automatisch verborgen op pagina's waar geen `ChatWidget` aanwezig is — partners hoeven niets extra te doen. Widget detecteert `window.ChatWidget` via polling (5 sec) én luistert naar custom event `hz-chatwidget-ready`.

**CTA 3 (AI chat — automatisch):**

Geen aparte instelling nodig. Als `data-cta2-action="ai-chat"` is ingesteld, toont de widget de AI chat knop alleen wanneer `window.ChatWidget` gedetecteerd wordt. Toon dit als informatieve note in de generator UI: *"De AI chat knop verschijnt automatisch alleen op pagina's waar de HomeZero AI chat widget geladen is."*

**For booking mode:**

| Field | Component | Notes |
|---|---|---|
| Knoptekst | Text input | Default: "Plan een afspraak". `data-cta1-text` |
| Booking provider | Dropdown | calendly / google / microsoft / hubspot / acuity / other. `data-booking-provider` |
| Booking URL | URL input | Required. `data-booking-url` |

**For brochure mode:**

| Field | Component | Notes |
|---|---|---|
| Knoptekst | Text input | Default: "Stuur mij de brochure". `data-cta1-text` |
| Bevestigingstekst | Text input | Default: "De brochure is onderweg!". `data-success-message` |

### Section 6: Geavanceerd (Advanced)

| Field | Component | Notes |
|---|---|---|
| Installer ID | Text input | `data-installer` |
| Context | Text input | `data-context` |
| Pico API key | Password input | Scan (CTA2) + brochure mode. `data-pico-key`. Required for direct-contact and brochure submissions |
| Pico omgeving | Segmented control: Production / Acceptance | Default: production. `data-pico-env` |
| Pico flow ID | Text input | UUID. Optional — auto-extracted from tile scan URL when omitted. `data-pico-flow-id` |

---

## Live Preview Panel

The live preview renders a **pixel-perfect React component** that looks exactly like the actual widget rendered in `embed.js`. It updates in real-time as config options change.

### Preview wrapper

The preview panel shows the widget on a light gray background with a subtle shadow, simulating an embedded widget on a white website. Show a label above: "Live preview — zo ziet de widget er uit op jouw website".

Provide a device toggle:
- `[Desktop]` — shows widget at 480px width
- `[Mobile]` — shows widget at 375px width

### Preview components to build (React)

Build these as separate React components that mirror the actual widget HTML/CSS:

#### `WidgetPreview` (wrapper)
Applies `--primary-color`, `--primary-gradient`, `--button-radius` as CSS variables.

#### `TileGrid` (scan mode)
```
Props: tiles[], selectedTiles (Set), onToggle, primaryColor, gradient?

Renders: grid of tile buttons.
Selected tile: gradient background (or primary-color solid), white text, checkmark badge top-right.
Unselected tile: light gray border, hover state.
```

#### `AddressField` (scan + classic mode)
```
Props: format ("dutch" | "international" | "google"), language

Dutch: [Postcode] [Huisnummer] [Toevoeging] in a row
International: [Straat] [Huisnummer] in row, [Postcode] [Stad] in row below
Google: single text input with search icon
```

#### `ContactFields` (scan + booking mode)
```
Props: showPhone, showEmail, phoneRequired, emailRequired, language

Renders phone and/or email inputs based on props.
When both shown: side-by-side in a grid.
```

#### `BrochureForm` (brochure mode)
```
Props: showName, showPhone, language, successMessage, ctaText

Renders: optional name row, email input, optional phone, CTA button.
```

#### `DualCTA` (scan mode)
```
Props: cta1Text, cta2Text, showCta2, primaryColor, gradient?, onCta1Click, onCta2Click

Primary button: full width, gradient or solid primary color, rounded (buttonRadius).
Secondary button: full width, muted gray background, text color.
Spacing: 12px between buttons.
```

#### `SingleCTA` (booking + brochure mode)
```
Props: text, primaryColor, gradient?, buttonRadius

Single full-width button.
```

#### `ConfirmScreen` (all modes)
```
Props: title, message

Center-aligned, checkmark icon in primary color circle, title, message.
```

#### `CheckboxField`
```
Props: label, required

Custom styled checkbox matching embed-styles.css.
```

### Live preview tile icons

For the tile icons in the preview, use **inline SVG** copied from the `measurementIcons` object in `embed.js`. These must match exactly. Do not substitute with Lucide icons.

### Styling the live preview

The preview components must use CSS that closely matches `embed-styles.css`. Use Tailwind for layout but add an `<style>` block or CSS module for the specific widget styles (input borders, border-radius, font sizes, etc.).

Key style values to match:
- Input border: `1px solid #dadee7`, border-radius `8px`, padding `12px`
- Font size inputs: `14px`, weight `500`
- Label: `12px`, weight `500`, color `#132039`
- Validation message: `14px`, color `#fd3118`
- Primary button: `16px`, weight `500`, padding `13px 40px`, no box-shadow
- Submit hover: `opacity: 0.8`

---

## Embed Code Generator

Below the config panel, show a section:

```
┌─────────────────────────────────────────────────────────┐
│  Embed code                                              │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ <hz-embed                                        │   │
│  │   data-mode="scan"                               │   │
│  │   data-color="#2A6DF4"                           │   │
│  │   ...                                            │   │
│  │ ></hz-embed>                                     │   │
│  │ <script defer                                    │   │
│  │   src="https://homezerotech.github.io/Widget/    │   │
│  │   Acceptance/embed.min.js">                      │   │
│  │ </script>                                        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [📋 Kopieer code]                                       │
└─────────────────────────────────────────────────────────┘
```

### Code generation rules

1. Only include attributes that differ from defaults (keep code clean)
2. Always include `data-mode` and `data-color`
3. For tiles: include all configured `data-tile-*` attributes in alphabetical order
4. The script tag always points to: `https://homezerotech.github.io/Widget/Acceptance/embed.min.js`
5. Pretty-print with one attribute per line, 2-space indentation
6. Syntax-highlight the output (use a simple highlighter or `<pre>` with CSS classes for attribute names/values)

### Generated code format

```html
<!-- HomeZero Widget — {{widget-type-label}} -->
<hz-embed
  data-mode="scan"
  data-color="#2A6DF4"
  data-title="Ontdek jouw besparingsmogelijkheden"
  data-tile-solarpanels-url="https://..."
  data-tile-solarpanels-title="Zonnepanelen"
  data-tile-heatpump-url="https://..."
  data-tile-heatpump-title="Warmtepomp"
  data-tiles-default="solarpanels"
  data-cta1-text-scan="Bereken wat je bespaart"
  data-cta2-show="true"
  data-cta2-text="Direct contact (30 sec)"
  data-google-search="true"
  data-country="nl"
  data-show-phone="true"
  data-open-new-tab="true"
></hz-embed>
<script defer src="https://homezerotech.github.io/Widget/Acceptance/embed.min.js"></script>
```

### Copy button behavior

On click:
1. Copy code to clipboard using `navigator.clipboard.writeText()`
2. Change button label to "✓ Gekopieerd!" for 2 seconds
3. Revert to "📋 Kopieer code"

---

## State Model

```typescript
// Top-level config state
interface WidgetConfig {
  mode: 'scan' | 'booking' | 'brochure' | 'classic';
  
  // Style
  color: string;           // hex, default "#2A6DF4"
  gradientFrom?: string;   // hex, optional
  gradientTo?: string;     // hex, optional
  buttonRadius: number;    // px, default 10
  language: 'nl' | 'en' | 'fr' | 'de';
  openNewTab: boolean;
  
  // Content
  title: string;
  subtitle: string;
  
  // Tiles (scan + optional for others)
  tiles: TileConfig[];
  tilesDefault: string[];          // pre-selected keys
  tilesEnabled: boolean;
  tileDisplay: 'tiles' | 'dropdown' | 'tags';  // data-tile-display
  tilesLabel: string;              // data-tiles-label, default "Producten"
  tilesMaxSelect: number;          // data-tiles-max-select, 0 = unlimited
  
  // Fields
  showPhone: boolean;
  phoneRequired: boolean;
  showEmail: boolean;
  emailRequired: boolean;
  addressFormat: 'dutch' | 'international' | 'google';
  country: string;
  showName: boolean;       // brochure mode
  checkboxTitle: string;
  checkboxShortTitle: string;
  checkboxRequired: boolean;
  
  // CTAs
  cta1TextScan: string;
  cta1TextBooking: string;
  cta1Text: string;                    // booking + brochure mode
  showCta2: boolean;
  cta2Text: string;
  cta2Action: 'pico' | 'ai-chat';     // data-cta2-action
  contactSkipAddress: boolean;
  
  // Booking mode
  bookingUrl: string;
  bookingProvider: 'calendly' | 'google' | 'microsoft' | 'hubspot' | 'acuity' | 'other';
  passToUrl: boolean;
  
  // Brochure mode
  successMessage: string;
  
  // Pico API (CTA2 direct-contact in scan mode + brochure mode)
  picoKey: string;           // X-API-Key header value
  picoEnv: 'production' | 'acceptance';
  picoFlowId: string;        // UUID — auto-extracted from tile URL when omitted
  
  // Advanced
  installer: string;
  context: string;
}

interface TileConfig {
  key: string;          // e.g. "solarpanels"
  title: string;        // e.g. "Zonnepanelen"
  url: string;          // scan flow URL
  bookingUrl?: string;  // optional external booking URL
  isDefault: boolean;
  iconSvg?: string;     // base64-encoded custom SVG icon (data-tile-{key}-icon-svg)
}
```

**Initialize** the config state with sensible defaults when a widget type is selected:

```typescript
const DEFAULTS: Record<WidgetConfig['mode'], Partial<WidgetConfig>> = {
  scan: {
    color: '#2A6DF4',
    buttonRadius: 10,
    language: 'nl',
    openNewTab: true,
    tiles: [
      { key: 'solarpanels', title: 'Zonnepanelen', url: '', isDefault: false },
      { key: 'heatpump', title: 'Warmtepomp', url: '', isDefault: false },
    ],
    tilesEnabled: true,
    tileDisplay: 'tiles',
    tilesLabel: 'Producten',
    tilesMaxSelect: 0,
    showPhone: true,
    showEmail: true,
    addressFormat: 'dutch',
    cta1TextScan: 'Bereken wat je bespaart',
    cta1TextBooking: 'Plan een gratis adviesgesprek',
    showCta2: false,
    cta2Text: 'Direct contact (30 sec)',
  },
  booking: {
    color: '#2A6DF4',
    buttonRadius: 10,
    language: 'nl',
    openNewTab: true,
    showPhone: true,
    phoneRequired: true,
    cta1Text: 'Plan een afspraak',
    bookingProvider: 'calendly',
  },
  brochure: {
    color: '#2A6DF4',
    buttonRadius: 10,
    language: 'nl',
    showEmail: true,
    cta1Text: 'Stuur mij de brochure',
    successMessage: 'De brochure is onderweg naar jouw inbox!',
    picoEnv: 'production',
  },
  classic: {
    color: '#2A6DF4',
    buttonRadius: 10,
    language: 'nl',
    addressFormat: 'dutch',
  },
};
```

---

## Embed Code Generation Function

```typescript
function generateEmbedCode(config: WidgetConfig): string {
  const attrs: [string, string][] = [];
  
  attrs.push(['data-mode', config.mode]);
  attrs.push(['data-color', config.color]);
  
  if (config.gradientFrom) attrs.push(['data-gradient-from', config.gradientFrom]);
  if (config.gradientTo) attrs.push(['data-gradient-to', config.gradientTo]);
  if (config.buttonRadius !== 10) attrs.push(['data-button-radius', `${config.buttonRadius}px`]);
  if (config.language !== 'nl') attrs.push(['data-language', config.language]);
  if (config.openNewTab) attrs.push(['data-open-new-tab', 'true']);
  if (config.title) attrs.push(['data-title', config.title]);
  if (config.subtitle) attrs.push(['data-subtitle', config.subtitle]);
  
  if (config.mode === 'scan') {
    // Tiles
    if (config.tileDisplay && config.tileDisplay !== 'tiles') attrs.push(['data-tile-display', config.tileDisplay]);
    if (config.tilesLabel && config.tilesLabel !== 'Producten') attrs.push(['data-tiles-label', config.tilesLabel]);
    if (config.tilesMaxSelect > 0) attrs.push(['data-tiles-max-select', String(config.tilesMaxSelect)]);
    config.tiles.forEach(tile => {
      if (tile.url) attrs.push([`data-tile-${tile.key}-url`, tile.url]);
      attrs.push([`data-tile-${tile.key}-title`, tile.title]);
      if (tile.bookingUrl) attrs.push([`data-tile-${tile.key}-booking-url`, tile.bookingUrl]);
      if (tile.iconSvg) attrs.push([`data-tile-${tile.key}-icon-svg`, tile.iconSvg]);
    });
    const defaults = config.tiles.filter(t => t.isDefault).map(t => t.key);
    if (defaults.length) attrs.push(['data-tiles-default', defaults.join(',')]);
    
    // Address
    if (config.addressFormat === 'google') {
      attrs.push(['data-google-search', 'true']);
      attrs.push(['data-country', config.country || 'nl']);
    } else if (config.addressFormat === 'international') {
      attrs.push(['data-address-format', 'international']);
    }
    
    // Fields
    if (config.showPhone) {
      attrs.push(['data-show-phone', 'true']);
      if (config.phoneRequired) attrs.push(['data-phone-required', 'true']);
    }
    if (config.showEmail) {
      attrs.push(['data-show-email', 'true']);
      if (config.emailRequired) attrs.push(['data-email-required', 'true']);
    }
    
    // CTAs
    if (config.cta1TextScan !== 'Bereken wat je bespaart') attrs.push(['data-cta1-text-scan', config.cta1TextScan]);
    if (config.cta1TextBooking !== 'Plan een gratis adviesgesprek') attrs.push(['data-cta1-text-booking', config.cta1TextBooking]);
    if (config.showCta2) {
      attrs.push(['data-cta2-show', 'true']);
      if (config.cta2Text) attrs.push(['data-cta2-text', config.cta2Text]);
      if (config.cta2Action && config.cta2Action !== 'pico') attrs.push(['data-cta2-action', config.cta2Action]);
      if (config.cta2Action !== 'ai-chat' && config.contactSkipAddress) attrs.push(['data-contact-skip-address', 'true']);
    }
  }
  
  if (config.mode === 'booking') {
    if (config.bookingUrl) attrs.push(['data-booking-url', config.bookingUrl]);
    if (config.bookingProvider !== 'other') attrs.push(['data-booking-provider', config.bookingProvider]);
    if (config.cta1Text !== 'Plan een afspraak') attrs.push(['data-cta1-text', config.cta1Text]);
    if (config.showPhone) attrs.push(['data-show-phone', 'true']);
    if (config.phoneRequired) attrs.push(['data-phone-required', 'true']);
    if (config.passToUrl) attrs.push(['data-pass-to-url', 'true']);
  }
  
  if (config.mode === 'brochure') {
    if (config.cta1Text !== 'Stuur mij de brochure') attrs.push(['data-cta1-text', config.cta1Text]);
    if (config.showName) attrs.push(['data-show-name', 'true']);
    if (config.showPhone) attrs.push(['data-show-phone', 'true']);
    if (config.successMessage !== 'De brochure is onderweg naar jouw inbox!') {
      attrs.push(['data-success-message', config.successMessage]);
    }
  }
  
  // Pico API — scan (CTA2) and brochure modes
  if ((config.mode === 'scan' && config.showCta2) || config.mode === 'brochure') {
    if (config.picoKey) attrs.push(['data-pico-key', config.picoKey]);
    if (config.picoEnv && config.picoEnv !== 'production') attrs.push(['data-pico-env', config.picoEnv]);
    if (config.picoFlowId) attrs.push(['data-pico-flow-id', config.picoFlowId]);
  }
  
  // Checkbox
  if (config.checkboxTitle) {
    attrs.push(['data-checkbox-title', config.checkboxTitle]);
    if (config.checkboxShortTitle) attrs.push(['data-checkbox-shorttitle', config.checkboxShortTitle]);
    if (config.checkboxRequired) attrs.push(['data-checkbox-required', 'true']);
  }
  
  // Advanced
  if (config.installer) attrs.push(['data-installer', config.installer]);
  if (config.context) attrs.push(['data-context', config.context]);
  
  const attrLines = attrs.map(([k, v]) => `  ${k}="${v}"`).join('\n');
  const scriptSrc = 'https://homezerotech.github.io/Widget/Acceptance/embed.min.js';
  
  return `<!-- HomeZero Widget -->\n<hz-embed\n${attrLines}\n></hz-embed>\n<script defer src="${scriptSrc}"></script>`;
}
```

---

## UX Details

### Section Accordion

Each config section has:
- **Header:** bold label + chevron icon (rotates on open/close)
- **Body:** smooth height animation (`max-height` transition)
- **State:** open by default, remembers state per session

### Input validation in the generator

- URL fields: show a warning icon if value is non-empty and not a valid URL
- Required fields for brochure mode: highlight Pico API key with an asterisk
- If `data-pico-key` is empty and CTA2 is enabled (scan mode): show a warning "Zonder Pico API key worden directe contactmeldingen niet verwerkt"
- If `data-pico-key` is empty in brochure mode: show a warning "Zonder Pico API key kan de brochure niet worden verstuurd"

### Color picker

Use an `<input type="color">` styled as a color swatch. Alongside it, a text input showing the hex value. Both are two-way synced.

### Tile drag-and-drop ordering

Tiles can be reordered by drag-and-drop. Use the HTML5 drag API (no external library). Reordering updates the order of `data-tile-*` attributes in the generated code.

---

## Header

```
┌─────────────────────────────────────────────────────────────┐
│  [HomeZero logo/wordmark]  Widget Generator                 │
│                                                [v2.0 badge] │
└─────────────────────────────────────────────────────────────┘
```

Height: `56px`. White background. Border-bottom: `1px solid #e5e7eb`.

---

## Empty States

**When no tiles are configured (scan mode):**
Show a dashed border placeholder in the preview where the tile grid would be, with the text "Voeg producten toe in de configuratie".

**When booking URL is empty (booking mode):**
Show a placeholder booking card in the preview with "Vul een booking URL in".

**When Pico API key is empty (brochure mode):**
Show a placeholder form with a note "Vul de Pico API key in om de brochure te kunnen versturen".

---

## Validation and Completeness Indicator

At the bottom of the config panel, show a **completeness indicator**:

```
Configuratie: ████████░░  80% compleet
⚠ Scan URL ontbreekt voor 2 tegels
⚠ Installer ID niet ingevuld (optioneel)
```

This updates dynamically. Green checkmark when 100% complete.

---

## Responsiveness

**Desktop (>= 1024px):** Full three-column layout as described.

**Tablet (768px–1023px):** Config panel + preview stacked vertically. Sidebar becomes a horizontal tab bar at top.

**Mobile (< 768px):** Same as tablet. Preview is collapsed behind a "Bekijk preview" toggle button. Config is shown by default.

---

## Page Title and Meta

- Title: `HomeZero Widget Generator`
- Description: `Configureer en embed lead-capture widgets op jouw website.`
- No indexing (`noindex, nofollow`) — this is an internal tool

---

## Notes on the Live Preview

The live preview is a **React reimplementation** of the widget — it does NOT load `embed.js` or use an iframe. This is intentional:

- Instant updates with no delay
- No CORS / same-origin issues
- No dependency on the production script URL
- Full control over styling

The preview must be kept **in sync** with the actual widget's HTML structure and CSS. When `embed.js` is updated, the preview components must be updated to match.

Consider adding a small note below the preview: "De preview is een benadering. Exacte weergave kan variëren door je website-stijlen."

---

## AI Iconen Genereren

Each tile can have a custom SVG icon instead of the built-in icon. The widget reads the `data-tile-{key}-icon-svg` attribute, base64-decodes it with `atob()`, and renders it as an inline SVG.

### How custom icons work in the widget

1. Widget calls `parseTilesFromElement()` → reads `data-tile-{key}-icon-svg` → stored on `tile.iconSvg`
2. When rendering, `decodeTileIcon(tile)` decodes with `atob()`, falls back to built-in icon if absent or malformed
3. The SVG is injected into a fixed-size container (28×28 px for tile grid, 22×22 for tag chips, 20×20 for dropdown)

### Workflow in the Lovable generator

**Option A — Upload SVG file:**
- Show a file input (accept `image/svg+xml`) per tile in the expanded tile row
- On file select: read file as text → `btoa(svgText)` → store in `tile.iconSvg`
- Preview the icon immediately in the tile row using the decoded SVG

**Option B — AI genereren (Gemini / Nano Banana):**

Use the Gemini API (model: `gemini-2.0-flash-preview-image-generation`, also called "Nano Banana") to generate a product icon from a text prompt.

Flow:
1. Partner clicks "AI icoon genereren" button on a tile row
2. A modal opens with:
   - Text field: "Beschrijf het icoon" (pre-filled with a smart default per tile key, e.g. "zonnepaneel op een dak, simpele lijnstijl, blauw")
   - Optional: "Website URL" — if filled, scrape the brand color from the site's CSS or meta tags and use it in the prompt
   - "Genereer" button
3. Call Gemini image generation API with a prompt like:
   ```
   Generate a clean, minimal line-art SVG icon of a {product} suitable for a website widget.
   Style: single-color stroke, no fill, modern, 28x28px viewBox.
   Color: {brandColor or "currentColor"}.
   Output: raw SVG markup only.
   ```
4. If Gemini returns a raster PNG instead of SVG: convert using a client-side vectorization step, OR use **Recraft.ai** API which natively produces SVG output.
5. Display generated icon in a preview. Partner clicks "Gebruik dit icoon" to accept.
6. On accept: clean the SVG markup, base64-encode with `btoa()`, store in `tile.iconSvg`

**Recraft.ai as SVG-native alternative:**
- API endpoint for SVG generation: `POST https://external.api.recraft.ai/v1/images/generations`
- Model: `recraftv3_svg`
- Returns SVG directly — no rasterization/vectorization step needed
- Requires Recraft API key (store in generator's config or env)

**Default prompts per tile key:**

| Key | Default prompt hint |
|---|---|
| `solarpanels` | "solar panels on a rooftop, minimal line art" |
| `heatpump` | "heat pump unit, minimal line art" |
| `homebattery` | "home battery pack, minimal line art" |
| `carcharger` | "electric car charger, minimal line art" |
| `heatpump` | "heat pump outdoor unit, minimal line art" |
| `ems` | "energy management system, circuit with lightning bolt, minimal line art" |
| `airconditioning` | "air conditioning unit, minimal line art" |
| `floorinsulation` | "cross-section of floor insulation layers, minimal line art" |
| `wallinsulation` | "brick wall with insulation cavity, minimal line art" |
| `roofinsulation` | "roof cross-section with insulation, minimal line art" |
| `glassinsulation` | "double-pane window cross-section, minimal line art" |
| `gasboiler` | "boiler / CV-ketel, minimal line art" |
| `solarboiler` | "solar water boiler, minimal line art" |
| `meterkast` | "electrical distribution board / fuse box, minimal line art" |
| `advisormodule` | "person with speech bubble and checkmark, minimal line art" |

---

## Delivery Checklist

- [ ] Three-column layout renders correctly on desktop
- [ ] All four widget types switch correctly via sidebar
- [ ] All config sections are present and functional per widget type
- [ ] Live preview updates in real-time on every config change
- [ ] Tile grid renders with correct icons (SVG from embed.js)
- [ ] Tile add/remove/reorder works
- [ ] Booking URL tile toggle (booking-url per tile) works
- [ ] Tile display selector (tiles / dropdown / tags) switches preview correctly
- [ ] Tags chip variant shows colored pill chips with icon, name and × in preview
- [ ] Dropdown variant shows multi-select dropdown in preview
- [ ] Custom SVG icon upload works per tile (file input → base64 → preview)
- [ ] AI icon generation modal opens, generates, and stores base64 SVG
- [ ] `data-tile-display` and `data-tiles-label` attributes appear in generated code
- [ ] `data-tile-{key}-icon-svg` attribute appears when custom icon is set
- [ ] Dual CTA renders correctly in scan mode preview
- [ ] Direct contact CTA toggle and sub-fields work
- [ ] Color picker updates preview in real-time
- [ ] Gradient toggle adds/removes gradient from preview
- [ ] Button radius slider updates preview in real-time
- [ ] Embed code generates correctly for all four modes
- [ ] Copy button copies code and shows confirmation
- [ ] Mobile layout renders correctly
- [ ] No TypeScript errors
- [ ] No console errors
