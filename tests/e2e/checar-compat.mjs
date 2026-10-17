// Compatibilidade com navegadores mais antigos (alvo: Chrome/Edge 90+, Firefox 90+, Safari 15+ / iOS 15+).
// 1) Cada .js precisa ser JavaScript ES2021 válido (o que o Safari 15 entende), verificado com o parser acorn.
// 2) Recursos que esses navegadores NÃO têm são proibidos (ex.: lookbehind em regex só existe no Safari 16.4+).
// 3) Recursos de CSS recentes só podem aparecer como melhoria progressiva (sem eles, a página continua usável).
// Uso: node checar-compat.mjs
import fs from 'node:fs'; import path from 'node:path'; import { parse } from 'acorn';
const dist = path.join(path.dirname(new URL(import.meta.url).pathname), '../../dist');
let n = 0; const falhas = [];
const ok = (c, m) => { n++; if (!c) { falhas.push(m); console.log('  FALHOU:', m); } };
const PROIBIDO_JS = [[/\(\?<[=!]/, 'lookbehind em regex (Safari < 16.4)'], [/\.at\(/, 'Array.prototype.at (Safari < 15.4)'], [/structuredClone\(/, 'structuredClone (Safari < 15.4)'],
  [/Object\.hasOwn\(/, 'Object.hasOwn (Safari < 15.4)'], [/\.findLast(Index)?\(/, 'findLast (Firefox < 104)'], [/\.(toSorted|toReversed|toSpliced|with)\(/, 'métodos de cópia de array (2023)'], [/\bstatic\s*\{/, 'bloco static em classe']];
for (const f of fs.readdirSync(dist).filter(f => f.endsWith('.js'))) {
  const src = fs.readFileSync(path.join(dist, f), 'utf8');
  let err = null; try { parse(src, { ecmaVersion: 2021, sourceType: 'script' }); } catch (e) { err = e.message; }
  ok(!err, `${f}: JavaScript ES2021 válido ${err || ''}`);
  for (const [re, nome] of PROIBIDO_JS) ok(!re.test(src), `${f}: sem ${nome}`);
}
// CSS: recursos recentes permitidos apenas nas regras listadas (melhorias progressivas).
const PROGRESSIVO = { ':has(': ['calculator.css'], 'text-wrap': ['styles.css'], 'aspect-ratio': ['treino.css'] };
const PROIBIDO_CSS = ['@container', 'color-mix(', '@layer', 'subgrid', '@scope', 'anchor-name'];
for (const f of fs.readdirSync(dist).filter(f => f.endsWith('.css'))) {
  const css = fs.readFileSync(path.join(dist, f), 'utf8');
  for (const p of PROIBIDO_CSS) ok(!css.includes(p), `${f}: sem ${p}`);
  for (const [p, onde] of Object.entries(PROGRESSIVO)) if (css.includes(p)) ok(onde.includes(f), `${f}: ${p} só como melhoria progressiva`);
}
console.log(`Compatibilidade: ${n - falhas.length}/${n} verificações`);
process.exit(falhas.length ? 1 : 0);
