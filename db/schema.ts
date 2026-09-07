import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  salt: text('salt').notNull(),
  iterations: integer('iterations').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const sessions = sqliteTable('sessions', {
  tokenHash: text('token_hash').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
  createdAt: integer('created_at').notNull(),
  lastSeenAt: integer('last_seen_at').notNull(),
});

export const trackerStates = sqliteTable('tracker_states', {
  userId: text('user_id').primaryKey(),
  email: text('email').notNull(),
  payload: text('payload').notNull().default('[]'),
  revision: integer('revision').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const jobQueryCache = sqliteTable('job_query_cache', {
  queryKey: text('query_key').primaryKey(),
  payload: text('payload').notNull(),
  cachedAt: integer('cached_at').notNull(),
});
