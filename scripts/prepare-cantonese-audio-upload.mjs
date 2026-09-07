import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const sourceDir = '/home/ubuntu/webdev-static-assets/cantonese-word-audio';
const targetDir = '/home/ubuntu/webdev-static-assets/cantonese-word-audio-upload';
const terms = JSON.parse(await readFile(resolve(projectRoot, 'client/src/data/terms.json'), 'utf8'));

await mkdir(targetDir, { recursive: true });

const manifest = {};
for (const [index, item] of terms.entries()) {
  const filename = `word-${String(index + 1).padStart(3, '0')}.mp3`;
  await copyFile(resolve(sourceDir, `${item.level}-${item.term}.mp3`), resolve(targetDir, filename));
  manifest[item.term] = filename;
}

await writeFile(resolve(targetDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`已建立 ${terms.length} 個 ASCII 檔名的粵語音檔。`);
