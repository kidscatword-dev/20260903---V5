import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const outputRoot = '/home/ubuntu/webdev-static-assets/expanded-word-audio';
const terms = JSON.parse(await readFile(resolve(projectRoot, 'client/src/data/terms.json'), 'utf8'));
const uniqueTerms = [...new Set(terms.map((item) => item.term))];
const voices = { cantonese: 'zh-HK-HiuMaanNeural', mandarin: 'zh-CN-XiaoxiaoNeural' };

await Promise.all(Object.keys(voices).map((locale) => mkdir(resolve(outputRoot, locale), { recursive: true })));

function makeAudio(term, voice, outputPath) {
  return new Promise((resolveTask, rejectTask) => {
    const child = spawn('edge-tts', ['--voice', voice, '--rate=-8%', '--text', term, '--write-media', outputPath]);
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', rejectTask);
    child.on('close', (code) => code === 0 ? resolveTask() : rejectTask(new Error(`${term}: ${stderr}`)));
  });
}

const tasks = uniqueTerms.flatMap((term, index) => Object.entries(voices).map(([locale, voice]) => ({ term, locale, voice, filename: `word-${String(index + 1).padStart(3, '0')}.mp3` })));
const concurrency = 6;
let cursor = 0;
const failures = [];
async function worker() {
  while (cursor < tasks.length) {
    const task = tasks[cursor++];
    try {
      await makeAudio(task.term, task.voice, resolve(outputRoot, task.locale, task.filename));
      console.log(`${task.locale}: ${task.term}`);
    } catch (error) {
      failures.push(`${task.locale}:${task.term}`);
      console.error(error.message);
    }
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
const manifest = Object.fromEntries(uniqueTerms.map((term, index) => [term, `word-${String(index + 1).padStart(3, '0')}.mp3`]));
await writeFile(resolve(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
if (failures.length) throw new Error(`共有 ${failures.length} 個語音檔失敗：${failures.join('、')}`);
console.log(`完成 ${uniqueTerms.length} 個字詞、${tasks.length} 個固定雙語音檔。`);
