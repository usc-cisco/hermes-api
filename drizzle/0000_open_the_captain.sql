CREATE TABLE `courses` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`coordinator_availability` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_name_unique` ON `courses` (`name`);--> statement-breakpoint
CREATE TABLE `queue_numbers` (
	`id` integer PRIMARY KEY NOT NULL,
	`student_id` integer NOT NULL,
	`course_id` integer NOT NULL,
	`queue_number` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `queue_numbers_student_id_unique` ON `queue_numbers` (`student_id`);