# Widget v2 — Implementation Plan

## Overview

This document defines the complete rebuild scope for `Acceptance/embed.js` and `Acceptance/embed-styles.css`. The rebuild introduces four distinct widget modes, a multi-step form flow, tile-based product selection, a direct-contact CTA path, a booking redirect widget, and a brochure email-delivery widget.

All changes are **backwards compatible**: existing `<hz-embed>` configurations without `data-mode` continue to work as-is (treated as `data-mode="classic"`).

---

## 1. Widget Modes

| Mode | `data-mode` value | Description |
|---|---|---|
| Classic | `classic` (default) | Existing behavior — address form + optional dropdown → redirect |
| Scan | `scan` | Tile grid + address + dual CTA → redirect to scan flow |
| Booking | `booking` | Optional tiles + phone/email → redirect to external booking URL |
| Brochure | `brochure` | Email capture → HomeZero API call → brochure delivered by email |

---

## 2. Complete Attribute Reference

### 2.1 Universal attributes (all modes)

| Attribute | Type | Default | Description |
|---|---|---|---|
| `data-mode` | `classic` \| `scan` \| `booking` \| `brochure` | `classic` | Widget mode |
| `data-color` | hex color | `#2A6DF4` | Primary color (button, focus rings, selected states) |
| `data-button-radius` | CSS value | `10px` | Border-radius of primary CTA button |
| `data-title` | string | — | Title rendered above the form |
| `data-subtitle` | string | — | Subtitle rendered below the title |
| `data-language` | `nl` \| `en` \| `fr` \| `de` | `nl` | UI language |
| `data-open-new-tab` | `true` \| `false` | `false` | Open redirect in new tab |
| `data-installer` | string | — | InstallerID appended to redirect URL |
| `data-context` | string | — | Free context parameter appended to redirect URL |
| `data-checkbox-title` | string | — | If set, renders a consent checkbox with this label |
| `data-checkbox-shorttitle` | string | — | URL parameter key for checkbox value |
| `data-checkbox-required` | `true` \| `false` | `false` | Makes checkbox mandatory |

### 2.2 Mode: `classic` (existing, unchanged)

All current attributes remain supported. See existing documentation. No breaking changes.

```html
<hz-embed
  src="https://app.example.com/link/start?id=abc123"
  data-mode="classic"
  data-color="#2A6DF4"
  data-button-text="Start Scan"
  data-show-phone="true"
  data-show-email="true"
  data-address-format="dutch"
  data-google-search="true"
  data-country="nl"
></hz-embed>
```

### 2.3 Mode: `scan` — Tile grid + dual CTA

This mode renders a product-tile grid (multi-select), an address field, optional phone/email fields, and two CTA buttons.

#### Tile configuration

Tiles are configured per product type using pairs of `data-tile-{key}-url` and `data-tile-{key}-title`. The `{key}` must match one of the supported icon keys (see §3).

| Attribute | Description |
|---|---|
| `data-tile-{key}-url` | Redirect URL for this tile (required to include tile) |
| `data-tile-{key}-title` | Display label for this tile |
| `data-tile-{key}-booking-url` | If set, CTA1 opens this URL in a new tab instead of the scan flow URL |
| `data-tiles-default` | Comma-separated list of pre-selected tile keys, e.g. `"batterij,ems"` |
| `data-tiles-max-select` | Max simultaneous selections (default: unlimited) |

The tile URL is used as the redirect base — address params are appended to it on submit. If `data-tile-{key}-booking-url` is set for a tile AND that tile is the primary selected tile, CTA1 redirects to the booking URL instead of the scan URL.

#### Scan-mode CTA configuration

| Attribute | Default | Description |
|---|---|---|
| `data-cta1-text-scan` | `"Bereken wat je bespaart"` | CTA1 label when non-booking tile selected |
| `data-cta1-text-booking` | `"Plan een gratis adviesgesprek"` | CTA1 label when booking tile selected |
| `data-cta2-show` | `false` | Whether to show the direct-contact CTA |
| `data-cta2-text` | `"Direct contact (30 sec)"` | Label for CTA2 |
| `data-pico-key` | — | Pico API key for CTA2 direct-contact submission (`X-API-Key` header) |
| `data-pico-env` | `production` | `acceptance` \| `production` |
| `data-pico-flow-id` | — | Pico FlowID for CTA2 submissions. If omitted and tiles are configured, the flow ID is extracted from the first selected tile's scan URL (`?id=` param). |

#### Address and contact fields (scan mode)

| Attribute | Default | Description |
|---|---|---|
| `data-address-format` | `dutch` | `dutch` or `international` |
| `data-google-search` | `false` | Use Google Places autocomplete |
| `data-country` | `nl` | Country code for Google Places |
| `data-show-phone` | `true` | Show phone field |
| `data-show-email` | `true` | Show email field |
| `data-phone-required` | `false` | Phone field mandatory |
| `data-email-required` | `false` | Email field mandatory |
| `data-contact-skip-address` | `false` | If `true`, CTA2 submits without requiring address |

#### Example: Scan mode

```html
<hz-embed
  data-mode="scan"
  data-color="#2A6DF4"
  data-title="Ook besparen met een thuisbatterij?"
  data-subtitle="Onafhankelijk advies voor jouw situatie"

  data-tile-batterij-url="https://app.example.com/link/start?id=batterij-flow"
  data-tile-batterij-title="Batterij"
  data-tile-ems-url="https://app.example.com/link/start?id=ems-flow"
  data-tile-ems-title="EMS"
  data-tile-laadpaal-url="https://app.example.com/link/start?id=laadpaal-flow"
  data-tile-laadpaal-title="Laadpaal"
  data-tile-zon-url="https://app.example.com/link/start?id=zon-flow"
  data-tile-zon-title="Zon"
  data-tile-advies-url="https://app.example.com/link/start?id=advies-flow"
  data-tile-advies-title="Advies"
  data-tile-advies-booking-url="https://calendly.com/bedrijf/advies"

  data-tiles-default="batterij,ems"
  data-cta1-text-scan="Bereken wat je bespaart"
  data-cta1-text-booking="Plan een gratis adviesgesprek"

  data-cta2-show="true"
  data-cta2-text="Direct contact (30 sec)"
  data-cta2-webhook="https://hook.eu2.make.com/xxxx"

  data-google-search="true"
  data-country="nl"
  data-show-phone="true"
  data-show-email="true"
  data-contact-skip-address="true"
  data-open-new-tab="true"
></hz-embed>
```

### 2.4 Mode: `booking` — Booking redirect

This mode is optimised for scheduling. It shows optional tile selection, collects phone/email (no address), and opens an external booking URL in a new tab on CTA click.

| Attribute | Default | Description |
|---|---|---|
| `data-booking-url` | **required** | External booking URL (Calendly, Google, Microsoft, HubSpot, etc.) |
| `data-booking-provider` | `other` | `calendly` \| `google` \| `microsoft` \| `hubspot` \| `acuity` \| `other` — used for display label/icon only |
| `data-cta1-text` | `"Plan een afspraak"` | Primary button label |
| `data-show-tiles` | `false` | Show product tile selection above the form |
| `data-show-phone` | `true` | Collect phone before redirect |
| `data-show-email` | `false` | Collect email before redirect |
| `data-phone-required` | `true` | Phone mandatory |
| `data-pass-to-url` | `true` | Append collected phone/email to booking URL as query params |

When `data-pass-to-url="true"`, the following are appended to `data-booking-url`:
- `?phone=0612345678`
- `&email=jan@voorbeeld.nl`

This works with Calendly's pre-fill feature (`prefill[name]`, `prefill[email]`), HubSpot Meetings (`email=`), and generic query params.

#### Example: Booking mode

```html
<hz-embed
  data-mode="booking"
  data-color="#2A6DF4"
  data-title="Plan een gratis adviesgesprek"
  data-subtitle="Kies een moment dat jou uitkomt — gesprek duurt ±15 minuten"
  data-booking-url="https://calendly.com/bedrijf/adviesgesprek"
  data-booking-provider="calendly"
  data-cta1-text="Kies een moment"
  data-show-phone="true"
  data-phone-required="true"
  data-pass-to-url="true"
  data-open-new-tab="true"
></hz-embed>
```

### 2.5 Mode: `brochure` — Email capture + Pico API lead submission

This mode collects an email address (and optionally name/phone/address) and submits it as an assignment to the **Pico API**. Pico handles the brochure email delivery via the configured flow. No redirect occurs — a confirmation message is shown inline.

| Attribute | Default | Description |
|---|---|---|
| `data-pico-key` | **required** | Pico API key (`X-API-Key` header). Domain-whitelisted. |
| `data-pico-env` | `production` | `acceptance` \| `production` — determines base URL |
| `data-pico-flow-id` | **required** | Pico FlowID to trigger brochure delivery |
| `data-cta1-text` | `"Stuur mij de brochure"` | Primary button label |
| `data-show-name` | `false` | Show first/last name fields (`Firstname`, `Lastname`) |
| `data-show-phone` | `false` | Show phone field (`Phonenumber`) |
| `data-show-address` | `false` | Show address fields (`HouseDetails`) |
| `data-success-message` | `"De brochure is onderweg naar jouw inbox!"` | Inline confirmation text |

#### Pico API integration (client-side)

On submit, the widget makes a `POST` request directly from the browser:

```
POST https://pico.homezero.nl/rest/pico/v1/assignments/create
     (acceptance: https://pico-accp.homezero.nl/rest/pico/v1/assignments/create)

Headers:
  Content-Type: application/json
  X-API-Key: {{data-pico-key}}
```

```json
{
  "FlowID": "{{data-pico-flow-id}}",
  "Email": "jan@voorbeeld.nl",
  "Phonenumber": "0612345678",
  "Firstname": "Jan",
  "Lastname": "de Vries",
  "ReferralURL": "https://partner-site.nl/pagina",
  "HouseDetails": {
    "Zipcode": "1234AB",
    "Housenumber": "10",
    "HouseNumberAddition": "",
    "Street": "Hoofdstraat",
    "City": "Amsterdam",
    "Country": "NL"
  },
  "UtmSource": "...",
  "UtmMedium": "...",
  "UtmCampaign": "...",
  "UtmContent": "...",
  "UtmTerm": "...",
  "GCLID": "...",
  "GBRAID": "...",
  "WBRAID": "...",
  "DCLID": "...",
  "TTCLID": "...",
  "FBCLID": "...",
  "LI_FAT_ID": "...",
  "AD_ID": "..."
}
```

**Validation rules (from Pico API):**
- Must provide `Email` OR `Phonenumber` (at least one)
- Must provide `FlowID` OR `FlowsInterestedIn` (at least one)
- If `HouseDetails` is included, `Zipcode` and `Housenumber` are required within it
- Error on invalid address: `{"error":"Could not find a building with this address"}`
- Error outside operating area: `{"error":"address not inside the operating area"}`

#### Error handling

On `address not found` or `address not inside the operating area` errors, show an inline validation message on the address field. All other non-200 responses show a generic inline error with retry option.

#### Example: Brochure mode

```html
<hz-embed
  data-mode="brochure"
  data-color="#2A6DF4"
  data-title="Ontvang onze thuisbatterij brochure"
  data-subtitle="Direct in jouw inbox — volledig gratis"
  data-pico-key="your-api-key-here"
  data-pico-env="production"
  data-pico-flow-id="5fc267a2-d867-4b72-ad76-2546f5019f9f"
  data-cta1-text="Stuur mij de brochure"
  data-show-name="true"
  data-show-phone="false"
  data-success-message="De brochure is onderweg naar jouw inbox!"
></hz-embed>
```

---

## 3. Supported Tile/Icon Keys

The following keys are supported for `data-tile-{key}-*` attributes. All have matching SVG icons in `measurementIcons`.

| Key | Label (NL) | Icon |
|---|---|---|
| `solarpanels` | Zonnepanelen | Solar panel icon |
| `heatpump` | Warmtepomp | Heat pump icon |
| `airconditioning` | Airco | Air conditioning icon |
| `homebattery` | Thuisbatterij | Battery icon |
| `carcharger` | Laadpaal | Car charger icon |
| `floorinsulation` | Vloerisolatie | Floor insulation icon |
| `wallinsulation` | Spouwmuurisolatie | Wall insulation icon |
| `roofinsulation` | Dakisolatie | Roof insulation icon |
| `glassinsulation` | Glas/HR++ | Glass icon |
| `gasboiler` | CV-Ketel | Boiler icon |
| `advicescan` | Advies scan | Scan icon |
| `advisormodule` | Adviseur | Advisor icon |
| `solarboiler` | Zonneboiler | Solar boiler icon |
| `general` | Algemeen | House icon |

**New icons to add (required for demo parity):**

| Key | Label (NL) | Notes |
|---|---|---|
| `batterij` | Batterij | Alias for `homebattery` or new dedicated icon |
| `ems` | EMS | New icon — energy management system |
| `laadpaal` | Laadpaal | Alias for `carcharger` |
| `zon` | Zon | Alias for `solarpanels` |
| `advies` | Advies | Alias for `advisormodule` |
| `meterkast` | Meterkast | New icon — electrical panel |

---

## 4. Form Flow Architecture

### 4.1 Classic mode (unchanged)

```
[form: address + optional dropdown]
         ↓ submit
[connectivity check]
         ↓
[redirect to scan URL]
```

### 4.2 Scan mode

```
[form: tiles + address + phone/email]
         │
         ├─ CTA1 (scan path): address validated
         │        ↓
         │   [connectivity check]
         │        ↓
         │   [redirect to tile URL + params]
         │
         ├─ CTA1 (booking tile selected): no address validation
         │        ↓
         │   [window.open(booking-url, "_blank")]
         │
         └─ CTA2 (direct contact): phone OR email required, no address
                  ↓
             [POST Pico API: assignments/create]
               FlowID = data-pico-flow-id OR extracted from tile URL (?id= param)
               FlowsInterestedIn = all selected tile flow IDs
               Phone/Email from form
               HouseDetails if address was filled (optional)
               All UTM/tracking params from page URL
                  ↓
             [confirm-contact screen inline]
```

### 4.3 Booking mode

```
[form: optional tiles + phone/email]
         ↓ CTA1
[window.open(booking-url, "_blank")]
         ↓
[confirm screen inline: "We sturen je een bevestiging"]
```

### 4.4 Brochure mode

```
[form: email + optional name/phone]
         ↓ CTA1
[POST to brochure API endpoint]
         ├─ success → [confirm screen inline]
         └─ error   → [inline error message + retry]
```

### 4.5 Confirm screen (inline)

All modes that end with a confirmation (CTA2 contact, booking, brochure) render a confirmation panel **replacing the form content** inside the `<hz-embed>` element. This requires no redirect and no new window.

```html
<!-- Inline confirm panel replaces form -->
<div class="embed-confirm">
  <div class="embed-confirm-icon">✓</div>
  <h3 class="embed-confirm-title">Bedankt!</h3>
  <p class="embed-confirm-message">{{message}}</p>
</div>
```

---

## 5. Multi-step Validation Logic

### Scan mode — CTA1 (scan path)

1. At least one tile selected (unless `src` fallback)
2. Address valid (Dutch: postcode + huisnummer; International: all 4 fields; Google: place selected)
3. Phone valid if shown and required
4. Email valid if shown and required
5. Checkbox checked if required

### Scan mode — CTA2 (direct contact)

1. Phone OR email filled
2. If `data-contact-skip-address="true"`: no address validation
3. If `data-contact-skip-address="false"` (default): same address validation as CTA1

### Booking mode

1. Phone valid if shown and required
2. Email valid if shown and required

### Brochure mode

1. Email required and valid (always)
2. Name fields if shown and required
3. Phone valid if shown and required

---

## 6. URL Parameter Mapping

On redirect (classic, scan CTA1), the widget constructs the redirect URL by appending parameters:

```
{tile-url}
  &ReferralURL={encodeURIComponent(window.location.href)}
  &Zipcode={postcode}
  &Housenumber={huisnummer}
  &Addition={toevoeging}           ← Dutch format
  &Street={street}                 ← International format
  &City={city}                     ← International format
  &InstallerID={data-installer}    ← if set
  &Phone={phone}                   ← if collected
  &Email={email}                   ← if collected
  &Tiles={tile1,tile2}             ← scan mode: all selected tiles (comma-separated)
  &PrimaryTile={tile1}             ← scan mode: first/primary selected tile
  &checkboxtitle={shorttitle}      ← if checkbox shown
  &checkboxvalue={true|false}      ← if checkbox shown
  &context={data-context}          ← if set
  &utm_campaign=...                ← all UTM/tracking params from page URL
  &gclid=...
```

---

## 7. CSS Architecture Changes

### New classes to add to `embed-styles.css`

```css
/* Tile grid */
.embed-tile-grid { }
.embed-tile { }
.embed-tile.selected { }
.embed-tile-icon { }
.embed-tile-label { }
.embed-tile-checkmark { }

/* Dual CTA */
.embed-cta-primary { }          /* gradient or solid primary button */
.embed-cta-secondary { }        /* muted secondary button */

/* Confirm screen */
.embed-confirm { }
.embed-confirm-icon { }
.embed-confirm-title { }
.embed-confirm-message { }

/* Brochure mode */
.embed-brochure-form { }
.embed-brochure-success { }

/* Booking mode */
.embed-booking-form { }
```

### Color system

The existing `--primary-color` CSS variable remains the single source of truth. Tile selected state uses a **configurable gradient** or falls back to `--primary-color` solid.

New CSS variable:
```css
--primary-gradient: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%);
```

If `data-gradient-from` and `data-gradient-to` are set, use those. Otherwise use solid `--primary-color`.

Optional gradient attributes:
- `data-gradient-from` — hex color (e.g. `#e8367c`)
- `data-gradient-to` — hex color (e.g. `#f08a3e`)

---

## 8. New `data-*` Attributes: Quick Reference

```
UNIVERSAL
  data-mode                     classic | scan | booking | brochure
  data-color                    hex
  data-gradient-from            hex (optional)
  data-gradient-to              hex (optional)
  data-button-radius            CSS value
  data-title                    string
  data-subtitle                 string
  data-language                 nl | en | fr | de
  data-open-new-tab             true | false
  data-installer                string
  data-context                  string
  data-checkbox-title           string
  data-checkbox-shorttitle      string
  data-checkbox-required        true | false

SCAN MODE
  data-tile-{key}-url           URL
  data-tile-{key}-title         string
  data-tile-{key}-booking-url   URL (external booking, opens new tab)
  data-tiles-default            comma-separated keys
  data-tiles-max-select         number
  data-cta1-text-scan           string
  data-cta1-text-booking        string
  data-cta2-show                true | false
  data-cta2-text                string
  data-contact-skip-address     true | false

PICO API (scan CTA2 + brochure mode)
  data-pico-key                 string (API key, sent as X-API-Key header)
  data-pico-env                 production | acceptance
  data-pico-flow-id             UUID (FlowID override; auto-extracted from tile URL if omitted)

SCAN + CLASSIC ADDRESS
  data-address-format           dutch | international
  data-google-search            true | false
  data-country                  country code
  data-show-phone               true | false
  data-show-email               true | false
  data-phone-required           true | false
  data-email-required           true | false

BOOKING MODE
  data-booking-url              URL (required)
  data-booking-provider         calendly | google | microsoft | hubspot | acuity | other
  data-cta1-text                string
  data-show-tiles               true | false
  data-pass-to-url              true | false

BROCHURE MODE
  data-brochure-api-endpoint    URL (required)
  data-brochure-api-key         string (required)
  data-brochure-product-id      string (required)
  data-brochure-installer-id    string
  data-cta1-text                string
  data-show-name                true | false
  data-success-message          string
```

---

## 9. Backwards Compatibility

- All existing `data-measurement-*` attributes remain supported in `classic` mode.
- When no `data-mode` is set, the widget defaults to `classic`.
- The existing dropdown mechanism is preserved and only activates in `classic` mode.
- The `src` attribute shortcut (single-URL mode in classic) is unchanged.
- All existing URL parameter names (`Zipcode`, `Housenumber`, `InstallerID`, etc.) are unchanged.

---

## 10. Build & Deployment

No changes to the build process:

```bash
npm run build:js:accept   # terser Acceptance/embed.js → Acceptance/embed.min.js
npm run build:css:accept  # lightningcss Acceptance/embed-styles.css → Acceptance/embed-styles.min.css
```

Deployment: push to `main` on `HomeZeroTech/Widget` GitHub repo → GitHub Pages auto-deploys.

---

## 11. Implementation Order

1. **Foundation** — Add `data-mode` parsing and routing logic to `init()`
2. **Icon library** — Add missing icon keys (ems, meterkast, alias keys)
3. **Scan mode tiles** — `renderTileGrid()` + multi-select state
4. **Scan mode dual CTA** — Primary + secondary button with conditional logic
5. **Scan mode direct contact** — CTA2 webhook POST + inline confirm screen
6. **Confirm screen** — Generic `renderConfirmScreen(title, message)` reusable for all modes
7. **Booking mode** — `renderBookingForm()` → collect phone/email → `window.open()`
8. **Brochure mode** — `renderBrochureForm()` → `fetch()` to API → inline confirm
9. **CSS** — New utility classes for all new UI elements
10. **Gradient support** — Optional gradient from/to attributes
11. **Testing** — Update `test.html` with examples of all four modes
12. **Build** — Run `npm run build` and verify both Acceptance min files

---

## 12. Files to Edit

| File | Changes |
|---|---|
| `Acceptance/embed.js` | Main rebuild — all new modes, flows, and attributes |
| `Acceptance/embed-styles.css` | New CSS classes for tiles, dual CTA, confirm screen |
| `Acceptance/test.html` | Add test examples for all 4 modes |

**Do NOT edit any files in `Production/`.**
