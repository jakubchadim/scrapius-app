# Database (Drizzle + Turso/libSQL)

Env vars (app):
- TURSO_DATABASE_URL=
- TURSO_AUTH_TOKEN=

Scripts:
- pnpm db:generate — generate SQL migrations from Drizzle schema
- pnpm db:migrate — push migrations to Turso

Notes:
- drizzle.config.ts is set to sqlite dialect for libSQL/Turso
- Client: src/db/client.ts
- Schema: src/db/schema.ts

Create a Turso database, set envs, then run:

```
pnpm db:generate
pnpm db:migrate
```
