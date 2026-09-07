/**
 * Android App 以正式網站網域載入現有網頁版，
 * 讓固定雙語音檔、排行榜與收藏進度可原樣使用，並避免指向暫時性的開發預覽網址。
 */
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.fantichinese.wordlibrary",
  appName: "中文認字樂",
  webDir: "dist/public",
  server: {
    url: "https://hkchineselib-mcq79f2x.manus.space",
    cleartext: false,
    allowNavigation: ["hkchineselib-mcq79f2x.manus.space"],
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
