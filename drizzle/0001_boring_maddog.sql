CREATE TABLE `job_query_cache` (
	`query_key` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`cached_at` integer NOT NULL
);
