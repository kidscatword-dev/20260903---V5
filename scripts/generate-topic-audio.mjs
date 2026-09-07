import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const outputRoot = '/home/ubuntu/webdev-static-assets/topic-word-audio';
const terms = JSON.parse(await readFile(resolve(projectRoot, 'client/src/data/terms.json'), 'utf8'));
const voices = {
  cantonese: 'zh-HK-HiuMaanNeural',
  mandarin: 'zh-CN-XiaoxiaoNeural',
};

await Promise.all(Object.keys(voices).map((locale) => mkdir(resolve(outputRoot, locale), { recursive: true })));

function generateVoice(term, voice, outputPath) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn('edge-tts', ['--voice', voice, '--rate=-8%', '--text', term, '--write-media', outputPath]);
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolvePromise() : reject(new Error(`edge-tts failed for ${term}: ${stderr}`)));
  });
}

const tasks = terms.flatMap((item, index) => Object.entries(voices).map(([locale, voice]) => ({
  term: item.term,
  locale,
  voice,
  filename: `word-${String(index + 1).padStart(3, '0')}.mp3`,
})));

const concurrency = 4;
let cursor = 0;
async function worker() {
  while (cursor < tasks.length) {
    const task = tasks[cursor++];
    await generateVoice(task.term, task.voice, resolve(outputRoot, task.locale, task.filename));
    console.log(`${task.locale}: ${task.term}`);
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));

const manifest = Object.fromEntries(terms.map((item, index) => [item.term, `word-${String(index + 1).padStart(3, '0')}.mp3`]));
await writeFile(resolve(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`完成 ${tasks.length} 個固定語音檔。`);
