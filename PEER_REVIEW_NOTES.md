# Peer Review Notes — Widget_v2 (scan dual-CTA + AI-chat link)

For the senior dev reviewing before migrating `Widget_v2` → the live `HomeZeroTech/Widget` repo via PR.

## What this change adds

A unified **1-or-2 CTA model** in scan mode so one measurement can route to **two different leadflows**
(e.g. "Direct een offerte" + "Adviesgesprek aanvraag"), plus a standalone **AI-chat text link**. Built for
the Feenstra widget. Scope: `Acceptance/embed.js` + `embed-styles.css` (and their minified outputs +
`Production/` copies + `test.html` demos + `LOVABLE_GENERATOR.md`).

New/changed embed attributes (scan mode only):
- `data-tile-{key}-cta2-url` — per-measurement secondary leadflow (CTA2).
- `data-cta1-combo-url` / `data-cta2-combo-url` — targets when >1 tile is selected (multi-select).
- `data-cta2-url` — global secondary target (reused fallback; HomeZero flow or external calendar).
- `data-cta2-action="flow|booking|pico"` — `flow` = HomeZero leadflow (address + offline.html fallback);
  `booking` = external calendar (direct open, no fallback); `pico` = existing direct-contact API.
- `data-cta1-text` (unified; `data-cta1-text-scan` still read for back-compat).
- `data-ai-chat-show` (default **false**) + `data-ai-chat-text` — AI-chat link, decoupled from CTA2.
- Optional preselection: `data-tiles-default="<key>"` (existing attr) now capped to the selection limit, so a
  single-select dropdown preselects at most one item; omit it for an empty/placeholder dropdown.

## Backward compatibility — the key point

**All live customer embeds run in `classic` mode** (no `data-mode`): they use `src` + `data-preselected-option`
(single measure) or `data-measurement-{key}-url/-title` (dropdown). **Classic mode is untouched by this change.**

Verified:
- The classic measurement-dropdown + preselected block is **byte-identical** to the current live
  `Production/embed.js` (diffed).
- Every new behavior is gated behind `data-mode="scan"` (and booking/brochure). Classic never enters it.
- The shared helpers that were edited (`buildContactFieldsHtml`, `renderTileDropdown`,
  `parseTilesFromElement`) are **not used by classic** — classic builds its own dropdown/address/contact
  inline. So e.g. the new "(Optioneel)" label suffix does **not** appear in classic widgets.
- Remaining edits are purely additive: a new `optional` translation key, an `airco` icon alias, and parsing of
  the new `data-tile-*-cta2-url`.

Net: existing live widgets keep rendering and behaving exactly as before.

## Fix included in this change

- **`&PrimaryTile` for multi-select** (`buildLeadflowUrl`): an intermediate version only sent `PrimaryTile`
  when exactly one tile was selected; restored to always send the first selected key (matches prior behavior;
  scan-mode only, no live widget affected).

## Architecture decision to weigh (your call)

We deliberately **kept classic mode as-is** rather than folding everything into the new engine now. Rationale
and recommended end-state:

- The embed **attributes are a public API**: Pico and the old generator emit `data-measurement-*` / `src` /
  `data-preselected-option`, and they're hard-coded on live pages we can't edit. These inputs can never be
  dropped.
- But the **rendering is currently duplicated** (two dropdown impls: classic innerHTML vs `renderTileDropdown`;
  two address builders; two contact builders). That duplication is real tech debt.
- **Recommended target:** one rendering engine; legacy attributes become a thin **adapter** (parse → normalize
  to the tile/config model → render through the unified engine). `data-mode` becomes largely internal/derived.
  Then delete the separate classic render path → net less code.
- **Do not big-bang this.** Routing legacy embeds through the new renderer must preserve the exact output DOM,
  CSS classes, and **outgoing URL params** (live CSS overrides / analytics / leadflows depend on them). Gate
  removal of the classic path on **snapshot/golden-master tests** asserting byte-identical DOM + URLs for the
  real live embeds (Feenstra widget 1 & 2, Pico output) before deleting anything. Upgrade the generator
  (separate project, WYSIWYG) in parallel.

## Deploy caveats (for the migration PR to live `HomeZeroTech/Widget`)

- This `Widget_v2` repo is **not** the live repo; live is `HomeZeroTech/Widget` (GitHub Pages + jsDelivr).
  Nothing here is live until merged into that repo.
- The promotion copies the **whole current Acceptance → Production**; old Production was the May build (no scan
  mode). Classic block verified identical, but QA the two exact live embeds against the new build before merge.
- jsDelivr embeds (`cdn.jsdelivr.net/gh/.../Production/embed.min.js`, no `@version`) cache branch HEAD ~12h
  (up to 7d). Rollout is gradual; purge via `purge.jsdelivr.net` or pin a tag for deterministic rollout.
- `getScriptBaseDir()` fallback returns the Acceptance path (pre-existing); real resolution uses
  `document.currentScript.src`, so Production resolves `offline.html` correctly relative to `/Production/`.

## Suggested review checklist

- [ ] Confirm classic-mode parity (run the two live embeds against `Production/embed.min.js`).
- [ ] Sanity-check the dual-CTA routing precedence in `resolveCtaTarget` (per-tile > combo > global).
- [ ] Confirm `flow` targets pass through `redirectToUrlWithCheck` (fallback) and `booking` targets open directly.
- [ ] Decide on the unify-vs-legacy roadmap above.
