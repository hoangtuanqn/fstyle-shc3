ALTER TABLE `users` ADD `raw_password` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `is_first_login` tinyint DEFAULT 1 NOT NULL;