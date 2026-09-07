# 中文認字樂 v2｜簽署、Google Play 帳單設定及商店文案

> **目的與界線：** 此文件按 2026-08-28 的程式狀態整理。它可協助帳戶擁有人安全地在**自己的電腦**簽署 v2 AAB、建立 Google Play 的一次性產品，以及填寫商店資料；它**不會**建立或複製 upload keystore、收集密碼、建立付款設定檔、啟用產品、上傳 AAB、推出測試或發佈 App。以上每一步均須由帳戶擁有人在當日確認。

## 1. v2 現況與上架前仍未完成的事項

| 項目 | 現況 | 重要限制 |
|---|---|---|
| Android 版本 | `versionCode 2`、`versionName 2.0`、套件 `com.fantichinese.wordlibrary`。 | 日後每次重新上傳必須使用更高的 `versionCode`。 |
| Google Play Billing 程式 | 已加入 Android 購買橋接、家長確認、恢復購買及伺服器端 token 核實設計；原生相依套件為 Google Play Billing Library `9.0.0`。 | 尚未在真實 Google Play 商品／帳戶上測試。 |
| 內容權益 | 第 1 級維持免費；第 2–10 級的練習、地圖、收藏、查詞及溫習庫設有權益閘門。 | App 未設定商品前，付款入口會安全地保持不可用。 |
| 伺服器核實 | 只接受 Google 回覆的 `PURCHASED` 狀態及產品 ID `family_full_unlock`；購買 token 以雜湊查找及加密保存，並核對登入家長的匿名帳戶 ID。 | 尚未設定 `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`。 |
| upload keystore | 唯一上傳簽署金鑰已由帳戶擁有人離線保存。 | 不應重新建立、上傳到此專案、放入 GitHub／雲端普通資料夾或用訊息傳送。 |
| 正式網站 | Android 容器載入正式網站 `https://hkchineselib-mcq79f2x.manus.space`。 | v2 AAB 上測試付款前，Billing 網頁及伺服器程式亦要先經帳戶擁有人確認後儲存／發佈。 |

> **不可宣稱已可正式收費。** 仍需設定服務帳戶、一次性商品與付款設定檔，完成 Google Play 封閉測試購買／恢復購買，並補足退款／撤銷後撤回權益的運作流程後，才可考慮公開收費。

## 2. 在你的電腦簽署 v2 AAB

### 2.1 你需要準備的檔案

請在自己的電腦、加密磁碟或 USB 內備妥下列內容。**不要**把第 2 至 4 項傳給任何人或放進本文件所在的專案。

| 檔案／資料 | 用途 | 儲存規則 |
|---|---|---|
| v2 未簽署 AAB | 等待 upload keystore 簽署的 Android App Bundle。 | 可放在本機「待簽署」資料夾。 |
| 既有 upload keystore `.jks` | 證明更新屬於同一 Android App。 | 獨立離線保存。 |
| keystore 密碼及 key 密碼 | 解鎖 keystore／簽署金鑰。 | 與 `.jks` 分開保存；不要寫進指令、記事簿、Git 或雲端。 |
| key alias | 指定 keystore 內的簽署項目。 | 可用本機 `keytool` 查看；不要猜測。 |

### 2.2 先在本機建立 release AAB

請從完整原始碼根目錄執行以下指令。Windows 可在 Android Studio 的 Terminal／PowerShell 執行；macOS 可在 Terminal 執行。指令中的 Java 與 Android SDK 路徑請按你的電腦調整。

```bash
pnpm install
pnpm vitest run
pnpm check
pnpm build
pnpm exec cap sync android
cd android
./gradlew bundleRelease
```

完成後，通常會在以下位置產生**未簽署**檔案：

```text
android/app/build/outputs/bundle/release/app-release.aab
```

請先確認 `android/app/build.gradle` 仍是：

```text
applicationId "com.fantichinese.wordlibrary"
versionCode 2
versionName "2.0"
```

若 Play Console 已有更高的版本代號，必須先把 `versionCode` 增加為較大正整數才可重新建立 AAB。[1]

### 2.3 不把密碼寫入指令的簽署方法

先從你的電腦離線讀取 alias；系統會提示輸入密碼，因此密碼不會出現在指令歷史中：

```bash
keytool -list -keystore "/你的安全路徑/中文認字樂-upload.jks"
```

記下顯示的 alias 後，以 `jarsigner` 對 AAB 簽署。請保留引號和互動式密碼提示，不要把密碼加在參數後面：

```bash
jarsigner -verbose \
  -keystore "/你的安全路徑/中文認字樂-upload.jks" \
  -signedjar "中文認字樂-v2.0-release-signed.aab" \
  "android/app/build/outputs/bundle/release/app-release.aab" \
  "你的-key-alias"
```

再驗證簽署並記錄檢查碼：

```bash
jarsigner -verify -verbose -certs "中文認字樂-v2.0-release-signed.aab"
sha256sum "中文認字樂-v2.0-release-signed.aab"
```

只有上述驗證沒有錯誤時，`中文認字樂-v2.0-release-signed.aab` 才是可供 Google Play 上傳的候選檔。Google Play 更新需要維持相同 package name、相同 upload key 與遞增的 version code。[1]

### 2.4 簽署前後的安全檢查

| 必須做 | 不應做 |
|---|---|
| 核對 `versionCode`、套件名稱、檔案 SHA-256 及簽署驗證結果。 | 為方便而重新建立 upload keystore；新金鑰不能簽署現有 App 的更新。 |
| 只交出 signed AAB 作 Play Console 上傳。 | 將 `.jks`、密碼、alias 密碼或服務帳戶 JSON 放進 ZIP、GitHub、Google Drive 一般資料夾或聊天。 |
| 先以封閉測試及授權測試帳戶驗證。 | 未測試便上傳正式版本或啟用真實商品。 |

## 3. 設定 Google Play Developer API 服務帳戶

伺服器核實購買 token 時，會以 Google Play Developer API 讀取 `productsv2` 購買狀態及確認購買。因此服務帳戶只可在後端秘密設定內使用，**不能**放到 Android App、React 網頁程式或原始碼。[2]

### 3.1 Console 操作次序

1. 在 Google Cloud Console 建立或選擇一個專用 Cloud 專案，例如「中文認字樂 Play Billing」。
2. 到 **API 和服務** → **啟用 API 和服務**，啟用 **Google Play Developer API**（Android Publisher API）。[2]
3. 到 **IAM 與管理** → **服務帳戶**，建立一個只供伺服器使用的服務帳戶；記下其電郵地址，例如 `play-billing@你的專案.iam.gserviceaccount.com`。
4. 只在確定要配置伺服器時建立 JSON 金鑰；下載後立即放在你自己的加密本機位置。不要以電郵、聊天室、GitHub 或 Drive 傳送。
5. 到 Play Console → **使用者和權限** → **邀請新使用者**，填入該服務帳戶電郵並授予 Google 官方指定的兩項權限：**查看財務資料、訂單和取消調查回覆**，以及 **管理訂單和訂閱**。[2]
6. 在服務帳戶 JSON 已安全保存後，才把 JSON 的完整內容以專案的受保護秘密設定輸入 `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`。此步驟應由帳戶擁有人確認後才進行；不要在聊天貼出 JSON。

> 如果服務帳戶權限或秘密設定未完成，App 顯示「付款測試仍在設定中」是正確的保護行為；不應繞過它。

## 4. 建立 HK$48「家庭完整解鎖」一次性產品

產品資料一經啟用便牽涉收款、退款與客服責任；請先完成第 3 節服務帳戶和第 5 節授權測試準備，再由帳戶擁有人確認是否建立。

| Play Console 欄位 | 應填內容 |
|---|---|
| 導覽 | **透過 Play 營利** → **產品** → **單次產品** → **建立單次產品**。 |
| 產品 ID | `family_full_unlock`。必須與 App 及伺服器程式完全一致；建立後不要以另一個相似 ID 取代。 |
| 名稱 | `家庭完整解鎖`。 |
| 產品說明 | `一次性解鎖第 2 至第 10 級的認字練習、地圖闖關、字卡收藏、查詞及溫習內容。不是訂閱。` |
| 購買選項 ID | 使用清楚而穩定的英文 ID，例如 `permanent_unlock`。 |
| 購買類型 | 選 **購買**；不要選「租借」。 |
| 商品性質 | 選 **數碼內容**。 |
| 香港價格 | 只把香港設為供應，定價 **HK$48**。如日後擴展市場，再逐一設定當地供應與價格。 |
| 啟用狀態 | 建立後先再次檢查資料，再啟用購買選項；草稿產品不會回傳給 Play Billing。 |

Google 現行「單次產品」模型由產品、購買選項及優惠組成；每個產品最少需要一個購買選項。只有有效的購買選項會由 Play Billing 回傳。[3]

**App 下載價錢應繼續保持「免費」。** 收費的是上述一次性數碼解鎖，而不是把整個 App 改為付費下載。這樣才保留第 1 級完整免費試玩與家長才可購買的設計。

### 4.1 對家長的權益說明

「家庭完整解鎖」是商品名稱，不應聲稱可讓多個不同 Google／家長帳戶自動共享。現有程式會把 Google Play 交易與**已登入的家長帳戶**作匿名綁定，方便同一帳戶的購買核實與恢復。真正跨家庭成員共享、退款自動撤權及客服帳戶轉移，均需另外設計、測試及更新私隱政策後才可承諾。

## 5. 授權測試、封閉測試及付款驗證

授權測試帳戶可使用 Google Play 測試付款方式，不會有真實扣款；一般封閉測試使用者則可能出現真實付款方式，因此測試購買應只使用授權帳戶。[4] [5]

1. 在 Play Console → **設定** → **授權測試**，以私人電郵清單或 Google 群組加入負責付款測試的成人帳戶；帳戶擁有人本身預設為授權測試員。[5]
2. 讓測試 Google 帳戶先加入現有封閉測試，再從同一 Google 帳戶的 Play 商店安裝 signed v2 AAB。測試軌道的發佈及測試者加入都須由帳戶擁有人另行確認。
3. Android 裝置上用同一個測試 Google 帳戶下載／安裝 App。裝置有多個 Google 帳戶時，購買一般會使用下載 App 的帳戶。[4]
4. 在 App 內進入第 2 級，確認先顯示家長登入及成人確認，再顯示 `家庭完整解鎖` 的本地化價格。
5. 以「測試付款工具：一律批准」完成一次購買。伺服器應只在 Google 回覆 `PURCHASED`、產品 ID 正確及匿名家長身份吻合時開放第 2–10 級。
6. 關閉及重新開啟 App，使用「恢復購買」；同一帳戶應重新取得權益。以另一個登入家長帳戶嘗試同一 token 時，系統應拒絕綁定。
7. 測試取消、拒絕與延遲付款；在這些情況下不可開放權益。非消耗型產品亦應驗證不能重複購買。Google 文件指出，測試多次同一非消耗型產品時，可先在 Console 退款並撤銷測試購買。[4]

| 測試情境 | 預期結果 |
|---|---|
| 未登入家長點選第 2 級 | 只顯示鎖定與前往家長區，不會開啟付款。 |
| 已登入但未勾選成人確認 | 購買鍵不可用。 |
| 服務帳戶或商品尚未設定 | 顯示設定中，不會模擬解鎖。 |
| 已批准測試購買 | 伺服器核實後，開放第 2–10 級。 |
| 取消／拒絕／待處理購買 | 不開放任何付費級別。 |
| 重開 App／恢復購買 | 同一已核實家長帳戶可恢復權益。 |
| 不同家長帳戶 | 不可拿另一帳戶的 token 解鎖。 |

## 6. Google Play 商店資料及宣傳文案

以下文字只應在 v2 付款功能、私隱權政策及資料安全聲明均與實際行為一致時使用。商店截圖與 App 內容亦必須一致，不要把尚未推出的功能寫入商店資料。

### 6.1 商店基本資料

| 欄位 | 建議內容 |
|---|---|
| App 名稱 | `中文認字樂` |
| 主要語言 | 中文（香港） |
| 類別 | 教育 |
| 私隱權政策 | `https://hkchineselib-mcq79f2x.manus.space/privacy` |
| 短描述 | `以粵語及普通話陪孩子認讀香港常用繁體字詞，邊學邊玩地圖闖關與收集字卡。` |

### 6.2 長描述（可直接貼上）

```text
中文認字樂是一個為香港小朋友而設、以香港繁體中文為主的認字學習 App。孩子可以在輕鬆的遊戲流程中，看一看、聽一聽、說一說，逐步認讀常用字詞。

主要功能：
• 香港繁體字詞學習：按級別與主題認讀常用詞語。
• 粵語及普通話讀音：可按需要選擇聆聽字詞讀音。
• 練習模式：以清楚大字及循序步驟，協助孩子專心認字。
• 地圖闖關：完成題目、累積進度，探索不同學習主題。
• 字卡收藏：完成挑戰後收集主題字卡，重溫已學內容。
• 圖片文字配對：在圖畫與詞語配對中加深記憶。
• 繁／简閱讀切換：只切換實際學習詞語的字形，介面與操作說明維持香港繁體中文。

第 1 級可免費使用，讓家長和孩子先試玩學習流程。家長如希望開放第 2 至第 10 級，可在家長專區以一次性「家庭完整解鎖」取得額外學習內容；此項目不是訂閱。

中文認字樂重視孩子的學習節奏。請由家長陪同孩子使用，並於購買或登入前閱讀 App 內的提示及私隱權政策。
```

### 6.3 付款項目顯示文案

| 使用位置 | 建議文字 |
|---|---|
| 家長專區主標題 | `家庭完整解鎖` |
| 價格旁說明 | `一次性購買，不是訂閱。` |
| 內容說明 | `解鎖第 2 至第 10 級的認字練習、地圖闖關、字卡收藏、查詞及溫習內容。` |
| 購買前提示 | `請由家長確認後購買。付款由 Google Play 安全處理。` |
| 恢復按鈕 | `恢復購買` |
| 客服／恢復說明 | `請使用原先購買時的 Google Play 帳戶，並登入相同的家長帳戶後恢復購買。` |

### 6.4 宣傳貼文草稿

**家長群組／社交平台短文：**

```text
想讓孩子用熟悉的粵語和普通話，一步步認讀香港繁體字詞？

「中文認字樂」把認字練習、地圖闖關、字卡收藏和圖片文字配對放進同一個孩子容易操作的學習流程。第 1 級可免費試玩，讓家長先陪孩子看看是否合適。

立即下載，一齊看一看、聽一聽、說一說。
```

**商店更新說明（v2 草稿）：**

```text
新增家長專區及「家庭完整解鎖」基礎流程：第 1 級維持免費，第 2 至第 10 級可由家長以 Google Play 一次性購買開放；同步加入恢復購買及更嚴格的伺服器端交易核實設計。
```

## 7. 本輪尚不可執行的動作

下列動作均有不可逆或實際外部後果，應逐項取得帳戶擁有人當日明確確認後才進行：

| 動作 | 為何要先確認 |
|---|---|
| 儲存／發佈 Billing 網站與伺服器程式 | 本專案每次儲存版本會自動更新正式網站。 |
| 建立 Cloud 專案、服務帳戶與 JSON 金鑰 | 會建立長期外部身份及私密憑證。 |
| 設定 `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | 會把有 API 權限的秘密部署到伺服器。 |
| 建立付款設定檔 | 涉及法定商家資料、稅務與收款安排。 |
| 建立／啟用 `family_full_unlock` | 建立日後可售的數碼商品。 |
| 簽署／上傳 v2 AAB、推出封閉測試 | 會產生可安裝版本並影響測試流程。 |
| 進行 Play 測試購買 | 會建立可驗證的 Google Play 測試交易。 |

## 參考資料

[1] [Version your app｜Android Developers](https://developer.android.com/studio/publish/versioning)

[2] [Getting Started｜Google Play Developer API](https://developers.google.com/android-publisher/getting_started)

[3] [單次產品概覽｜Google Play 管理中心說明](https://support.google.com/googleplay/android-developer/answer/16430488?hl=zh-HK)

[4] [Test your Google Play Billing Library integration｜Android Developers](https://developer.android.com/google/play/billing/test)

[5] [透過應用程式授權測試應用程式內結帳功能｜Google Play 管理中心說明](https://support.google.com/googleplay/android-developer/answer/6062777?hl=zh-HK)
