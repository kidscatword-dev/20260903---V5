CREATE TABLE `pictureMatchGuestBestTimes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guestId` varchar(16) NOT NULL,
	`durationSeconds` int NOT NULL,
	`moves` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pictureMatchGuestBestTimes_id` PRIMARY KEY(`id`),
	CONSTRAINT `pictureMatchGuestBestTimes_guestId_unique` UNIQUE(`guestId`)
);
