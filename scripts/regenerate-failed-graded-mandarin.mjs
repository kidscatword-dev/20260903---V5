/** 補製批量產生時失敗的單一普通話音檔。 */
import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";

const target = "/home/ubuntu/webdev-static-assets/unique-graded-audio/mandarin/graded-168.mp3";
await new Promise((resolveTask, rejectTask) => {
  const child = spawn("edge-tts", ["--voice", "zh-CN-XiaoxiaoNeural", "--rate=-8%", "--text", "乾媽", "--write-media", target]);
  let stderr = "";
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  child.on("error", rejectTask);
  child.on("close", (code) => code === 0 ? resolveTask() : rejectTask(new Error(stderr)));
});
const file = await stat(target);
if (file.size < 1024) throw new Error(`補製錄音無效，檔案只有 ${file.size} bytes。`);
console.log(`乾媽普通話錄音已補製：${file.size} bytes`);
