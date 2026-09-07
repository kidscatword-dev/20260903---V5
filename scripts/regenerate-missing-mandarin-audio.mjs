import { rename, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const outputDirectory = '/home/ubuntu/webdev-static-assets/expanded-word-audio/mandarin';
const finalPath = resolve(outputDirectory, 'word-026.mp3');
const temporaryPath = resolve(outputDirectory, 'word-026-rebuilt.mp3');

function createAudio() {
  return new Promise((resolveTask, rejectTask) => {
    const child = spawn('edge-tts', [
      '--voice', 'zh-CN-XiaoxiaoNeural',
      '--rate=-8%',
      '--text', '馬鈴薯',
      '--write-media', temporaryPath,
    ]);
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', rejectTask);
    child.on('close', (code) => {
      if (code === 0) {
        resolveTask();
        return;
      }
      rejectTask(new Error(stderr || `edge-tts exited with code ${code}`));
    });
  });
}

await createAudio();
const audioInfo = await stat(temporaryPath);
if (audioInfo.size === 0) {
  throw new Error('重新產生的普通話錄音仍然是空白檔案。');
}
await rename(temporaryPath, finalPath);
console.log(`已重新產生馬鈴薯普通話錄音：${audioInfo.size} bytes`);
