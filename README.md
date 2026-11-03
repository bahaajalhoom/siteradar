# SiteRadar

## Firebase Hosting deployment

`firebase deploy --only hosting` builds a frontend-only static export with
`npm run build:hosting` and publishes `.firebase/export`. Public pages are
pre-rendered; account data and audits use the external SiteRadar API. Hosting
rewrites `/app/**` to the workspace shell so saved report links work on reload.
The build runs in an isolated temporary directory and does not publish local
API routes, SQLite databases, or environment files. The usual Next.js build
and local development setup remain available.

**Continuing on a Mac or handing this project to another developer? Start with [HANDOFF.md](HANDOFF.md).** It contains setup, private data migration, the latest implementation state, known unfinished work, and launch requirements. Original requirements: [Arabic product specification](docs/original-product-spec-ar.md).

For the detailed architecture, every library's role, web/worker separation, API, database model and audit lifecycle, read [PROJECT-GUIDE.md](PROJECT-GUIDE.md).

A Next.js, Node.js, TypeScript, and Tailwind audit product with a readable light interface. Public pages, real accounts, saved projects, rendered-page audits, Lighthouse performance, axe accessibility, and repair prompts.

## Run locally

Requires Node.js 24.11 or newer and npm.

```sh
npm ci
npm run setup:browsers
npm run dev
```

Open http://127.0.0.1:3000. Create an account to open `/app`. The command starts Next.js and the Node worker. A database lease ensures one active worker even when development sessions overlap. Queued runs survive worker restarts.

```sh
npm test
npm run typecheck
npm run build
npm start
```

The launcher sets the standard `NODE_ENV` value explicitly because desktop development hosts may supply their own value. Node's built-in SQLite currently emits an experimental warning.

## Included

- Public landing, Free/Basic/Pro/Max pricing, searchable documentation, signup/login/logout, projects, findings, pages, performance, keywords, competitors, history, integrations and settings.
- Free has no plan quotas on projects, audits, keywords or history. Basic, Pro and Max are disabled Coming soon plans. No payments are collected.
- Projects remember their URL and scan configuration. Run again reuses it; Scan settings changes it without URL re-entry. Keyword suggestions come from actual page titles and headings.
- Radix dialogs, Phosphor icons, Recharts, Sonner, Zod, Cheerio, robots-parser, and ipaddr.js. Manrope and IBM Plex Mono are self-hosted through Fontsource.
- Separate Node worker, durable SQLite job queue, real progress polling, cancellation, and persisted reports.
- Public HTTPS same-origin crawling and robots.txt enforcement. Choose a page scope or All discoverable pages. Technical safeguards default to 10,000 pages and a 300-second crawl budget; these are configurable job safeguards, not paid-plan quotas. Enter the final canonical origin; off-origin redirects are denied.
- DNS checks before every request and redirect, pinning requests to a checked public IP. Private, loopback, link-local, mapped-private IPv6 and reserved destinations are denied.
- HTTP, title, description, H1, canonical, noindex, viewport, document language, image alt, JSON-LD parsing, and basic content-structure observations.
- Isolated Chromium rendering, mobile/desktop homepage Lighthouse scores, LCP, CLS, TBT, FCP, Speed Index and axe violations. Browser egress uses a public-IP-only proxy with DNS validation and pinned connections; direct loopback bypass is disabled.
- Optional SerpApi rankings and search competitors. Save an encrypted API key in Integrations. Without a key, keywords remain saved and ranks remain unmeasured.
- Real category charts from the first report, then a timeline of actual snapshots for the same website and device. Dates use a fixed locale and Jerusalem timezone to prevent hydration mismatches.
- JSON and CSV exports, browser print-to-PDF, selected-finding Markdown prompt download and clipboard copy. CSV cells guard against formula injection.

## Scope and limitations

This installation remains local. Accounts have private sessions and owner-scoped reports. The public `/demo` is explicitly illustrative; live scans never reuse its measurements. Automatic import of unowned legacy reports during signup is disabled. Latest routing and SEO work still requires UX review; see HANDOFF.md.

Performance and automated accessibility measure the homepage. Lab data is not CrUX field data; TBT is not INP. Automation does not establish complete WCAG compliance. GEO readiness is a structural heuristic, not measured AI visibility. The audit score averages available category scores; missing sources are disclosed. Re-run older HTML-only reports to add browser measurements.

AI-visibility observation, Search Console, screenshot artifacts, email verification/password reset, teams, verified ownership, payments, scheduling, sharing, full Arabic/RTL localization, PostgreSQL/Redis and object storage remain outside this build. Market context configures SERP queries; it does not relocate the local browser's network exit.

The server binds to loopback and enforces same-origin API writes. Passwords use salted scrypt; sessions use hashed random tokens and HttpOnly cookies. Provider keys use AES-256-GCM with a key in `data/.secrets-key`. Reports are in `data/siteradar.sqlite`. These files are excluded from source control. Public deployment still needs HTTPS, backups, operational isolation and review. Audit only authorized sites.

## Data and verification

Worker jobs are claimed transactionally. Interrupted running jobs fail explicitly on worker restart; queued jobs persist. Cancellation preserves partial observations and never claims a completed report. Findings are deduplicated by rule and retain page URLs and evidence. External page strings are treated as data, rendered as text, and delimited in repair prompts.

Tests cover passwords, worker leasing, browser proxy isolation, DNS/redirect policy, HTML rules, scoring, prompts and mocked provider behavior. `npm run check:product` tests routes, disposable accounts, report isolation, scan reuse, real Lighthouse/axe output and logout/login. Live SerpApi was not tested without an account. Interactive visual QA of this revision was unavailable because preview permission was declined; no alternative browser was used.

See [STATUS.md](STATUS.md) for the implementation boundary and [ARCHITECTURE.md](ARCHITECTURE.md) for file responsibilities.
