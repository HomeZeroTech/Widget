# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## **CRITICAL: NEVER EDIT PRODUCTION FILES**

**Only edit files in the `Acceptance/` folder. NEVER edit files in the `Production/` folder.**

---

## Instructions

- Only edit `Acceptance/embed.js` and `Acceptance/embed-styles.css`
- **NEVER** edit any files in `Production/` - these are deployed to live users
- Do not edit `.min.js`, `.min.css`, or `offline.html` files
- Do not run the build command

## Architecture

This repository contains an embeddable widget for HomeZero with two deployment environments:

- **Acceptance/** - Staging/test environment (EDIT FILES HERE)
- **Production/** - Live production environment (DO NOT EDIT)

Each environment contains:

- `embed.js` - Main widget JavaScript
- `embed-styles.css` - Widget styles
- `embed.min.js` - Minified JS (auto-generated)
- `embed-styles.min.css` - Minified CSS (auto-generated)
- `offline.html` - Fallback page shown when server is unavailable

The build process uses `terser` for JS minification and `lightningcss` for CSS minification.

## Connectivity & Fallback Logic

The `embed.js` script performs a connectivity check before redirecting the user to the main application to ensure users don't land on a broken page.

### The Mechanism

1. **Initial Check:** `embed.js` sends a `HEAD` request to `/ping/v1/ping`
2. **Success:** If 200 OK, redirect to the App URL
3. **Failure:** If request fails (Network Error or non-200), redirect to `offline.html`

### The Problem (Corporate Firewalls & Infinite Loops)

Many corporate networks block specific API endpoints or methods but allow general web traffic:

1. **False Negative:** `embed.js` thinks server is offline because ping is blocked
2. **The Loop:** `offline.html` has its own check that may succeed, redirecting back
3. **Result:** Infinite loop: `embed.js` (Fail) -> `offline.html` (Success) -> `embed.js` (Fail)

### Current Solution (v4 - Health Script)

If `fetch` fails, attempt to load `${baseUrl}/ping/v1/script/health.js`:

- **Firewall Blocked (API):** `health.js` bypasses the firewall (it's a script, not an API call) -> **Online**
- **Maintenance (503):** Server returns 503 HTML, browser fails to parse HTML as JS, `onerror` fires -> **Offline**
- **Server Down:** Requests timeout, `onerror` fires -> **Offline**

This is used in both `embed.js` and `offline.html` as the single source of truth.

### Deprecated Approaches

- **v1:** Simple `fetch` to `/ping` - failed often on restrictive networks
- **v2 (Image Fallback):** Loading `favicon.ico` via `new Image()` - unreliable
- **v3 (No-CORS Fetch):** Masked 503 Maintenance pages as "Online"
