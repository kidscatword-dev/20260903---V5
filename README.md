# 字詞探索站

「繁體認字樂」是一個手機優先的香港繁體中文認字 App，服務香港、台灣及海外華人家庭。它把 **870 筆分級主題詞彙**放進孩子易於理解的流程：首頁、初級／中級／高級、主題類別、每節十詞的專注認字頁，以及可持久保存的溫習庫。每個收錄字詞都保留粵拼、普通話拼音、難度及主題標籤，並可播放固定香港粵語或普通話錄音。

## 功能概覽

| 功能 | 說明 |
|---|---|
| 首頁與學習模式 | 閱讀小貓首頁提供「開始遊戲」、「練習模式」及溫習庫入口，並用分級軌道、示範字卡和聲音提示呈現學習方法。 |
| 難度與類別流程 | 先選初級、中級或高級，再顯示共用分類與相應難度專屬分類；初級有玩具與交通工具，中級有學校、職業與運動，高級有自然、情緒進階與社會。七個共用主題會按難度重新分配不重複詞語。 |
| 專注認字頁 | 以超大繁體字為核心，不加入干擾圖片或例句；每節固定十詞，提供粵語、普通話兩個獨立讀音按鈕、粵拼、普通話拼音、進度與收藏星號。完成十詞後，會顯示小貓鼓勵頁並返回類別頁。 |
| 溫習庫 | 孩子可在每張認字卡按星號收藏字詞；收藏資料寫入瀏覽器 `localStorage`，在同一裝置重新開啟網站仍可重溫與移除。 |
| 固定雙語錄音 | 870 個唯一字詞均有香港粵語及普通話 MP3；播放時不依賴瀏覽器自動選聲。 |
| 遊戲樂園 | 「開始遊戲」會先進入遊戲樂園；第一項是原有地圖闖關，另有圖片文字配對、聽音揀字、拆字拼拼樂、溫習庫闖關小測驗、找錯字及填字小空格。圖片文字配對使用可翻開的圖畫與繁體文字卡；答對後播放固定粵語讀音與正向聲效。 |
| 自由輸入 | 搜尋完整主題詞庫；未收錄字詞則顯示本地粵拼索引及普通話拼音後備結果。 |

## 本機運行

本專案使用 React、Vite 與 Tailwind CSS。請先安裝 Node.js 20 或以上版本，再於專案根目錄執行：

```bash
pnpm install
pnpm dev
```

雙語音檔已上傳至網站資產儲存；只要裝置允許網站播放聲音，即可使用，毋須安裝系統粵語或普通話語音。

## 生產建置

```bash
pnpm check
pnpm build
pnpm start
```

`pnpm build` 會將靜態前端建置至 `dist/public`。本專案毋須資料庫或伺服器端 API。

## 部署

| 平台 | 設定 |
|---|---|
| Vercel | Build Command：`pnpm build`；Output Directory：`dist/public`；Install Command：`pnpm install --frozen-lockfile`。 |
| Netlify | Build command：`pnpm build`；Publish directory：`dist/public`。若日後加入路由，請加入 SPA fallback 規則。 |
| GitHub Pages | 在 CI 安裝依賴並執行 `pnpm build`，然後將 `dist/public` 發佈；非根目錄網域須在 Vite 設定正確 `base`。 |

## 資料結構與替換方式

主題詞彙儲存於 `client/src/data/terms.json`。每個項目採用以下格式：

```json
{
  "term": "蘋果",
  "jyutping": "ping4 gwo2",
  "pinyin": "píng guǒ",
  "level": "preschool",
  "category": "food",
  "topic": "food"
}
```

`category` 支援 `food`、`emotion`、`animal`、`color`、`body`、`nature`、`school`、`family`、`action`、`object` 及 `other`；`topic` 用於決定其顯示主題。三個難度各自在適用主題提供 30 筆字詞；全庫 870 筆詞語彼此不重複，並由 `scripts/build-30-word-curriculum.mjs` 強制驗證。完整清單可由 `scripts/export-vocabulary-list.mjs` 匯出至 `docs/詞庫完整清單.md`。日後如有已獲再發布權利的完整教育局字詞表，只須以相同欄位替換此檔，即可沿用現有主題分組與介面。

## 資料來源與授權說明

本版本**沒有匯入或轉載香港教育局完整字詞表**。教育局字詞表是香港小學詞彙的重要參考，但未找到可供整庫下載、再發布的公開 JSON 授權，因此本專案建立的是人工檢核的常用主題示範詞庫，而非教育局官方詞表。[1]

粵拼的單字後備索引及讀音核對使用香港語言學學會粵拼小組維護的 `jyutping-table`；該資料以 **CC BY 4.0** 發布，網站保留來源和署名。[2] Cifu 是一個香港粵語頻率詞庫，條目包括漢字及粵拼；它以 GPL-3.0 發布，故本專案只把它用作研究與詞彙候選參考，並不直接複製或分發其詞庫資料。[3]

普通話拼音後備轉換使用 `pinyin-pro`。收錄詞的雙語音檔分別使用 `zh-HK-HiuMaanNeural`（香港粵語）及 `zh-CN-XiaoxiaoNeural`（普通話）生成，然後作為靜態 MP3 資產發布；詳細技術選擇見 `cantonese_audio_notes.md` 與 `topic_lexicon_research.md`。[4] [5]

圖片文字配對的首批八張插圖來自 OpenMoji。所有表情與圖示由 OpenMoji 設計，依 **CC BY-SA 4.0** 使用，並於遊戲畫面與本 README 保留署名。[6]

## 參考資料

[1] [香港教育局：香港小學學習字詞表](https://www.edbchinese.hk/lexlist_ch/)  
[2] [香港語言學學會粵拼小組：jyutping-table（CC BY 4.0）](https://github.com/lshk-org/jyutping-table)  
[3] [Cifu：A frequency lexicon for Hong Kong Cantonese（GPL-3.0）](https://github.com/gwinterstein/Cifu)  
[4] [Microsoft Learn：Azure Speech language support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts)  
[5] [edge-tts 開源工具](https://github.com/rany2/edge-tts)
[6] [OpenMoji（CC BY-SA 4.0）](https://github.com/hfg-gmuend/openmoji)
