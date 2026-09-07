import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const outputDir = '/home/ubuntu/webdev-static-assets/cantonese-word-audio';
const terms = JSON.parse(await readFile(resolve(projectRoot, 'client/src/data/terms.json'), 'utf8'));

await mkdir(outputDir, { recursive: true });

function runEdgeTts(term, outputPath) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn('edge-tts', [
      '--voice', 'zh-HK-HiuMaanNeural',
      '--rate=-8%',
      '--text', term,
      '--write-media', outputPath,
    ]);
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`edge-tts failed for ${term}: ${stderr}`));
    });
  });
}

const manifest = {};
for (const item of terms) {
  const filename = `${item.level}-${item.term}.mp3`;
  const outputPath = resolve(outputDir, filename);
  await runEdgeTts(item.term, outputPath);
  manifest[item.term] = filename;
  console.log(`已生成：${item.term}`);
}

await writeFile(resolve(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`完成 ${terms.length} 個粵語音檔。`);
