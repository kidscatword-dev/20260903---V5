import { readFile, writeFile } from 'node:fs/promises';

const [sourcePath, targetPath] = process.argv.slice(2);

if (!sourcePath || !targetPath) {
  throw new Error('Usage: node build-jyutping-map.mjs <source-json> <target-json>');
}

const records = JSON.parse(await readFile(sourcePath, 'utf8'));
const map = Object.fromEntries(
  records
    .filter((record) => record?.ch && Array.isArray(record.infoArray) && record.infoArray[0]?.jyutping)
    .map((record) => [record.ch, record.infoArray[0].jyutping]),
);

await writeFile(targetPath, `${JSON.stringify(map)}\n`, 'utf8');
console.log(`已建立 ${Object.keys(map).length} 個漢字的粵拼索引。`);
