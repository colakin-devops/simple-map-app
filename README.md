# Simple Map App (Colakin Hiring Portal)

A web proxy and map application supporting dynamic map rendering, location data APIs, and static asset serving. This project can be run locally via Node.js/Express or deployed to **Cloudflare Workers with Static Assets**.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Cloudflare Deployment](#cloudflare-deployment)
  - [Prerequisites](#prerequisites)
  - [Step 1: Authenticate with Cloudflare](#step-1-authenticate-with-cloudflare)
  - [Step 2: Configure `wrangler.toml`](#step-2-configure-wranglertoml)
  - [Step 3: Test Locally with Wrangler](#step-3-test-locally-with-wrangler)
  - [Step 4: Deploy to Cloudflare](#step-4-deploy-to-cloudflare)
  - [Step 5: Verify Deployment](#step-5-verify-deployment)
- [Automated Deployment (CI/CD via GitHub Actions)](#automated-deployment-cicd-via-github-actions)
- [Configuration Reference (`wrangler.toml`)](#configuration-reference-wranglertoml)
- [VM / Systemd Deployment](#vm--systemd-deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

The application provides:
- **Express Server** (`index.js`): Node.js/Express server serving API routes (`/api/map`, `/api/au-map`) and static assets for VM/container hosting.
- **Cloudflare Worker** (`worker/index.js` + `wrangler.toml`): Cloudflare Workers deployment that handles both API endpoints (`/api/au-map`, `/api/map`) and serves static front-end assets (like `index.html`, `bubble-config.html`, and `au-map.js`) at edge speed.

---

## Project Structure

```text
.
├── api/
│   ├── au-map.js          # Node.js API handler for Australia regions & properties
│   └── map.js             # Node.js Cheerio proxy handler for Abuzz map content
├── public/
│   ├── au-map.js          # Client-side map logic
│   ├── bubble-config.html # Embedded map configuration UI
│   └── index.html         # AU Map Explorer front-end application
├── worker/
│   └── index.js           # Cloudflare Worker handling API routes and asset delivery
├── deploy.md              # Instructions for VM/Systemd deployment
├── index.js               # Local Node.js Express server
├── package.json           # Dependencies and scripts
├── simple-map-app.service # Systemd service unit file
└── wrangler.toml          # Cloudflare Workers configuration
```

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Express Server
```bash
# Production mode
npm start

# Development mode (auto-reload on change)
npm run dev
```
The server will start at `http://localhost:3000`.

- **Root check**: [http://localhost:3000/](http://localhost:3000/)
- **Map Proxy**: [http://localhost:3000/api/map?property=cockburnGateway](http://localhost:3000/api/map?property=cockburnGateway)
- **AU Map API**: [http://localhost:3000/api/au-map](http://localhost:3000/api/au-map)
- **Static Assets**: [http://localhost:3000/bubble-config.html](http://localhost:3000/bubble-config.html)

---

## Cloudflare Deployment

Cloudflare Workers with Assets allows you to host full-stack applications and static sites on Cloudflare's edge network.

### Prerequisites

1. A [Cloudflare Account](https://dash.cloudflare.com/sign-up).
2. Node.js (version 18 or later) and `npm` installed.
3. Dependencies installed in this directory (`npm install`).

---

### Step 1: Authenticate with Cloudflare

Log in to your Cloudflare account using Wrangler CLI:

```bash
npx wrangler login
```

This will open your browser and ask you to authorize Wrangler. Once approved, Wrangler will store your authentication credentials locally.

> **Tip (Headless/CI Environments):**  
> If you are on a server without a browser, create an API Token in the [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) with the **Edit Cloudflare Workers** template and set the environment variable:
> ```bash
> export CLOUDFLARE_API_TOKEN="your-api-token"
> export CLOUDFLARE_ACCOUNT_ID="your-account-id"
> ```

---

### Step 2: Configure `wrangler.toml`

The repository includes a pre-configured `wrangler.toml`:

```toml
name = "clk-hiring-portal"
main = "worker/index.js"
compatibility_date = "2026-11-19"

[assets]
directory = "./public"
binding = "ASSETS"
not_found_handling = "single-page-application"
```

- **`name`**: The name of your Cloudflare Worker project (customize if needed).
- **`main`**: The worker script handling incoming edge requests.
- **`[assets].directory`**: The directory containing files to upload and serve statically (`./public`).
- **`[assets].not_found_handling`**: Set to `"single-page-application"` to serve `index.html` for unknown paths, or `"none"` for 404 responses.

---

### Step 3: Test Locally with Wrangler

Before publishing to production, you can test the worker and assets in the local Cloudflare sandbox:

```bash
npx wrangler dev
```

This runs a local emulation server (default `http://localhost:8787`) to verify static asset delivery and edge handling.

---

### Step 4: Deploy to Cloudflare

Deploy the worker and static assets with a single command:

```bash
npm run deploy
```
*(Alternatively, run `npx wrangler deploy`)*

#### Example Output:
```text
⛅️ wrangler 4.165.0
────────────────────
✨ Read 2 files from the assets directory ./public
Total Upload: ~0.18 KiB
Uploaded 100% of assets
Deployed clk-hiring-portal triggers (1.23 sec)
  https://clk-hiring-portal.<your-subdomain>.workers.dev
Current Version ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

### Step 5: Verify Deployment

Once deployed, access the assigned `workers.dev` URL or your custom domain:

- **Static Asset**: `https://clk-hiring-portal.<your-subdomain>.workers.dev/bubble-config.html`
- **JavaScript Asset**: `https://clk-hiring-portal.<your-subdomain>.workers.dev/au-map.js`

---

## Automated Deployment (CI/CD via GitHub Actions)

To automatically deploy whenever changes are pushed to your repository, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in **GitHub Repository Settings > Secrets and variables > Actions**.

---

## Configuration Reference (`wrangler.toml`)

### Adding a Custom Domain

To link your deployment to a custom domain on your Cloudflare zone:

```toml
routes = [
  { pattern = "maps.yourdomain.com", custom_domain = true }
]
```

### Environment Variables & Secrets

Add non-sensitive environment variables directly in `wrangler.toml`:
```toml
[vars]
ENVIRONMENT = "production"
```

For sensitive secrets (API keys, credentials), set them securely via CLI:
```bash
npx wrangler secret put SECRET_KEY
```

---

## VM / Systemd Deployment

If hosting the Express server on an Ubuntu VM rather than Cloudflare:

1. Refer to [deploy.md](file:///home/venkatesh-colakin/Downloads/simple-map-app-main/deploy.md) for remote pulling and service reload commands.
2. The service definition file is located at [simple-map-app.service](file:///home/venkatesh-colakin/Downloads/simple-map-app-main/simple-map-app.service).
3. Restart the systemd service:
   ```bash
   sudo systemctl restart simple-map-app
   ```

---

## Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `Authentication error (code 10000)` | Not logged in or expired token | Run `npx wrangler login` or verify `CLOUDFLARE_API_TOKEN`. |
| `Missing script: build` | Legacy build hook | Use `npm run deploy` or `npx wrangler deploy` directly. |
| `Asset not found (404)` | File not in `public/` folder | Ensure files are inside `./public` before deploying. |
| `CORS Error` | Origin domain not permitted | Update `allowedOrigins` in `api/map.js` and `api/au-map.js`. |
| `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` | `/api/au-map` returned the SPA fallback HTML instead of JSON because the worker only had asset proxying. | Ensure `worker/index.js` handles `/api/au-map` and `/api/map` before delegating to `env.ASSETS.fetch()`. |
