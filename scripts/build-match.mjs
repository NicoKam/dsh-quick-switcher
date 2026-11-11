import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
await mkdir(new URL('../lib/', import.meta.url), { recursive:true });
await build({
  entryPoints: [new URL('../string-match.js', import.meta.url).pathname],
  outfile: new URL('../lib/string-match.cjs', import.meta.url).pathname,
  bundle:true, platform:'browser', format:'cjs', target:'es2022', minify:true, legalComments:'inline',
});
const matcher = await readFile(new URL('../lib/string-match.cjs', import.meta.url), 'utf8');
const source = await readFile(new URL('../client-source.js', import.meta.url), 'utf8');
const marker = '    const React = require(\'react\');';
if (!source.includes(marker)) throw new Error('Client factory marker is missing');
const embedded = `    const StringMatch = (() => { const module = {exports:{}}; const exports = module.exports;\n${matcher}\nreturn module.exports; })();\n`;
await writeFile(new URL('../client.js', import.meta.url), source.replace(marker, embedded + marker));
