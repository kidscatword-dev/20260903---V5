import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 每個登入家長對應一個家庭學習檔案。排行榜只會讀取此處的自訂暱稱與星星，
 * 不會公開 OAuth 名稱或電郵。
 */
export const familyProfiles = mysqlTable("familyProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  displayName: varchar("displayName", { length: 24 }).notNull(),
  friendCode: varchar("friendCode", { length: 12 }).notNull(),
  avatarEmoji: varchar("avatarEmoji", { length: 12 }).notNull().default("🐱"),
  learningStars: int("learningStars").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("familyProfiles_friendCode_unique").on(table.friendCode)]);

/**
 * 好友請求必須由雙方確認。拒絕與封鎖狀態不會出現在排行榜或安全短句收件人中。
 */
export const friendConnections = mysqlTable("friendConnections", {
  id: int("id").autoincrement().primaryKey(),
  requesterProfileId: int("requesterProfileId").notNull(),
  addresseeProfileId: int("addresseeProfileId").notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "declined", "blocked"]).notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  respondedAt: timestamp("respondedAt"),
}, (table) => [uniqueIndex("friendConnections_pair_unique").on(table.requesterProfileId, table.addresseeProfileId)]);

/**
 * 不儲存自由文字；只容許白名單短句／貼圖代號，避免孩子之間出現未審核聊天內容。
 */
export const safeMessages = mysqlTable("safeMessages", {
  id: int("id").autoincrement().primaryKey(),
  senderProfileId: int("senderProfileId").notNull(),
  recipientProfileId: int("recipientProfileId").notNull(),
  messageKey: mysqlEnum("messageKey", ["cheer", "greatJob", "letsPlay", "star", "wave"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * 家長可回報字詞、粵語或普通話讀音問題。資料只保存結構化問題類型及詞庫位置，
 * 不提供自由文字欄位，也不保存姓名、電郵或裝置識別資料。
 */
export const wordIssueReports = mysqlTable("wordIssueReports", {
  id: int("id").autoincrement().primaryKey(),
  term: varchar("term", { length: 32 }).notNull(),
  language: mysqlEnum("language", ["cantonese", "mandarin"]).notNull(),
  issueType: mysqlEnum("issueType", ["cantonese_audio", "mandarin_audio", "word_display", "other"]).notNull(),
  source: mysqlEnum("source", ["practice", "search", "review"]).notNull(),
  level: int("level"),
  mapId: varchar("mapId", { length: 8 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * 圖片文字配對只保存每個家庭的最佳有效完成成績。排行榜以家庭自訂暱稱及
 * 頭像顯示，絕不公開 OAuth 名稱、電郵、裝置資料或逐局遊戲紀錄。
 */
export const pictureMatchBestTimes = mysqlTable("pictureMatchBestTimes", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().unique(),
  durationSeconds: int("durationSeconds").notNull(),
  moves: int("moves").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * 未登入訪客只以瀏覽器本機建立的隨機代號保存一筆最佳成績。此表不保存姓名、
 * 電郵、頭像、裝置資訊或逐局紀錄；排行榜只會顯示由代號末段衍生的匿名編號。
 */
export const pictureMatchGuestBestTimes = mysqlTable("pictureMatchGuestBestTimes", {
  id: int("id").autoincrement().primaryKey(),
  guestId: varchar("guestId", { length: 16 }).notNull(),
  durationSeconds: int("durationSeconds").notNull(),
  moves: int("moves").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("pictureMatchGuestBestTimes_guestId_unique").on(table.guestId)]);

/**
 * 一個可由 Google Play 購買 token 恢復的永久「家庭完整解鎖」權益。只有伺服器核對
 * Google Play 的購買 token 後才會新增或更新此資料；前端不可自行寫入。
 */
export const familyEntitlements = mysqlTable("familyEntitlements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entitlementKey: varchar("entitlementKey", { length: 64 }).notNull(),
  source: mysqlEnum("source", ["google_play"]).notNull(),
  active: int("active").notNull().default(1),
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
  revokedAt: timestamp("revokedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("familyEntitlements_user_key_unique").on(table.userId, table.entitlementKey)]);

/**
 * 已被伺服器驗證的購買 token 雜湊。原始 token 不會寫進資料庫；唯一限制可
 * 防止同一筆 Google Play 購買被重複授權給不同帳戶。
 */
export const googlePlayPurchases = mysqlTable("googlePlayPurchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: varchar("productId", { length: 96 }).notNull(),
  purchaseTokenHash: varchar("purchaseTokenHash", { length: 64 }).notNull(),
  purchaseTokenCiphertext: text("purchaseTokenCiphertext").notNull(),
  orderId: varchar("orderId", { length: 128 }),
  purchaseState: mysqlEnum("purchaseState", ["purchased", "pending", "cancelled", "revoked"]).notNull(),
  acknowledgedAt: timestamp("acknowledgedAt"),
  purchaseTime: timestamp("purchaseTime"),
  verifiedAt: timestamp("verifiedAt").defaultNow().notNull(),
  revokedAt: timestamp("revokedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("googlePlayPurchases_token_hash_unique").on(table.purchaseTokenHash)]);

/**
 * 每個匿名 App 安裝的一次性付款識別碼。原生付款橋接只會把它的雜湊傳給
 * Google Play；它不代表 Manus 帳戶，也不保存姓名、電郵或裝置指紋。
 */
export const familyBillingProfiles = mysqlTable("familyBillingProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  billingIdentity: varchar("billingIdentity", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("familyBillingProfiles_user_unique").on(table.userId),
  uniqueIndex("familyBillingProfiles_identity_unique").on(table.billingIdentity),
]);

export type FamilyProfile = typeof familyProfiles.$inferSelect;
export type FriendConnection = typeof friendConnections.$inferSelect;
export type SafeMessage = typeof safeMessages.$inferSelect;
export type WordIssueReport = typeof wordIssueReports.$inferSelect;
export type PictureMatchBestTime = typeof pictureMatchBestTimes.$inferSelect;
export type PictureMatchGuestBestTime = typeof pictureMatchGuestBestTimes.$inferSelect;
export type FamilyEntitlement = typeof familyEntitlements.$inferSelect;
export type GooglePlayPurchase = typeof googlePlayPurchases.$inferSelect;
export type FamilyBillingProfile = typeof familyBillingProfiles.$inferSelect;
