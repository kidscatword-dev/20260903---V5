# 遊戲素材

**美術方向：**溫和米白紙張底、深墨藍文字、柚子黃主要行動、薄荷綠完成狀態，搭配閱讀小貓、貼紙式 Emoji、圓角字卡與繪本探險地圖；符合日系兒童教育編輯設計和香港校園文具美學。

| 素材 | 位置 | 用途 |
| --- | --- | --- |
| 閱讀小貓 | `/manus-storage/reading-cat-mascot_e03e748c.png` | 首頁及遊戲選單引導 |
| 豎拇指小貓 | `/manus-storage/cat-thumbs-up-celebration_80ef4ef4.png` | 遊戲答對與完成鼓勵 |
| 初級地圖 | `client/src/index.css` 的 `map-campaign.beginner` | 以天空、果園色帶、雲朵、山丘與主題 Emoji 組成九個生活主題的穩定繪本場景。 |
| 中級地圖 | `client/src/index.css` 的 `map-campaign.intermediate` | 以校園綠地、雲朵、山丘與主題 Emoji 組成十個生活及校園主題場景。 |
| 高級地圖 | `client/src/index.css` 的 `map-campaign.advanced` | 以森林色帶、雲朵、山丘與主題 Emoji 組成十個進階主題場景。 |
| 字詞圖像 | Unicode Emoji | 作為主題陸地及題目選項的高辨識提示。 |
| 字卡拼圖紋理 | `/manus-storage/word-card-puzzle-pattern_71866039.png` | 五片字卡拼圖在已收集狀態使用的繪本紙材與星星、書頁、聲波紋理；繁體字與主題圖示由介面疊加，保持清晰可讀。 |
| 食物三級字卡原圖 | `/manus-storage/food-three-level-card_e5714c68.png` | 使用者提供的橫向原圖；收藏冊依序展示左側初級 LV.1、中間中級 LV.2、右側高級 LV.3，原始插畫不作內容修改。 |
| 心情三級字卡原圖 | `/manus-storage/emotion-three-level-card_7789a6da.png` | 使用者提供；依序展示左側初級 LV.1、中間中級 LV.2、右側高級 LV.3。 |
| 動物三級字卡原圖 | `/manus-storage/animal-three-level-card_6f0cd97e.png` | 使用者提供；依序展示左側初級 LV.1、中間中級 LV.2、右側高級 LV.3。 |
| 顏色三級字卡原圖 | `/manus-storage/color-three-level-card_3fa28502.jpg` | 使用者提供；依序展示左側初級 LV.1、中間中級 LV.2、右側高級 LV.3。 |
| 身體三級字卡原圖 | `/manus-storage/body-three-level-card_04a5a23e.jpg` | 使用者提供；依序展示左側初級 LV.1、中間中級 LV.2、右側高級 LV.3。 |
| 家庭三級字卡原圖 | `/manus-storage/family-three-level-card_858f8cff.png` | 使用者提供；依序展示左側初級 LV.1、中間中級 LV.2、右側高級 LV.3。 |
| 日常用品三級字卡原圖 | `/manus-storage/object-three-level-card_e90fc0e1.png` | 使用者提供；依序展示左側初級 LV.1、中間中級 LV.2、右側高級 LV.3。 |

## 使用者提供的專屬主題字卡

| 主題 | 級別 | 儲存位置 |
| --- | --- | --- |
| 玩具 | 初級 | `/manus-storage/toy-junior_f7fa5d20.png` |
| 交通工具 | 初級 | `/manus-storage/transport-junior_c2c8f32a.png` |
| 學校 | 中級 | `/manus-storage/school-middle_62ccaa9a.png` |
| 職業 | 中級 | `/manus-storage/career-middle_924cf7d1.png` |
| 運動 | 中級 | `/manus-storage/sports-middle_a5579f3d.png` |
| 自然 | 高級 | `/manus-storage/nature-senior_db001a00.png` |
| 情緒進階 | 高級 | `/manus-storage/advanced-emotion-senior_e284dbd1.png` |
| 社會 | 高級 | `/manus-storage/society-senior_b43abf28.png` |

> 原規劃的生成地圖背景在預覽時未能產出可用檔案，故目前改採 CSS 繪本場景，避免出現失敗圖片及確保即時載入。地圖背景不包含文字、數字或題目；程式在安全留白位置疊加可存取的主題名稱、關卡、星數與鎖定狀態。
