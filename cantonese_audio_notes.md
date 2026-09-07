# 固定粵語音檔實作紀錄

本次修正不再依賴瀏覽器的 `speechSynthesis` 自動選聲，因為實際裝置可能把 `zh-HK` 錯配為普通話。固定錄音採用 Microsoft Edge 線上文字轉語音的香港粵語神經聲線 `zh-HK-HiuMaanNeural`，每個示範字詞各產生一個 MP3 檔，供字詞卡及小測驗直接播放。

| 項目 | 結果 |
|---|---|
| 粵語語言代碼 | `zh-HK`（Chinese, Cantonese, Traditional） |
| 已確認聲線 | `zh-HK-HiuGaaiNeural`、`zh-HK-HiuMaanNeural`、`zh-HK-WanLungNeural` |
| 本次選用 | `zh-HK-HiuMaanNeural`，女性、友善正向語調 |
| 產出數量 | 45 個分級字詞 MP3 |

來源：[Microsoft Azure Speech language support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts)；[edge-tts 專案](https://github.com/rany2/edge-tts)。
