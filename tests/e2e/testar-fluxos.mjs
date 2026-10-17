// Fluxos completos da v9 no navegador, como uma pessoa usaria: trilhas dos métodos novos, missões,
// Terminal (Ponto Fixo, Falsa Posição, aba Convergência com hover e teclado), Treino (diagnóstico, erro típico,
// gabarito com gráfico), modo prova até o relatório impresso, revisão, celular e modo escuro.
// Uso: node testar-fluxos.mjs http://127.0.0.1:8000/ [pasta-para-previews]
import { abrir, ok, fim, BASE } from './comum.mjs';
const PREV = process.argv[3] || '';
const shot = async (page, name, full = false) => { if (PREV) await page.screenshot({ path: `${PREV}/${name}.png`, fullPage: full }); };
const { browser, ctx, page, erros } = await abrir();
const go = async hash => { await page.goto(BASE + 'index.html#' + hash); await page.waitForTimeout(150); };
await page.goto(BASE + 'index.html'); await page.evaluate(() => localStorage.clear()); await page.reload();

// ---------- Início
await go('home');
const stats = await page.$$eval('.stats b', bs => bs.map(b => b.textContent));
ok(stats[0] === '7' && stats[1] === '147' && stats[2] === '140' && Number(stats[3].replace('.', '')) > 1400, 'Início mostra 7 métodos, 147 atividades, 140 exercícios e as verificações: ' + stats.join(' / '));
await shot(page, 'v9-inicio');

// ---------- Trilha da Falsa Posição
await go('academy');
ok(await page.$$eval('.catalog:first-of-type .course-card', c => c.length) === 5, 'Cinco trilhas de raízes');
await page.click('[data-act=course][data-id=falseposition]');
await page.click('[data-act=start-node][data-id=intro]');
for (let i = 0; i < 6; i++) await page.click('[data-act=intro-next]');
ok(await page.isVisible('.g-chord'), 'Simulação da Falsa Posição desenha a corda');
await page.click('[data-act=sim-next]'); await page.click('[data-act=sim-next]');
await shot(page, 'v9-falsa-posicao-simulacao');
await page.click('[data-act=sim-done]');
const q0 = await page.evaluate(() => { const C = window.NumeraContent; return C.TASKS.falseposition[0]; });
const letters = await page.$$eval('.choice', bs => bs.map(b => b.textContent));
const idx = letters.findIndex(t => t.includes(q0.options[q0.answer]));
await page.click(`.choice >> nth=${idx}`); await page.click('#quiz-form button[type=submit]');
ok((await page.textContent('.sheet-msg')).includes('Correto'), 'Primeira etapa da Falsa Posição (alternativa)');
await page.click('[data-act=next-course]');
await page.fill('#answer', '1,666667'); await page.click('#quiz-form button[type=submit]');
ok((await page.textContent('.sheet-msg')).includes('Correto'), 'Segunda etapa: primeiro corte da corda = 5/3');

// ---------- Trilha do Ponto Fixo: diagrama em teia
await go('academy'); await page.click('[data-act=course][data-id=fixedpoint]');
await page.click('[data-act=start-node][data-id=intro]');
for (let i = 0; i < 6; i++) await page.click('[data-act=intro-next]');
for (let i = 0; i < 4; i++) await page.click('[data-act=sim-next]');
ok(await page.isVisible('.g-web') && await page.isVisible('.g-diag'), 'Simulação do Ponto Fixo desenha a teia');
await shot(page, 'v9-ponto-fixo-teia');

// ---------- Missão da taxa (Falsa Posição) → Terminal
await go('cases'); await page.click('[data-act=case][data-id=loan]');
await page.click('details summary'); await page.click('[data-act=case-terminal]');
await page.click('#terminal-form button[type=submit]'); await page.waitForSelector('.result-shell');
ok((await page.textContent('.result-shell h2')).includes('Falsa Posição') && (await page.textContent('.answer-result strong')).includes('0,02075'), 'Missão do carnê resolvida pela Falsa Posição no Terminal');
await go('cases'); await page.click('[data-act=case][data-id=kepler]');
await page.click('details summary'); await page.click('[data-act=case-terminal]');
await page.click('#terminal-form button[type=submit]'); await page.waitForSelector('.result-shell');
ok((await page.textContent('.result-shell h2')).includes('Ponto Fixo') && (await page.textContent('.answer-result strong')).includes('1,4987'), 'Missão de Kepler resolvida pelo Ponto Fixo (g vinda de x = …)');
ok(await page.isVisible('.g-web'), 'Resultado do Ponto Fixo mostra a teia');
await shot(page, 'v9-terminal-ponto-fixo');

// ---------- Terminal: aba Convergência com hover e teclado
await go('lab'); await page.click('[data-act=example][data-index="0"]'); await page.click('#terminal-form button[type=submit]');
await page.waitForSelector('.result-shell'); await page.click('[data-act=result-tab][data-id=converge]');
ok(await page.$$eval('.conv-series', s => s.length) >= 4, 'Convergência: quatro métodos lado a lado');
await page.$eval('.conv-plot', el => el.scrollIntoView({ block: 'center' }));
const box = await page.$('.conv-plot svg').then(h => h.boundingBox());
await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.5, { steps: 3 });
await page.waitForTimeout(100);
ok(await page.isVisible('.conv-tip') && (await page.textContent('.conv-tip')).includes('Iteração'), 'Dica com os valores aparece ao passar o mouse');
await page.focus('.conv-plot'); await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight');
ok((await page.textContent('.conv-tip')).includes('Iteração 1'), 'Teclado percorre as iterações do gráfico');
await page.evaluate(() => document.querySelector('.conv').scrollIntoView());
await shot(page, 'v9-terminal-convergencia');

// ---------- Treino: diagnóstico errado → revisão; erro típico; gabarito com gráfico
await go('treino');
const data = await page.evaluate(() => window.NumeraTreino.exercises.map(e => ({ id: e.id, method: e.method, answer: e.answer, traps: e.traps || [], askBlind: e.askBlind, ask: e.ask })));
const e0 = data[0];
ok((await page.textContent('#tr-form')).includes(e0.askBlind.slice(0, 25)), 'Pergunta sem o nome do método antes do diagnóstico');
const wrongM = e0.method === 'newton' ? 'secant' : 'newton';
await page.click(`.tr-tool[data-id=${wrongM}]`);
ok(await page.isVisible('.tr-verdict.bad') && await page.isVisible('mark.cue'), 'Diagnóstico errado mostra o veredito e as pistas');
ok((await page.textContent('.topbar .chip .count')).trim() === '1', 'O erro de diagnóstico entra na contagem da Revisão');
const fmt = v => String(+v.toPrecision(9)).replace('.', ',');
if (e0.traps.length && e0.answer.type !== 'vec') {
  await page.fill('#tr-ans-0', fmt(Array.isArray(e0.traps[0].v) ? e0.traps[0].v[0] : e0.traps[0].v)); await page.click('#tr-form button[type=submit]');
  ok((await page.textContent('#tr-form .tr-verdict')).includes('Erro típico'), 'Erro típico reconhecido no Treino');
}
const vals = e0.answer.type === 'vec' ? e0.answer.values : [e0.answer.value];
for (let i = 0; i < vals.length; i++) await page.fill('#tr-ans-' + i, fmt(vals[i]));
await page.click('#tr-form button[type=submit]');
ok((await page.textContent('#tr-form .tr-verdict')).includes('Correto'), 'Resposta certa com vírgula');
await page.click('[data-act=tr-key]');
ok(await page.isVisible('.tr-conv .conv-plot'), 'Gabarito com gráfico de convergência');
await page.evaluate(() => document.querySelector('.tr-key-open').scrollIntoView());
await shot(page, 'v9-treino-gabarito-convergencia');

// ---------- Teclado: diagnosticar e responder sem mouse
await page.click('[data-act=tr-open][data-index="2"]');
const e2 = data[2];
await page.focus(`.tr-tool[data-id=${e2.method}]`); await page.keyboard.press('Enter');
ok(await page.isVisible('.tr-verdict.ok'), 'Diagnóstico pelo teclado (Tab + Enter)');
const v2 = e2.answer.type === 'vec' ? e2.answer.values : [e2.answer.value];
for (let i = 0; i < v2.length; i++) { await page.focus('#tr-ans-' + i); await page.keyboard.type(fmt(v2[i])); }
await page.keyboard.press('Enter');
ok((await page.textContent('#tr-form .tr-verdict')).includes('Correto'), 'Resposta enviada com Enter');

// ---------- Revisão do diagnóstico
await go('review');
ok((await page.textContent('#main')).includes('Diagnósticos do Treino'), 'Caderno de Revisão mostra o Treino');
await page.click('.tr-review-section [data-act=tr-rev]');
await page.click(`.tr-tool[data-id=${e0.method}]`);
ok((await page.textContent('.tr-rev-card')).includes('3 dias'), 'Acerto na revisão adia para 3 dias');

// ---------- Modo prova: 5 questões certas = nota 10
await go('treino'); await page.click('[data-act=tr-view][data-id=prova]');
await page.click('[data-act=tr-pv-n][data-id="5"]'); await page.fill('#pv-name', 'Teste automático');
await page.click('[data-act=tr-pv-start]');
ok(await page.isVisible('#tr-timer'), 'Prova com cronômetro');
await shot(page, 'v9-prova-questao');
const ids = await page.evaluate(() => JSON.parse(localStorage.getItem('numera-treino-v9'))._prova.ids);
for (let k = 0; k < ids.length; k++) {
  const e = data.find(x => x.id === ids[k]);
  ok(!(await page.textContent('#tr-pv-form')).includes(e.ask) || e.ask === e.askBlind, 'Prova não revela o método na pergunta ' + (k + 1));
  await page.click(`.tr-tool[data-id=${e.method}]`);
  const v = e.answer.type === 'vec' ? e.answer.values : [e.answer.value];
  for (let i = 0; i < v.length; i++) await page.fill('#pv-ans-' + i, fmt(v[i]));
  if (k < ids.length - 1) await page.click('[data-act=tr-pv-next]'); else await page.click('.tr-nav [data-act=tr-pv-end]');
}
await page.click('[data-act=tr-pv-end-yes]');
ok((await page.textContent('.tr-grade b')).trim() === '10,0', 'Prova toda certa vale 10,0');
await shot(page, 'v9-prova-relatorio');
await page.emulateMedia({ media: 'print' });
ok(!(await page.isVisible('.topbar')) && await page.isVisible('.tr-report') && !(await page.isVisible('.tr-report .no-print')), 'Impressão mostra só o relatório');
await page.pdf({ path: (PREV || '/tmp') + '/v9-relatorio-prova.pdf', format: 'A4', printBackground: true }).catch(() => {});
await page.emulateMedia({ media: 'screen' });

// ---------- Celular: sem rolagem horizontal
await page.setViewportSize({ width: 390, height: 844 });
for (const hash of ['home', 'academy', 'treino', 'lab', 'review', 'progress', 'cases', 'arena']) {
  await go(hash);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok(over <= 0, `Celular sem rolagem lateral em #${hash} (${over}px)`);
}
await go('lab'); await page.click('[data-act=example][data-index="0"]'); await page.click('#terminal-form button[type=submit]'); await page.waitForSelector('.result-shell'); await page.click('[data-act=result-tab][data-id=converge]');
ok(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, 'Celular: gráfico de convergência cabe na tela');
await shot(page, 'v9-celular-convergencia');
await go('treino'); await page.click('[data-act=tr-view][data-id=prova]'); await page.click('[data-act=tr-pv-start]');
ok(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, 'Celular: prova cabe na tela');
await shot(page, 'v9-celular-prova');
await page.click('[data-act=tr-pv-quit]');

// ---------- Modo escuro
await page.setViewportSize({ width: 1280, height: 900 }); await page.emulateMedia({ colorScheme: 'dark' });
await go('treino'); await page.click('[data-act=tr-view][data-id=ex]');
await page.click('[data-act=tr-open][data-index="1"]'); await page.click('.tr-tool >> nth=0'); await page.click('[data-act=tr-key]');
await page.evaluate(() => document.querySelector('.tr-conv').scrollIntoView());
ok(await page.isVisible('.tr-conv .conv-plot'), 'Modo escuro: gabarito com gráfico');
await shot(page, 'v9-escuro-gabarito');

ok(erros.length === 0, 'Sem erros de JavaScript: ' + erros.slice(0, 3).join(' | '));
await browser.close(); fim('Fluxos da v9');
