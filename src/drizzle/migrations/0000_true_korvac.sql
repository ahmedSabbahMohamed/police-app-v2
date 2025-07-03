CREATE TABLE `criminals` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`national_id` text NOT NULL,
	`job` text NOT NULL,
	`bod` text,
	`mother_name` text NOT NULL,
	`stage_name` text NOT NULL,
	`impersonation` text NOT NULL,
	`address` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `criminals_national_id_unique` ON `criminals` (`national_id`);--> statement-breakpoint
CREATE TABLE `crimes` (
	`id` text PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`type_of_accusation` text NOT NULL,
	`last_behaviors` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `criminals_crimes` (
	`criminal_id` text NOT NULL,
	`crime_id` text NOT NULL,
	PRIMARY KEY(`criminal_id`, `crime_id`),
	FOREIGN KEY (`criminal_id`) REFERENCES `criminals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`crime_id`) REFERENCES `crimes`(`id`) ON UPDATE no action ON DELETE no action
);
