# HomeZero Widget Generator — Lovable Build Instructions

## Project Brief

Build a **widget configuration tool** that allows HomeZero partners to visually configure embeddable lead-capture widgets and copy the resulting HTML embed code. The tool generates `<hz-embed>` tag configurations with all required `data-*` attributes. A live preview panel shows exactly how the widget will look on a partner's website as they configure it.

This tool replaces the "Pico Widget Generator" prototype at `flowmatchwidgetgenerator.lovable.app`. It must have a significantly more complete configuration surface and an accurate live preview.

> **What changed in this revision (read first):**
> - **Unified dual-CTA model.** Scan mode now supports **1 or 2 CTAs that route to two different leadflows** per measurement. CTA2 is no longer Pico-only: it can route to a HomeZero leadflow (`flow`) or an external calendar (`booking`), per-tile, per-combination, or a global fallback.
> - **AI-chat is now a separate text link** (not a button, not the CTA2 slot). Controlled by `data-ai-chat-show` (default **false**) + `data-ai-chat-text`. Shown as a centered underlined link under the bottom CTA, only when `window.ChatWidget` is present.
> - **Selection modes are explicit:** tiles = single or multi, **dropdown = single only**, tags = single or multi.
> - **Config validation + guaranteed fallback:** misconfigurations log a `console.warn` and degrade gracefully; HomeZero leadflows always pass through the offline.html connectivity fallback, external calendars open directly.

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
| `scan` | Postcodeflow | Maatregel kiezen + adres → leadflow(s) | `MapPin` |
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
6. **AI-chat link** (scan mode only — optional)
7. **Geavanceerd** (Advanced — installer, context, tracking)

Classic mode shows a simplified view with raw attribute editing.

---

## Config Panel — Section Details

### Section 1: Stijl (Style)

These are the **only** style attributes settable via the embed code. Everything else (card background, fonts, input styling, label colors, card radius) is fixed in `embed-styles.css`.

| Field | Component | Notes |
|---|---|---|
| Primaire kleur | Color picker + hex input | Default: `#2A6DF4`. Drives primary button fill, tile-selection accents, the **secondary CTA outline**, and the AI-chat link color. Sanitized server-side via `sanitizeColor()`; invalid colors fall back to `#2A6DF4`. `data-color` |
| Kleurverloop (gradient) | Toggle + two color pickers | When enabled, shows "Van kleur" and "Naar kleur". Used for tile-selection background. `data-gradient-from` / `data-gradient-to` |
| Knop afronding | Slider (0–24px) + label "px" | Default: 10. Applies to both CTAs. `data-button-radius` |
| Taal | Segmented control: NL / EN / FR / DE | Default: NL. Drives field labels, the "(Optioneel)" suffix and validation messages. `data-language` |
| Link openen | Toggle: "In nieuw tabblad" | Default: off. `data-open-new-tab` |

### Section 2: Inhoud (Content)

| Field | Component | Notes |
|---|---|---|
| Titel | Text input | Optional. `data-title` |
| Subtitel | Text input | Optional. `data-subtitle` |

### Section 3: Producten (Products)

This section is the most complex. It allows the partner to build their tile/dropdown list and wire each measurement to its leadflow(s).

**Header:** "Productopties" with a toggle to enable/disable the entire section. When disabled, no selector is shown and the widget goes straight to the address field.

**Weergave-stijl** (display style) — radio group at the top of the section. Each style also has a **selectie-modus**:

| Value | Label | Selection | Attribute (scan) | Attribute (booking) |
|---|---|---|---|---|
| `large` | Grote tegels (standaard) | single **of** multi | `data-tile-display="large"` (default, omit) | `data-show-tiles="large"` |
| `dropdown` | Dropdown | **single only** | `data-tile-display="dropdown"` | `data-show-tiles="dropdown"` |
| `tags` | Tags / chips | single **of** multi | `data-tile-display="tags"` | `data-show-tiles="tags"` |

- **Selectie-modus** (single / multi) maps to `data-tiles-max-select`: **single = `1`**, **multi = `0`** (unlimited) or a number > 1.
- **Dropdown is single-select only.** The widget forces `data-tiles-max-select="1"` for dropdown and logs a warning if you set anything else. In the generator, hide the multi option when `dropdown` is selected.
- **Important:** Scan mode uses `data-tile-display`; booking mode uses `data-show-tiles` (different name — same values).

**Label veld:** Text input for the label above the selector. Default: "Producten". Generated as `data-tiles-label="..."`. To render **no** label (e.g. when the title already asks the question, like Feenstra's "Waarin ben je geïnteresseerd?"), emit `data-tiles-label=""` (explicit empty string is respected).

**Tile list:**

Show a list of configurable tiles. Each row:
```
[drag handle] [icon preview] [name field] [primary URL] [2e CTA URL toggle] [delete]
```

- Maximum: 4 tiles — the widget enforces this in `parseTilesFromElement()` via `.slice(0, 4)`. The UI must hard-cap at 4.
- Minimum: 1 tile (when section enabled)
- **Add tile button:** opens a modal to pick from the supported icon types

**Add tile modal:** Grid of all supported product icons with Dutch labels. Clicking one adds it and pre-fills `data-tile-{key}-title` with the default Dutch label.

**Per-tile configuration (expanded row):**

| Field | Component | Notes |
|---|---|---|
| Label | Text input | Tile display name. `data-tile-{key}-title` |
| Primaire flow URL | URL input | CTA1 target for this measurement (the "offerte"-flow). `data-tile-{key}-url` |
| 2e CTA flow URL | URL input (collapsible) | CTA2 target for this measurement (the "adviesgesprek"-flow). Reveal via toggle "Aparte 2e CTA per maatregel". `data-tile-{key}-cta2-url`. Leave empty to fall back to the global 2e CTA URL; if neither exists, CTA2 is hidden for that measurement → automatically **1 button**. |
| Booking URL (legacy) | URL input (collapsible, advanced) | `data-tile-{key}-booking-url`. **Legacy single-button switch:** when set and selected, CTA1 itself becomes a booking button (opens this URL directly) and uses `data-cta1-text-booking`. Prefer the new "2e CTA flow URL" for dual-flow. Show a deprecation hint. |
| Standaard geselecteerd | Checkbox | Adds key to `data-tiles-default` |
| Aangepast icoon | File upload + AI button | Custom SVG icon, base64 in `data-tile-{key}-icon-svg`. Built-in icon used as fallback. See "AI Iconen Genereren". |

**Supported icon types** (show in add modal with icons):

```
solarpanels     → Zonnepanelen          (alias: zon)
heatpump        → Warmtepomp
airconditioning → Airco                  (alias: airco)
homebattery     → Thuisbatterij         (alias: batterij)
carcharger      → Laadpaal              (alias: laadpaal)
floorinsulation → Vloerisolatie
wallinsulation  → Spouwmuurisolatie
roofinsulation  → Dakisolatie
glassinsulation → Glas / HR++
gasboiler       → CV-Ketel
ems             → EMS
advicescan      → Advies scan
advisormodule   → Adviseur / Advies     (alias: advies)
solarboiler     → Zonneboiler / Zonnestroomboiler
meterkast       → Meterkast / Groepenkast
general         → Algemeen
```

Aliases are short keys that resolve to the same built-in icon (e.g. `data-tile-batterij-url` uses the `homebattery` icon). Both the canonical key and the alias work as the `{key}` in `data-tile-{key}-*`.

### CTA-routing logic (read carefully — this is the core)

The widget resolves CTA targets at click time based on the current selection (`resolveCtaTarget`). Precedence:

**CTA1** (primary, always present when a tile is selected):
- 1 selected → that tile's `data-tile-{key}-url`.
- >1 selected → `data-cta1-combo-url` (a single combination leadflow). If omitted, falls back to the first selected tile's URL **and logs a warning**.
- Legacy: if the single selected tile has `data-tile-{key}-booking-url`, CTA1 becomes a direct booking button to that URL.

**CTA2** (secondary, optional; `data-cta2-show="true"`), depends on `data-cta2-action`:
- `"flow"` → HomeZero leadflow. Target: 1 selected → `data-tile-{key}-cta2-url` else `data-cta2-url`; >1 selected → `data-cta2-combo-url` else `data-cta2-url`. **Full validation + offline.html fallback.**
- `"booking"` → external calendar (Calendly/Google). Same target precedence, but the URL **opens directly** in a new tab (passes phone/email), **no address required, no offline.html fallback**.
- `"pico"` (legacy) → direct-contact lead via the Pico API; requires `data-pico-key`.

**CTA2 auto-visibility:** for `flow`/`booking`, CTA2 only shows when a target resolves for the current selection. Measurements without a 2e-CTA target render only CTA1. This is how "1 of 2 CTA's per maatregel" works — no extra flag needed.

**Reusing one leadflow everywhere:** set a single `data-cta2-url` (e.g. a generic "plan adviesgesprek" leadflow or a direct Calendly link) and leave per-tile/combo URLs empty. Every measurement then shows the same secondary CTA.

**Generator scenarios to support (all expressible):**
1. *Feenstra (dropdown, dual-flow per maatregel):* `data-tile-display="dropdown"`, `data-tiles-max-select="1"`, per tile `-url` + `-cta2-url`, `data-cta2-show="true"`, `data-cta2-action="flow"`. One measurement without `-cta2-url` → shows a single button.
2. *Multi-select met combinatie-flows:* `data-tile-display="large"` (multi), per tile `-url`, `data-cta1-combo-url` for >1, `data-cta2-action="flow"` + global `data-cta2-url` (reused).
3. *Secundaire CTA altijd naar agenda:* `data-cta2-action="booking"`, global `data-cta2-url="https://calendly.com/..."`.

### Section 4: Velden (Form fields)

The available fields differ by widget type.

**Scan mode fields:**

| Toggle | Label | Attribuut | Sub-opties |
|---|---|---|---|
| Adresveld | Adresveld (altijd aan) | — | Format: "Nederlands" (`data-address-format="dutch"`, standaard → Postcode + Huisnummer + Toevoeging) / "Internationaal" (`data-address-format="international"`) / "Google autocomplete" (`data-google-search="true"` + `data-country="nl"`). |
| Mobielveld | Mobiel nummer | `data-show-phone="true"` | Sub-toggle: "Verplicht" → `data-phone-required="true"`. Niet-verplicht toont label "(Optioneel)". |
| E-mailveld | E-mailadres | `data-show-email="true"` | Sub-toggle: "Verplicht" → `data-email-required="true"`. Niet-verplicht toont label "(Optioneel)". |
| Toestemmingsvak | Toestemming checkbox | `data-checkbox-title="..."` | Sub-toggle: "Verplicht" → `data-checkbox-required="true"`. Verkorte sleutel: `data-checkbox-shorttitle="..."` (meegestuurd als URL-param `checkboxtitle`). |

> The "(Optioneel)" suffix is added automatically by the widget for any shown-but-not-required phone/email field, translated per `data-language`.

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

#### Scan mode — unified CTA system

**CTA 1 (hoofd — altijd zichtbaar):**

| Field | Component | Notes |
|---|---|---|
| Knoptekst | Text input | Default: "Bereken wat je bespaart". `data-cta1-text` (legacy alias `data-cta1-text-scan` still read). For Feenstra: "Direct een offerte". |
| Knoptekst (booking, legacy) | Text input | Default: "Plan een gratis adviesgesprek". `data-cta1-text-booking`. Only used by the legacy per-tile `booking-url` switch. |
| Combinatie-flow URL | URL input | Shown when selection-mode is multi. `data-cta1-combo-url` — target when >1 tile selected. |

**CTA 2 (secundair — optioneel):**

Toggle "Secundaire CTA" → `data-cta2-show="true"`. When enabled:

| Field | Component | Notes |
|---|---|---|
| CTA 2 tekst | Text input | Default: "Direct contact (30 sec)". For Feenstra: "Adviesgesprek aanvraag". `data-cta2-text` |
| CTA 2 actie | Segmented control | "Leadflow" (`flow`) / "Externe agenda" (`booking`) / "Direct contact (Pico)" (`pico`). `data-cta2-action` |
| ↳ Globale 2e flow URL | URL input (flow/booking) | `data-cta2-url`. Fallback target for all measurements + for combinations. For `booking`, a Calendly/Google Calendar URL. |
| ↳ Combinatie 2e flow URL | URL input (flow/booking, multi only) | `data-cta2-combo-url`. Target for CTA2 when >1 tile selected. |
| ↳ Adres overslaan | Toggle (alleen bij Pico) | `data-contact-skip-address` |
| ↳ Pico API key | Password (alleen bij Pico) | `data-pico-key` (lives in Advanced; warn here if empty) |

**`data-cta2-action` values:**
- `"flow"` — HomeZero leadflow with address fields + offline.html fallback. Target precedence: per-tile `data-tile-{key}-cta2-url` → `data-cta2-combo-url` (multi) → global `data-cta2-url`.
- `"booking"` — external calendar; opens directly in a new tab, no fallback, passes phone/email only. Same target precedence.
- `"pico"` — direct-contact via Pico API. Requires `data-pico-key`.
- ~~`"ai-chat"`~~ — **deprecated.** Still works (maps to the AI-chat link) but the generator must use Section 6 instead.

> **Per-measurement 1 or 2 CTAs:** you don't toggle this manually. With `flow`/`booking`, CTA2 hides automatically for any selected measurement that has no resolvable 2e-CTA target.

**Booking mode CTAs:**

| Field | Component | Notes |
|---|---|---|
| Knoptekst | Text input | Default: "Plan een afspraak". `data-cta1-text` |
| Booking provider | Dropdown | calendly / google / microsoft / hubspot / acuity / other. `data-booking-provider` |
| Booking URL | URL input | Required. `data-booking-url` |

**Brochure mode CTAs:**

| Field | Component | Notes |
|---|---|---|
| Knoptekst | Text input | Default: "Stuur mij de brochure". `data-cta1-text` |
| Bevestigingstekst | Text input | Default: "De brochure is onderweg!". `data-success-message` |

### Section 6: AI-chat link (scan mode only)

A standalone, centered, underlined **text link** below the bottom CTA — not a button. Used to point visitors to the on-page HomeZero AI chat assistant (e.g. "Of chat met Fleur de Ai adviseur").

| Field | Component | Notes |
|---|---|---|
| AI-chat link tonen | Toggle | Default **off**. `data-ai-chat-show="true"` |
| Link tekst | Text input | Default: "Of chat met onze AI adviseur". `data-ai-chat-text` |

Behavior note to show in the UI: *"De link verschijnt alleen op pagina's waar de HomeZero AI chat widget (`window.ChatWidget`) geladen is. Klikken roept `ChatWidget.open()` aan."* The widget detects ChatWidget via 5s polling and the `hz-chatwidget-ready` / `hz-chatwidget-removed` custom events.

### Section 7: Geavanceerd (Advanced)

| Field | Component | Notes |
|---|---|---|
| Installer ID | Text input | `data-installer` |
| Context | Text input | `data-context` |
| Pico API key | Password input | Scan (CTA2=pico) + brochure. `data-pico-key` |
| Pico omgeving | Segmented control: Production / Acceptance | Default: production. `data-pico-env` |
| Pico flow ID | Text input | UUID. Optional — auto-extracted from tile URL when omitted. `data-pico-flow-id` |

---

## Live Preview Panel

The live preview renders a **pixel-perfect React component** that looks exactly like the actual widget rendered in `embed.js`. It updates in real-time as config options change.

### Preview wrapper

Light gray background with subtle shadow, simulating an embedded widget on a white website. Label above: "Live preview — zo ziet de widget er uit op jouw website". Device toggle: `[Desktop]` (480px) / `[Mobile]` (375px).

### Preview components to build (React)

#### `WidgetPreview` (wrapper)
Applies `--primary-color`, `--primary-gradient`, `--button-radius` as CSS variables.

#### `TileSelector` (scan mode)
Renders one of three variants based on display style:
- **large:** 4-column full-width grid, radio circle, tinted-bg selection (`color-mix(in srgb, primary 8%, #fff)`), 2×2 on mobile.
- **dropdown:** single trigger showing the selected icon in a **grey rounded badge** + name; options list with the same icon badge per row and a checkmark on the selected row. Single-select.
- **tags:** chip multi-select — selected items appear as colored pills (icon + name + ×).

#### `AddressField` (scan + classic mode)
```
Dutch: [Postcode] [Huisnummer] [Toevoeging] in a row
International: [Straat] [Huisnummer] then [Postcode] [Stad]
Google: single text input with search icon
```

#### `ContactFields` (scan + booking mode)
Renders phone and/or email inputs. Non-required fields show a "(Optioneel)" suffix on the label. Both shown → side-by-side grid.

#### `DualCTA` (scan mode)
```
Props: cta1Text, cta2Text, showCta2, cta2Resolvable, primaryColor, gradient?, buttonRadius

Primary button: full width, gradient or solid primary color, rounded.
Secondary button: full width, TRANSPARENT background, 1.5px solid primary-color border,
  primary-color text (outline style). Hidden when !cta2Resolvable for current selection.
Spacing: 8px between buttons.
```

#### `AiChatLink` (scan mode)
```
Props: text, primaryColor, visible

Centered, underlined text link in primary color, 14px, below the bottom CTA.
Only rendered when visible (simulate window.ChatWidget presence with a preview toggle).
```

#### `SingleCTA` (booking + brochure mode)
Single full-width button.

#### `ConfirmScreen` / `CheckboxField`
As before — confirm screen is center-aligned with a checkmark in a primary-color circle; checkbox matches `embed-styles.css`.

### Live preview tile icons

Use **inline SVG** copied from the `measurementIcons` object in `embed.js`. Must match exactly. Do not substitute Lucide icons.

### Styling the live preview — key values to match

- Input border: `1px solid #dadee7`, radius `8px`, padding `12px`
- Inputs: `14px`, weight `500`. Labels: `12px`, weight `500`, color `#132039`
- Optional-suffix: weight `400`, color `#7585a3`
- Validation message: `14px`, color `#fd3118`
- Primary button: `16px`, weight `500`, padding `13px 40px`, no box-shadow
- Secondary button (outline): transparent bg, `1.5px solid var(--primary-color)`, text `var(--primary-color)`
- AI-chat link: `14px`, weight `500`, underline, `color: var(--primary-color)`, centered, `margin-top: 12px`
- Dropdown icon badge: `32×32`, radius `8px`, background `#f0f2f5`
- Hover (buttons/link): `opacity: 0.8`

---

## Embed Code Generator

Below the config panel, show the generated code with a copy button.

### Code generation rules

1. Only include attributes that differ from defaults (keep code clean)
2. Always include `data-mode` and `data-color`
3. For tiles: include all configured `data-tile-*` attributes grouped per tile
4. The script tag points to `https://homezerotech.github.io/Widget/Acceptance/embed.min.js` for testing; for live use the partner switches `/Acceptance/` to `/Production/`. Surface this as a "Omgeving: Acceptatie / Productie" toggle.
5. Pretty-print one attribute per line, 2-space indentation
6. Syntax-highlight attribute names/values

### Generated code format — Feenstra example (dropdown dual-flow)

```html
<!-- HomeZero Widget — Postcodeflow -->
<hz-embed
  data-mode="scan"
  data-color="#e8762a"
  data-button-radius="24px"
  data-open-new-tab="true"
  data-title="Waarin ben je geïnteresseerd?"
  data-tile-display="dropdown"
  data-tiles-max-select="1"
  data-tiles-label=""
  data-tiles-default="airco"
  data-tile-airco-title="Airco"
  data-tile-airco-url="https://.../start?id=...&flow=offerte-airco"
  data-tile-airco-cta2-url="https://.../start?id=...&flow=advies-airco"
  data-tile-batterij-title="Thuisbatterij"
  data-tile-batterij-url="https://.../start?id=...&flow=offerte-batterij"
  data-tile-batterij-cta2-url="https://.../start?id=...&flow=advies-batterij"
  data-tile-solarboiler-title="Zonnestroomboiler"
  data-tile-solarboiler-url="https://.../start?id=...&flow=offerte-boiler"
  data-cta1-text="Direct een offerte"
  data-cta2-show="true"
  data-cta2-action="flow"
  data-cta2-text="Adviesgesprek aanvraag"
  data-address-format="dutch"
  data-show-email="true"
  data-ai-chat-show="true"
  data-ai-chat-text="Of chat met Fleur de Ai adviseur"
></hz-embed>
<script defer src="https://homezerotech.github.io/Widget/Acceptance/embed.min.js"></script>
```

### Copy button behavior
On click: copy via `navigator.clipboard.writeText()`, change label to "✓ Gekopieerd!" for 2s, revert.

---

## State Model

```typescript
interface WidgetConfig {
  mode: 'scan' | 'booking' | 'brochure' | 'classic';

  // Style
  color: string;            // hex, default "#2A6DF4"
  gradientFrom?: string;
  gradientTo?: string;
  buttonRadius: number;     // px, default 10
  language: 'nl' | 'en' | 'fr' | 'de';
  openNewTab: boolean;

  // Content
  title: string;
  subtitle: string;

  // Tiles
  tiles: TileConfig[];
  tilesDefault: string[];          // pre-selected keys
  tilesEnabled: boolean;
  tileDisplay: 'large' | 'dropdown' | 'tags';
  selectionMode: 'single' | 'multi';   // → tilesMaxSelect (single=1, multi=0). Forced 'single' for dropdown.
  tilesLabel: string;              // default "Producten"; "" = no label
  tilesMaxSelect: number;          // derived from selectionMode

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

  // CTAs (scan)
  cta1Text: string;                // default "Bereken wat je bespaart"
  cta1TextBooking: string;         // legacy booking-url switch
  cta1ComboUrl: string;            // CTA1 target when >1 selected
  showCta2: boolean;
  cta2Text: string;
  cta2Action: 'flow' | 'booking' | 'pico';
  cta2Url: string;                 // global secondary target (flow/booking)
  cta2ComboUrl: string;            // CTA2 target when >1 selected
  contactSkipAddress: boolean;     // pico only

  // CTAs (booking + brochure)
  cta1Text_single: string;         // booking/brochure single CTA text
  successMessage: string;          // brochure

  // AI-chat link (scan)
  aiChatShow: boolean;             // default false
  aiChatText: string;              // default "Of chat met onze AI adviseur"

  // Booking mode
  bookingUrl: string;
  bookingProvider: 'calendly' | 'google' | 'microsoft' | 'hubspot' | 'acuity' | 'other';
  passToUrl: boolean;

  // Pico API
  picoKey: string;
  picoEnv: 'production' | 'acceptance';
  picoFlowId: string;

  // Advanced
  installer: string;
  context: string;

  // Embed environment
  embedEnv: 'acceptance' | 'production';   // script src path
}

interface TileConfig {
  key: string;          // e.g. "airco"
  title: string;        // e.g. "Airco"
  url: string;          // CTA1 primary leadflow URL — data-tile-{key}-url
  cta2Url?: string;     // CTA2 secondary leadflow URL — data-tile-{key}-cta2-url
  bookingUrl?: string;  // legacy CTA1 booking switch — data-tile-{key}-booking-url
  isDefault: boolean;
  iconSvg?: string;     // base64 custom SVG — data-tile-{key}-icon-svg
}
```

**Defaults per mode:**

```typescript
const DEFAULTS: Record<WidgetConfig['mode'], Partial<WidgetConfig>> = {
  scan: {
    color: '#2A6DF4', buttonRadius: 10, language: 'nl', openNewTab: true,
    tiles: [
      { key: 'solarpanels', title: 'Zonnepanelen', url: '', isDefault: false },
      { key: 'heatpump', title: 'Warmtepomp', url: '', isDefault: false },
    ],
    tilesEnabled: true, tileDisplay: 'large', selectionMode: 'single',
    tilesLabel: 'Producten',
    showPhone: false, showEmail: true, addressFormat: 'dutch',
    cta1Text: 'Bereken wat je bespaart',
    cta1TextBooking: 'Plan een gratis adviesgesprek',
    showCta2: false, cta2Text: 'Direct contact (30 sec)', cta2Action: 'flow',
    aiChatShow: false, aiChatText: 'Of chat met onze AI adviseur',
  },
  booking: {
    color: '#2A6DF4', buttonRadius: 10, language: 'nl', openNewTab: true,
    showPhone: true, phoneRequired: true, cta1Text_single: 'Plan een afspraak',
    bookingProvider: 'calendly',
  },
  brochure: {
    color: '#2A6DF4', buttonRadius: 10, language: 'nl', showEmail: true,
    cta1Text_single: 'Stuur mij de brochure',
    successMessage: 'De brochure is onderweg naar jouw inbox!', picoEnv: 'production',
  },
  classic: { color: '#2A6DF4', buttonRadius: 10, language: 'nl', addressFormat: 'dutch' },
};
```

---

## Embed Code Generation Function

```typescript
function generateEmbedCode(config: WidgetConfig): string {
  const attrs: [string, string][] = [];
  const maxSelect = config.tileDisplay === 'dropdown' ? 1 : (config.selectionMode === 'single' ? 1 : 0);

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
    // Selector
    if (config.tileDisplay !== 'large') attrs.push(['data-tile-display', config.tileDisplay]);
    if (config.tilesLabel !== 'Producten') attrs.push(['data-tiles-label', config.tilesLabel]); // "" respected
    if (maxSelect === 1) attrs.push(['data-tiles-max-select', '1']);

    // Tiles (grouped per tile)
    config.tiles.forEach(tile => {
      if (tile.url) attrs.push([`data-tile-${tile.key}-url`, tile.url]);
      attrs.push([`data-tile-${tile.key}-title`, tile.title]);
      if (tile.cta2Url) attrs.push([`data-tile-${tile.key}-cta2-url`, tile.cta2Url]);
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

    // CTA1
    if (config.cta1Text !== 'Bereken wat je bespaart') attrs.push(['data-cta1-text', config.cta1Text]);
    if (maxSelect !== 1 && config.cta1ComboUrl) attrs.push(['data-cta1-combo-url', config.cta1ComboUrl]);
    if (config.tiles.some(t => t.bookingUrl) && config.cta1TextBooking !== 'Plan een gratis adviesgesprek') {
      attrs.push(['data-cta1-text-booking', config.cta1TextBooking]);
    }

    // CTA2
    if (config.showCta2) {
      attrs.push(['data-cta2-show', 'true']);
      if (config.cta2Text) attrs.push(['data-cta2-text', config.cta2Text]);
      attrs.push(['data-cta2-action', config.cta2Action]); // flow | booking | pico
      if (config.cta2Action !== 'pico') {
        if (config.cta2Url) attrs.push(['data-cta2-url', config.cta2Url]);
        if (maxSelect !== 1 && config.cta2ComboUrl) attrs.push(['data-cta2-combo-url', config.cta2ComboUrl]);
      } else if (config.contactSkipAddress) {
        attrs.push(['data-contact-skip-address', 'true']);
      }
    }

    // AI-chat link
    if (config.aiChatShow) {
      attrs.push(['data-ai-chat-show', 'true']);
      if (config.aiChatText) attrs.push(['data-ai-chat-text', config.aiChatText]);
    }
  }

  if (config.mode === 'booking') {
    if (config.bookingUrl) attrs.push(['data-booking-url', config.bookingUrl]);
    if (config.bookingProvider !== 'other') attrs.push(['data-booking-provider', config.bookingProvider]);
    if (config.cta1Text_single !== 'Plan een afspraak') attrs.push(['data-cta1-text', config.cta1Text_single]);
    if (config.showPhone) attrs.push(['data-show-phone', 'true']);
    if (config.phoneRequired) attrs.push(['data-phone-required', 'true']);
    if (config.showEmail) attrs.push(['data-show-email', 'true']);
    if (config.passToUrl) attrs.push(['data-pass-to-url', 'true']);
    // Tiles — booking mode uses data-show-tiles (not data-tile-display)
    if (config.tilesEnabled && config.tiles.length > 0) {
      attrs.push(['data-show-tiles', config.tileDisplay === 'large' ? 'large' : config.tileDisplay]);
      if (config.tilesLabel !== 'Producten') attrs.push(['data-tiles-label', config.tilesLabel]);
      if (maxSelect === 1) attrs.push(['data-tiles-max-select', '1']);
      config.tiles.forEach(tile => {
        if (tile.url) attrs.push([`data-tile-${tile.key}-url`, tile.url]);
        attrs.push([`data-tile-${tile.key}-title`, tile.title]);
        if (tile.iconSvg) attrs.push([`data-tile-${tile.key}-icon-svg`, tile.iconSvg]);
      });
      const defaults = config.tiles.filter(t => t.isDefault).map(t => t.key);
      if (defaults.length) attrs.push(['data-tiles-default', defaults.join(',')]);
    }
  }

  if (config.mode === 'brochure') {
    if (config.cta1Text_single !== 'Stuur mij de brochure') attrs.push(['data-cta1-text', config.cta1Text_single]);
    if (config.showName) attrs.push(['data-show-name', 'true']);
    if (config.showPhone) attrs.push(['data-show-phone', 'true']);
    if (config.successMessage !== 'De brochure is onderweg naar jouw inbox!') {
      attrs.push(['data-success-message', config.successMessage]);
    }
  }

  // Pico API — scan (CTA2=pico) and brochure modes
  if ((config.mode === 'scan' && config.showCta2 && config.cta2Action === 'pico') || config.mode === 'brochure') {
    if (config.picoKey) attrs.push(['data-pico-key', config.picoKey]);
    if (config.picoEnv !== 'production') attrs.push(['data-pico-env', config.picoEnv]);
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
  const envPath = config.embedEnv === 'production' ? 'Production' : 'Acceptance';
  const scriptSrc = `https://homezerotech.github.io/Widget/${envPath}/embed.min.js`;

  return `<!-- HomeZero Widget -->\n<hz-embed\n${attrLines}\n></hz-embed>\n<script defer src="${scriptSrc}"></script>`;
}
```

---

## UX Details

### Section Accordion
Header (bold + chevron), animated body (`max-height` transition), open by default, remembers state per session.

### Input validation in the generator (mirror the widget's own checks)

The widget validates config at runtime (`validateScanConfig`) and logs `console.warn` while degrading gracefully. The generator should surface the same issues **before** the partner copies the code:

- URL fields: warning icon if non-empty and not a valid http(s) URL.
- Dropdown + multi selected: not allowed — force single, show note "Dropdown is altijd single-select".
- Multi-select without `data-cta1-combo-url`: warn "Bij meerdere geselecteerde producten valt CTA1 terug op het eerste product. Stel een combinatie-flow in."
- `cta2-show` + action `flow`/`booking` but no per-tile cta2-url, no combo-url and no global cta2-url: warn "Secundaire CTA heeft geen doel en blijft verborgen."
- `cta2-action="pico"` and empty `data-pico-key`: warn "Zonder Pico API key worden directe contactmeldingen niet verwerkt."
- Brochure mode empty `data-pico-key`: warn "Zonder Pico API key kan de brochure niet worden verstuurd."
- Any tile missing a primary `url`: warn per tile.

### Color picker
`<input type="color">` styled as a swatch + two-way-synced hex text input.

### Tile drag-and-drop ordering
HTML5 drag API. Reordering updates the order of `data-tile-*` groups in the output.

---

## Header

White, `56px`, border-bottom `1px solid #e5e7eb`. Left: logo + "Widget Generator". Right: `v2.1` badge + the "Acceptatie / Productie" environment toggle.

---

## Empty States

- **No tiles (scan):** dashed placeholder in preview "Voeg producten toe in de configuratie".
- **No booking URL (booking):** placeholder card "Vul een booking URL in".
- **No Pico key (brochure):** placeholder note "Vul de Pico API key in om de brochure te kunnen versturen".

---

## Validation and Completeness Indicator

Bottom of config panel:

```
Configuratie: ████████░░  80% compleet
⚠ Primaire flow URL ontbreekt voor 2 maatregelen
⚠ Combinatie-flow URL niet ingevuld (multi-select)
```

Green checkmark at 100%.

---

## Responsiveness

- **Desktop (≥1024px):** three columns.
- **Tablet (768–1023px):** config + preview stacked; sidebar becomes a top tab bar.
- **Mobile (<768px):** preview collapsed behind a "Bekijk preview" toggle; config shown by default.

---

## Page Title and Meta
- Title: `HomeZero Widget Generator`
- Description: `Configureer en embed lead-capture widgets op jouw website.`
- `noindex, nofollow` — internal tool.

---

## Notes on the Live Preview

The live preview is a **React reimplementation** of the widget — it does NOT load `embed.js` or use an iframe (instant updates, no CORS, full styling control). Keep it **in sync** with the widget's HTML/CSS. When `embed.js` changes, update the preview.

Show below the preview: "De preview is een benadering. Exacte weergave kan variëren door je website-stijlen." Add a small **"Simuleer AI chat"** toggle so partners can preview the AI-chat link visibility.

---

## AI Iconen Genereren

Each tile can have a custom SVG icon instead of the built-in one. The widget reads `data-tile-{key}-icon-svg`, base64-decodes it with `atob()`, and renders it inline. Built-in icon is the fallback.

### How custom icons work in the widget
1. `parseTilesFromElement()` reads `data-tile-{key}-icon-svg` → `tile.iconSvg`.
2. `decodeTileIcon(tile)` decodes with `atob()`, falls back to the built-in icon if absent/malformed.
3. The SVG is injected into a fixed-size container (large grid 36×36, tile grid 28×28, dropdown/tag badge 18×18 inside a 32×32 badge).

### Workflow in the generator

**Option A — Upload SVG file:** file input (`image/svg+xml`) per tile → read as text → `btoa(svgText)` → `tile.iconSvg`; preview immediately.

**Option B — AI genereren (Gemini / Nano Banana):** model `gemini-2.0-flash-preview-image-generation`.
1. "AI icoon genereren" button per tile row.
2. Modal: prompt field (smart default per key), optional "Website URL" to scrape brand color, "Genereer".
3. Prompt template:
   ```
   Generate a clean, minimal line-art SVG icon of a {product} suitable for a website widget.
   Style: single-color stroke, no fill, modern, 24x24 viewBox. Color: currentColor.
   Output: raw SVG markup only.
   ```
4. If a raster PNG is returned, vectorize client-side OR use **Recraft.ai** (`recraftv3_svg`, `POST https://external.api.recraft.ai/v1/images/generations`) which returns SVG natively.
5. Preview → "Gebruik dit icoon" → clean markup, `btoa()`, store in `tile.iconSvg`.

**Default prompts per key:**

| Key | Prompt hint |
|---|---|
| `solarpanels` | "solar panels on a rooftop, minimal line art" |
| `heatpump` | "heat pump outdoor unit, minimal line art" |
| `homebattery` | "home battery pack, minimal line art" |
| `carcharger` | "electric car charger, minimal line art" |
| `airconditioning` | "air conditioning unit, minimal line art" |
| `ems` | "energy management system, circuit with lightning bolt, minimal line art" |
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
- [ ] All config sections present and functional per widget type
- [ ] Live preview updates in real-time on every config change
- [ ] Tile/dropdown/tags selectors render with correct SVG icons from embed.js
- [ ] Dropdown shows the selected icon in a grey badge in the trigger; single-select enforced
- [ ] Tags chip variant shows pill chips with icon, name and ×
- [ ] large variant: 4-column radio grid (2×2 mobile)
- [ ] Selection-mode (single/multi) maps to `data-tiles-max-select`; hidden/forced single for dropdown
- [ ] Per-tile **primary URL** and **2e CTA URL** fields work; legacy booking-url behind an advanced toggle
- [ ] Dual CTA: CTA2 routes via `flow`/`booking`/`pico`; auto-hides when no target resolves
- [ ] `data-cta1-combo-url` / `data-cta2-combo-url` emitted only in multi-select
- [ ] Global `data-cta2-url` reuse scenario works
- [ ] AI-chat link section: `data-ai-chat-show` (default false) + `data-ai-chat-text`; preview link is centered, underlined, primary color
- [ ] Secondary CTA preview is an outline in the primary color (transparent bg)
- [ ] "(Optioneel)" suffix shown for non-required phone/email
- [ ] Booking mode emits `data-show-tiles` (not `data-tile-display`)
- [ ] Max 4 tiles enforced in UI
- [ ] Custom SVG icon upload + AI generation store base64 SVG
- [ ] Generator validation mirrors `validateScanConfig` warnings
- [ ] Environment toggle switches script src between `/Acceptance/` and `/Production/`
- [ ] Embed code generates correctly for all four modes; copy button works
- [ ] Color picker, gradient toggle, radius slider update preview in real-time
- [ ] Mobile layout renders correctly
- [ ] No TypeScript errors, no console errors
```
