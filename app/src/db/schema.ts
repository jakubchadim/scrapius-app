import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
})

export const organizations = sqliteTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ownerUserId: text('owner_user_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
})

export const memberships = sqliteTable('memberships', {
  id: text('id').primaryKey(),
  orgId: text('org_id').notNull(),
  userId: text('user_id').notNull(),
  role: text('role').notNull(), // 'admin' | 'user'
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
})

export const scrapers = sqliteTable('scrapers', {
  id: text('id').primaryKey(),
  orgId: text('org_id').notNull(),
  ownerUserId: text('owner_user_id').notNull(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  configJson: text('config_json').notNull(),
  visibility: text('visibility').notNull().default('org'), // 'private' | 'org'
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
})

export const apiTokens = sqliteTable('api_tokens', {
  id: text('id').primaryKey(),
  orgId: text('org_id'),
  userId: text('user_id'),
  name: text('name').notNull(),
  hash: text('hash').notNull(), // sha256 of token
  lastUsedAt: integer('last_used_at', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
  revokedAt: integer('revoked_at', { mode: 'timestamp_ms' }),
})

export const scraperRuns = sqliteTable('scraper_runs', {
  id: text('id').primaryKey(),
  scraperId: text('scraper_id').notNull(),
  triggeredBy: text('triggered_by'), // 'api' | 'schedule' | 'user'
  status: text('status').notNull(), // 'queued' | 'running' | 'success' | 'error'
  startedAt: integer('started_at', { mode: 'timestamp_ms' }),
  finishedAt: integer('finished_at', { mode: 'timestamp_ms' }),
  resultJson: text('result_json'),
  errorMessage: text('error_message'),
})

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  orgId: text('org_id').notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id'),
  status: text('status'),
  currentPeriodEnd: integer('current_period_end', { mode: 'timestamp_ms' }),
  planKey: text('plan_key'),
  priceId: text('price_id'),
  quantity: integer('quantity'),
})

export const orgInvites = sqliteTable('org_invites', {
  id: text('id').primaryKey(),
  orgId: text('org_id').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('user'),
  tokenHash: text('token_hash').notNull(),
  invitedByUserId: text('invited_by_user_id').notNull(),
  status: text('status').notNull().default('pending'),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(strftime('%s','now')*1000)`),
})
