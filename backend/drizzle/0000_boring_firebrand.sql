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
CREATE TABLE `awards` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('AUTO','MANUAL') NOT NULL,
	`winner_type` enum('TEAM','INDIVIDUAL') NOT NULL,
	`quantity` tinyint NOT NULL DEFAULT 1,
	`prize` varchar(500),
	`display_order` tinyint NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `awards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `btc_scores` (
	`id` varchar(36) NOT NULL,
	`team_id` varchar(36) NOT NULL,
	`discipline` decimal(3,1) DEFAULT '0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `btc_scores_id` PRIMARY KEY(`id`),
	CONSTRAINT `btc_scores_team_id_unique` UNIQUE(`team_id`)
);
--> statement-breakpoint
CREATE TABLE `effort_votes` (
	`id` varchar(36) NOT NULL,
	`voter_id` varchar(36) NOT NULL,
	`candidate_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `effort_votes_id` PRIMARY KEY(`id`),
	CONSTRAINT `vote_unique_idx` UNIQUE(`voter_id`,`candidate_id`)
);
--> statement-breakpoint
CREATE TABLE `judge_scores` (
	`id` varchar(36) NOT NULL,
	`team_id` varchar(36) NOT NULL,
	`judge_number` tinyint NOT NULL,
	`idea_concept` decimal(4,1) DEFAULT '0',
	`choreography` decimal(4,1) DEFAULT '0',
	`synchronization` decimal(4,1) DEFAULT '0',
	`performance` decimal(4,1) DEFAULT '0',
	`costume` decimal(4,1) DEFAULT '0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `judge_scores_id` PRIMARY KEY(`id`),
	CONSTRAINT `judge_team_idx` UNIQUE(`team_id`,`judge_number`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`concept` varchar(255) NOT NULL,
	`color` varchar(7) NOT NULL,
	`display_order` tinyint NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('ADMIN','BTC_FSTYLE','MC','MEMBER') NOT NULL DEFAULT 'MEMBER',
	`team_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `award_winners` ADD CONSTRAINT `award_winners_award_id_awards_id_fk` FOREIGN KEY (`award_id`) REFERENCES `awards`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `award_winners` ADD CONSTRAINT `award_winners_winner_team_id_teams_id_fk` FOREIGN KEY (`winner_team_id`) REFERENCES `teams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `award_winners` ADD CONSTRAINT `award_winners_winner_user_id_users_id_fk` FOREIGN KEY (`winner_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `btc_scores` ADD CONSTRAINT `btc_scores_team_id_teams_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `effort_votes` ADD CONSTRAINT `effort_votes_voter_id_users_id_fk` FOREIGN KEY (`voter_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `effort_votes` ADD CONSTRAINT `effort_votes_candidate_id_users_id_fk` FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `judge_scores` ADD CONSTRAINT `judge_scores_team_id_teams_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_team_id_teams_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `vote_candidate_idx` ON `effort_votes` (`candidate_id`);