CREATE TABLE `award_winners` (
	`id` varchar(36) NOT NULL,
	`award_id` varchar(36) NOT NULL,
	`slot` tinyint NOT NULL,
	`winner_team_id` varchar(36),
	`winner_user_id` varchar(36),
	`winner_name` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `award_winners_id` PRIMARY KEY(`id`),
	CONSTRAINT `award_slot_idx` UNIQUE(`award_id`,`slot`)
);
--> statement-breakpoint
ALTER TABLE `awards` DROP FOREIGN KEY `awards_winner_team_id_teams_id_fk`;
--> statement-breakpoint
ALTER TABLE `awards` DROP FOREIGN KEY `awards_winner_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `award_winners` ADD CONSTRAINT `award_winners_award_id_awards_id_fk` FOREIGN KEY (`award_id`) REFERENCES `awards`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `award_winners` ADD CONSTRAINT `award_winners_winner_team_id_teams_id_fk` FOREIGN KEY (`winner_team_id`) REFERENCES `teams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `award_winners` ADD CONSTRAINT `award_winners_winner_user_id_users_id_fk` FOREIGN KEY (`winner_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `awards` DROP COLUMN `winner_team_id`;--> statement-breakpoint
ALTER TABLE `awards` DROP COLUMN `winner_user_id`;--> statement-breakpoint
ALTER TABLE `awards` DROP COLUMN `winner_name`;