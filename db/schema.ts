import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
