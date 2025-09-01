# Specification: Scrapius App (Next.js + Chrome Extension)

This document is the single source of truth used to generate the entire application. After final approval, code will be generated from it (monorepo with `app` and `extension` folders).

It is designed as a living document and includes a requirements checklist, architecture, data model (Drizzle), APIs, build/deploy pipeline, and security. It ends with acceptance criteria and a test plan.

---

## ✅ Requirements checklist (living)

- [x] Monorepo at root: `app/` (Next.js, TypeScript), `extension/` (Chrome Extension, TypeScript)
- [x] Build chain: build `extension` before Next.js; copy `extension/dist` into `app`
- [ ] Next.js endpoint that takes the built extension, injects client-specific values (token and metadata), performs string replace, creates a ZIP, and serves it for download (route scaffolded at `/api/extension/download`, implementation pending)
- [ ] Authentication: OAuth login/registration + email/password (Credentials), custom pages for login/registration/reset password (Google OAuth wired via NextAuth; Credentials + custom pages pending)
- [ ] Entire app behind login (except auth pages) (middleware pending)
- [ ] Dashboard: show user access token, download extension, manage scrapers (page exists with token placeholder, download button, and scrapers overview)
- [ ] Settings/Billing: Stripe subscription (webhooks, status, cancel/resume)
- [ ] Scrapers management: CRUD, name, editable JS code, settings (see “Scraper Model”) (list + create UI done; detail skeleton; no code editor/DB yet)
- [ ] Persistence in DB (Drizzle ORM + Turso/libSQL/SQLite), migrations
- [ ] Scrapers related to accounts and organizations; roles and permissions: admin/user
- [ ] User (member) can run scrapers, but cannot see or edit code
- [ ] Workspaces/Organizations: user can create a workspace, join existing workspaces, and switch between them (switcher UI only)
- [ ] Roles are per-workspace (a user can be admin in one workspace and user in another)
- [ ] Billing is tied to workspace (not user); seat-based pricing based on number of members
- [ ] Multiple plans (e.g., Solo, Team, Enterprise) with different pricing/features
- [ ] REST endpoint: with a token, return list of scrapers and user-facing info
- [ ] REST endpoint: run a scraper (optional, if allowed by settings)
- [ ] Tokens: per-workspace (organization) only in v1; rotation supported - need  to download new extension
- [x] No separate JS SDK in v1 (typed internal client only)
- [ ] CI: lint, typecheck, build, tests; release pipeline; codegen from this spec

---

## Scope and goals

- Users manage “scrapers” — pieces of JS code with settings that extract data from websites.
- A Chrome Extension will be available for end users and “customized” based on their account/token.
- The app provides login/registration (OAuth + email/password), billing (Stripe subscriptions), and a token-protected REST API.

Out of scope (for v1):
- Publishing the extension to the Chrome Web Store (local ZIP download is sufficient in v1).
- A full JS SDK published on NPM (can be part of a later phase).
- Distributed execution of scrapers (v1 treats scripts as definitions; execution is “best effort” via API or client environments).

---

## Architecture (high-level)

Monorepo:
- `app/` – Next.js 14 (App Router), TypeScript, NextAuth (OAuth + Credentials), Stripe (billing), Drizzle ORM (Turso), REST API (route handlers), UI (e.g., shadcn/ui — nice-to-have), server actions, edge-friendly where appropriate.
- `extension/` – Chrome Extension (Manifest v3), TypeScript, built with Vite + `@crxjs/vite-plugin` (or esbuild/tsup with manual manifest copy). Output `dist/` contains `manifest.json`, service worker, content scripts, and assets.

Flows:
1) Build: `extension` builds first. Output `extension/dist/**` is copied into `app/public/extension-base/**` (or `app/.cache/extension/**`).
2) User clicks “Download extension” on Dashboard → Next.js route `/api/extension/download`:
   - Copies the templated build (`extension-base`) into a temp directory.
   - Performs token replacement (`__API_TOKEN__`, `__USER_ID__`, `__ORG_ID__`, and host permissions) in `.js`, `.json`, `.html`, `.css` files.
   - Optionally adjusts `manifest.json` (name, description, host_permissions based on scrapers).
   - Zips (streaming) and returns for download.
3) REST API: authenticated by `X-API-Key` (user/org token), with rate limiting.

Token scope:
- v1: tokens are scoped to the organization (workspace) only. Extension download always embeds the current workspace token.

---

## Tech stack and key libraries

- Next.js 14 (App Router), TypeScript
- Auth: NextAuth.js
  - OAuth: Google/GitHub (at least one provider)
  - Credentials (email/password) for registration and password reset
- Database: Turso (libSQL) + Drizzle ORM, drizzle-kit for migrations
- Billing: Stripe (Checkout + Customer Portal + webhooks)
- Email: Resend (or Postmark) for reset password and email verification (optional)
- Validation: Zod
- API contracts: ts-rest (+ Zod) for typed REST; optional OpenAPI docs via zod-to-openapi and Swagger/Redoc
- UI: Tailwind CSS + shadcn/ui (required, minimalistic)
- Extension build: Vite + `@crxjs/vite-plugin`
- ZIP: `archiver` (streamed from API route)
- Rate limit: `@upstash/ratelimit` (optional)

---

## Design system and styling

- Design language: minimalistic, clean, dark-first UI with generous spacing. Subtle borders and low-elevation shadows only when needed.
- Frameworks: Tailwind CSS + shadcn/ui (Radix primitives). Use shadcn components consistently for inputs, buttons, dialogs, sheets, tabs, dropdowns, tables, and toasts.
- Background (global): apply this gradient to the entire app shell (root layout):
  - CSS value:
    `radial-gradient(1200px 600px at 20% -10%, rgba(10, 96, 255, 0.18), transparent 55%), radial-gradient(900px 500px at 100% 10%, rgba(0, 209, 255, 0.14), transparent 60%), linear-gradient(180deg, #060b1d, #091129 35%, #071028 100%)`
- Primary colors: gradient between `#6fa0ff` and `#00d1ff`.
- Typography: system fonts or Inter; base font-size responsive; high contrast for text.

Tailwind setup (spec):
- Extend `tailwind.config.ts`:
  - `backgroundImage.app-gradient` = Background (global) value above.
  - `colors.primary.from = '#6fa0ff'`, `colors.primary.to = '#00d1ff'`.
  - Optional semantic colors: `muted`, `accent`, `border` derived from slate/neutral in dark mode.
- Global classes:
  - Root layout wrapper: `min-h-screen bg-app-gradient text-slate-200 antialiased`.
  - CTA buttons: `bg-gradient-to-r from-[#6fa0ff] to-[#00d1ff] text-slate-900 hover:opacity-95`.
  - Cards/Panels: shadcn `Card` with `bg-white/5 border border-white/10 backdrop-blur` (dark-first).

shadcn/ui components (baseline set):
- Button, Input, Textarea, Label, Select, Checkbox, Badge
- Card, Tabs, Dialog, Drawer/Sheet, DropdownMenu, Toast/Sonner
- Table (for scrapers listing), Switch (toggle enabled)

Implementation notes:
- Default theme is dark; ensure adequate contrast and focus states.
- Keep iconography minimal; use `lucide-react` if needed.
- Use gradient for key CTAs (e.g., “Download extension”, “Create scraper”).
- Apply the background gradient on every protected page via the shared layout.

---

## User roles and permissions

- Organization/workspace roles: `admin`, `user`.
- `admin`: full access, sees/edits scraper code, manages members, billing, and tokens.
- `user`: can run scrapers and view metadata, but cannot see or edit code.

Visibility:
- Roles are assigned per workspace. The same person can be `admin` in one workspace and `user` in another.
- Scrapers are owned by a workspace (recommended). They can also be assigned directly to a user (v1 default: each user has an “implicit workspace”).

---

## Auth and login flows

Pages (public):
- `/login` – sign in (OAuth buttons + Credentials)
- `/register` – sign up via email/password (email verification optional)
- `/reset-password` – request reset (email), confirmation link with token → set new password

Everything else behind login:
- Middleware protects all non-auth routes; allow-listed public API only (e.g., health-check).

Workspace membership and invites:
- Users can create a new workspace during onboarding or from the workspace switcher.
- Users can join a workspace via an invitation link (signed token) or email invite.
- Admins can invite users (email-based) and set their role (`admin`/`user`).
- Pending invites are visible in Workspace Settings → Members.

NextAuth:
- Providers: Google, GitHub, Credentials
- Session: JWT (default), `NEXTAUTH_SECRET`
- Adapter (optional): custom via Drizzle if persistence of sessions/verification tokens is needed.

Access tokens (API Keys):
- Generated per workspace (organization). Support multiple tokens and rotation.
- Stored hashed (e.g., `sha256`) and shown only once upon creation.
- Auth via `X-API-Key: <token>`.

---

## Billing (Stripe)

- Plans: multiple plans (e.g., Solo, Team, Enterprise) with different pricing and features.
- Onboarding: via Stripe Checkout Session (link from `/settings/billing`).
- Management: Stripe Customer Portal link for payment method changes/cancel.
- Billing scope: workspace (organization). If a user is outside a workspace, their “implicit workspace” is billed.
- Seat-based pricing: subscription quantity equals the number of active members in the workspace (exclude pending invites). On membership changes, update Stripe subscription quantity.
- Webhooks: `checkout.session.completed`, `customer.subscription.updated|deleted` → update DB (`status`, `current_period_end`, `price_id`, `plan_key`, `quantity`).
- Optional metered usage: track scraper runs or bandwidth as add-on.

---

## Data model (Drizzle ORM)

Entities and relationships:
- `users` – users
- `organizations` – workspaces/organizations
- `memberships` – user memberships in orgs (roles)
- `api_tokens` – API keys (user/org, hash, name, revoked)
- `scrapers` – scraper definitions (org_id, owner_id, name, code, configuration)
- `scraper_runs` – (optional) execution logs with results/errors
- `subscriptions` – Stripe metadata (org)
- `org_invites` – invitations to join a workspace

Scraper configuration (JSON):
- `exposedVia`: `"library" | "endpoint" | "both"`
- `availabilityUrls`: string[] (hostnames/URL patterns)
- `execution`: { `type`: `"once" | "periodic"`, `intervalMs?`: number, `cron?`: string }
- `changeDetection`: `"all" | "diff"`
- `delivery`: { `mode`: `"push" | "pull"`, `endpointUrl?`: string }
- `enabled`: boolean

Tables (schema sketch):

```ts
// drizzle/schema.ts (sketch)
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  passwordHash: text('password_hash'), // null when OAuth-only
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
});

export const organizations = sqliteTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ownerUserId: text('owner_user_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
});

export const memberships = sqliteTable('memberships', {
  id: text('id').primaryKey(),
  orgId: text('org_id').notNull(),
  userId: text('user_id').notNull(),
  role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
  invitedByUserId: text('invited_by_user_id'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
});

export const apiTokens = sqliteTable('api_tokens', {
  id: text('id').primaryKey(),
  orgId: text('org_id'),
  userId: text('user_id'),
  name: text('name').notNull(),
  hash: text('hash').notNull(), // sha256
  lastUsedAt: integer('last_used_at', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
  revokedAt: integer('revoked_at', { mode: 'timestamp_ms' }),
});

export const scrapers = sqliteTable('scrapers', {
  id: text('id').primaryKey(),
  orgId: text('org_id').notNull(),
  ownerUserId: text('owner_user_id').notNull(),
  name: text('name').notNull(),
  code: text('code').notNull(), // JS source (versioning can be in a separate table)
  configJson: text('config_json').notNull(),
  visibility: text('visibility', { enum: ['private', 'org'] }).notNull().default('org'),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
});

export const scraperRuns = sqliteTable('scraper_runs', {
  id: text('id').primaryKey(),
  scraperId: text('scraper_id').notNull(),
  triggeredBy: text('triggered_by'), // 'api' | 'schedule' | 'user'
  status: text('status', { enum: ['queued', 'running', 'success', 'error'] }).notNull(),
  startedAt: integer('started_at', { mode: 'timestamp_ms' }),
  finishedAt: integer('finished_at', { mode: 'timestamp_ms' }),
  resultJson: text('result_json'),
  errorMessage: text('error_message'),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  orgId: text('org_id').notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id'),
  status: text('status'), // trialing | active | past_due | canceled | unpaid
  currentPeriodEnd: integer('current_period_end', { mode: 'timestamp_ms' }),
  planKey: text('plan_key'), // 'solo' | 'team' | 'enterprise'
  priceId: text('price_id'), // Stripe price ID
  quantity: integer('quantity'), // seat count
});

export const orgInvites = sqliteTable('org_invites', {
  id: text('id').primaryKey(),
  orgId: text('org_id').notNull(),
  email: text('email').notNull(),
  role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
  tokenHash: text('token_hash').notNull(), // invite token stored hashed
  invitedByUserId: text('invited_by_user_id').notNull(),
  status: text('status', { enum: ['pending', 'accepted', 'revoked', 'expired'] }).notNull().default('pending'),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
});
```

Indexes and FKs will be added in migrations (Drizzle `relations`). IDs can be `cuid2`/`ulid`/`uuid` — choose during implementation.

---

## Next.js — routing and pages

App Router:
- Public:
  - `/login` – sign in (OAuth + Credentials)
  - `/register` – sign up
  - `/reset-password` – request reset + `/reset-password/[token]` – set new password
- Protected:
  - `/dashboard` – show token, “Download extension” button, scrapers overview
  - `/scrapers` – list, add, edit (admin-only for code)
  - `/scrapers/[id]` – detail; “Settings” tab, “Code” tab (role-gated)
  - `/settings/billing` – subscription status, Stripe links

Middleware:
- Protect all protected routes; redirect to `/login` when no session.

---

## REST API (v1)

Auth: `X-API-Key` (hash verified against `api_tokens`), rate limited.

Contracts and typing:
- Define REST contracts with ts-rest using Zod schemas under `app/src/contracts`.
- Implement handlers via `@ts-rest/next` in Route Handlers.
- Generate a typed client for internal UI consumption from the same contracts (no separate SDK needed in v1).
- Optional API docs: export OpenAPI via `zod-to-openapi` and serve `/api/openapi.json` plus a docs page at `/api/docs` (Swagger UI or Redoc).

Core endpoints:
- `GET /api/v1/scrapers` – returns list of scrapers (only metadata available to the token)
  - Response items: `id`, `name`, `enabled`, `config` (no `code` for user role)
- `GET /api/v1/scrapers/:id` – scraper detail (no `code` for user role)
- `POST /api/v1/scrapers/:id/run` – runs the scraper if `exposedVia` includes `endpoint` and `enabled=true`
  - Body may include input params for the scraper (optional)

Workspace management (behind login; internal/admin as noted):
- `GET /api/internal/organizations` – list user workspaces
- `POST /api/internal/organizations` – create workspace
- `GET /api/internal/organizations/:orgId/members` – list members (admin)
- `POST /api/internal/organizations/:orgId/invites` – create invite (admin)
- `POST /api/internal/invites/accept` – accept invite via token
- `PATCH /api/internal/organizations/:orgId/members/:userId` – change role (admin)
- `DELETE /api/internal/organizations/:orgId/members/:userId` – remove member (admin)

Admin UI (behind login) uses server actions/handlers for scrapers CRUD:
- `POST /api/internal/scrapers` – create (admin)
- `PATCH /api/internal/scrapers/:id` – update (admin)
- `DELETE /api/internal/scrapers/:id` – delete (admin)

Note: v1 does not execute scraper JS on the server. Execution is delegated to the Chrome extension or other clients. A server-side sandbox may be explored later.

---

## Chrome Extension (Manifest v3)

Folder `extension/` includes:
- `src/background.ts` (service worker) — communication, API calls with placeholder `__API_TOKEN__`
- `src/content.ts` (content script) — optional page interaction
- `src/ui/*` — optional popup/options
- `manifest.json` — host permissions updated based on scrapers/user preferences

Build:
- Vite + `@crxjs/vite-plugin`, outputs to `extension/dist`
- Placeholders in code/manifest: `__API_BASE_URL__`, `__API_TOKEN__`, `__USER_ID__`, `__ORG_ID__`

Custom ZIP download:
- Next.js route `/api/extension/download`:
  - Reads session → identifies user/org → collects allowed host permissions (from `availabilityUrls` across scrapers)
  - String-replaces placeholders in a temporary copy of the build output
  - Modifies `manifest.json` (name: `Scrapius – <OrgName>`; `host_permissions`)
  - Streams the ZIP

---

## Build and orchestration (monorepo)

Structure:
```
root/
  app/            # Next.js
  extension/      # Chrome Extension
  package.json    # workspaces + scripts
  turbo.json      # (optional) Turborepo
```

Root `package.json` — scripts (proposal):
- `build` → `pnpm -w build` (or `turbo build`)
- `build:extension` → `pnpm --filter extension build`
- `build:app` → `pnpm --filter app build`
- Hook: `prebuild:app` runs `build:extension` and copies `extension/dist` to `app/public/extension-base`

Copying: `cpy-cli` or a Node script (FS `cp -R`).

Next.js ZIP route: uses `archiver` + `fs/promises` for the temp copy.

---

## Security

- Store API tokens only as hashes (sha256 + salt); display only once upon creation.
- Rate limit public APIs and the ZIP download.
- RBAC: enforce role checks on all internal operations. For `user`, never return the `code` field.
- Sandbox for server-side JS execution (if part of v1) — isolated environment; disallow network calls outside a whitelist.
- CSP for the app and the extension (Manifest v3 already enforces constraints).
- Secret management: `.env` for keys (NextAuth, Stripe, DB, Resend, etc.).

---

## UX — pages and flows

- Global shell — consistent gradient background, centered content max-width (e.g., `max-w-6xl mx-auto px-4`), sticky top nav with minimal actions.
- Login/Register/Reset — simple forms, OAuth buttons.
- Dashboard —
  - “Your API token” (copy button, token rotation)
  - “Download extension” (generates a custom ZIP)
  - Scrapers overview (table), actions: Run (if allowed), Edit (admin), Delete (admin)
- Scraper detail — code editor (Monaco), settings panel (checkboxes/selects)
- Settings/Billing — subscription status, Stripe portal link, billing email

Workspace UX:
- Workspace switcher in the top nav (shows current workspace name, menu to switch/create new workspace).
- Workspace Settings → Members: list members, roles, invite users (email), revoke invites, remove members.
- Accept Invite page: opens via secure token link; after acceptance, adds user to workspace and updates Stripe seats.

---

## Acceptance criteria (MVP)

1) Registration/login works (OAuth + Credentials). Password reset sends an email and allows setting a new password.
2) After login, Dashboard shows API token and allows downloading an extension ZIP with my token embedded.
3) Scrapers CRUD: create, name, paste code, configure, and save to DB.
4) Roles: `user` cannot see code; `admin` can view/edit. `user` can run a scraper if allowed.
5) REST `GET /api/v1/scrapers` returns scrapers available to a valid `X-API-Key`.
6) Stripe billing: subscription creation/cancel reflect in DB via webhook.
7) Build pipeline: build `extension` → copy `dist` → Next.js generates and serves a token-injected ZIP.
8) Styling: Tailwind + shadcn/ui installed and used; app uses the specified global background gradient; primary gradient (#6fa0ff → #00d1ff) applied to primary CTAs.
9) REST API contracts defined with ts-rest + Zod; UI uses generated typed client; OpenAPI JSON available (or docs page) for external consumers.
10) Workspaces: users can create a workspace, join via invite, switch workspaces; roles are enforced per workspace.
11) Billing per workspace with seat-based quantity equals active members; multiple plans supported and reflected in DB/webhooks.

---

## Test plan

- Unit: input validation (Zod), token hashing utils, manifest transformer.
- Integration: NextAuth flows (Credentials), REST endpoints with `X-API-Key`, Stripe webhook handler (mock).
- E2E: Register → sign in → create scraper → download extension (ZIP contains token) → REST list scrapers with token.

---

## Next steps (implementation roadmap)

1) Initialize monorepo (pnpm workspaces), Next.js app, extension template, shared TS configs.
2) Drizzle + Turso setup, schema and migrations.
3) NextAuth (OAuth + Credentials), auth pages.
4) Scrapers CRUD (UI + API), role guard.
5) Extension → app build pipeline, ZIP endpoint with transformations.
6) Stripe integration (checkout, portal, webhooks), Settings/Billing UI.
7) REST API v1 + rate limit + token hashing/rotation.
8) E2E and smoke tests, CI.
9) Tailwind + shadcn setup, background gradient in root layout, CTA gradient styles.
10) ts-rest contracts folder with Zod schemas, `@ts-rest/next` handlers wired, typed client used in app; optional `/api/openapi.json` and `/api/docs` route.
11) Workspace switcher UI, organizations CRUD (create/list), members list, invites create/accept; Stripe seat sync on membership changes.

---

## Decisions (resolved)

- Tokens: per workspace (organization) in v1; no user-level tokens embedded in the extension. Rotation supported.
- Execution: v1 executes scraper JS via the Chrome extension/clients only; no server-side sandbox execution in v1.
- OAuth providers: Google only (Credentials also available for email/password). No GitHub in v1.
- JS SDK: not included in MVP. Internal typed REST client only.

---

Note: Once we agree on this document, we will generate the monorepo skeleton per “Build and orchestration,” add Drizzle schemas, pages and endpoints, then prepare CI and baseline tests.
