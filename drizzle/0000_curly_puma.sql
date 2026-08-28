CREATE TABLE `tracker_states` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`payload` text DEFAULT '[]' NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
