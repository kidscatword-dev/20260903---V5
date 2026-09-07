# Firebase Firestore 排行榜研究筆記

研究日期：2026-09-01

## 官方資料

1. [Firestore Usage and limits](https://firebase.google.com/docs/firestore/quotas)：Firestore 免費層包括 1 GiB 儲存、每日 50,000 次文件讀取、每日 20,000 次文件寫入、每日 20,000 次刪除，以及每月 10 GiB outbound data transfer。配額按日計算，約於 Pacific Time 午夜重設；每個 Firebase／Google Cloud project 只提供一個免費 Firestore database。超出配額需啟用 Google Cloud billing。

2. [Authenticate with Firebase Anonymously Using JavaScript](https://firebase.google.com/docs/auth/web/anonymous-auth)：Firebase Anonymous Authentication 可以在不要求使用者輸入電郵、密碼或社交帳戶的情況下建立暫時匿名 UID，並讓 Firestore Security Rules 根據 request.auth.uid 保護資料。官方亦指出匿名帳戶可在日後連結至永久登入方式；若啟用 Identity Platform 的 automatic clean-up，匿名帳戶可能在 30 日後自動刪除。因此本 App 不應把匿名 Firebase UID 當作付款證明；付款資格仍必須由現有 Google Play server-side verification 決定。

## 對本 App 的設計結論

圖片文字配對排行榜可以使用 Firestore，但不能由手機直接相信「我已付款」欄位。建議排行榜寫入走伺服器 callable/API：伺服器接收成績、付款安裝 ID／購買權益狀態或 Firebase Auth 身份，重新驗證分數範圍與付款權益後才寫入 Firestore。讀取可使用 Firestore query 或由伺服器回傳排名。

已付款玩家的名字應保存為可修改的 displayName，並以付款安裝身份作為該玩家的穩定 owner key；未付款玩家只能使用由本機 guestId 產生的「訪客XXXX」。不能讓客戶端提交任意付費旗標或任意排行榜名稱而直接寫入公開 collection。

若採用 Firebase client SDK，建議至少使用 Anonymous Auth 取得 Firestore Rules 可辨識的 UID，再配合 App Check、Rules 的欄位白名單、分數上下限、寫入頻率限制及伺服器端排行榜重驗證。由於本 App 已有 Node/tRPC 後端，較安全及一致的方案是由後端使用 Firebase Admin SDK 寫入 Firestore，手機不持有服務帳戶私鑰；Firebase Web config 本身不是私鑰，但 service account JSON 必須只放在 server secret。

## 安全規則與 App Check 補充

3. [Writing conditions for Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/rules-conditions)：Firestore Security Rules 可按 `request.auth` 驗證身份及驗證寫入資料；官方提醒伺服器端 Firebase Admin SDK／REST／RPC client library 會繞過 Firestore Rules，伺服器因此必須自行做 IAM 及輸入驗證。排行榜若由後端寫入，不能只配置 Rules，必須在 tRPC 後端重驗證成績、名稱與付款狀態。

4. [Firebase App Check](https://firebase.google.com/docs/app-check)：App Check 透過 app／device attestation 協助阻止未授權 client 存取 Firebase backend；Android 支援 Play Integrity，Web 支援 reCAPTCHA Enterprise，Cloud Firestore 是支援服務之一。App Check 是降低濫用的額外防線，不是付款證明，也不能取代現有 Google Play purchase token server-side verification。

## 架構選擇

| 方案 | 取捨 | 成本 | 設定複雜度 |
| --- | --- | --- | --- |
| 直接由 App 使用 Firebase client SDK／Anonymous Auth 寫 Firestore | 開發較快，但需處理匿名 UID、Rules、App Check、成績濫用及跨 Web／Android 身份；任何公開客戶端排行榜都不能真正防止修改過的 App 偽造成績 | 可使用 Firestore 免費配額，但依每日讀寫及儲存配額而定；匿名 Auth 另有配額與帳戶清理考量 | 中 |
| 由現有 Node/tRPC 後端接收成績，伺服器驗證付費權益／訪客 ID 後用 Firebase Admin SDK 寫 Firestore | 最符合目前專案；手機不持有 service account 私鑰，付款判斷與排行榜寫入集中管理；需要新增 Firebase Admin secret 與 Firestore service layer | Firestore 仍受免費配額限制；伺服器運算由現有後端承擔 | 中至高 |
| 暫時保留現有 MySQL／匿名排行榜 | 最少改動，無需新的 Firebase 專案或 secret；但不是使用者要求的 Firestore，且目前 paid name 與既有 account profile 模型需要另外調整 | 沿用目前服務成本 | 低 |

目前較安全的建議是第二方案，但在正式接入前需要使用者提供 Firebase project ID／服務帳戶設定，或在 Firebase Console 建立新 project；絕不能猜測或把服務帳戶私鑰寫入程式碼。
