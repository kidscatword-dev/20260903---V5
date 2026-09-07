# 中文認字樂：免登入付款、Firestore 排行榜及全屏交付指南

本版本採用**第 1 級免費、第 2 至第 10 級以 HK$48 一次性家庭完整解鎖**。購買不要求 Manus OAuth；家長勾選同意後，由 Android Google Play 顯示付款確認及裝置指紋、臉部辨識或 PIN 驗證。

## 已包含的最新改動

`server/billing.ts` 使用匿名 `installId` 及 Google Play purchase token 做伺服器核實，核實成功後才授予 `family_full_unlock`。`client/src/pages/Home.tsx` 會在完成配對時送出 installId、本機名字和訪客 ID；`client/src/lib/familyUnlock.ts` 只接受伺服器核實標記作離線解鎖依據。

圖片文字配對排行榜現在由 `server/social.ts` 接到 `server/firebaseLeaderboard.ts`。Firebase 設定有效時，成績會寫入 Firestore 的 `pictureMatchLeaderboard`，名字佔用記錄寫入 `pictureMatchNameClaims`。伺服器以交易方式檢查名字是否已被其他玩家佔用；同一玩家可以保存自己的原名字，其他玩家使用相同名字會收到「這個名字已有人使用」。未付款玩家即使在本機輸入名字，上榜時仍由伺服器強制顯示 `訪客XXXX`；已核實付款玩家才會顯示自訂名字。未完成 Firebase 設定時，程式會保留原有 MySQL fallback，不會假裝已同步到 Firestore。

`client/src/components/PictureMatchLeaderboard.tsx` 新增本機名字輸入和保存；`client/src/lib/localPlayerProfile.ts` 使用 `local_player_name` 保存名字。這個本機名字不是付款證明，伺服器會重新檢查 installId 的已核實權益。

## Firebase 設定

Firestore Rules 已放在 `firestore.rules`：客戶端只可讀取公開排行榜，不可直接寫入分數或名字；所有寫入由 Node/tRPC 伺服器使用 Firebase Admin SDK 執行。`firestore.indexes.json` 已一併提供。

伺服器可讀取以下其中一個 secret：

| Secret | 內容 |
|---|---|
| `FIREBASE_PROJECT_ID` | `kids-cat-word` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | 完整 Firebase Admin service-account JSON |
| `FIREBASE_SERVICE_ACCOUNT_JSON_BASE64` | 整個 JSON 檔案的 Base64 單行內容；當安全欄位改寫 PEM 換行時使用 |

不要把 JSON、Base64、private key、upload keystore、`.jks`、密碼或 `google-services.json` 放入 ZIP、GitHub、Android App 或前端。若直接輸入 JSON 導致 `private_key` 的 BEGIN／END 標記被改寫，請在 Windows PowerShell 使用以下指令把原始檔案轉成 Base64，再把結果輸入 `FIREBASE_SERVICE_ACCOUNT_JSON_BASE64`：

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\你的路徑\kids-cat-word-firebase-adminsdk-fbsvc-0a27b4cbb1.json")) | Set-Clipboard
```

目前程式檢查環境中的 Firebase secret；若沒有有效 secret，仍可通過本地建置和單元測試，但不能聲稱已完成真實 Firestore 連線驗證。你稍後在正式 server 的 Secrets 頁面輸入即可。

## 全屏改動及涉及檔案

這次的「不用手機框」主要是網頁 App 的 CSS 外層，不是 Android 原生 WebView 框。已修改：

| 檔案 | 改動 |
|---|---|
| `client/src/pages/Home.tsx` | 共用 `Shell`、首頁及完成頁移除 `max-w-md`、紫灰色外框、圓角和外層陰影 |
| `client/src/components/WordGames.tsx` | 遊戲 `GameShell` 移除手機式 `max-w-md` 限制，改為佔用全寬 |
| `client/src/components/PictureMatchLeaderboard.tsx` | 排行榜 loading／錯誤／主畫面改為全寬 |
| `android/app/src/main/res/layout/activity_main.xml` | 原本已是 `match_parent`，不需要再加手機框 |
| `android/app/src/main/java/com/fantichinese/wordlibrary/MainActivity.java` | 原本只是 `BridgeActivity`，沒有額外手機框邏輯，不需要修改 |
| `capacitor.config.ts` | 保留正式網域載入及 plugin 設定；它不是手機框來源 |

Android 原生 status bar／navigation bar 仍可能顯示，這與「沒有紫色手機框」不同；本次沒有強制隱藏系統導覽列，以免影響返回及可用性。

## Google Play 商品

在 `com.fantichinese.wordlibrary` 建立一次性 non-consumable product：Product ID 為 `family_full_unlock`，香港價格 HK$48，App 下載價格為免費。商品必須啟用並加入封閉測試軌道，測試者需從 Google Play 測試連結安裝，而不是直接安裝 debug APK。

## 你在 Windows 自行建置 AAB

在專案根目錄執行：

```text
pnpm install
pnpm approve-builds
pnpm rebuild
pnpm build
npx cap sync android
```

之後在 Android Studio 開啟 `android` 資料夾，使用 JDK 21、SDK Platform 35 和 Build-Tools 35.x。`android/local.properties` 每部電腦不同，本交付包不包含它；Android Studio 會按你的 SDK 路徑重新建立。使用你自己保管的 upload keystore 產生 signed release AAB，並遞增 versionCode；不要把 keystore 或密碼交給程式包。

## 檢查結果

最新程式已通過 TypeScript 檢查、相關 Vitest、production build 及 Capacitor Android sync。由於 sandbox 沒有 Android SDK，沒有在這裡產生或簽署 AAB；你應在自己的 Android Studio 內完成最後的 Signed Bundle 建置。
