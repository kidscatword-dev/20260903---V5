CREATE TABLE `pictureMatchBestTimes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`durationSeconds` int NOT NULL,
	`moves` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pictureMatchBestTimes_id` PRIMARY KEY(`id`),
	CONSTRAINT `pictureMatchBestTimes_profileId_unique` UNIQUE(`profileId`)
);
