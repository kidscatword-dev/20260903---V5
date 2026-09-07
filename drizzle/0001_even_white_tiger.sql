CREATE TABLE `wordIssueReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`term` varchar(32) NOT NULL,
	`language` enum('cantonese','mandarin') NOT NULL,
	`issueType` enum('cantonese_audio','mandarin_audio','word_display','other') NOT NULL,
	`source` enum('practice','search','review') NOT NULL,
	`level` int,
	`mapId` varchar(8),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wordIssueReports_id` PRIMARY KEY(`id`)
);
