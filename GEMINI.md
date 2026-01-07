## Instructions

Only edit the embed.js and embed-styles.css files. Do not edit any other files.

Dont run the build command.

## Connectivity & Fallback Logic Context

The `embed.js` script performs a connectivity check before redirecting the user to the main application. This is to ensure we don't send users to a broken page if the server is down.

### The Mechanism

1.  **Initial Check:** `embed.js` sends a `HEAD` request to `/ping/v1/ping`.
2.  **Success:** If 200 OK, the user is redirected to the App URL.
3.  **Failure:** If the request fails (Network Error or non-200), the user is redirected to `offline.html`.

### The Problem (Corporate Firewalls & Infinite Loops)

Many corporate networks block specific API endpoints (like `/ping`) or methods (`HEAD`), but allow general web traffic.

1.  **False Negative:** `embed.js` thinks the server is offline because the ping is blocked, so it redirects to `offline.html`.
2.  **The Loop:** `offline.html` has its own logic (originally an Image check for `favicon.ico`, or a retry interval). If `offline.html`'s check _succeeds_ (e.g., because images aren't blocked), it redirects the user _back_ to the App.
3.  **Result:** The user enters an infinite loop: `embed.js` (Fail) -> `offline.html` (Success) -> `embed.js` (Fail) -> ...

### Evolution of Solutions

-   **v1 (Original):** Simple `fetch` to `/ping`. Failed often on restrictive networks.
-   **v2 (Image Fallback):** _Removed/Deprecated._ Previously tried loading `favicon.ico` via `new Image()`. This proved unreliable (blocked/missing icons) and was removed in favor of v4.
-   **v3 (No-CORS Fetch):** _Rejected._ While robust, it masked 503 Maintenance pages as "Online", preventing users from seeing the offline form during maintenance.
-   **v4 (Health Script - Final):** The clean/final solution.
    -   **Mechanism:** If `fetch` fails, attempt to load a specific script: `${baseUrl}/ping/v1/script/health.js`.
    -   **Firewall Blocked (API):** `health.js` bypasses the firewall (it's a script, not an API call) -> **Online**. (Loop Fixed).
    -   **Maintenance (503):** Server returns 503 HTML. Browser fails to parse HTML as JS. `onerror` fires -> **Offline**.
    -   **Server Down:** Requests timeout. `onerror` fires -> **Offline**.
    -   **Implementation:** Used in both `embed.js` and `offline.html` as the sole Truth Source. Retries and Image checks removed.
