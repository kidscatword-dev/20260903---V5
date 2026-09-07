CREATE TABLE `familyProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(24) NOT NULL,
	`friendCode` varchar(12) NOT NULL,
	`avatarEmoji` varchar(12) NOT NULL DEFAULT '🐱',
	`learningStars` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `familyProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `familyProfiles_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `familyProfiles_friendCode_unique` UNIQUE(`friendCode`)
);
--> statement-breakpoint
CREATE TABLE `friendConnections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requesterProfileId` int NOT NULL,
	`addresseeProfileId` int NOT NULL,
	`status` enum('pending','accepted','declined','blocked') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`respondedAt` timestamp,
	CONSTRAINT `friendConnections_id` PRIMARY KEY(`id`),
	CONSTRAINT `friendConnections_pair_unique` UNIQUE(`requesterProfileId`,`addresseeProfileId`)
);
--> statement-breakpoint
CREATE TABLE `safeMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderProfileId` int NOT NULL,
	`recipientProfileId` int NOT NULL,
	`messageKey` enum('cheer','greatJob','letsPlay','star','wave') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `safeMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
