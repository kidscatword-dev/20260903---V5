CREATE TABLE `familyBillingProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`billingIdentity` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `familyBillingProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `familyBillingProfiles_user_unique` UNIQUE(`userId`),
	CONSTRAINT `familyBillingProfiles_identity_unique` UNIQUE(`billingIdentity`)
);
--> statement-breakpoint
CREATE TABLE `familyEntitlements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entitlementKey` varchar(64) NOT NULL,
	`source` enum('google_play') NOT NULL,
	`active` int NOT NULL DEFAULT 1,
	`grantedAt` timestamp NOT NULL DEFAULT (now()),
	`revokedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `familyEntitlements_id` PRIMARY KEY(`id`),
	CONSTRAINT `familyEntitlements_user_key_unique` UNIQUE(`userId`,`entitlementKey`)
);
--> statement-breakpoint
CREATE TABLE `googlePlayPurchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` varchar(96) NOT NULL,
	`purchaseTokenHash` varchar(64) NOT NULL,
	`purchaseTokenCiphertext` text NOT NULL,
	`orderId` varchar(128),
	`purchaseState` enum('purchased','pending','cancelled','revoked') NOT NULL,
	`acknowledgedAt` timestamp,
	`purchaseTime` timestamp,
	`verifiedAt` timestamp NOT NULL DEFAULT (now()),
	`revokedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `googlePlayPurchases_id` PRIMARY KEY(`id`),
	CONSTRAINT `googlePlayPurchases_token_hash_unique` UNIQUE(`purchaseTokenHash`)
);
