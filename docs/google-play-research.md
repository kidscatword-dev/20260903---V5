# Google Play 上架準備核對

最後核對：2026-08-27。

## 官方要求摘要

- 新 App 以已簽署的 Android App Bundle（`.aab`）提交；Google Play App Signing 是所有新 App 的必要流程。來源：[Upload your app to the Play Console](https://developer.android.com/studio/publish/upload-bundle)。
- 2023-11-13 後建立的個人 Play Console 帳戶，公開上架前必須完成封閉測試：至少 12 位測試者連續加入至少 14 日；之後才可申請正式發佈權限。來源：[App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)。
- 個人帳戶需提供及驗證開發者名稱、法定姓名、法定地址、聯絡電郵及電話，以及會於 Google Play 顯示的開發者電郵；開發者名稱可與法定姓名不同。若選擇收費，Google Play 會顯示完整地址。來源：[Required information to create a Play Console developer account](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en)。
- 商店頁須準備 App 圖示、簡短說明、功能圖片及截圖等宣傳素材；全部素材須遵守 Google Play 政策。來源：[Add preview assets to showcase your app](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)。
- Android 官方命令列工具可透過 `sdkmanager` 安裝所需套件；本專案 target SDK 為 36，需安裝 `platform-tools`、`platforms;android-36` 及 `build-tools;36.0.0`，並在無介面環境接受 SDK 授權。來源：[sdkmanager](https://developer.android.com/tools/sdkmanager)。
- 本應用程式的介面及用途明顯面向學童；若在 Play Console 的目標年齡選擇包含 13 歲以下兒童，便須遵守家庭政策，據實揭露所有資料收集與第三方 SDK，且不得用未獲准用於兒童服務的 SDK 處理兒童資料。現有原生包只要求網絡權限，沒有廣告或裝置識別碼權限；登入排行榜功能、訪客匿名編號及任何帳戶資料仍必須逐項核對。來源：[Google Play 家庭政策](https://support.google.com/googleplay/android-developer/answer/9893335?hl=zh-Hant)。
- 無論是否收集資料，封閉測試、公開測試及正式版均須如實填寫資料安全性表單並提供隱私權政策連結；內部測試可先不填該表單。來源：[在 Google Play 的資料安全性專區提供資訊](https://support.google.com/googleplay/android-developer/answer/10787469?hl=zh-Hant)。
- 已使用網站既有的閱讀小貓原始素材產生 512×512 PNG 商店圖示，並同步替換 Android 各密度啟動器圖示；圖示不包含誤導性按鈕或文字，能在小尺寸顯示小貓閱讀主視覺。

## 網頁版收費與 Android 版的分流注意事項

- 現有網站可直接供 iPhone Safari、Android 瀏覽器及電腦使用。網頁版可在取得使用者明確確認後接入由擁有者控制的付款服務，讓家長購買第 2–10 級的「家庭完整解鎖」。如要跨裝置還原權限，需以家長帳戶或經驗證的購買身分保存權限，不能只依賴瀏覽器本機儲存。
- Google Play 發佈的 Android App 內如直接販售第 2–10 級數碼內容或解鎖功能，原則上必須使用 Google Play Billing，而非在 App 內導向網頁付款。Google Play 官方指出，數碼內容、App 功能與 App 內新功能均屬應使用其帳單系統的類型。來源：[Understanding Google Play's Payments policy](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en)。
- 兒童導向 App 的付款入口不得以誤導、干擾遊戲、令人誤點或情緒操控的方式催促購買；較合適的設計是只在家長專區經成人確認後顯示解鎖選項。來源：[Google Play Families Policies](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en)。
- 因此，網頁版付款與 Google Play Android 版付款應視為兩條付款軌道：網頁版可讓 iPhone Safari 使用者購買及使用；Android App 上架時則另需 Google Play Billing 與伺服器端購買驗證。跨平台權限整合需在實作前再次按 Play Console 當時的政策與帳單功能確認。
